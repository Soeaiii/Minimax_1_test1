import { NextResponse } from 'next/server';
import { prisma, prismaRaw } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

export const GET = withTenantContext(async () => {
  try {
    const ctx = getTenantContext()!;
    
    // Only SUPER_ADMIN or ADMIN can access debug data
    if (ctx.role !== 'SUPER_ADMIN' && ctx.role !== 'ADMIN') {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // SUPER_ADMIN uses raw client to bypass tenant isolation, others use tenant-scoped prisma
    const client = ctx.role === 'SUPER_ADMIN' ? prismaRaw : prisma;

    // 获取评分记录
    const scores = await client.score.findMany({
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
    const judgeScoreCounts = await client.score.groupBy({
      by: ['judgeId'],
      _count: {
        id: true,
      }
    });

    // 获取评委信息
    const judges = await client.user.findMany({
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
});