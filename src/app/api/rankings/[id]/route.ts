import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cleanupAuditLogs } from '@/lib/auditLogCleanup';

// 获取单个排名
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const ranking = await prisma.ranking.findUnique({
      where: { id, tenantId: session.user.tenantId },
      include: {
        program: true,
        competition: true,
      },
    });

    if (!ranking) {
      return NextResponse.json(
        { error: '排名不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(ranking);
  } catch (error) {
    console.error('Error fetching ranking:', error);
    return NextResponse.json(
      { error: '获取排名详情失败' },
      { status: 500 }
    );
  }
}

// 手动调整单个排名
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    const {
      rank,
      totalScore,
      userId, // 记录操作人ID
    } = body;
    
    // 检查排名是否存在且属于同一租户
    const existingRanking = await prisma.ranking.findUnique({
      where: { id, tenantId: session.user.tenantId },
    });
    
    if (!existingRanking) {
      return NextResponse.json(
        { error: '排名不存在' },
        { status: 404 }
      );
    }
    
    // 手动调整排名
    const updatedRanking = await prisma.$transaction(async (tx) => {
      const updated = await tx.ranking.update({
        where: { id },
        data: {
          rank,
          totalScore,
          updateType: 'MANUAL',
        },
      });
      
      // 记录审计日志
      await tx.auditLog.create({
        data: {
          tenantId: session.user.tenantId,
          userId,
          action: 'MANUAL_UPDATE_RANKING',
          targetId: id,
          details: {
            previous: existingRanking,
            updated: updated,
          },
        },
      });
      
      return updated;
    });
    
    return NextResponse.json(updatedRanking);
  } catch (error) {
    console.error('Error updating ranking:', error);
    return NextResponse.json(
      { error: '更新排名失败' },
      { status: 500 }
    );
  }
}

// 刷新比赛排名
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id: competitionId } = await params;
    
    // 检查比赛是否存在且属于同一租户
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId, tenantId: session.user.tenantId },
      include: {
        programs: {
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

    // 计算每个节目的总分并更新排名
    const programScores: Array<{ programId: string; totalScore: number }> = [];
    
    for (const program of competition.programs) {
      // 按评委分组计算每个评委的平均分（与大屏幕显示逻辑一致）
      const judgeAverageScores = new Map<string, { totalValue: number; count: number }>();
      
      // 计算每个评委对该节目的平均分
      for (const score of program.scores) {
        const judgeId = score.judgeId;
        
        if (!judgeAverageScores.has(judgeId)) {
          judgeAverageScores.set(judgeId, { totalValue: 0, count: 0 });
        }
        
        const judgeData = judgeAverageScores.get(judgeId)!;
        judgeData.totalValue += score.value;
        judgeData.count += 1;
      }
      
      // 计算每个评委的平均分
      const judgeScoreValues: number[] = [];
      for (const [judgeId, judgeData] of judgeAverageScores.entries()) {
        const judgeAverageScore = judgeData.count > 0 ? judgeData.totalValue / judgeData.count : 0;
        judgeScoreValues.push(judgeAverageScore);
      }
      
      // 计算节目最终得分（所有评委平均分的平均值）
      const finalScore = judgeScoreValues.length > 0 
        ? judgeScoreValues.reduce((sum, score) => sum + score, 0) / judgeScoreValues.length
        : 0;
      
      programScores.push({
        programId: program.id,
        totalScore: Math.round(finalScore * 100) / 100, // 保留两位小数，与大屏幕显示一致
      });
    }
    
    // 按总分排序
    programScores.sort((a, b) => b.totalScore - a.totalScore);
    
    // 使用事务更新排名
    const updatedRankings = await prisma.$transaction(async (tx) => {
      // 删除现有排名
      await tx.ranking.deleteMany({
        where: { competitionId },
      });
      
      // 创建新排名
      const rankings = [];
      for (let i = 0; i < programScores.length; i++) {
        const ranking = await tx.ranking.create({
          data: {
            competitionId,
            programId: programScores[i].programId,
            rank: i + 1,
            totalScore: programScores[i].totalScore,
            updateType: 'AUTO',
            tenantId: session.user.tenantId,
          },
        });
        rankings.push(ranking);
      }
      
      // 记录审计日志
      await tx.auditLog.create({
        data: {
          tenantId: session.user.tenantId,
          userId: session.user.id,
          action: 'REFRESH_RANKINGS',
          targetId: competitionId,
          details: {
            competitionName: competition.name,
            updatedRankings: rankings.length,
            programAverageScores: programScores,
          },
        },
      });
      
      return rankings;
    });
    
    // 异步清理审计日志（不等待完成，避免影响响应时间）
    setImmediate(() => {
      cleanupAuditLogs().catch(() => {
        // 静默处理清理错误
      });
    });
    
    return NextResponse.json({
      success: true,
      message: '排名刷新成功',
      updatedRankings: updatedRankings.length,
    });
  } catch (error) {
    console.error('刷新排名失败:', error);
    return NextResponse.json(
      { error: '刷新排名失败' },
      { status: 500 }
    );
  }
}