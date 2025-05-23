import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 获取节目评分
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

    const { id: programId } = await params;

    // 检查节目是否存在
    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        competition: {
          select: {
            id: true,
            organizerId: true,
          }
        }
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      );
    }

    // 获取评分数据
    const scores = await prisma.score.findMany({
      where: { programId },
      include: {
        scoringCriteria: {
          select: {
            id: true,
            name: true,
            weight: true,
            maxScore: true,
          }
        }
      },
      orderBy: [
        { scoringCriteria: { name: 'asc' } },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(scores);
  } catch (error) {
    console.error('Error fetching program scores:', error);
    return NextResponse.json(
      { error: '获取评分数据失败' },
      { status: 500 }
    );
  }
}

// 添加评分
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

    const { id: programId } = await params;
    const body = await request.json();

    const {
      scoringCriteriaId,
      value,
      comment,
      judgeId,
    } = body;

    // 验证必要字段
    if (!scoringCriteriaId || value === undefined || !judgeId) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }

    // 检查节目是否存在
    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        competition: {
          select: {
            id: true,
            organizerId: true,
          }
        }
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      );
    }

    // 检查评分标准是否存在且属于该比赛
    const scoringCriteria = await prisma.scoringCriteria.findUnique({
      where: { id: scoringCriteriaId },
    });

    if (!scoringCriteria || scoringCriteria.competitionId !== program.competitionId) {
      return NextResponse.json(
        { error: '评分标准不存在或不属于该比赛' },
        { status: 400 }
      );
    }

    // 验证分数范围
    if (value < 0 || value > scoringCriteria.maxScore) {
      return NextResponse.json(
        { error: `分数必须在 0 到 ${scoringCriteria.maxScore} 之间` },
        { status: 400 }
      );
    }

    // 检查是否已经有相同评委对该标准的评分
    const existingScore = await prisma.score.findFirst({
      where: {
        programId,
        scoringCriteriaId,
        judgeId,
      }
    });

    if (existingScore) {
      // 更新现有评分
      const updatedScore = await prisma.score.update({
        where: { id: existingScore.id },
        data: {
          value,
          comment,
        },
        include: {
          scoringCriteria: {
            select: {
              id: true,
              name: true,
              weight: true,
              maxScore: true,
            }
          }
        }
      });

      // 记录审计日志
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'UPDATE_SCORE',
          targetId: updatedScore.id,
          details: {
            programId,
            scoringCriteriaId,
            previousValue: existingScore.value,
            newValue: value,
          },
        },
      });

      return NextResponse.json(updatedScore);
    } else {
      // 创建新评分
      const newScore = await prisma.score.create({
        data: {
          programId,
          scoringCriteriaId,
          value,
          comment,
          judgeId,
        },
        include: {
          scoringCriteria: {
            select: {
              id: true,
              name: true,
              weight: true,
              maxScore: true,
            }
          }
        }
      });

      // 记录审计日志
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'CREATE_SCORE',
          targetId: newScore.id,
          details: {
            programId,
            scoringCriteriaId,
            value,
          },
        },
      });

      return NextResponse.json(newScore, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating score:', error);
    return NextResponse.json(
      { error: '评分操作失败' },
      { status: 500 }
    );
  }
} 