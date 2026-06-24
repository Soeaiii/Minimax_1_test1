import { NextResponse } from 'next/server';
import { prisma, prismaRaw } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';
import { cleanupAuditLogs } from '@/lib/auditLogCleanup';
import * as XLSX from 'xlsx';

// 获取审计日志
async function GET_handler(request: Request) {
  try {
    const ctx = getTenantContext()!;

    if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const client = ctx.role === 'SUPER_ADMIN' ? prismaRaw : prisma;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const exportXlsx = searchParams.get('export') === 'true';

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};

    // 租户隔离：prisma 扩展自动处理。SUPER_ADMIN 使用 prismaRaw 实现跨租户查询。

    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (action) {
      where.action = action;
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }
    
    // 如果是导出请求，获取所有匹配的数据
    if (exportXlsx) {
      const logs = await client.auditLog.findMany({
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
      
      // 创建Excel数据数组
      const excelData = [];
      
      // 添加标题行
      excelData.push(['时间', '用户姓名', '用户邮箱', '操作类型', '目标ID', '详细信息']);
      
      // 添加数据行
      logs.forEach(log => {
        const timestamp = new Date(log.timestamp).toLocaleString('zh-CN');
        const details = log.details ? JSON.stringify(log.details) : '';
        
        excelData.push([
          timestamp,
          log.user.name,
          log.user.email,
          log.action,
          log.targetId || '',
          details
        ]);
      });

      // 创建工作簿和工作表
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);
      
      // 设置列宽
      worksheet['!cols'] = [
        { wch: 18 }, // 时间
        { wch: 15 }, // 用户姓名
        { wch: 25 }, // 用户邮箱
        { wch: 12 }, // 操作类型
        { wch: 20 }, // 目标ID
        { wch: 40 }  // 详细信息
      ];
      
      XLSX.utils.book_append_sheet(workbook, worksheet, '审计日志');

      const fileName = `audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`;
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        },
      });
    }
    
    // 获取总数
    const total = await client.auditLog.count({ where });
    
    // 获取分页数据
    const logs = await client.auditLog.findMany({
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

export const GET = withTenantContext(GET_handler);

// 手动清理审计日志
async function DELETE_handler(request: Request) {
  try {
    const ctx = getTenantContext()!;

    if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '未授权操作，只有管理员可以清理审计日志' },
        { status: 403 }
      );
    }

    const client = ctx.role === 'SUPER_ADMIN' ? prismaRaw : prisma;

    // 获取清理前的总数
    const beforeCount = await client.auditLog.count();

    // 执行清理
    await cleanupAuditLogs();

    // 获取清理后的总数
    const afterCount = await client.auditLog.count();
    const deletedCount = beforeCount - afterCount;

    // 记录清理操作的审计日志
    await client.auditLog.create({
      data: {
        userId: ctx.userId,
        ...(ctx.role === 'SUPER_ADMIN' ? { tenantId: ctx.tenantId } : {}),
        action: 'CLEANUP_AUDIT_LOGS',
        details: {
          beforeCount,
          afterCount,
          deletedCount,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: '审计日志清理完成',
      beforeCount,
      afterCount,
      deletedCount,
    });
  } catch (error) {
    console.error('手动清理审计日志失败:', error);
    return NextResponse.json(
      { error: '清理审计日志失败' },
      { status: 500 }
    );
  }
}

export const DELETE = withTenantContext(DELETE_handler);