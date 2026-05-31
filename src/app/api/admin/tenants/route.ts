import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { getAuthSession, auditLog, checkQuota, PLAN_QUOTAS } from '@/lib/tenant-guard';

// 获取所有租户列表
export async function GET(request: Request) {
  const session = await getAuthSession();

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
  const search = searchParams.get('search');
  const isActive = searchParams.get('isActive');
  const plan = searchParams.get('plan');

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { domain: { contains: search, mode: 'insensitive' } },
      { contactEmail: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (isActive !== null && isActive !== undefined && isActive !== '') {
    where.isActive = isActive === 'true';
  }
  if (plan) {
    where.plan = plan.toUpperCase();
  }

  const total = await prisma.tenant.count({ where });

  const tenants = await prisma.tenant.findMany({
    where,
    include: {
      _count: { select: { users: true, competitions: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const tenantsWithCounts = tenants.map(t => ({
    ...t,
    userCount: t._count.users,
    competitionCount: t._count.competitions,
    _count: undefined,
  }));

  return NextResponse.json({
    data: tenantsWithCounts,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

// 创建新租户
export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 });
  }

  const body = await request.json();
  const { name, domain, settings, adminEmail, adminPassword, adminName, plan, contactEmail } = body;

  if (!name) {
    return NextResponse.json({ error: '租户名称不能为空' }, { status: 400 });
  }

  if (adminEmail && !adminPassword) {
    return NextResponse.json({ error: '管理员密码不能为空' }, { status: 400 });
  }

  if (domain) {
    const existing = await prisma.tenant.findUnique({ where: { domain } });
    if (existing) {
      return NextResponse.json({ error: '域名已被使用' }, { status: 400 });
    }
  }

  if (adminEmail) {
    const existing = await prisma.user.findFirst({ where: { email: adminEmail } });
    if (existing) {
      return NextResponse.json({ error: '管理员邮箱已被使用' }, { status: 400 });
    }
  }

  // 根据套餐设置配额
  const planKey = (plan?.toUpperCase() || 'FREE') as keyof typeof PLAN_QUOTAS;
  const quotas = PLAN_QUOTAS[planKey] || PLAN_QUOTAS.FREE;

  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name,
        domain: domain || null,
        settings: settings || {},
        isActive: true,
        plan: planKey,
        maxUsers: quotas.maxUsers,
        maxCompetitions: quotas.maxCompetitions,
        contactEmail: contactEmail || null,
        createdBy: session.user.id,
      },
    });

    let adminUser = null;
    if (adminEmail && adminPassword) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      adminUser = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: adminName || name + '管理员',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true,
        },
        select: { id: true, name: true, email: true, role: true },
      });
    }

    return { tenant, adminUser };
  });

  await auditLog(session.user.tenantId, session.user.id, 'CREATE_TENANT', result.tenant.id, {
    tenantName: name,
    domain,
    plan: planKey,
    adminCreated: !!result.adminUser,
  });

  return NextResponse.json({
    message: '租户创建成功',
    tenant: result.tenant,
    adminUser: result.adminUser,
  }, { status: 201 });
}
