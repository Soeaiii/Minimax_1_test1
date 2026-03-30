import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/lib/types';

// 获取数据访问日志
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

    // 只有管理员可以查看数据访问日志
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');

    // 构建查询条件
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = action;
    }

    if (resource) {
      where.resource = {
        contains: resource,
        mode: 'insensitive',
      };
    }

    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.timestamp = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.timestamp = {
        lte: new Date(endDate),
      };
    }

    if (search) {
      where.OR = [
        {
          action: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          resource: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          details: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // 计算分页
    const skip = (page - 1) * limit;

    // 获取总数
    const total = await prisma.auditLog.count({ where });

    // 获取日志数据
    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      skip,
      take: limit,
    });

    // 获取统计信息
    const stats = {
      totalActions: await prisma.auditLog.count(),
      uniqueUsers: await prisma.auditLog.findMany({
        select: { userId: true },
        distinct: ['userId'],
      }).then(users => users.length),
      actionTypes: await prisma.auditLog.groupBy({
        by: ['action'],
        _count: { id: true },
      }).then(groups => groups.map(g => ({ action: g.action, count: g._count.id }))),
    };

    // 计算分页信息
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching data access logs:', error);
    return NextResponse.json(
      { error: '获取数据访问日志失败' },
      { status: 500 }
    );
  }
}

// 创建数据访问日志
export async function POST(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, resource, details, metadata } = body;

    if (!action) {
      return NextResponse.json(
        { error: '操作类型不能为空' },
        { status: 400 }
      );
    }

    // 创建审计日志
    const log = await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        tenantId: session.user.tenantId,
        action,
        targetId: resource || null,
        details: {
          ...details,
          metadata: metadata || null,
          ipAddress: request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { error: '创建审计日志失败' },
      { status: 500 }
    );
  }
}

// 批量删除审计日志（仅管理员）
export async function DELETE(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 只有管理员可以删除审计日志
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const action = searchParams.get('action');

    // 构建删除条件
    const where: any = {
      timestamp: {
        lt: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    };

    if (action) {
      where.action = action;
    }

    // 删除旧的审计日志
    const result = await prisma.auditLog.deleteMany({ where });

    return NextResponse.json({
      message: `成功删除 ${result.count} 条审计日志`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Error deleting audit logs:', error);
    return NextResponse.json(
      { error: '删除审计日志失败' },
      { status: 500 }
    );
  }
}