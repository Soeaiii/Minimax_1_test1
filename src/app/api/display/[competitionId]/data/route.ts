import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // 获取显示设置
    let displaySettings = await prisma.displaySettings.findUnique({
      where: {
        competitionId: params.competitionId,
      },
      include: {
        backgroundImage: {
          select: {
            id: true,
            filename: true,
            path: true,
          },
        },
      },
    });

    // 如果没有显示设置，创建默认设置
    if (!displaySettings) {
      displaySettings = await prisma.displaySettings.create({
        data: {
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
        },
        include: {
          backgroundImage: {
            select: {
              id: true,
              filename: true,
              path: true,
            },
          },
        },
      });
    }

    // 获取比赛信息
    const competition = await prisma.competition.findUnique({
      where: {
        id: params.competitionId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
    });

    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }

    // 获取当前节目信息
    let currentProgram = null;
    if (displaySettings.currentProgramId) {
      currentProgram = await prisma.program.findUnique({
        where: {
          id: displaySettings.currentProgramId,
        },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              team: true,
            },
          },
        },
      });
    }

    // 获取裁判信息
    const judges = await prisma.user.findMany({
      where: {
        role: 'JUDGE',
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    // 获取当前节目的裁判评分
    let judgeScores: JudgeScore[] = [];
    if (currentProgram && displaySettings.showJudgeScores) {
      const scores = await prisma.score.findMany({
        where: {
          programId: currentProgram.id,
        },
        include: {
          judge: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          scoringCriteria: {
            select: {
              id: true,
              name: true,
              weight: true,
              maxScore: true,
            },
          },
        },
      });

      // 按裁判分组计算总分
      const judgeScoreMap = new Map();
      
      scores.forEach(score => {
        const judgeId = score.judgeId;
        if (!judgeScoreMap.has(judgeId)) {
          judgeScoreMap.set(judgeId, {
            judge: score.judge,
            scores: [],
            totalScore: 0,
          });
        }
        
        const judgeData = judgeScoreMap.get(judgeId);
        judgeData.scores.push({
          criteriaId: score.scoringCriteriaId,
          criteriaName: score.scoringCriteria.name,
          value: score.value,
          weight: score.scoringCriteria.weight,
          maxScore: score.scoringCriteria.maxScore,
        });
      });

      // 计算每个裁判的平均分
      judgeScores = Array.from(judgeScoreMap.values()).map(judgeData => {
        const totalScore = judgeData.scores.length > 0 
          ? judgeData.scores.reduce((sum: number, score: any) => sum + score.value, 0) / judgeData.scores.length
          : 0;
          
        return {
          judge: judgeData.judge,
          totalScore: Math.round(totalScore * 100) / 100, // 保留两位小数
          scores: judgeData.scores,
        };
      });

      // 根据选择的评委过滤结果
      if (displaySettings.selectedJudgeIds && displaySettings.selectedJudgeIds.length > 0) {
        judgeScores = judgeScores.filter(judgeScore => 
          displaySettings.selectedJudgeIds.includes(judgeScore.judge.id)
        );
      }
    }

    // 获取所有节目列表（用于管理员控制）
    const programs = await prisma.program.findMany({
      where: {
        competitionId: params.competitionId,
      },
      select: {
        id: true,
        name: true,
        order: true,
        currentStatus: true,
        participants: {
          select: {
            id: true,
            name: true,
            team: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

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