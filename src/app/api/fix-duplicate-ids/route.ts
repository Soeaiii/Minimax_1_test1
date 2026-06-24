import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

export const POST = withTenantContext(async () => {
  try {
    const ctx = getTenantContext()!;

    let fixedParticipants = 0;
    let fixedPrograms = 0;

    await prisma.$transaction(async (tx) => {
      // 1. 修复参与者的重复节目ID
      const participants = await tx.participant.findMany({
        select: { id: true, programIds: true }
      });

      for (const participant of participants) {
        if (participant.programIds && participant.programIds.length > 0) {
          // 去重
          const uniqueProgramIds = [...new Set(participant.programIds)];
          
          // 如果有重复，更新数据库
          if (uniqueProgramIds.length !== participant.programIds.length) {
            await tx.participant.update({
              where: { id: participant.id },
              data: {
                programIds: uniqueProgramIds
              }
            });
            fixedParticipants++;
          }
        }
      }

      // 2. 修复节目的重复参与者ID
      const programs = await tx.program.findMany({
        select: { id: true, participantIds: true }
      });

      for (const program of programs) {
        if (program.participantIds && program.participantIds.length > 0) {
          // 去重
          const uniqueParticipantIds = [...new Set(program.participantIds)];
          
          // 如果有重复，更新数据库
          if (uniqueParticipantIds.length !== program.participantIds.length) {
            await tx.program.update({
              where: { id: program.id },
              data: {
                participantIds: uniqueParticipantIds
              }
            });
            fixedPrograms++;
          }
        }
      }

      // 3. 记录修复操作
      if (fixedParticipants > 0 || fixedPrograms > 0) {
        await tx.auditLog.create({
          data: {
            userId: ctx.userId,
            action: 'FIX_DUPLICATE_IDS',
            targetId: 'system',
            details: {
              type: 'SystemMaintenance',
              fixedParticipants,
              fixedPrograms,
              description: '修复重复ID问题'
            },
          },
        });
      }
    });

    return NextResponse.json({
      message: `修复完成，处理了 ${fixedParticipants} 个参与者和 ${fixedPrograms} 个节目的重复ID问题`,
      fixedParticipants,
      fixedPrograms
    });

  } catch (error) {
    console.error('修复重复ID失败:', error);
    return NextResponse.json(
      { error: '修复失败' },
      { status: 500 }
    );
  }
});