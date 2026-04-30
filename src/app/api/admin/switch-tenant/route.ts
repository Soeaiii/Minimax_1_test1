'use server';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 切换当前用户的租户上下文
export async function POST(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);

    // 只有 SUPER_ADMIN 才能切换租户
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '未授权访问，只有超级管理员可以切换租户' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tenantId } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: '缺少租户ID' },
        { status: 400 }
      );
    }

    // 验证目标租户存在且活跃
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: '租户不存在' },
        { status: 404 }
      );
    }

    if (!tenant.isActive) {
      return NextResponse.json(
        { error: '该租户已被禁用，无法切换' },
        { status: 400 }
      );
    }

    // 更新用户的租户上下文
    await prisma.user.update({
      where: { id: session.user.id },
      data: { tenantId: tenantId },
    });

    return NextResponse.json({
      success: true,
      message: `已切换到租户: ${tenant.name}`,
      tenantId: tenantId,
      tenantName: tenant.name,
    });
  } catch (error) {
    console.error('Error switching tenant:', error);
    return NextResponse.json(
      { error: '切换租户失败' },
      { status: 500 }
    );
  }
}