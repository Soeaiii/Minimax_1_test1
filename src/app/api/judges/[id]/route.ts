import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcrypt';

// 获取单个评委信息
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const judge = await prisma.user.findUnique({
      where: {
        id: params.id,
        role: 'JUDGE',
        isDeleted: false,
      },
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

    if (!judge) {
      return NextResponse.json(
        { error: '评委不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(judge);
  } catch (error) {
    console.error('Error fetching judge:', error);
    return NextResponse.json(
      { error: '获取评委信息失败' },
      { status: 500 }
    );
  }
}

// 更新评委信息
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const body = await request.json();
    const { name, email, bio, avatar, password } = body;

    // 验证必填字段
    if (!name || !email) {
      return NextResponse.json(
        { error: '姓名和邮箱是必填项' },
        { status: 400 }
      );
    }

    // 检查评委是否存在
    const existingJudge = await prisma.user.findUnique({
      where: {
        id: params.id,
        role: 'JUDGE',
        isDeleted: false,
      },
    });

    if (!existingJudge) {
      return NextResponse.json(
        { error: '评委不存在' },
        { status: 404 }
      );
    }

    // 检查邮箱是否被其他用户使用
    if (email !== existingJudge.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          id: { not: params.id },
          isDeleted: false,
        },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: '该邮箱已被其他用户使用' },
          { status: 400 }
        );
      }
    }

    // 准备更新数据
    const updateData: Record<string, unknown> = {
      name,
      email,
      bio: bio || null,
      avatar: avatar || null,
    };

    // 如果提供了新密码，则加密并更新
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // 更新评委信息
    const updatedJudge = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_JUDGE',
        targetId: params.id,
        details: {
          judgeName: updatedJudge.name,
          judgeEmail: updatedJudge.email,
          changes: Object.keys(updateData),
        },
      },
    });

    return NextResponse.json(updatedJudge);
  } catch (error) {
    console.error('Error updating judge:', error);
    return NextResponse.json(
      { error: '更新评委失败' },
      { status: 500 }
    );
  }
}

// 删除评委
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const params = await context.params;
    
    // 检查评委是否存在
    const existingJudge = await prisma.user.findUnique({
      where: {
        id: params.id,
        role: 'JUDGE',
        isDeleted: false,
      },
    });

    if (!existingJudge) {
      return NextResponse.json(
        { error: '评委不存在' },
        { status: 404 }
      );
    }

    // 检查评委是否有相关的评分记录
    const scoresCount = await prisma.score.count({
      where: { judgeId: params.id },
    });

    if (scoresCount > 0) {
      return NextResponse.json(
        { error: '该评委已有评分记录，无法删除' },
        { status: 400 }
      );
    }

    // 软删除评委（标记为已删除，而不是物理删除）
    await prisma.user.update({
      where: { id: params.id },
      data: { isDeleted: true },
    });

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE_JUDGE',
        targetId: params.id,
        details: {
          judgeName: existingJudge.name,
          judgeEmail: existingJudge.email,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting judge:', error);
    return NextResponse.json(
      { error: '删除评委失败' },
      { status: 500 }
    );
  }
} 