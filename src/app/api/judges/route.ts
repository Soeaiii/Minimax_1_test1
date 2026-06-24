import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';
import bcrypt from 'bcrypt';

// 创建裁判
export const POST = withTenantContext(async (request: Request) => {
  try {
    const ctx = getTenantContext()!;
    
    // 检查用户是否已登录且是管理员
    if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN' && ctx.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, password, bio, avatar } = body;

    // 验证必填字段
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '姓名、邮箱和密码是必填项' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被使用' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建裁判用户
    const judgeData: any = {
      name,
      email,
      password: hashedPassword,
      role: 'JUDGE',
      permissions: ['JUDGE_PROGRAMS'],
      isActive: true,
      tenantId: ctx.tenantId,
    };

    if (bio) judgeData.bio = bio;
    if (avatar) judgeData.avatar = avatar;

    const judge = await prisma.user.create({
      data: judgeData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatar: true,
        createdAt: true,
      },
    });

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: ctx.tenantId,
        userId: ctx.userId,
        action: 'CREATE_JUDGE',
        targetId: judge.id,
        details: {
          judgeName: judge.name,
          judgeEmail: judge.email,
        },
      },
    });

    return NextResponse.json(judge);
  } catch (error) {
    console.error('Error creating judge:', error);
    return NextResponse.json(
      { error: '创建裁判失败' },
      { status: 500 }
    );
  }
});

// 获取裁判列表
export const GET = withTenantContext(async (request: Request) => {
  try {
    const ctx = getTenantContext()!;
    
    // 检查用户是否已登录且是管理员
    if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN' && ctx.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let where = {
      role: 'JUDGE' as const,
      isDeleted: false,
    };

    // 如果有搜索关键词，按姓名或邮箱搜索
    if (search) {
      where = {
        ...where,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      } as any;
    }

    const judges = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(judges);
  } catch (error) {
    console.error('Error fetching judges:', error);
    return NextResponse.json(
      { error: '获取裁判列表失败' },
      { status: 500 }
    );
  }
});