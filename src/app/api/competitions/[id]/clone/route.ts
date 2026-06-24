import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

// 克隆比赛（复制比赛配置、评分标准、轮次、组别）
export const POST = withTenantContext(async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const ctx = getTenantContext()!;
  const { id } = await params;

  const source = await prisma.competition.findUnique({
    where: { id },
    include: {
      scoringCriteria: true,
      rounds: { orderBy: { roundOrder: 'asc' } },
      groups: true,
      displaySettings: true,
    },
  });

  if (!source) return NextResponse.json({ error: '比赛不存在' }, { status: 404 });

  const suffix = ' (副本)';
  const newName = source.name.endsWith(suffix) ? source.name : source.name + suffix;

  const cloned = await prisma.$transaction(async (tx) => {
    // 1. 复制比赛
    const comp = await tx.competition.create({
      data: {
        tenantId: ctx.tenantId,
        name: newName,
        description: source.description,
        organizerId: source.organizerId,
        creatorId: ctx.userId,
        startTime: source.startTime,
        endTime: source.endTime,
        status: 'PENDING',
        rankingUpdateMode: source.rankingUpdateMode,
        customFieldDefinitions: source.customFieldDefinitions as any,
        registrationFields: source.registrationFields as any,
        scoringConfig: source.scoringConfig as any,
      },
    });

    // 2. 复制评分标准
    if (source.scoringCriteria.length > 0) {
      await tx.scoringCriteria.createMany({
        data: source.scoringCriteria.map(c => ({
          tenantId: ctx.tenantId,
          competitionId: comp.id,
          name: c.name,
          weight: c.weight,
          maxScore: c.maxScore,
        })),
      });
    }

    // 3. 复制轮次
    if (source.rounds.length > 0) {
      for (const round of source.rounds) {
        await tx.competitionRound.create({
          data: {
            tenantId: ctx.tenantId,
            competitionId: comp.id,
            name: round.name,
            roundOrder: round.roundOrder,
            status: 'PENDING',
            promotionRule: round.promotionRule as any,
          },
        });
      }
    }

    // 4. 复制组别
    if (source.groups.length > 0) {
      for (const group of source.groups) {
        await tx.competitionGroup.create({
          data: {
            tenantId: ctx.tenantId,
            competitionId: comp.id,
            name: group.name,
            description: group.description,
          },
        });
      }
    }

    // 5. 复制显示设置（不含 currentProgramId）
    if (source.displaySettings) {
      await tx.displaySettings.create({
        data: {
          tenantId: ctx.tenantId,
          competitionId: comp.id,
          showJudgeScores: source.displaySettings.showJudgeScores,
          showParticipants: source.displaySettings.showParticipants,
          showProgramInfo: source.displaySettings.showProgramInfo,
          title: source.displaySettings.title,
          subtitle: source.displaySettings.subtitle,
          theme: source.displaySettings.theme,
          titleColor: source.displaySettings.titleColor,
          subtitleColor: source.displaySettings.subtitleColor,
          judgeNameColor: source.displaySettings.judgeNameColor,
          judgeScoreColor: source.displaySettings.judgeScoreColor,
          averageScoreColor: source.displaySettings.averageScoreColor,
          selectedJudgeIds: source.displaySettings.selectedJudgeIds,
        },
      });
    }

    // 6. 审计日志
    await tx.auditLog.create({
      data: {
        tenantId: ctx.tenantId,
        userId: ctx.userId,
        action: 'CLONE_COMPETITION',
        targetId: comp.id,
        details: { sourceId: id, sourceName: source.name },
      },
    });

    return comp;
  });

  return NextResponse.json({ success: true, data: cloned }, { status: 201 });
});
