import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

/**
 * 获取当前大屏幕显示的节目信息
 * 供裁判打分页面使用，显示当前屏幕上正在显示的节目
 */
export const GET = withTenantContext(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const ctx = getTenantContext()!;
    if (ctx.role !== 'JUDGE') {
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
        participantPrograms: {
          include: {
            participant: {
              select: {
                id: true,
                name: true,
                team: true,
              },
            },
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
});
