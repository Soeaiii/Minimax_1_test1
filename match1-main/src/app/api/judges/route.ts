import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcrypt';

// 创建裁判
export async function POST(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录且是管理员
    if (!session || session.user.role !== 'ADMIN') {
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

    // 获取默认租户
    const defaultTenant = await prisma.tenant.findFirst({
      where: { name: 'Default' },
    });

    if (!defaultTenant) {
      return NextResponse.json(
        { error: '系统配置错误：未找到默认租户' },
        { status: 500 }
      );
    }

    // 创建裁判用户
    const judgeData: any = {
      name,
      email,
      password: hashedPassword,
      role: 'JUDGE',
      tenantId: defaultTenant.id,
      permissions: ['JUDGE_PROGRAMS'],
      isActive: true,
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
        userId: session.user.id,
        tenantId: session.user.tenantId,
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
}

// 获取裁判列表
export async function GET(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录且是管理员
    if (!session || session.user.role !== 'ADMIN') {
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
}