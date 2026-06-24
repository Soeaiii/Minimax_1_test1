import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 公开成绩查询 —— 通过 registrationToken 鉴权，按姓名+联系方式查询
export async function POST(
  request: Request,
  context: { params: Promise<{ competitionId: string }> }
) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const body = await request.json();
    const { name, contact } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: '请输入姓名查询' }, { status: 400 });
    }

    // 1. token 鉴权
    const competition = await prisma.competition.findUnique({
      where: { id: params.competitionId },
      select: { id: true, name: true, registrationToken: true, status: true },
    });

    if (!competition) {
      return NextResponse.json({ error: '比赛不存在' }, { status: 404 });
    }

    if (!competition.registrationToken || token !== competition.registrationToken) {
      return NextResponse.json({ error: '无效的查询链接' }, { status: 401 });
    }

    // 2. 查找选手
    const where: any = {
      name: name.trim(),
      tenantId: competition.id, // 通过 competition 确定租户
    };
    if (contact?.trim()) {
      where.contact = contact.trim();
    }

    const participants = await prisma.participant.findMany({
      where: {
        name: name.trim(),
        participantPrograms: {
          some: {
            program: {
              competitionId: params.competitionId,
            },
          },
        },
      },
      include: {
        participantPrograms: {
          include: {
            program: {
              select: {
                id: true,
                name: true,
                order: true,
                currentStatus: true,
                scores: {
                  select: {
                    value: true,
                    scoringCriteria: { select: { id: true, name: true, weight: true, maxScore: true } },
                    judge: { select: { id: true, name: true } },
                  },
                },
                ranking: {
                  select: { rank: true, totalScore: true },
                },
              },
            },
          },
        },
      },
    });

    if (participants.length === 0) {
      return NextResponse.json({ error: '未找到该选手的成绩信息' }, { status: 404 });
    }

    // 3. 格式化返回数据
    const results = participants.map(p => {
      const programs = p.participantPrograms.map(pp => {
        const scores = pp.program.scores;
        const criteria = new Map<string, { name: string; weight: number; maxScore: number; values: number[] }>();
        scores.forEach(s => {
          if (!criteria.has(s.scoringCriteria.id)) {
            criteria.set(s.scoringCriteria.id, {
              name: s.scoringCriteria.name,
              weight: s.scoringCriteria.weight,
              maxScore: s.scoringCriteria.maxScore,
              values: [],
            });
          }
          criteria.get(s.scoringCriteria.id)!.values.push(s.value);
        });

        const criteriaScores = Array.from(criteria.values()).map(c => ({
          name: c.name,
          weight: c.weight,
          avgScore: c.values.length > 0 ? Math.round(c.values.reduce((a, b) => a + b, 0) / c.values.length * 100) / 100 : 0,
          judgeCount: c.values.length,
        }));

        return {
          id: pp.program.id,
          name: pp.program.name,
          order: pp.program.order,
          status: pp.program.currentStatus,
          criteriaScores,
          ranking: pp.program.ranking ? { rank: pp.program.ranking.rank, totalScore: pp.program.ranking.totalScore } : null,
        };
      });

      return {
        id: p.id,
        name: p.name,
        team: p.team,
        programs,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        competitionName: competition.name,
        results,
      },
    });
  } catch (error) {
    console.error('成绩查询失败:', error);
    return NextResponse.json({ error: '查询失败，请稍后重试' }, { status: 500 });
  }
}
