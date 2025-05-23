import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id: competitionId } = await params;

    // 检查比赛是否存在
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId }
    });

    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }

    // 获取统计数据
    const [
      totalPrograms,
      waitingPrograms,
      performingPrograms,
      completedPrograms,
      totalParticipants,
      totalScores,
      rankings,
      scoringCriteria,
      programsWithScores
    ] = await Promise.all([
      // 节目统计
      prisma.program.count({
        where: { competitionId }
      }),
      prisma.program.count({
        where: { 
          competitionId,
          currentStatus: 'WAITING'
        }
      }),
      prisma.program.count({
        where: { 
          competitionId,
          currentStatus: 'PERFORMING'
        }
      }),
      prisma.program.count({
        where: { 
          competitionId,
          currentStatus: 'COMPLETED'
        }
      }),
      
      // 选手统计
      prisma.program.findMany({
        where: { competitionId },
        include: {
          participants: true
        }
      }).then(programs => {
        const participantIds = new Set();
        programs.forEach(program => {
          program.participants.forEach(participant => {
            participantIds.add(participant.id);
          });
        });
        return participantIds.size;
      }),
      
      // 评分统计
      prisma.score.count({
        where: {
          program: {
            competitionId
          }
        }
      }),
      
      // 排名数据
      prisma.ranking.findMany({
        where: { competitionId },
        include: {
          program: {
            include: {
              participants: {
                select: {
                  id: true,
                  name: true,
                  team: true
                }
              }
            }
          }
        },
        orderBy: { rank: 'asc' }
      }),
      
      // 评分标准
      prisma.scoringCriteria.findMany({
        where: { competitionId },
        orderBy: { name: 'asc' }
      }),
      
      // 节目详细评分数据
      prisma.program.findMany({
        where: { competitionId },
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              team: true
            }
          },
          scores: {
            include: {
              scoringCriteria: {
                select: {
                  id: true,
                  name: true,
                  weight: true,
                  maxScore: true
                }
              }
            }
          }
        },
        orderBy: { order: 'asc' }
      })
    ]);

    // 计算评分统计
    const scoreStats = calculateScoreStatistics(programsWithScores, scoringCriteria);
    
    // 计算选手团队统计
    const teamStats = calculateTeamStatistics(programsWithScores);
    
    // 计算进度统计
    const progressStats = calculateProgressStatistics(
      totalPrograms,
      waitingPrograms,
      performingPrograms,
      completedPrograms,
      totalScores,
      scoringCriteria.length
    );

    const stats = {
      overview: {
        totalPrograms,
        totalParticipants,
        totalScores,
        totalCriteria: scoringCriteria.length,
        competitionStatus: competition.status,
        rankingUpdateMode: competition.rankingUpdateMode
      },
      programs: {
        total: totalPrograms,
        waiting: waitingPrograms,
        performing: performingPrograms,
        completed: completedPrograms,
        distribution: {
          waiting: totalPrograms > 0 ? Math.round((waitingPrograms / totalPrograms) * 100) : 0,
          performing: totalPrograms > 0 ? Math.round((performingPrograms / totalPrograms) * 100) : 0,
          completed: totalPrograms > 0 ? Math.round((completedPrograms / totalPrograms) * 100) : 0
        }
      },
      scores: scoreStats,
      teams: teamStats,
      progress: progressStats,
      rankings: rankings.slice(0, 10), // 只返回前10名
      scoringCriteria,
      chartData: {
        programStatus: [
          { name: '等待中', value: waitingPrograms, color: '#fbbf24' },
          { name: '表演中', value: performingPrograms, color: '#3b82f6' },
          { name: '已完成', value: completedPrograms, color: '#10b981' }
        ],
        scoreDistribution: generateScoreDistribution(programsWithScores, scoringCriteria),
        teamPerformance: generateTeamPerformanceData(programsWithScores, rankings)
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching competition stats:', error);
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}

// 计算评分统计
function calculateScoreStatistics(programs: any[], criteria: any[]) {
  let totalScores = 0;
  let highestScore = 0;
  let lowestScore = Number.MAX_VALUE;
  let totalPossibleScores = 0;
  
  const judgeStats = new Map();
  
  programs.forEach(program => {
    const programScore = calculateProgramTotalScore(program.scores, criteria);
    if (programScore > 0) {
      totalScores++;
      highestScore = Math.max(highestScore, programScore);
      lowestScore = Math.min(lowestScore, programScore);
    }
    
    // 统计评委评分情况
    program.scores.forEach((score: any) => {
      if (!judgeStats.has(score.judgeId)) {
        judgeStats.set(score.judgeId, {
          judgeId: score.judgeId,
          scoresGiven: 0,
          averageScore: 0,
          totalScore: 0
        });
      }
      const judge = judgeStats.get(score.judgeId);
      judge.scoresGiven++;
      judge.totalScore += score.value;
      judge.averageScore = Math.round((judge.totalScore / judge.scoresGiven) * 100) / 100;
    });
  });
  
  totalPossibleScores = programs.length * criteria.length;
  const completionRate = totalPossibleScores > 0 ? Math.round((totalScores / totalPossibleScores) * 100) : 0;
  
  return {
    totalScores: programs.reduce((sum, p) => sum + p.scores.length, 0),
    completionRate,
    highestScore: highestScore === 0 ? null : highestScore,
    lowestScore: lowestScore === Number.MAX_VALUE ? null : lowestScore,
    averageScore: totalScores > 0 ? Math.round(((highestScore + lowestScore) / 2) * 100) / 100 : 0,
    judgeStats: Array.from(judgeStats.values())
  };
}

// 计算团队统计
function calculateTeamStatistics(programs: any[]) {
  const teamMap = new Map();
  
  programs.forEach(program => {
    program.participants.forEach((participant: any) => {
      const teamName = participant.team || '个人选手';
      if (!teamMap.has(teamName)) {
        teamMap.set(teamName, {
          name: teamName,
          participantCount: 0,
          programCount: 0,
          participants: new Set()
        });
      }
      
      const team = teamMap.get(teamName);
      team.participants.add(participant.id);
      team.programCount++;
    });
  });
  
  // 转换为数组并计算最终统计
  const teams = Array.from(teamMap.values()).map(team => ({
    name: team.name,
    participantCount: team.participants.size,
    programCount: team.programCount
  }));
  
  return {
    totalTeams: teams.filter(t => t.name !== '个人选手').length,
    individualParticipants: teams.find(t => t.name === '个人选手')?.participantCount || 0,
    teams: teams.sort((a, b) => b.programCount - a.programCount)
  };
}

// 计算进度统计
function calculateProgressStatistics(
  totalPrograms: number,
  waitingPrograms: number,
  performingPrograms: number,
  completedPrograms: number,
  totalScores: number,
  totalCriteria: number
) {
  const overallProgress = totalPrograms > 0 ? Math.round((completedPrograms / totalPrograms) * 100) : 0;
  const expectedScores = totalPrograms * totalCriteria;
  const scoringProgress = expectedScores > 0 ? Math.round((totalScores / expectedScores) * 100) : 0;
  
  return {
    overallProgress,
    scoringProgress,
    remainingPrograms: waitingPrograms + performingPrograms,
    expectedScores,
    actualScores: totalScores
  };
}

// 生成评分分布数据
function generateScoreDistribution(programs: any[], criteria: any[]) {
  const distribution: Array<{
    label: string;
    value: number;
    percentage: number;
  }> = [];
  const ranges = [
    { min: 0, max: 20, label: '0-20分' },
    { min: 20, max: 40, label: '20-40分' },
    { min: 40, max: 60, label: '40-60分' },
    { min: 60, max: 80, label: '60-80分' },
    { min: 80, max: 100, label: '80-100分' }
  ];
  
  ranges.forEach(range => {
    let count = 0;
    programs.forEach(program => {
      const score = calculateProgramTotalScore(program.scores, criteria);
      if (score >= range.min && score < range.max) {
        count++;
      }
    });
    distribution.push({
      label: range.label,
      value: count,
      percentage: programs.length > 0 ? Math.round((count / programs.length) * 100) : 0
    });
  });
  
  return distribution;
}

// 生成团队表现数据
function generateTeamPerformanceData(programs: any[], rankings: any[]) {
  const teamPerformance = new Map();
  
  rankings.forEach(ranking => {
    ranking.program.participants.forEach((participant: any) => {
      const teamName = participant.team || '个人选手';
      if (!teamPerformance.has(teamName)) {
        teamPerformance.set(teamName, {
          name: teamName,
          bestRank: ranking.rank,
          totalScore: ranking.totalScore,
          programCount: 1
        });
      } else {
        const team = teamPerformance.get(teamName);
        team.bestRank = Math.min(team.bestRank, ranking.rank);
        team.totalScore += ranking.totalScore;
        team.programCount++;
      }
    });
  });
  
  return Array.from(teamPerformance.values()).map(team => ({
    ...team,
    averageScore: Math.round((team.totalScore / team.programCount) * 100) / 100
  })).sort((a, b) => a.bestRank - b.bestRank);
}

// 计算节目总分
function calculateProgramTotalScore(scores: any[], criteria: any[]) {
  if (scores.length === 0) return 0;
  
  const criteriaScores = new Map();
  
  scores.forEach(score => {
    const criteriaId = score.scoringCriteriaId;
    if (!criteriaScores.has(criteriaId)) {
      criteriaScores.set(criteriaId, {
        scores: [],
        weight: score.scoringCriteria.weight
      });
    }
    criteriaScores.get(criteriaId).scores.push(score.value);
  });
  
  let totalScore = 0;
  criteriaScores.forEach(({ scores, weight }) => {
    const average = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
    totalScore += average * weight;
  });
  
  return Math.round(totalScore * 100) / 100;
} 