import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/lib/types';

// 获取数据访问统计
export async function GET(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 只有管理员可以查看数据访问统计
    if (session.user.role !== 'ADMIN') {
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

    // 获取用户访问统计
    const userAccessStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    // 获取审计日志统计
    const auditLogStats = await prisma.auditLog.groupBy({
      by: ['action'],
      _count: {
        id: true,
      },
      where: {
        timestamp: {
          gte: start,
          lte: end,
        },
      },
    });

    // 获取每日访问量统计
    const dailyStats = await prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: start,
          lte: end,
        },
      },
      select: {
        timestamp: true,
        action: true,
      },
    });

    // 按日期分组统计
    const dailyAccessMap = new Map<string, number>();
    dailyStats.forEach(log => {
      const date = log.timestamp.toISOString().split('T')[0];
      dailyAccessMap.set(date, (dailyAccessMap.get(date) || 0) + 1);
    });

    const dailyAccess = Array.from(dailyAccessMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    // 获取总体统计
    const totalUsers = await prisma.user.count();
    const totalAuditLogs = await prisma.auditLog.count({
      where: {
        timestamp: {
          gte: start,
          lte: end,
        },
      },
    });

    // 获取活跃用户数（最近7天有操作的用户）
    const activeUsers = await prisma.auditLog.findMany({
      where: {
        timestamp: {
          gte: start,
          lte: end,
        },
      },
      select: {
        userId: true,
      },
      distinct: ['userId'],
    });

    const stats = {
      summary: {
        totalUsers,
        activeUsers: activeUsers.length,
        totalAuditLogs,
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
      userStats: userAccessStats.map(stat => ({
        role: stat.role,
        count: stat._count?.id || 0,
      })),
      actionStats: auditLogStats.map(stat => ({
        action: stat.action,
        count: stat._count?.id || 0,
      })),
      dailyAccess: dailyAccess.sort((a, b) => a.date.localeCompare(b.date)),
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching data access stats:', error);
    return NextResponse.json(
      { error: '获取数据访问统计失败' },
      { status: 500 }
    );
  }
}