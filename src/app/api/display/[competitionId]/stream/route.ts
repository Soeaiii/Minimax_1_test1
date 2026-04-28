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

// 获取当前节目的评分数据
async function getCurrentProgramScores(competitionId: string, selectedJudgeIds?: string[]) {
  try {
    // 获取显示设置
    const displaySettings = await prisma.displaySettings.findUnique({
      where: {
        competitionId: competitionId,
      },
    });

    if (!displaySettings?.currentProgramId) {
      return null;
    }

    // 获取当前节目信息
    const currentProgram = await prisma.program.findUnique({
      where: {
        id: displaySettings.currentProgramId,
      },
      include: {
        participantPrograms: {
          select: {
            id: true,
            name: true,
            team: true,
          },
        },
      },
    });

    if (!currentProgram) {
      return null;
    }

    // 获取当前节目的裁判评分
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

    // 获取所有评委或指定评委
    const judgeFilter = selectedJudgeIds && selectedJudgeIds.length > 0 
      ? { role: 'JUDGE' as const, id: { in: selectedJudgeIds } }
      : { role: 'JUDGE' as const };
      
    const allJudges = await prisma.user.findMany({
      where: judgeFilter,
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    // 计算每个裁判的平均分，只包含选中的评委
    const judgeScores: JudgeScore[] = Array.from(judgeScoreMap.values())
      .filter(judgeData => {
        // 如果指定了评委列表，只包含选中的评委
        if (selectedJudgeIds && selectedJudgeIds.length > 0) {
          return selectedJudgeIds.includes(judgeData.judge.id);
        }
        return true;
      })
      .map(judgeData => {
        const totalScore = judgeData.scores.length > 0 
          ? judgeData.scores.reduce((sum: number, score: any) => sum + score.value, 0) / judgeData.scores.length
          : 0;
          
        return {
          judge: judgeData.judge,
          totalScore: Math.round(totalScore * 100) / 100, // 保留两位小数
          scores: judgeData.scores,
        };
      });

    // 检查是否所有评委都已打分
    const allJudgesScored = allJudges.length > 0 && judgeScores.length === allJudges.length;

    // 只有所有评委都打分完成后才计算平均分
    const averageScore = allJudgesScored && judgeScores.length > 0 
      ? judgeScores.reduce((sum, js) => sum + js.totalScore, 0) / judgeScores.length
      : null;

    return {
      programId: currentProgram.id,
      programName: currentProgram.name,
      programOrder: currentProgram.order,
      participants: currentProgram.participants,
      judgeScores,
      averageScore: averageScore !== null ? Math.round(averageScore * 100) / 100 : null,
      allJudgesScored,
      totalJudges: allJudges.length,
      scoredJudges: judgeScores.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('获取评分数据失败:', error);
    return null;
  }
}

// SSE 端点
export async function GET(
  request: Request,
  context: { params: Promise<{ competitionId: string }> }
) {
  const params = await context.params;
  const competitionId = params.competitionId;

  // 创建 SSE 响应
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      let isClosed = false;
      
      // 发送初始数据
      const sendData = async () => {
        if (isClosed) return;
        
        try {
          // 验证比赛ID
          if (!competitionId) {
            throw new Error('比赛ID不能为空');
          }
          
          // 获取显示设置中的评委选择
          const displaySettings = await prisma.displaySettings.findUnique({
            where: { competitionId },
            select: { selectedJudgeIds: true }
          });
          
          const selectedJudgeIds = displaySettings?.selectedJudgeIds || [];
          const scoreData = await getCurrentProgramScores(competitionId, selectedJudgeIds);
          
          // 确保数据格式正确
          const responseData = scoreData || {
            programId: null,
            programName: null,
            programOrder: null,
            participants: [],
            judgeScores: [],
            averageScore: null,
            allJudgesScored: false,
            totalJudges: 0,
            scoredJudges: 0,
            timestamp: new Date().toISOString(),
          };
          
          const data = JSON.stringify(responseData);
          
          if (!isClosed) {
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        } catch (error) {
          console.error('发送数据失败:', error);
          const errorMessage = error instanceof Error ? error.message : '获取数据失败';
          
          if (!isClosed) {
            try {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
              })}\n\n`));
            } catch (encodeError) {
              console.error('编码错误数据失败:', encodeError);
            }
          }
        }
      };

      // 立即发送一次数据
      sendData();

      // 设置定时器，每2秒发送一次数据
      const interval = setInterval(sendData, 2000);

      // 清理函数
      const cleanup = () => {
        if (isClosed) return;
        isClosed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch (error) {
          // 忽略已关闭的控制器错误
        }
      };

      // 监听客户端断开连接
      request.signal.addEventListener('abort', cleanup);

      // 保持连接打开，客户端断开时会自动清理
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
} 