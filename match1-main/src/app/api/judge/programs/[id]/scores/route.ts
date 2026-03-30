import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 获取节目的现有评分
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'JUDGE') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const scores = await prisma.score.findMany({
      where: {
        programId: params.id,
        judgeId: session.user.id,
      },
      select: {
        id: true,
        value: true,
        comment: true,
        scoringCriteriaId: true,
      },
    });

    // 转换为前端需要的格式
    const formattedScores = scores.map(score => ({
      criteriaId: score.scoringCriteriaId,
      value: score.value,
      comment: score.comment,
    }));

    return NextResponse.json(formattedScores);
  } catch (error) {
    console.error('Error fetching program scores:', error);
    return NextResponse.json(
      { error: '获取评分失败' },
      { status: 500 }
    );
  }
}

// 保存或更新节目评分
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'JUDGE') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { scores } = body;

    if (!Array.isArray(scores)) {
      return NextResponse.json(
        { error: '评分数据格式错误' },
        { status: 400 }
      );
    }

    const params = await context.params;
    // 验证节目是否存在
    const program = await prisma.program.findUnique({
      where: { id: params.id },
    });

    if (!program) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      );
    }

    // 使用事务来保存所有评分
    const result = await prisma.$transaction(async (tx) => {
      // 先删除现有的评分（如果有的话）
      await tx.score.deleteMany({
        where: {
          programId: params.id,
          judgeId: session.user.id,
        },
      });

      // 创建新的评分记录
      const savedScores = await Promise.all(
        scores.map(async (score: any) => {
          // 确保值是数字并保留两位小数精度
          const scoreValue = parseFloat(parseFloat(score.value).toFixed(2));
          
          return tx.score.create({
            data: {
              value: scoreValue,
              comment: score.comment || '',
              programId: params.id,
              scoringCriteriaId: score.criteriaId,
              judgeId: session.user.id,
            },
          });
        })
      );

      return savedScores;
    });

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        tenantId: session.user.tenantId,
        action: 'SCORE_PROGRAM',
        targetId: params.id,
        details: {
          programId: params.id,
          scoresCount: scores.length,
          judgeId: session.user.id,
        },
      },
    });

    return NextResponse.json({ success: true, scores: result });
  } catch (error) {
    console.error('Error saving program scores:', error);
    return NextResponse.json(
      { error: '保存评分失败' },
      { status: 500 }
    );
  }
}