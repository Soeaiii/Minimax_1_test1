import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

// 晋级引擎：将当前轮次排名靠前的节目晋级到下一轮
export const POST = withTenantContext(async (
  request: Request,
  { params }: { params: Promise<{ id: string; rid: string }> }
) => {
  const ctx = getTenantContext()!;
  const { id: competitionId, rid: currentRoundId } = await params;
  const body = await request.json();
  const { targetRoundId, promotionRule } = body;
  // promotionRule: { type: 'topN', value: 10 } 或 { type: 'minScore', value: 85 }

  if (!targetRoundId) {
    return NextResponse.json({ error: '请选择目标轮次' }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 获取当前轮次排名（按 rank 升序）
      const rankings = await tx.ranking.findMany({
        where: { competitionId, roundId: currentRoundId },
        include: { program: { include: { participantPrograms: { select: { participantId: true } } } } },
        orderBy: { rank: 'asc' },
      });

      if (rankings.length === 0) {
        throw new Error('当前轮次没有排名数据');
      }

      // 2. 根据晋级规则筛选
      let promoted: typeof rankings = [];
      if (promotionRule?.type === 'topN') {
        const n = Math.min(promotionRule.value, rankings.length);
        promoted = rankings.slice(0, n);
      } else if (promotionRule?.type === 'minScore') {
        promoted = rankings.filter(r => r.totalScore >= promotionRule.value);
      } else {
        // 默认：前5名
        const n = Math.min(5, rankings.length);
        promoted = rankings.slice(0, n);
      }

      if (promoted.length === 0) {
        throw new Error('没有符合晋级条件的节目');
      }

      // 3. 获取目标轮次信息
      const targetRound = await tx.competitionRound.findUnique({
        where: { id: targetRoundId },
        select: { id: true, name: true },
      });
      if (!targetRound) throw new Error('目标轮次不存在');

      // 4. 为每个晋级的节目创建下一轮节目（复用选手关联）
      const createdPrograms = [];
      for (const ranking of promoted) {
        const sourceProgram = ranking.program;
        const participantIds = sourceProgram.participantPrograms.map(pp => pp.participantId);

        // 创建新节目（关联到目标轮次）
        const newProgram = await tx.program.create({
          data: {
            tenantId: ctx.tenantId,
            name: sourceProgram.name,
            description: sourceProgram.description,
            competitionId: competitionId,
            roundId: targetRoundId,
            order: createdPrograms.length + 1,
            currentStatus: 'WAITING',
            customFields: sourceProgram.customFields as any,
          },
        });

        // 5. 为每个选手创建 participantProgram 关联
        if (participantIds.length > 0) {
          for (const participantId of participantIds) {
            await tx.participantProgram.create({
              data: { participantId, programId: newProgram.id },
            });
          }
        }

        createdPrograms.push({ programId: newProgram.id, name: newProgram.name });
      }

      // 6. 更新当前轮次的晋级规则
      await tx.competitionRound.update({
        where: { id: currentRoundId },
        data: { promotionRule: promotionRule || { type: 'topN', value: promoted.length }, status: 'FINISHED' },
      });

      // 7. 激活目标轮次
      await tx.competitionRound.update({
        where: { id: targetRoundId },
        data: { status: 'ACTIVE' },
      });

      // 8. 审计日志
      await tx.auditLog.create({
        data: {
          tenantId: ctx.tenantId,
          userId: ctx.userId,
          action: 'PROMOTE_ROUND',
          targetId: competitionId,
          details: {
            fromRoundId: currentRoundId,
            toRoundId: targetRoundId,
            toRoundName: targetRound.name,
            promotedCount: promoted.length,
            rule: promotionRule,
            programs: createdPrograms,
          },
        },
      });

      return { promotedCount: promoted.length, programs: createdPrograms };
    });

    return NextResponse.json({ success: true, data: result, message: `成功晋级 ${result.promotedCount} 个节目` });
  } catch (error: any) {
    console.error('晋级失败:', error);
    return NextResponse.json({ error: error.message || '晋级操作失败' }, { status: 500 });
  }
});
