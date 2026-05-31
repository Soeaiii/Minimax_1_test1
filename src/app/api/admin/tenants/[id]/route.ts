import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession, auditLog, checkQuota, PLAN_QUOTAS } from '@/lib/tenant-guard';

// 获取单个租户详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 });
  }

  const { id } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      _count: { select: { users: true, competitions: true, programs: true, auditLogs: true } },
      users: {
        select: {
          id: true, name: true, email: true, role: true,
          isActive: true, createdAt: true, lastLogin: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      competitions: {
        select: {
          id: true, name: true, status: true, startTime: true,
          _count: { select: { programs: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!tenant) {
    return NextResponse.json({ error: '租户不存在' }, { status: 404 });
  }

  // 计算配额使用率
  const quotaUsage = {
    users: { used: tenant._count.users, max: tenant.maxUsers, percent: Math.round((tenant._count.users / tenant.maxUsers) * 100) },
    competitions: { used: tenant._count.competitions, max: tenant.maxCompetitions, percent: Math.round((tenant._count.competitions / tenant.maxCompetitions) * 100) },
  };

  return NextResponse.json({
    ...tenant,
    userCount: tenant._count.users,
    competitionCount: tenant._count.competitions,
    programCount: tenant._count.programs,
    auditLogCount: tenant._count.auditLogs,
    quotaUsage,
    _count: undefined,
  });
}

// 更新租户
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const {
    name, domain, settings, isActive,
    plan, maxUsers, maxCompetitions,
    logoUrl, primaryColor, contactEmail, expiresAt,
  } = body;

  const existing = await prisma.tenant.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: '租户不存在' }, { status: 404 });
  }

  if (domain && domain !== existing.domain) {
    const dup = await prisma.tenant.findFirst({ where: { domain, id: { not: id } } });
    if (dup) {
      return NextResponse.json({ error: '域名已被使用' }, { status: 400 });
    }
  }

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (domain !== undefined) updateData.domain = domain || null;
  if (settings !== undefined) updateData.settings = settings;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (contactEmail !== undefined) updateData.contactEmail = contactEmail || null;
  if (logoUrl !== undefined) updateData.logoUrl = logoUrl || null;
  if (primaryColor !== undefined) updateData.primaryColor = primaryColor;
  if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

  // 套餐变更：自动调整配额
  if (plan !== undefined) {
    const planKey = plan.toUpperCase() as keyof typeof PLAN_QUOTAS;
    const quotas = PLAN_QUOTAS[planKey];
    if (quotas) {
      updateData.plan = planKey;
      // 仅在未手动指定配额时自动调整
      if (maxUsers === undefined) updateData.maxUsers = quotas.maxUsers;
      if (maxCompetitions === undefined) updateData.maxCompetitions = quotas.maxCompetitions;
    }
  }
  if (maxUsers !== undefined) updateData.maxUsers = maxUsers;
  if (maxCompetitions !== undefined) updateData.maxCompetitions = maxCompetitions;

  const updated = await prisma.tenant.update({ where: { id }, data: updateData });

  await auditLog(session.user.tenantId, session.user.id, 'UPDATE_TENANT', id, {
    previous: { name: existing.name, plan: existing.plan, isActive: existing.isActive },
    updated: updateData,
  });

  return NextResponse.json({ message: '租户更新成功', tenant: updated });
}

// 删除租户（软删除）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '只有超级管理员可以删除租户' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.tenant.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: '租户不存在' }, { status: 404 });
  }

  // 不允许删除系统租户
  const sysSetting = existing.settings as Record<string, any> || {};
  if (sysSetting.isSystem) {
    return NextResponse.json({ error: '不能删除系统租户' }, { status: 403 });
  }

  const deleted = await prisma.tenant.update({
    where: { id },
    data: { isActive: false },
  });

  await auditLog(session.user.tenantId, session.user.id, 'DELETE_TENANT', id, {
    deletedTenant: { id: deleted.id, name: deleted.name, domain: deleted.domain },
  });

  return NextResponse.json({ message: '租户已停用', tenant: deleted });
}
