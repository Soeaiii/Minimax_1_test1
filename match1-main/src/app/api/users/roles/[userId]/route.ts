import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { $Enums } from '@prisma/client';

// 更新用户角色
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 只有管理员可以修改用户角色
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '无权限修改用户角色' },
        { status: 403 }
      );
    }

    // userId已在函数开头解构
    const body = await request.json();
    const { role, reason } = body;
    
    // 验证角色值
    if (!role || !Object.values($Enums.UserRole).includes(role)) {
      return NextResponse.json(
        { error: '无效的角色类型' },
        { status: 400 }
      );
    }
    
    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    
    if (!targetUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 防止修改自己的角色
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: '不能修改自己的角色' },
        { status: 400 }
      );
    }
    
    // 如果角色没有变化，直接返回
    if (targetUser.role === role) {
      return NextResponse.json({
        message: '用户角色未发生变化',
        user: targetUser,
      });
    }
    
    // 更新用户角色
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });
    
    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: 'UPDATE_USER_ROLE',
        targetId: userId,
        details: {
          oldRole: targetUser.role,
          newRole: role,
          targetUser: {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
          },
          reason: reason || '管理员修改用户角色',
        },
      },
    });
    
    return NextResponse.json({
      message: '用户角色更新成功',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: '更新用户角色失败' },
      { status: 500 }
    );
  }
}

// 删除用户（软删除）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 只有管理员可以删除用户
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '无权限删除用户' },
        { status: 403 }
      );
    }

    // userId已在函数开头解构
    const body = await request.json();
    const { reason } = body;
    
    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isDeleted: true,
      },
    });
    
    if (!targetUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    if (targetUser.isDeleted) {
      return NextResponse.json(
        { error: '用户已被删除' },
        { status: 400 }
      );
    }
    
    // 防止删除自己
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: '不能删除自己的账户' },
        { status: 400 }
      );
    }
    
    // 软删除用户
    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
      },
    });
    
    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: 'DELETE_USER',
        targetId: userId,
        details: {
          targetUser: {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            role: targetUser.role,
          },
          reason: reason || '管理员删除用户',
        },
      },
    });
    
    return NextResponse.json({
      message: '用户删除成功',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    );
  }
}