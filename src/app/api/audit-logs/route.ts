import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取审计日志
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const exportCsv = searchParams.get('export') === 'true';
    
    const skip = (page - 1) * limit;
    
    let where: any = {};
    
    if (action) {
      where.action = action;
    }
    
    if (userId) {
      where.userId = userId;
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
    
    // 搜索功能 - 搜索操作类型和目标ID
    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { targetId: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // 如果是导出请求，获取所有匹配的数据
    if (exportCsv) {
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
      });
      
      // 生成CSV格式
      const csvHeaders = 'Timestamp,User Name,User Email,Action,Target ID,Details\n';
      const csvRows = logs.map(log => {
        const timestamp = new Date(log.timestamp).toLocaleString('zh-CN');
        const details = log.details ? JSON.stringify(log.details).replace(/"/g, '""') : '';
        return `"${timestamp}","${log.user.name}","${log.user.email}","${log.action}","${log.targetId || ''}","${details}"`;
      }).join('\n');
      
      const csv = csvHeaders + csvRows;
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }
    
    // 获取总数
    const total = await prisma.auditLog.count({ where });
    
    // 获取分页数据
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
    
    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: '获取审计日志失败' },
      { status: 500 }
    );
  }
} 