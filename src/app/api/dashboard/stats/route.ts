import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 获取统计数据
    const [
      totalCompetitions,
      activeCompetitions,
      totalPrograms,
      waitingPrograms,
      performingPrograms,
      completedPrograms,
      totalParticipants,
      totalTeams,
      totalAuditLogs,
      todayAuditLogs,
      recentCompetitions,
      recentAuditLogs
    ] = await Promise.all([
      // 比赛统计
      prisma.competition.count(),
      prisma.competition.count({
        where: { status: 'ACTIVE' }
      }),
      
      // 节目统计
      prisma.program.count(),
      prisma.program.count({
        where: { currentStatus: 'WAITING' }
      }),
      prisma.program.count({
        where: { currentStatus: 'PERFORMING' }
      }),
      prisma.program.count({
        where: { currentStatus: 'COMPLETED' }
      }),
      
      // 选手统计
      prisma.participant.count(),
      prisma.participant.findMany({
        where: {
          team: { not: null }
        },
        select: { team: true },
        distinct: ['team']
      }),
      
      // 审计日志统计
      prisma.auditLog.count(),
      prisma.auditLog.count({
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      
      // 最近的比赛
      prisma.competition.findMany({
        include: {
          organizer: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              programs: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      }),
      
      // 最近的审计日志
      prisma.auditLog.findMany({
        include: {
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 10
      })
    ]);

    const stats = {
      competitions: {
        total: totalCompetitions,
        active: activeCompetitions
      },
      programs: {
        total: totalPrograms,
        waiting: waitingPrograms,
        performing: performingPrograms,
        completed: completedPrograms
      },
      participants: {
        total: totalParticipants,
        teams: totalTeams.length
      },
      auditLogs: {
        total: totalAuditLogs,
        today: todayAuditLogs
      },
      recent: {
        competitions: recentCompetitions,
        auditLogs: recentAuditLogs
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: '获取仪表盘统计数据失败' },
      { status: 500 }
    );
  }
} 