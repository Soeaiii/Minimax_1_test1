import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    
    // Only SUPER_ADMIN or ADMIN can access debug data
    if (!session || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const tenantFilter = session.user.role === 'SUPER_ADMIN' ? {} : { tenantId: session.user.tenantId };

    // 获取评分记录（按租户过滤）
    const scores = await prisma.score.findMany({
      where: tenantFilter,
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
      where: tenantFilter,
      _count: {
        id: true,
      }
    });

    // 获取评委信息
    const judges = await prisma.user.findMany({
      where: {
        ...tenantFilter,
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