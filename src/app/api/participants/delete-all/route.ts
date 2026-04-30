import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 只有管理员可以执行此操作
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: '只有管理员可以删除全部选手' },
        { status: 403 }
      );
    }

    let deletedCount = 0;
    let updatedPrograms = 0;

    await prisma.$transaction(async (tx) => {
      // 1. 获取当前租户的所有参与者信息用于审计日志
      const allParticipants = await tx.participant.findMany({
        where: {
          tenantId: session.user.tenantId
        },
        select: {
          id: true,
          name: true,
          team: true,
          programIds: true
        }
      });

      deletedCount = allParticipants.length;

      if (deletedCount === 0) {
        return;
      }

      // 2. 清理当前租户节目中已删除参与者的关联
      const allPrograms = await tx.program.findMany({
        where: {
          tenantId: session.user.tenantId,
          participantIds: {
            isEmpty: false
          }
        },
        select: {
          id: true,
          participantIds: true
        }
      });

      // 批量更新节目，清空participantIds
      for (const program of allPrograms) {
        await tx.program.update({
          where: { id: program.id },
          data: {
            participantIds: []
          }
        });
        updatedPrograms++;
      }

      // 3. 删除所有参与者
      await tx.participant.deleteMany({});

      // 4. 记录审计日志
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          tenantId: session.user.tenantId,
          action: 'DELETE_ALL_PARTICIPANTS',
          targetId: 'participants',
          details: {
            type: 'BulkDelete',
            deletedCount,
            updatedPrograms,
            participants: allParticipants.map(p => ({
              id: p.id,
              name: p.name,
              team: p.team,
              programCount: p.programIds?.length || 0
            })),
            timestamp: new Date().toISOString(),
            operator: session.user.name || session.user.email
          },
        },
      });
    }, {
      maxWait: 15000,
      timeout: 30000,
    });

    return NextResponse.json({
      message: `成功删除 ${deletedCount} 名选手，更新了 ${updatedPrograms} 个节目`,
      deletedCount,
      updatedPrograms
    });

  } catch (error) {
    console.error('删除全部选手失败:', error);
    return NextResponse.json(
      { error: '删除操作失败' },
      { status: 500 }
    );
  }
}