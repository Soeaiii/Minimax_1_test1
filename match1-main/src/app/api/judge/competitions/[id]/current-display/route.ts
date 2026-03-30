import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * 获取当前大屏幕显示的节目信息
 * 供裁判打分页面使用，显示当前屏幕上正在显示的节目
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 检查用户是否已登录
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 检查用户是否为评委
    if (session.user.role !== 'JUDGE') {
      return NextResponse.json(
        { error: '只有评委可以访问此接口' },
        { status: 403 }
      );
    }

    const { id: competitionId } = await params;

    // 获取显示设置
    const displaySettings = await prisma.displaySettings.findUnique({
      where: {
        competitionId: competitionId,
      },
    });

    if (!displaySettings?.currentProgramId) {
      return NextResponse.json(
        { 
          success: true,
          currentProgram: null 
        },
        { status: 200 }
      );
    }

    // 获取当前节目信息
    const currentProgram = await prisma.program.findUnique({
      where: {
        id: displaySettings.currentProgramId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        order: true,
        currentStatus: true,
        participants: {
          select: {
            id: true,
            name: true,
            team: true,
          },
        },
      },
    });

    if (!currentProgram) {
      return NextResponse.json(
        { 
          success: true,
          currentProgram: null 
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      currentProgram,
    });
  } catch (error) {
    console.error('获取当前大屏幕节目信息失败:', error);
    return NextResponse.json(
      { error: '获取当前大屏幕节目信息失败' },
      { status: 500 }
    );
  }
} 