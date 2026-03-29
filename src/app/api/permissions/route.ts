import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/lib/types';

// 获取权限列表和角色权限配置
export async function GET(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const targetId = searchParams.get('targetId');
    
    // 如果是权限检查请求
    if (action && resource) {
      const hasPermission = await checkPermission(
        session.user.id,
        session.user.role,
        action,
        resource,
        targetId
      );
      
      return NextResponse.json({
        hasPermission,
        user: {
          id: session.user.id,
          role: session.user.role,
        },
        permission: {
          action,
          resource,
          targetId,
        },
      });
    }
    
    // 返回完整的权限配置（仅管理员可查看）
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '无权限查看权限配置' },
        { status: 403 }
      );
    }
    
    const permissionConfig = getPermissionConfig();
    
    return NextResponse.json({
      permissions: permissionConfig,
      roles: ['ADMIN', 'ORGANIZER', 'JUDGE', 'USER'],
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { error: '获取权限信息失败' },
      { status: 500 }
    );
  }
}

// 权限检查函数
async function checkPermission(
  userId: string,
  userRole: UserRole,
  action: string,
  resource: string,
  targetId?: string | null
): Promise<boolean> {
  // 获取用户角色的基础权限
  const rolePermissions = getRolePermissions(userRole);
  const permission = `${resource}:${action}`;
  
  // 检查基础权限
  if (!rolePermissions.includes(permission)) {
    return false;
  }
  
  // 如果没有指定目标ID，只检查基础权限
  if (!targetId) {
    return true;
  }
  
  // 根据资源类型和用户角色进行数据范围检查
  return await checkDataScope(userId, userRole, resource, targetId);
}

// 获取角色权限列表
function getRolePermissions(role: UserRole): string[] {
  switch (role) {
    case 'ADMIN':
      return [
        'user:create', 'user:read', 'user:update', 'user:delete',
        'competition:create', 'competition:read', 'competition:update', 'competition:delete',
        'program:create', 'program:read', 'program:update', 'program:delete',
        'participant:create', 'participant:read', 'participant:update', 'participant:delete',
        'score:create', 'score:read', 'score:update', 'score:delete',
        'judge:assign', 'judge:remove',
        'system:settings', 'data:export', 'audit:read',
      ];
    
    case 'ORGANIZER':
      return [
        'competition:create', 'competition:read', 'competition:update', 'competition:manage',
        'program:create', 'program:read', 'program:update', 'program:delete',
        'participant:create', 'participant:read', 'participant:update', 'participant:delete',
        'judge:assign', 'judge:remove',
        'score:read', 'data:export',
      ];
    
    case 'JUDGE':
      return [
        'competition:read', 'program:read', 'participant:read',
        'score:create', 'score:read', 'score:update',
      ];
    
    case 'USER':
      return [
        'competition:read', 'program:read', 'participant:read', 'score:read',
      ];
    
    default:
      return [];
  }
}

// 数据范围检查
async function checkDataScope(
  userId: string,
  userRole: UserRole,
  resource: string,
  targetId: string
): Promise<boolean> {
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
            programs: {
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
}

// 获取完整的权限配置
function getPermissionConfig() {
  return {
    resources: [
      {
        name: 'user',
        label: '用户管理',
        actions: [
          { name: 'create', label: '创建用户' },
          { name: 'read', label: '查看用户' },
          { name: 'update', label: '更新用户' },
          { name: 'delete', label: '删除用户' },
        ],
      },
      {
        name: 'competition',
        label: '比赛管理',
        actions: [
          { name: 'create', label: '创建比赛' },
          { name: 'read', label: '查看比赛' },
          { name: 'update', label: '更新比赛' },
          { name: 'delete', label: '删除比赛' },
          { name: 'manage', label: '管理比赛' },
        ],
      },
      {
        name: 'program',
        label: '节目管理',
        actions: [
          { name: 'create', label: '创建节目' },
          { name: 'read', label: '查看节目' },
          { name: 'update', label: '更新节目' },
          { name: 'delete', label: '删除节目' },
        ],
      },
      {
        name: 'participant',
        label: '参赛者管理',
        actions: [
          { name: 'create', label: '创建参赛者' },
          { name: 'read', label: '查看参赛者' },
          { name: 'update', label: '更新参赛者' },
          { name: 'delete', label: '删除参赛者' },
        ],
      },
      {
        name: 'score',
        label: '评分管理',
        actions: [
          { name: 'create', label: '创建评分' },
          { name: 'read', label: '查看评分' },
          { name: 'update', label: '更新评分' },
          { name: 'delete', label: '删除评分' },
        ],
      },
      {
        name: 'judge',
        label: '评委管理',
        actions: [
          { name: 'assign', label: '分配评委' },
          { name: 'remove', label: '移除评委' },
        ],
      },
      {
        name: 'system',
        label: '系统管理',
        actions: [
          { name: 'settings', label: '系统设置' },
        ],
      },
      {
        name: 'data',
        label: '数据管理',
        actions: [
          { name: 'export', label: '数据导出' },
        ],
      },
      {
        name: 'audit',
        label: '审计管理',
        actions: [
          { name: 'read', label: '查看审计日志' },
        ],
      },
    ],
    rolePermissions: {
      ADMIN: getRolePermissions('ADMIN'),
      ORGANIZER: getRolePermissions('ORGANIZER'),
      JUDGE: getRolePermissions('JUDGE'),
      USER: getRolePermissions('USER'),
    },
  };
}