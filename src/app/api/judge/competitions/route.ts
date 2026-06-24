import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

export const GET = withTenantContext(async () => {
  try {
    const ctx = getTenantContext()!;
    if (ctx.role !== 'JUDGE') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const competitions = await prisma.competition.findMany({
      where: {
        judgeAssignments: {
          some: {
            judgeId: ctx.userId,
            isActive: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        startTime: true,
        endTime: true,
        status: true,
        programs: {
          select: {
            id: true,
            scores: {
              where: {
                judgeId: ctx.userId,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 处理数据，计算每个比赛的节目数和已评分数
    const competitionsWithStats = competitions.map(competition => ({
      id: competition.id,
      name: competition.name,
      description: competition.description,
      startTime: competition.startTime,
      endTime: competition.endTime,
      status: competition.status,
      programsCount: competition.programs.length,
      scoredCount: competition.programs.filter(program => program.scores.length > 0).length,
    }));

    return NextResponse.json(competitionsWithStats);
  } catch (error) {
    console.error('Error fetching judge competitions:', error);
    return NextResponse.json(
      { error: '获取比赛列表失败' },
      { status: 500 }
    );
  }
});
