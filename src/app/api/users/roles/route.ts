import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/lib/types';

// 获取用户角色和权限信息
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
    const userId = searchParams.get('userId');
    
    // 如果指定了userId且当前用户不是管理员，只能查看自己的信息
    if (userId && userId !== session.user.id && (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: '无权限查看其他用户信息' },
        { status: 403 }
      );
    }
    
    const targetUserId = userId || session.user.id;
    
    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 根据角色获取权限列表
    const permissions = getPermissionsByRole(user.role);
    
    // 根据角色获取数据访问范围
    const dataScope = await getDataScopeByRole(user.role, user.id);
    
    return NextResponse.json({
      role: user.role,
      permissions,
      dataScope,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json(
      { error: '获取用户角色信息失败' },
      { status: 500 }
    );
  }
}

// 根据角色获取权限列表
function getPermissionsByRole(role: UserRole): string[] {
  switch (role) {
    case 'ADMIN':
      return [
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'competition:create',
        'competition:read',
        'competition:update',
        'competition:delete',
        'program:create',
        'program:read',
        'program:update',
        'program:delete',
        'participant:create',
        'participant:read',
        'participant:update',
        'participant:delete',
        'score:create',
        'score:read',
        'score:update',
        'score:delete',
        'judge:assign',
        'judge:remove',
        'system:settings',
        'data:export',
        'audit:read',
      ];
    
    case 'ORGANIZER':
      return [
        'competition:create',
        'competition:read',
        'competition:update',
        'competition:manage',
        'program:create',
        'program:read',
        'program:update',
        'program:delete',
        'participant:create',
        'participant:read',
        'participant:update',
        'participant:delete',
        'judge:assign',
        'judge:remove',
        'score:read',
        'data:export',
      ];
    
    case 'JUDGE':
      return [
        'competition:read',
        'program:read',
        'participant:read',
        'score:create',
        'score:read',
        'score:update',
      ];
    
    case 'USER':
      return [
        'competition:read',
        'program:read',
        'participant:read',
        'score:read',
      ];
    
    default:
      return [];
  }
}

// 根据角色获取数据访问范围
async function getDataScopeByRole(role: UserRole, userId: string) {
  switch (role) {
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
        participants: organizerPrograms.map(p => p.id), // 通过节目关联的参赛者
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
        participants: judgePrograms, // 通过节目关联的参赛者
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
        programs: [], // 需要通过比赛来访问
        participants: [],
      };
    
    default:
      return {
        competitions: [],
        programs: [],
        participants: [],
      };
  }
}