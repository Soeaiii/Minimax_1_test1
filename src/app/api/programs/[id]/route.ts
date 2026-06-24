import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

// 获取单个节目详情
export const GET = withTenantContext(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        competition: {
          select: { id: true, name: true, organizerId: true },
        },
        participantPrograms: {
          include: { participant: true }
        },
        programFiles: {
          include: { file: true }
        },
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
});

// 更新节目
export const PUT = withTenantContext(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const ctx = getTenantContext()!;

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
    
    // 检查节目是否存在且属于同一租户
    const existingProgram = await prisma.program.findUnique({
      where: { id },
      include: {
        competition: true,
        participantPrograms: {
          include: { participant: true }
        },
      },
    });
    
    if (!existingProgram) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      );
    }

    // 检查权限
    if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN' && existingProgram.competition.organizerId !== ctx.userId) {
      return NextResponse.json(
        { error: '您没有权限修改此节目' },
        { status: 403 }
      );
    }
    
    // 构建更新数据
    const updateData: Record<string, unknown> = {
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
        participantPrograms: {
          include: { participant: true }
        },
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
          userId: ctx.userId,
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
});

// 删除节目
export const DELETE = withTenantContext(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const ctx = getTenantContext()!;

    const { id } = await params;
    
    // 检查节目是否存在且属于同一租户
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
    if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN' && existingProgram.competition.organizerId !== ctx.userId) {
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
          userId: ctx.userId,
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
});

// 更新节目状态（最简化版本，避免复杂查询和事务）
export const PATCH = withTenantContext(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const ctx = getTenantContext()!;

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
    if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN' && competition.organizerId !== ctx.userId) {
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
});
