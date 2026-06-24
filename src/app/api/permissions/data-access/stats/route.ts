import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

// 获取数据访问统计
export const GET = withTenantContext(async (request: Request) => {
  try {
    const ctx = getTenantContext()!;

    // 只有管理员可以查看数据访问统计
    if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 设置默认时间范围（最近7天）
    const defaultEndDate = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 7);

    const start = startDate ? new Date(startDate) : defaultStartDate;
    const end = endDate ? new Date(endDate) : defaultEndDate;

    const logs = await prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: start,
          lte: end,
        },
      },
      select: {
        action: true,
        userId: true,
      },
    });

    const inferResource = (action: string) => {
      const normalized = action.toLowerCase();
      if (normalized.includes('user')) return 'user';
      if (normalized.includes('judge')) return 'judge';
      if (normalized.includes('score')) return 'score';
      if (normalized.includes('participant')) return 'participant';
      if (normalized.includes('program')) return 'program';
      if (normalized.includes('competition')) return 'competition';
      return 'system';
    };

    const grouped = new Map<string, { totalAccess: number; uniqueUsers: Set<string> }>();
    logs.forEach((log) => {
      const resource = inferResource(log.action);
      const current = grouped.get(resource) ?? { totalAccess: 0, uniqueUsers: new Set<string>() };
      current.totalAccess += 1;
      current.uniqueUsers.add(log.userId);
      grouped.set(resource, current);
    });

    const stats = Array.from(grouped.entries()).map(([resource, value]) => ({
      resource,
      totalAccess: value.totalAccess,
      allowedAccess: value.totalAccess,
      deniedAccess: 0,
      uniqueUsers: value.uniqueUsers.size,
    }));

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching data access stats:', error);
    return NextResponse.json(
      { error: '获取数据访问统计失败' },
      { status: 500 }
    );
  }
});
