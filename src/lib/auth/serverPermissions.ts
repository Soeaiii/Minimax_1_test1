import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/lib/types';
import { hasPermission, Permission, ROLE_PERMISSIONS } from './permissions';
import { prisma } from '@/lib/prisma';

// 权限验证中间件选项
export interface PermissionMiddlewareOptions {
  // 必需的权限
  requiredPermissions?: Permission[];
  // 允许的角色
  allowedRoles?: UserRole[];
  // 是否需要数据范围检查
  requireDataScope?: boolean;
  // 自定义权限检查函数
  customCheck?: (session: any, request: NextRequest) => Promise<boolean>;
}

// 权限验证结果
export interface PermissionCheckResult {
  success: boolean;
  session?: any;
  error?: string;
  statusCode?: number;
}

// 服务端权限检查函数
export async function checkServerPermissions(
  request: NextRequest,
  options: PermissionMiddlewareOptions = {}
): Promise<PermissionCheckResult> {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录
    if (!session || !session.user) {
      return {
        success: false,
        error: '未授权访问',
        statusCode: 401,
      };
    }
    
    const userRole = session.user.role as UserRole;
    
    // 检查角色权限
    if (options.allowedRoles && options.allowedRoles.length > 0) {
      if (!options.allowedRoles.includes(userRole)) {
        return {
          success: false,
          error: '角色权限不足',
          statusCode: 403,
        };
      }
    }
    
    // 检查具体权限
    if (options.requiredPermissions && options.requiredPermissions.length > 0) {
      for (const permission of options.requiredPermissions) {
        const result = hasPermission(userRole, permission.resource, permission.action);
        if (!result.hasPermission) {
          return {
            success: false,
            error: result.reason || '权限不足',
            statusCode: 403,
          };
        }
      }
    }
    
    // 自定义权限检查
    if (options.customCheck) {
      const customResult = await options.customCheck(session, request);
      if (!customResult) {
        return {
          success: false,
          error: '自定义权限检查失败',
          statusCode: 403,
        };
      }
    }
    
    return {
      success: true,
      session,
    };
  } catch (error) {
    console.error('Permission check error:', error);
    return {
      success: false,
      error: '权限检查失败',
      statusCode: 500,
    };
  }
}

// 权限验证装饰器
export function withPermissions(options: PermissionMiddlewareOptions) {
  return function (
    handler: (request: NextRequest, context: any) => Promise<NextResponse>
  ) {
    return async function (request: NextRequest, context: any) {
      const permissionResult = await checkServerPermissions(request, options);
      
      if (!permissionResult.success) {
        return NextResponse.json(
          { error: permissionResult.error },
          { status: permissionResult.statusCode || 403 }
        );
      }
      
      // 将session添加到请求上下文中
      (request as any).session = permissionResult.session;
      
      return handler(request, context);
    };
  };
}

// 数据范围检查函数
export async function checkDataScope(
  userId: string,
  userRole: UserRole,
  resource: string,
  targetId: string
): Promise<boolean> {
  try {
    switch (userRole) {
      case 'ADMIN':
        // 管理员可以访问所有数据
        return true;
      
      case 'ORGANIZER':
        // 组织者只能访问自己创建的比赛及相关数据
        if (resource === 'competition') {
          const competition = await prisma.competition.findUnique({
            where: { id: targetId },
            select: { organizerId: true },
          });
          return competition?.organizerId === userId;
        }
        
        if (resource === 'program') {
          const program = await prisma.program.findUnique({
            where: { id: targetId },
            include: { competition: { select: { organizerId: true } } },
          });
          return program?.competition.organizerId === userId;
        }
        
        if (resource === 'participant') {
          const participant = await prisma.participant.findUnique({
            where: { id: targetId },
            include: {
              participantPrograms: {
                include: { competition: { select: { organizerId: true } } },
              },
            },
          });
          return participant?.programs.some(program => program.competition.organizerId === userId) || false;
        }
        
        return false;
      
      case 'JUDGE':
        // 评委只能访问被分配的比赛和节目
        if (resource === 'competition') {
          const judgeAssignment = await prisma.score.findFirst({
            where: {
              judgeId: userId,
              program: { competitionId: targetId },
            },
          });
          return !!judgeAssignment;
        }
        
        if (resource === 'program') {
          const judgeAssignment = await prisma.score.findFirst({
            where: {
              judgeId: userId,
              programId: targetId,
            },
          });
          return !!judgeAssignment;
        }
        
        if (resource === 'score') {
          const score = await prisma.score.findUnique({
            where: { id: targetId },
            select: { judgeId: true },
          });
          return score?.judgeId === userId;
        }
        
        return false;
      
      case 'USER':
        // 普通用户只能访问公开数据
        if (resource === 'competition') {
          const competition = await prisma.competition.findUnique({
            where: { id: targetId },
            select: { status: true },
          });
          return competition?.status === 'ACTIVE' || competition?.status === 'FINISHED';
        }
        
        return false;
      
      default:
        return false;
    }
  } catch (error) {
    console.error('Data scope check error:', error);
    return false;
  }
}

