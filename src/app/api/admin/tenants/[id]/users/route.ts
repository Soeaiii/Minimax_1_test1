import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { getAuthSession, auditLog } from '@/lib/tenant-guard';

/**
 * 租户内用户管理 API
 * GET  - 列出租户下所有用户
 * POST - 为租户添加用户（校验配额）
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 });
  }

  const { id: tenantId } = await params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '50', 10)));
  const search = searchParams.get('search');
  const role = searchParams.get('role');

  const where: any = { tenantId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) where.role = role.toUpperCase();

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, role: true,
        isActive: true, createdAt: true, lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    data: users,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

/**
 * 为租户添加用户
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 });
  }

  const { id: tenantId } = await params;
  const body = await request.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: '姓名、邮箱和密码为必填项' }, { status: 400 });
  }


  // 邮箱唯一性（同一租户内）
  const existing = await prisma.user.findFirst({ where: { email, tenantId } });
  if (existing) {
    return NextResponse.json({ error: '该邮箱在此租户中已被使用' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      tenantId,
      name,
      email,
      password: hashedPassword,
      role: (role?.toUpperCase() || 'USER') as any,
      isActive: true,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  await auditLog(session.user.tenantId, session.user.id, 'CREATE_USER_IN_TENANT', user.id, {
    targetTenantId: tenantId,
    userName: name,
    userEmail: email,
    userRole: role,
  });

  return NextResponse.json({ message: '用户创建成功', user }, { status: 201 });
}
