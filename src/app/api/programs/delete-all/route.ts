import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 删除所有节目
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 验证管理员权限
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 从URL查询参数获取选项
    const { searchParams } = new URL(request.url);
    const skipWithScores = searchParams.get('skipWithScores') === 'true'; // 是否跳过有评分记录的节目
    const force = searchParams.get('force') === 'true'; // 强制删除所有节目，包括有评分记录的

    // 获取所有节目
    const allPrograms = await prisma.program.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            scores: true
          }
        }
      }
    });

    // 分类节目
    const programsWithScores = allPrograms.filter(p => p._count.scores > 0);
    const programsWithoutScores = allPrograms.filter(p => p._count.scores === 0);
    
    // 如果有评分记录的节目，并且不是强制删除模式
    if (programsWithScores.length > 0 && !force) {
      if (skipWithScores) {
        // 只删除没有评分记录的节目
        await deletePrograms(programsWithoutScores.map(p => p.id), session);
        
        return NextResponse.json({
          success: true,
          message: `已删除 ${programsWithoutScores.length} 个节目，跳过了 ${programsWithScores.length} 个有评分记录的节目`,
          deletedCount: programsWithoutScores.length,
          skippedCount: programsWithScores.length,
          skippedPrograms: programsWithScores.map(p => ({ id: p.id, name: p.name, scoresCount: p._count.scores })),
          canForceDelete: true
        });
      } else {
        // 返回错误并提供可以跳过或强制删除的选项
        return NextResponse.json({
          error: '部分节目有评分记录，无法删除',
          programsWithScoresCount: programsWithScores.length,
          totalProgramsCount: allPrograms.length,
          canSkipWithScores: true,
          canForceDelete: true,
        }, { status: 400 });
      }
    }
    
    // 没有评分记录或者是强制删除模式，删除所有节目
    const result = await deletePrograms(allPrograms.map(p => p.id), session);
    
    return NextResponse.json({
      success: true,
      message: `成功删除所有 ${result.count} 个节目`,
      deletedCount: result.count,
      force: force
    });
    
  } catch (error) {
    console.error('Error deleting all programs:', error);
    return NextResponse.json(
      { error: '删除所有节目失败' },
      { status: 500 }
    );
  }
}

// 辅助函数：删除指定ID的节目
async function deletePrograms(programIds: string[], session: any) {
  // 使用事务确保所有操作成功
  const result = await prisma.$transaction(async (tx) => {
    // 如果需要强制删除，先删除评分记录
    if (programIds.length > 0) {
      await tx.score.deleteMany({
        where: { programId: { in: programIds } }
      });
    }
    
    // 断开参与者与节目的关联（更新参与者的programIds数组）
    const participants = await tx.participant.findMany({
      where: {
        programIds: { hasSome: programIds }
      },
      select: {
        id: true,
        programIds: true
      }
    });
    
    // 为每个参与者更新程序ID
    for (const participant of participants) {
      await tx.participant.update({
        where: { id: participant.id },
        data: {
          programIds: participant.programIds.filter(id => !programIds.includes(id))
        }
      });
    }
    
    // 删除排名
    await tx.ranking.deleteMany({
      where: { programId: { in: programIds } }
    });
    
    // 删除节目
    const deleteResult = await tx.program.deleteMany({
      where: { id: { in: programIds } }
    });
    
    return { count: deleteResult.count };
  });
  
  // 记录审计日志
  await prisma.auditLog.create({
    data: {
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'DELETE_ALL_PROGRAMS',
      targetId: 'programs',
      details: {
        programCount: result.count,
        programIds: programIds
      }
    }
  });
  
  return result;
}