// 便捷的权限检查函数
export const requireAdmin = (handler: (request: NextRequest, context: any) => Promise<NextResponse>) => {
  return withPermissions({ allowedRoles: ['ADMIN'] })(handler);
};

export const requireOrganizer = (handler: (request: NextRequest, context: any) => Promise<NextResponse>) => {
  return withPermissions({ allowedRoles: ['ADMIN', 'ORGANIZER'] })(handler);
};

export const requireJudge = (handler: (request: NextRequest, context: any) => Promise<NextResponse>) => {
  return withPermissions({ allowedRoles: ['ADMIN', 'ORGANIZER', 'JUDGE'] })(handler);
};

export const requireAuth = (handler: (request: NextRequest, context: any) => Promise<NextResponse>) => {
  return withPermissions({})(handler);
};

// 权限检查工具函数
export async function getUserPermissions(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    if (!user) {
      return [];
    }
    
    const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
    return rolePermissions.map(p => `${p.resource}:${p.action}`);
  } catch (error) {
    console.error('Get user permissions error:', error);
    return [];
  }
}

// 获取用户数据访问范围
export async function getUserDataScope(userId: string, userRole: UserRole) {
  try {
    switch (userRole) {
      case 'ADMIN':
        // 管理员可以访问所有数据
        const allCompetitions = await prisma.competition.findMany({
          select: { id: true },
        });
        const allPrograms = await prisma.program.findMany({
          select: { id: true },
        });
        return {
          competitions: allCompetitions.map(c => c.id),
          programs: allPrograms.map(p => p.id),
          participants: 'all',
          users: 'all',
        };
      
      case 'ORGANIZER':
        // 组织者只能访问自己创建的比赛及相关数据
        const organizerCompetitions = await prisma.competition.findMany({
          where: { organizerId: userId },
          select: { id: true },
        });
        const organizerPrograms = await prisma.program.findMany({
          where: {
            competition: {
              organizerId: userId,
            },
          },
          select: { id: true },
        });
        return {
          competitions: organizerCompetitions.map(c => c.id),
          programs: organizerPrograms.map(p => p.id),
          participants: organizerPrograms.map(p => p.id),
        };
      
      case 'JUDGE':
        // 评委只能访问被分配的比赛和节目
        const judgeScores = await prisma.score.findMany({
          where: { judgeId: userId },
          select: {
            programId: true,
            program: {
              select: {
                competitionId: true,
              },
            },
          },
        });
        const judgeCompetitions = [...new Set(judgeScores.map(s => s.program.competitionId))];
        const judgePrograms = [...new Set(judgeScores.map(s => s.programId))];
        return {
          competitions: judgeCompetitions,
          programs: judgePrograms,
          participants: judgePrograms,
        };
      
      case 'USER':
        // 普通用户只能访问公开数据
        const publicCompetitions = await prisma.competition.findMany({
          where: {
            status: {
              in: ['ACTIVE', 'FINISHED'],
            },
          },
          select: { id: true },
        });
        return {
          competitions: publicCompetitions.map(c => c.id),
          programs: [],
          participants: [],
        };
      
      default:
        return {
          competitions: [],
          programs: [],
          participants: [],
        };
    }
  } catch (error) {
    console.error('Get user data scope error:', error);
    return {
      competitions: [],
      programs: [],
      participants: [],
    };
  }
}