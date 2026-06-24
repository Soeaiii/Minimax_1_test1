import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

export const GET = withTenantContext(async () => {
  try {
    const ctx = getTenantContext()!;
    if (ctx.role !== 'JUDGE') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const profile = await prisma.user.findUnique({
      where: {
        id: ctx.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching judge profile:', error);
    return NextResponse.json(
      { error: '获取个人资料失败' },
      { status: 500 }
    );
  }
});