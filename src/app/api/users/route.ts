import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/lib/types';

// 获取用户列表，支持按角色筛选
export async function GET(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录且是管理员
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') as UserRole | null;
    const search = searchParams.get('search');
    
    let where: any = {
      tenantId: session.user.tenantId, // 添加租户过滤
      isDeleted: false, // 只返回未删除的用户
    };
    
    // 如果指定了角色，按角色筛选
    if (role) {
      where = {
        ...where,
        role,
      };
    }
    
    // 如果有搜索关键词，按姓名或邮箱搜索
    if (search) {
      where = {
        ...where,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }
    
    // 查询用户，但不返回密码
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    );
  }
} 