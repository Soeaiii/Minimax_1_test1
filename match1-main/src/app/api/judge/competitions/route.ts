import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'JUDGE') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 获取裁判参与的比赛列表
    // 这里我们获取所有比赛，在实际应用中应该根据裁判分配来过滤
    const competitions = await prisma.competition.findMany({
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
                judgeId: session.user.id,
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
} 