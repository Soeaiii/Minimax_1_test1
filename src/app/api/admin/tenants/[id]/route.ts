import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 获取单个租户详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);

    // 只有 SUPER_ADMIN 才能访问
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            competitions: true,
            auditLogs: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        competitions: {
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: '租户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...tenant,
      userCount: tenant._count.users,
      competitionCount: tenant._count.competitions,
      auditLogCount: tenant._count.auditLogs,
      _count: undefined,
    });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json(
      { error: '获取租户详情失败' },
      { status: 500 }
    );
  }
}

// 更新租户
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);

    // 只有 SUPER_ADMIN 才能更新租户
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, domain, settings, isActive } = body;

    // 检查租户是否存在
    const existingTenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!existingTenant) {
      return NextResponse.json(
        { error: '租户不存在' },
        { status: 404 }
      );
    }

    // 如果要更新域名，检查唯一性
    if (domain && domain !== existingTenant.domain) {
      const domainExists = await prisma.tenant.findFirst({
        where: {
          domain,
          id: { not: id },
        },
      });
      if (domainExists) {
        return NextResponse.json(
          { error: '域名已被使用' },
          { status: 400 }
        );
      }
    }

    // 构建更新数据
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (domain !== undefined) updateData.domain = domain || null;
    if (settings !== undefined) updateData.settings = settings;
    if (isActive !== undefined) updateData.isActive = isActive;

    // 更新租户
    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: updateData,
    });

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: 'UPDATE_TENANT',
        targetId: id,
        details: {
          previous: {
            name: existingTenant.name,
            domain: existingTenant.domain,
            isActive: existingTenant.isActive,
          },
          updated: updateData,
        },
      },
    });

    return NextResponse.json({
      message: '租户更新成功',
      tenant: updatedTenant,
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    return NextResponse.json(
      { error: '更新租户失败' },
      { status: 500 }
    );
  }
}

// 删除租户（软删除）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);

    // 只有 SUPER_ADMIN 才能删除租户
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '只有超级管理员可以删除租户' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 检查租户是否存在
    const existingTenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!existingTenant) {
      return NextResponse.json(
        { error: '租户不存在' },
        { status: 404 }
      );
    }

    // 软删除：设置为不活跃
    const deletedTenant = await prisma.tenant.update({
      where: { id },
      data: { isActive: false },
    });

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: 'DELETE_TENANT',
        targetId: id,
        details: {
          deletedTenant: {
            id: deletedTenant.id,
            name: deletedTenant.name,
            domain: deletedTenant.domain,
          },
        },
      },
    });

    return NextResponse.json({
      message: '租户已停用',
      tenant: deletedTenant,
    });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return NextResponse.json(
      { error: '删除租户失败' },
      { status: 500 }
    );
  }
}