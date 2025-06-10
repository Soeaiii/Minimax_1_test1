import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 获取所有评分记录
    const scores = await prisma.score.findMany({
      include: {
        judge: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        program: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    // 按评委分组统计
    const judgeScoreCounts = await prisma.score.groupBy({
      by: ['judgeId'],
      _count: {
        id: true,
      }
    });

    // 获取评委信息
    const judges = await prisma.user.findMany({
      where: {
        role: 'JUDGE',
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    return NextResponse.json({
      totalScores: scores.length,
      scores: scores,
      judgeScoreCounts: judgeScoreCounts,
      judges: judges,
    });
  } catch (error) {
    console.error('Error fetching debug scores:', error);
    return NextResponse.json(
      { error: '获取调试信息失败' },
      { status: 500 }
    );
  }
} 