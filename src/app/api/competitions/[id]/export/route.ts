import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import * as XLSX from 'xlsx';

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
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'xlsx';
    const type = searchParams.get('type') || 'scores';

    // 检查比赛是否存在和权限
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        organizer: {
          select: {
            name: true
          }
        }
      }
    });

    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }

    // 检查权限
    if (session.user.role !== 'ADMIN' && competition.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    if (type === 'scores') {
      return await exportScoresData(competitionId, format, competition);
    } else if (type === 'rankings') {
      return await exportRankingsData(competitionId, format, competition);
    } else if (type === 'participants') {
      return await exportParticipantsData(competitionId, format, competition);
    } else {
      return NextResponse.json(
        { error: '不支持的导出类型' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error exporting competition data:', error);
    return NextResponse.json(
      { error: '导出数据失败' },
      { status: 500 }
    );
  }
}

// 导出评分数据
async function exportScoresData(competitionId: string, format: string, competition: any) {
  // 获取比赛下所有节目的评分数据，并包含自定义字段
  const programsWithScores = await prisma.program.findMany({
    where: { competitionId },
    include: {
      participantPrograms: {
        include: {
          participant: {
            select: {
              id: true,
              name: true,
              team: true
            }
          }
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
          },
          judge: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        orderBy: [
          { judgeId: 'asc' },
          { scoringCriteria: { name: 'asc' } }
        ]
      }
    },
    orderBy: { order: 'asc' }
  });

  // 获取所有评委信息（已在上面的查询中通过include获取）
  const judgeMap = new Map<string, string>();
  programsWithScores.forEach(p => {
    p.scores.forEach(s => {
      if (s.judge && !judgeMap.has(s.judge.id)) {
        judgeMap.set(s.judge.id, s.judge.name || '未知评委');
      }
    });
  });
  const judges = Array.from(judgeMap.entries()).map(([id, name]) => ({ id, name }));

  // 获取所有自定义字段的键名
  const customFieldKeys = Array.from(
    new Set(
      programsWithScores.flatMap(p => {
        if (!p.customFields) return [];
        // 如果是字符串，则尝试解析JSON
        if (typeof p.customFields === 'string') {
          try {
            const fields = JSON.parse(p.customFields as string);
            return Object.keys(fields);
          } catch {
            return [];
          }
        }
        // 如果是对象，直接返回键名
        if (typeof p.customFields === 'object') {
          try {
            return Object.keys(p.customFields as any);
          } catch {
            return [];
          }
        }
        return [];
      })
    )
  );

  if (format === 'xlsx') {
    const excelData: (string | number | Date | null)[][] = [];
    
    // 添加标题行，动态添加自定义字段列
    const headers = [
      '节目名称', '节目顺序', '选手姓名', '选手团队', '评委姓名', 
      '评分标准', '分数', '权重', '最高分', '评语', '评分时间'
    ];
    headers.push(...customFieldKeys);
    excelData.push(headers);
    
    // 添加数据行
    for (const program of programsWithScores) {
      const participantNames = program.participantPrograms.map(pp => pp.participant.name).join('、');
      const participantTeams = [...new Set(program.participantPrograms.map(pp => pp.participant.team || '无'))].join('、');
      let customFields: Record<string, any> = {};
      if (program.customFields) {
        if (typeof program.customFields === 'string') {
          try {
            customFields = JSON.parse(program.customFields as string);
          } catch {}
        } else if (typeof program.customFields === 'object') {
          customFields = program.customFields as any;
        }
      }

      if (program.scores.length === 0) {
        const row = [
          program.name, program.order, participantNames, participantTeams,
          '', '', '', '', '', '', ''
        ];
        // 添加自定义字段的值
        customFieldKeys.forEach(key => {
          row.push(customFields[key] || '');
        });
        excelData.push(row);
      } else {
        // 按评委分组
        const scoresByJudge = program.scores.reduce((acc, score) => {
          if (!acc[score.judgeId]) {
            acc[score.judgeId] = [];
          }
          acc[score.judgeId].push(score);
          return acc;
        }, {} as Record<string, typeof program.scores>);

        for (const judgeId in scoresByJudge) {
          const judgeScores = scoresByJudge[judgeId];
          const judgeName = judgeScores[0]?.judge?.name || '未知评委';
          
          for(const score of judgeScores) {
            const row = [
              program.name, program.order, participantNames, participantTeams,
              judgeName, score.scoringCriteria.name, score.value,
              score.scoringCriteria.weight, score.scoringCriteria.maxScore,
              score.comment || '', new Date(score.createdAt).toLocaleString('zh-CN'),
            ];
            // 添加自定义字段的值
            customFieldKeys.forEach(key => {
              row.push(customFields[key] || '');
            });
            excelData.push(row);
          }
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    
    // 自动设置列宽
    const cols = headers.map(header => ({
      wch: Math.max(header.length, 15) // 最小宽度15
    }));
    worksheet['!cols'] = cols;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, '评分数据');

    const fileName = `${competition.name}-评分数据-${new Date().toISOString().split('T')[0]}.xlsx`;
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });

  } else if (format === 'json') {
    const exportData = {
      competition: {
        id: competition.id,
        name: competition.name,
        organizer: competition.organizer.name,
        exportTime: new Date().toISOString()
      },
      judges: judges,
      programs: programsWithScores.map(program => {
        let customFields: Record<string, any> = {};
        if (program.customFields) {
          if (typeof program.customFields === 'string') {
            try {
              customFields = JSON.parse(program.customFields as string);
            } catch {}
          } else if (typeof program.customFields === 'object') {
            customFields = program.customFields as any;
          }
        }
        
        return {
          id: program.id,
          name: program.name,
          order: program.order,
          status: program.currentStatus,
          participants: program.participantPrograms.map(pp => pp.participant),
          customFields: customFields, // 添加自定义字段
          scores: program.scores.map(score => ({
            judgeId: score.judgeId,
            judgeName: score.judge?.name || '未知评委',
            criteriaId: score.scoringCriteriaId,
            criteriaName: score.scoringCriteria.name,
            value: score.value,
            weight: score.scoringCriteria.weight,
            maxScore: score.scoringCriteria.maxScore,
            comment: score.comment,
            createdAt: score.createdAt,
            updatedAt: score.updatedAt
          })),
          totalScore: calculateProgramTotalScore(program.scores),
          averageScore: calculateProgramAverageScore(program.scores, competition.scoringCriteria)
        };
      })
    };

    return NextResponse.json(exportData);
  }
}

// 导出排名数据
async function exportRankingsData(competitionId: string, format: string, competition: any) {
  const rankings = await prisma.ranking.findMany({
    where: { competitionId },
    include: {
      program: {
        include: {
          participantPrograms: {
            include: {
              participant: {
                select: {
                  id: true,
                  name: true,
                  team: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: { rank: 'asc' }
  });

  if (format === 'xlsx') {
    // 创建Excel数据数组
    const excelData = [];
    
    // 添加标题行
    excelData.push(['排名', '节目名称', '选手姓名', '选手团队', '总分', '更新方式', '更新时间']);
    
    // 添加数据行
    for (const ranking of rankings) {
      const participantNames = ranking.program.participantPrograms.map(pp => pp.participant.name).join('、');
      const participantTeams = [...new Set(ranking.program.participantPrograms.map(pp => pp.participant.team || '无'))].join('、');
      
      excelData.push([
        ranking.rank,
        ranking.program.name,
        participantNames,
        participantTeams,
        ranking.totalScore,
        ranking.updateType === 'AUTO' ? '自动计算' : '手动调整',
        new Date(ranking.updatedAt).toLocaleString('zh-CN')
      ]);
    }

    // 创建工作簿和工作表
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    
    // 设置列宽
    worksheet['!cols'] = [
      { wch: 8 },  // 排名
      { wch: 20 }, // 节目名称
      { wch: 15 }, // 选手姓名
      { wch: 15 }, // 选手团队
      { wch: 10 }, // 总分
      { wch: 12 }, // 更新方式
      { wch: 18 }  // 更新时间
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, '排名数据');

    const fileName = `${competition.name}-排名数据-${new Date().toISOString().split('T')[0]}.xlsx`;
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } else if (format === 'json') {
    return NextResponse.json({
      competition: {
        id: competition.id,
        name: competition.name,
        organizer: competition.organizer.name,
        exportTime: new Date().toISOString()
      },
      rankings
    });
  }
}

// 导出选手数据
async function exportParticipantsData(competitionId: string, format: string, competition: any) {
  const programs = await prisma.program.findMany({
    where: { competitionId },
    include: {
      participantPrograms: {
        include: { participant: true }
      }
    }
  });

  // 获取所有唯一的选手
  const participantMap = new Map();
    programs.forEach(program => {
    program.participantPrograms.forEach(pp => {
      if (!participantMap.has(pp.participant.id)) {
        participantMap.set(pp.participant.id, {
          ...pp.participant,
          programs: [program.name]
        });
      } else {
        participantMap.get(pp.participant.id).programs.push(program.name);
      }
    });
  });

  const participants = Array.from(participantMap.values());

  if (format === 'xlsx') {
    // 整理团队数据
    const teamData: { [key: string]: any[] } = {};
    participants.forEach(p => {
      const teamName = p.team || '个人参赛';
      if (!teamData[teamName]) {
        teamData[teamName] = [];
      }
      teamData[teamName].push(p);
    });

    // 创建Excel数据数组
    const excelData: (string | number)[][] = [];
    
    // 添加标题行
    excelData.push(['选手团队', '选手姓名', '联系方式', '个人简介', '参与节目', '参与节目数量', '注册时间']);
    
    // 添加数据行
    for (const teamName in teamData) {
      const teamMembers = teamData[teamName];
      teamMembers.forEach((participant, index) => {
        excelData.push([
          index === 0 ? teamName : '', // 只在团队第一行显示团队名称
          participant.name,
          participant.contact || '',
          participant.bio || '',
          participant.programs.join('、'),
          participant.programs.length,
          new Date(participant.createdAt).toLocaleString('zh-CN')
        ]);
      });
    }

    // 创建工作簿和工作表
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    
    // 设置列宽
    worksheet['!cols'] = [
      { wch: 15 }, // 选手团队
      { wch: 12 }, // 选手姓名
      { wch: 15 }, // 联系方式
      { wch: 25 }, // 个人简介
      { wch: 30 }, // 参与节目
      { wch: 12 }, // 参与节目数量
      { wch: 18 }  // 注册时间
    ];
    
    XLSX.utils.book_append_sheet(workbook, worksheet, '选手数据');

    const fileName = `${competition.name}-选手数据-${new Date().toISOString().split('T')[0]}.xlsx`;
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } else if (format === 'json') {
    return NextResponse.json({
      competition: {
        id: competition.id,
        name: competition.name,
        organizer: competition.organizer.name,
        exportTime: new Date().toISOString()
      },
      participants
    });
  }
}

// 计算节目总分
function calculateProgramTotalScore(scores: any[]) {
  if (scores.length === 0) return 0;
  
  // 按评分标准分组，计算每个标准的平均分
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
  
  return Math.round(totalScore * 100) / 100; // 保留两位小数
}

// 计算节目平均分
function calculateProgramAverageScore(scores: any[], criteria: any[]) {
  if (scores.length === 0 || criteria.length === 0) return 0;
  
  const totalMaxScore = criteria.reduce((sum, c) => sum + c.maxScore * c.weight, 0);
  const totalScore = calculateProgramTotalScore(scores);
  
  return Math.round((totalScore / totalMaxScore) * 100 * 100) / 100; // 转换为百分制并保留两位小数
} 