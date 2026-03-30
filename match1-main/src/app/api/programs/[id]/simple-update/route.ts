import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 节目状态更新API - 支持PATCH和PUT方法
async function updateProgramStatus(
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

    // 验证状态值
    const validStatuses = ['WAITING', 'PERFORMING', 'COMPLETED'];
    if (!validStatuses.includes(currentStatus)) {
      return NextResponse.json(
        { error: '无效的状态值。允许的状态: WAITING, PERFORMING, COMPLETED' },
        { status: 400 }
      );
    }

    // 检查节目是否存在
    const existingProgram = await prisma.program.findUnique({
      where: { id: id },
      select: { id: true, name: true, currentStatus: true }
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      );
    }

    // 更新节目状态
    const result = await prisma.program.update({
      where: { id: id },
      data: { 
        currentStatus: currentStatus,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        currentStatus: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `节目 "${existingProgram.name}" 状态已更新为 "${currentStatus}"`,
      program: result,
    });
    
  } catch (error) {
    console.error('Program status update error:', error);
    return NextResponse.json(
      { 
        error: '更新失败', 
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

// 支持PATCH方法
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateProgramStatus(request, { params });
}

// 支持PUT方法
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateProgramStatus(request, { params });
} 