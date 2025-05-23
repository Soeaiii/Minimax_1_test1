import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 最简单的状态更新API
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { currentStatus } = body;

    if (!currentStatus) {
      return NextResponse.json(
        { error: '缺少状态参数' },
        { status: 400 }
      );
    }

    // 使用最基本的 Prisma 操作，不包含任何关联
    const result = await prisma.program.update({
      where: { id: id },
      data: { currentStatus: currentStatus },
    });

    return NextResponse.json({
      success: true,
      message: '状态更新成功',
      program: {
        id: result.id,
        currentStatus: result.currentStatus,
      },
    });
    
  } catch (error) {
    console.error('Simple update error:', error);
    return NextResponse.json(
      { 
        error: '更新失败', 
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
} 