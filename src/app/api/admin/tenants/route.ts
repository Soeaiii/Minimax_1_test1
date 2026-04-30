import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcrypt';

// 获取所有租户列表
export async function GET(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);

    // 只有 SUPER_ADMIN 才能访问租户列表
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');

    // 构建查询条件
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // 获取总数
    const total = await prisma.tenant.count({ where });

    const tenants = await prisma.tenant.findMany({
      where,
      include: {
        _count: {
          select: {
            users: true,
            competitions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 转换数据，添加计数信息
    const tenantsWithCounts = tenants.map(tenant => ({
      ...tenant,
      userCount: tenant._count.users,
      competitionCount: tenant._count.competitions,
      _count: undefined,
    }));

    return NextResponse.json({
      data: tenantsWithCounts,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { error: '获取租户列表失败' },
      { status: 500 }
    );
  }
}

// 创建新租户
export async function POST(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);

    // 只有 SUPER_ADMIN 才能创建租户
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, domain, settings, adminEmail, adminPassword, adminName } = body;

    if (!name) {
      return NextResponse.json(
        { error: '租户名称不能为空' },
        { status: 400 }
      );
    }

    // 如果提供了管理员信息，验证必填字段
    if (adminEmail && !adminPassword) {
      return NextResponse.json(
        { error: '管理员密码不能为空' },
        { status: 400 }
      );
    }

    // 检查域名唯一性（如果提供了域名）
    if (domain) {
      const existingDomain = await prisma.tenant.findUnique({
        where: { domain },
      });
      if (existingDomain) {
        return NextResponse.json(
          { error: '域名已被使用' },
          { status: 400 }
        );
      }
    }

    // 检查管理员邮箱唯一性
    if (adminEmail) {
      const existingUser = await prisma.user.findFirst({
        where: { email: adminEmail },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: '管理员邮箱已被使用' },
          { status: 400 }
        );
      }
    }

    // 使用事务创建租户和管理员
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name,
          domain: domain || null,
          settings: settings || {},
          isActive: true,
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
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });
      }

      return { tenant, adminUser };
    });

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: 'CREATE_TENANT',
        targetId: result.tenant.id,
        details: {
          tenantName: name,
          domain,
          adminCreated: !!result.adminUser,
        },
      },
    });

    return NextResponse.json({
      message: '租户创建成功',
      tenant: result.tenant,
      adminUser: result.adminUser,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      { error: '创建租户失败' },
      { status: 500 }
    );
  }
}