import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 修复选手和节目的关联关系
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    let fixedPrograms = 0;
    let fixedParticipants = 0;

    await prisma.$transaction(async (tx) => {
      // 1. 获取所有节目和它们的participantIds
      const programs = await tx.program.findMany({
        select: {
          id: true,
          participantIds: true,
        }
      });

      // 2. 获取所有参与者和它们的programIds
      const participants = await tx.participant.findMany({
        select: {
          id: true,
          programIds: true,
        }
      });

      // 3. 为每个节目，确保其参与者的programIds包含此节目ID
      for (const program of programs) {
        if (program.participantIds && program.participantIds.length > 0) {
          for (const participantId of program.participantIds) {
            const participant = participants.find(p => p.id === participantId);
            if (participant && !participant.programIds.includes(program.id)) {
              await tx.participant.update({
                where: { id: participantId },
                data: {
                  programIds: {
                    push: program.id
                  }
                }
              });
              fixedParticipants++;
            }
          }
        }
      }

      // 4. 为每个参与者，确保其节目的participantIds包含此参与者ID
      for (const participant of participants) {
        if (participant.programIds && participant.programIds.length > 0) {
          for (const programId of participant.programIds) {
            const program = programs.find(p => p.id === programId);
            if (program && !program.participantIds.includes(participant.id)) {
              await tx.program.update({
                where: { id: programId },
                data: {
                  participantIds: {
                    push: participant.id
                  }
                }
              });
              fixedPrograms++;
            }
          }
        }
      }

      // 5. 清理无效的关联 - 移除不存在的参与者ID
      for (const program of programs) {
        if (program.participantIds && program.participantIds.length > 0) {
          const validParticipantIds = program.participantIds.filter(pid => 
            participants.some(p => p.id === pid)
          );
          if (validParticipantIds.length !== program.participantIds.length) {
            await tx.program.update({
              where: { id: program.id },
              data: {
                participantIds: validParticipantIds
              }
            });
            fixedPrograms++;
          }
        }
      }

      // 6. 清理无效的关联 - 移除不存在的节目ID
      for (const participant of participants) {
        if (participant.programIds && participant.programIds.length > 0) {
          const validProgramIds = participant.programIds.filter(pid => 
            programs.some(p => p.id === pid)
          );
          if (validProgramIds.length !== participant.programIds.length) {
            await tx.participant.update({
              where: { id: participant.id },
              data: {
                programIds: validProgramIds
              }
            });
            fixedParticipants++;
          }
        }
      }
    });

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        tenantId: session.user.tenantId,
        action: 'FIX_PARTICIPANT_RELATIONS',
        targetId: 'system',
        details: {
          fixedPrograms,
          fixedParticipants,
          timestamp: new Date().toISOString()
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: '关联关系修复完成',
      fixedPrograms,
      fixedParticipants
    });
  } catch (error) {
    console.error('Error fixing participant relations:', error);
    return NextResponse.json(
      { error: '修复关联关系失败' },
      { status: 500 }
    );
  }
}