import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 获取排名
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    
    if (!competitionId) {
      return NextResponse.json(
        { error: '必须提供比赛ID' },
        { status: 400 }
      );
    }
    
    const rankings = await prisma.ranking.findMany({
      where: { competitionId },
      include: {
        program: true,
      },
      orderBy: {
        rank: 'asc',
      },
    });
    
    return NextResponse.json(rankings);
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json(
      { error: '获取排名失败' },
      { status: 500 }
    );
  }
}

// 手动更新排名
export async function POST(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const {
      competitionId,
      userId, // 记录操作人ID
    } = body;
    
    if (!competitionId) {
      return NextResponse.json(
        { error: '必须提供比赛ID' },
        { status: 400 }
      );
    }
    
    // 获取比赛信息
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        programs: {
          where: { currentStatus: 'COMPLETED' },
          include: {
            scores: {
              include: {
                scoringCriteria: true,
              },
            },
          },
        },
        scoringCriteria: true,
      },
    });
    
    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }
    
    // 计算每个节目的总分
    const programScores = competition.programs.map(program => {
      let totalScore = 0;
      
      // 如果节目有评分，计算加权总分
      if (program.scores && program.scores.length > 0) {
        competition.scoringCriteria.forEach(criteria => {
          const matchingScores = program.scores.filter(
            score => score.scoringCriteriaId === criteria.id
          );
          
          // 如果有此评分项的分数，计算加权平均分
          if (matchingScores.length > 0) {
            const averageScore = matchingScores.reduce((sum, score) => sum + score.value, 0) / matchingScores.length;
            totalScore += averageScore * criteria.weight;
          }
        });
      }
      
      return {
        programId: program.id,
        totalScore: parseFloat(totalScore.toFixed(2)),
      };
    });
    
    // 按总分排序
    programScores.sort((a, b) => b.totalScore - a.totalScore);
    
    // 更新排名
    const updatedRankings = await prisma.$transaction(async (tx) => {
      // 删除现有排名
      await tx.ranking.deleteMany({
        where: { competitionId },
      });
      
      // 创建新的排名
      const rankings = await Promise.all(
        programScores.map((score, index) =>
          tx.ranking.create({
            data: {
              rank: index + 1,
              totalScore: score.totalScore,
              updateType: 'AUTO',
              competitionId,
              programId: score.programId,
            },
          })
        )
      );
      
      // 记录审计日志
      await tx.auditLog.create({
        data: {
          tenantId: session.user.tenantId,
          userId,
          action: 'UPDATE_RANKINGS',
          targetId: competitionId,
          details: { rankings },
        },
      });
      
      return rankings;
    });
    
    return NextResponse.json(updatedRankings);
  } catch (error) {
    console.error('Error updating rankings:', error);
    return NextResponse.json(
      { error: '更新排名失败' },
      { status: 500 }
    );
  }
}