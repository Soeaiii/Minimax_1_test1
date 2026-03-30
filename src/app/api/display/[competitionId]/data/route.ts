import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

interface JudgeScore {
  judge: {
    id: string;
    name: string;
    avatar?: string;
  };
  totalScore: number;
  scores: Array<{
    criteriaId: string;
    criteriaName: string;
    value: number;
    weight: number;
    maxScore: number;
  }>;
}

// 获取大屏幕显示数据
export async function GET(
  request: Request,
  context: { params: Promise<{ competitionId: string }> }
) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // 并行获取显示设置和比赛信息
    const competition = await prisma.competition.findUnique({
      where: { id: params.competitionId },
      select: { id: true, name: true, description: true, status: true, tenantId: true },
    });

    if (!competition) {
      return NextResponse.json({ error: '比赛不存在' }, { status: 404 });
    }

    // 获取显示设置（验证租户）
    const displaySettingsResult = await prisma.displaySettings.findUnique({
      where: { competitionId: params.competitionId },
      include: { backgroundImage: { select: { id: true, filename: true, path: true } } },
    });

    // 如果没有显示设置，创建默认设置
    let displaySettings = displaySettingsResult;
    if (!displaySettings) {
      // 生成公开Token
      const publicToken = crypto.randomBytes(16).toString('hex');
      displaySettings = await prisma.displaySettings.create({
        data: {
          tenantId: competition.tenantId,
          competitionId: params.competitionId,
          showJudgeScores: true,
          showParticipants: true,
          showProgramInfo: true,
          autoRefresh: false,
          refreshInterval: 5,
          theme: 'MODERN',
          titleColor: '#ffffff',
          subtitleColor: '#ffffff',
          judgeNameColor: '#1f2937',
          judgeScoreColor: '#1f2937',
          averageScoreColor: '#ffffff',
          programInfoColor: '#ffffff',
          participantLabelFontSize: 56,
          participantValueFontSize: 56,
          participantCardPadding: 48,
          participantCardGap: 16,
          participantCardRowGap: 32,
          averageScoreFontSize: 192,
          publicToken,
        },
        include: { backgroundImage: { select: { id: true, filename: true, path: true } } },
      });
    } else if (!displaySettings.publicToken) {
      // 如果已有设置但没有Token，生成一个
      const publicToken = crypto.randomBytes(16).toString('hex');
      displaySettings = await prisma.displaySettings.update({
        where: { competitionId: params.competitionId },
        data: { publicToken },
        include: { backgroundImage: { select: { id: true, filename: true, path: true } } },
      });
    }

    // 验证Token（如果设置了Token则必须验证）
    if (displaySettings.publicToken) {
      if (!token || token !== displaySettings.publicToken) {
        return NextResponse.json({ error: '无效的访问Token' }, { status: 401 });
      }
    }

    // 并行获取当前节目、裁判和所有节目列表
    const [currentProgram, judges, programs] = await Promise.all([
      displaySettings.currentProgramId
        ? prisma.program.findUnique({
            where: { id: displaySettings.currentProgramId },
            select: { id: true, name: true, description: true, order: true, participants: { select: { id: true, name: true, team: true } }, customFields: true },
          })
        : Promise.resolve(null),
      prisma.user.findMany({ where: { role: 'JUDGE' }, select: { id: true, name: true, avatar: true } }),
      prisma.program.findMany({
        where: { competitionId: params.competitionId },
        select: { id: true, name: true, order: true, currentStatus: true, participants: { select: { id: true, name: true, team: true } }, customFields: true },
        orderBy: { order: 'asc' },
      }),
    ]);

    // 获取当前节目的裁判评分
    let judgeScores: JudgeScore[] = [];
    if (currentProgram && displaySettings.showJudgeScores) {
      const scores = await prisma.score.findMany({
        where: { programId: currentProgram.id },
        include: {
          judge: { select: { id: true, name: true, avatar: true } },
          scoringCriteria: { select: { id: true, name: true, weight: true, maxScore: true } },
        },
      });

      // 按裁判分组计算总分
      const judgeScoreMap = new Map();

      scores.forEach(score => {
        const judgeId = score.judgeId;
        if (!judgeScoreMap.has(judgeId)) {
          judgeScoreMap.set(judgeId, { judge: score.judge, scores: [], totalScore: 0 });
        }
        const judgeData = judgeScoreMap.get(judgeId);
        judgeData.scores.push({ criteriaId: score.scoringCriteriaId, criteriaName: score.scoringCriteria.name, value: score.value, weight: score.scoringCriteria.weight, maxScore: score.scoringCriteria.maxScore });
      });

      // 计算每个裁判的平均分
      judgeScores = Array.from(judgeScoreMap.values()).map(judgeData => {
        const totalScore = judgeData.scores.length > 0 ? judgeData.scores.reduce((sum: number, score: { value: number }) => sum + score.value, 0) / judgeData.scores.length : 0;
        return { judge: judgeData.judge, totalScore: Math.round(totalScore * 100) / 100, scores: judgeData.scores };
      });

      // 根据选择的评委过滤结果
      if (displaySettings.selectedJudgeIds && displaySettings.selectedJudgeIds.length > 0) {
        judgeScores = judgeScores.filter(judgeScore => displaySettings!.selectedJudgeIds.includes(judgeScore.judge.id));
      }
    }

    const displayData = {
      settings: displaySettings,
      competition,
      currentProgram,
      judgeScores,
      judges,
      programs,
    };

    return NextResponse.json(displayData);
  } catch (error) {
    console.error('Error fetching display data:', error);
    return NextResponse.json(
      { error: '获取显示数据失败' },
      { status: 500 }
    );
  }
} 