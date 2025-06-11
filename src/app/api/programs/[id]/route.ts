import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 获取单个节目详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        competition: true,
        participants: true,
        attachments: true,
        scores: {
          include: {
            scoringCriteria: true,
          },
        },
        ranking: true,
      },
    });
    
    if (!program) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: '获取节目详情失败' },
      { status: 500 }
    );
  }
}

// 更新节目
export async function PUT(
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
    
    const {
      name,
      description,
      order,
      currentStatus,
      participantIds,
      customFields,
    } = body;
    
    // 检查节目是否存在
    const existingProgram = await prisma.program.findUnique({
      where: { id },
      include: {
        competition: true,
        participants: true,
      },
    });
    
    if (!existingProgram) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      );
    }

    // 检查权限
    if (session.user.role !== 'ADMIN' && existingProgram.competition.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: '您没有权限修改此节目' },
        { status: 403 }
      );
    }
    
    // 构建更新数据
    const updateData: any = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(order && { order }),
      ...(currentStatus && { currentStatus }),
    };
    
    // 如果有自定义字段，添加到更新数据中
    if (customFields) {
      updateData.customFields = customFields;
    }
    
    // 更新节目基本信息
    const updatedProgram = await prisma.program.update({
      where: { id },
      data: updateData,
      include: {
        competition: true,
        participants: true,
      },
    });

    // 如果需要更新参与者关联，单独处理
    if (participantIds && Array.isArray(participantIds)) {
      try {
        await prisma.$transaction(async (tx) => {
          // 获取当前的参与者关联
          const currentProgram = await tx.program.findUnique({
            where: { id },
            select: { participantIds: true }
          });
          
          const currentParticipantIds = currentProgram?.participantIds || [];
          
          // 找出要移除的参与者
          const toRemove = currentParticipantIds.filter(pid => !participantIds.includes(pid));
          // 找出要添加的参与者
          const toAdd = participantIds.filter(pid => !currentParticipantIds.includes(pid));
          
          // 移除不再关联的参与者
          for (const participantId of toRemove) {
            await tx.participant.update({
              where: { id: participantId },
              data: {
                programIds: {
                  set: (await tx.participant.findUnique({
                    where: { id: participantId },
                    select: { programIds: true }
                  }))?.programIds.filter(pid => pid !== id) || []
                }
              }
            });
          }
          
          // 添加新的参与者关联
          for (const participantId of toAdd) {
            await tx.participant.update({
              where: { id: participantId },
              data: {
                programIds: {
                  push: id
                }
              }
            });
          }
          
          // 更新节目的participantIds
          await tx.program.update({
            where: { id },
            data: {
              participantIds: participantIds
            }
          });
        });
      } catch (participantError) {
        console.error('Error updating participants:', participantError);
        // 参与者更新失败时记录错误但不影响基本信息更新
      }
    }

    // 尝试记录审计日志（如果失败也不影响主要功能）
    try {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'UPDATE_PROGRAM',
          targetId: id,
          details: {
            updated: body,
          },
        },
      });
    } catch (auditError) {
      console.error('Error creating audit log:', auditError);
    }
    
    return NextResponse.json(updatedProgram);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: '更新节目失败' },
      { status: 500 }
    );
  }
}

// 删除节目
export async function DELETE(
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
    
    // 检查节目是否存在
    const existingProgram = await prisma.program.findUnique({
      where: { id },
      include: {
        competition: true,
      },
    });
    
    if (!existingProgram) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      );
    }

    // 检查权限
    if (session.user.role !== 'ADMIN' && existingProgram.competition.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: '您没有权限删除此节目' },
        { status: 403 }
      );
    }
    
    // 删除节目
    await prisma.program.delete({
      where: { id },
    });

    // 尝试记录审计日志
    try {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'DELETE_PROGRAM',
          targetId: id,
          details: {
            deleted: existingProgram,
          },
        },
      });
    } catch (auditError) {
      console.error('Error creating audit log:', auditError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: '删除节目失败' },
      { status: 500 }
    );
  }
}

// 更新节目状态（最简化版本，避免复杂查询和事务）
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
    
    // 简单检查节目是否存在，不使用复杂的include
    const existingProgram = await prisma.program.findUnique({
      where: { id },
      select: {
        id: true,
        currentStatus: true,
        competitionId: true,
      },
    });
    
    if (!existingProgram) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      );
    }

    // 简单检查权限，单独查询比赛信息
    const competition = await prisma.competition.findUnique({
      where: { id: existingProgram.competitionId },
      select: {
        organizerId: true,
      },
    });

    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }

    // 检查权限
    if (session.user.role !== 'ADMIN' && competition.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: '您没有权限修改此节目状态' },
        { status: 403 }
      );
    }
    
    // 最简化的更新操作，只更新状态字段
    const updatedProgram = await prisma.program.update({
      where: { id },
      data: {
        currentStatus,
      },
      select: {
        id: true,
        name: true,
        currentStatus: true,
        competitionId: true,
      },
    });

    // 跳过审计日志，避免可能的事务问题
    
    return NextResponse.json({
      success: true,
      program: updatedProgram,
    });
  } catch (error) {
    console.error('Error updating program status:', error);
    return NextResponse.json(
      { error: '更新节目状态失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    );
  }
} 