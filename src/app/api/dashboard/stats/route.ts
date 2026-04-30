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

    const tenantId = session.user.tenantId;

    // 优化后的统计数据获取 - 减少查询次数（全部租户隔离）
    const [
      competitionStats,
      programStats,
      participantStats,
      auditLogStats,
      recentCompetitions,
      recentAuditLogs
    ] = await Promise.all([
      // 比赛统计 - 合并查询
      prisma.competition.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: {
          _all: true
        }
      }),

      // 节目统计 - 合并查询
      prisma.program.groupBy({
        by: ['currentStatus'],
        where: { tenantId },
        _count: {
          _all: true
        }
      }),

      // 选手统计 - 合并查询
      prisma.participant.aggregate({
        where: { tenantId },
        _count: {
          _all: true
        }
      }).then(async (totalCount) => {
        const teamsCount = await prisma.participant.findMany({
          where: {
            tenantId,
            team: { not: null }
          },
          select: { team: true },
          distinct: ['team']
        });
        return {
          total: totalCount._count._all,
          teams: teamsCount.length
        };
      }),

      // 审计日志统计 - 合并查询
      prisma.auditLog.aggregate({
        _count: {
          _all: true
        },
        where: { tenantId }
      }).then(async (totalCount) => {
        const todayCount = await prisma.auditLog.count({
          where: {
            tenantId,
            timestamp: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        });
        return {
          total: totalCount._count._all,
          today: todayCount
        };
      }),

      // 最近的比赛
      prisma.competition.findMany({
        where: { tenantId },
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
        where: { tenantId },
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

    // 处理统计数据
    const competitionCounts = competitionStats.reduce((acc, item) => {
      acc[item.status] = item._count._all;
      return acc;
    }, {} as Record<string, number>);

    const programCounts = programStats.reduce((acc, item) => {
      acc[item.currentStatus] = item._count._all;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      competitions: {
        total: Object.values(competitionCounts).reduce((sum, count) => sum + count, 0),
        active: competitionCounts['ACTIVE'] || 0
      },
      programs: {
        total: Object.values(programCounts).reduce((sum, count) => sum + count, 0),
        waiting: programCounts['WAITING'] || 0,
        performing: programCounts['PERFORMING'] || 0,
        completed: programCounts['COMPLETED'] || 0
      },
      participants: {
        total: participantStats.total,
        teams: participantStats.teams
      },
      auditLogs: {
        total: auditLogStats.total,
        today: auditLogStats.today
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
