'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  TrendingUp, 
  PieChart, 
  Activity,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CompetitionStatsProps {
  competitionId: string;
}

interface StatsData {
  overview: {
    totalPrograms: number;
    totalParticipants: number;
    totalScores: number;
    totalCriteria: number;
    competitionStatus: string;
    rankingUpdateMode: string;
  };
  programs: {
    total: number;
    waiting: number;
    performing: number;
    completed: number;
    distribution: {
      waiting: number;
      performing: number;
      completed: number;
    };
  };
  scores: {
    totalScores: number;
    completionRate: number;
    highestScore: number | null;
    lowestScore: number | null;
    averageScore: number;
    judgeStats: Array<{
      judgeId: string;
      scoresGiven: number;
      averageScore: number;
    }>;
  };
  teams: {
    totalTeams: number;
    individualParticipants: number;
    teams: Array<{
      name: string;
      participantCount: number;
      programCount: number;
    }>;
  };
  progress: {
    overallProgress: number;
    scoringProgress: number;
    remainingPrograms: number;
    expectedScores: number;
    actualScores: number;
  };
  rankings: Array<{
    rank: number;
    totalScore: number;
    program: {
      name: string;
      participants: Array<{
        name: string;
        team: string | null;
      }>;
    };
  }>;
  chartData: {
    programStatus: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    scoreDistribution: Array<{
      label: string;
      value: number;
      percentage: number;
    }>;
    teamPerformance: Array<{
      name: string;
      bestRank: number;
      averageScore: number;
      programCount: number;
    }>;
  };
}

export function CompetitionStats({ competitionId }: CompetitionStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchStats() {
      try {
        setError(null);
        setLoading(true);
        
        const response = await fetch(`/api/competitions/${competitionId}/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (mounted) {
          setStats(data);
        }
      } catch (err) {
        console.error('获取统计数据失败:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : '获取统计数据时发生未知错误');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchStats();
    
    return () => {
      mounted = false;
    };
  }, [competitionId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">正在加载统计数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              统计数据加载失败: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              暂无统计数据可显示
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: '待开始',
      ACTIVE: '进行中',
      FINISHED: '已结束',
      ARCHIVED: '已归档'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PENDING: 'secondary',
      ACTIVE: 'default',
      FINISHED: 'outline',
      ARCHIVED: 'destructive'
    };
    return colorMap[status] || 'outline';
  };

  return (
    <div className="space-y-6">
      {/* 概览统计 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">比赛状态</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant={getStatusColor(stats.overview.competitionStatus)}>
                {getStatusText(stats.overview.competitionStatus)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {stats.overview.rankingUpdateMode === 'REALTIME' ? '实时排名' : '批量排名'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">节目总数</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalPrograms}</div>
            <div className="flex gap-1 mt-2">
              <Badge variant="secondary" className="text-xs">
                已完成: {stats.programs.completed}
              </Badge>
              <Badge variant="outline" className="text-xs">
                进行中: {stats.programs.performing}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">参与选手</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalParticipants}</div>
            <p className="text-xs text-muted-foreground mt-1">
              团队: {stats.teams.totalTeams} | 个人: {stats.teams.individualParticipants}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">评分进度</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.progress.scoringProgress}%</div>
            <Progress value={stats.progress.scoringProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.progress.actualScores} / {stats.progress.expectedScores} 评分
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 详细统计 */}
      <Tabs defaultValue="programs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="programs">节目分析</TabsTrigger>
          <TabsTrigger value="scores">评分统计</TabsTrigger>
          <TabsTrigger value="teams">团队表现</TabsTrigger>
          <TabsTrigger value="rankings">排名榜</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  节目状态分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.chartData.programStatus.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </span>
                        <span className="font-medium">
                          {item.value} ({stats.programs.distribution[item.name === '等待中' ? 'waiting' : item.name === '表演中' ? 'performing' : 'completed']}%)
                        </span>
                      </div>
                      <Progress 
                        value={stats.programs.distribution[item.name === '等待中' ? 'waiting' : item.name === '表演中' ? 'performing' : 'completed']} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  完成进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>整体进度</span>
                      <span>{stats.progress.overallProgress}%</span>
                    </div>
                    <Progress value={stats.progress.overallProgress} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>评分进度</span>
                      <span>{stats.progress.scoringProgress}%</span>
                    </div>
                    <Progress value={stats.progress.scoringProgress} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    剩余 {stats.progress.remainingPrograms} 个节目待完成
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scores" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>评分概览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.scores.highestScore || '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">最高分</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.scores.lowestScore || '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">最低分</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {stats.scores.averageScore}
                    </div>
                    <div className="text-xs text-muted-foreground">平均分</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium">
                      {stats.scores.totalScores}
                    </div>
                    <div className="text-xs text-muted-foreground">总评分数</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>评委统计</CardTitle>
                <CardDescription>
                  各评委的评分情况
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.scores.judgeStats.slice(0, 5).map((judge, index) => (
                    <div key={judge.judgeId} className="flex justify-between items-center">
                      <span className="text-sm">评委 {index + 1}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {judge.averageScore}分
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {judge.scoresGiven} 次评分
                        </div>
                      </div>
                    </div>
                  ))}
                  {stats.scores.judgeStats.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm">
                      暂无评分数据
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                团队表现
              </CardTitle>
              <CardDescription>
                各团队的参与情况和表现
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.teams.teams.slice(0, 10).map((team, index) => (
                  <div key={team.name} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {team.participantCount} 名选手 • {team.programCount} 个节目
                      </div>
                    </div>
                    <Badge variant={index < 3 ? 'default' : 'secondary'}>
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
                {stats.teams.teams.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    暂无团队数据
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                当前排名
              </CardTitle>
              <CardDescription>
                实时排名榜单
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.rankings.map((ranking) => (
                  <div key={ranking.rank} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {ranking.rank <= 3 ? (
                          <Award className={`h-4 w-4 ${
                            ranking.rank === 1 ? 'text-yellow-500' :
                            ranking.rank === 2 ? 'text-gray-400' :
                            'text-amber-600'
                          }`} />
                        ) : (
                          <span className="text-sm font-medium">{ranking.rank}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{ranking.program.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {ranking.program.participants.map(p => p.name).join('、')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{ranking.totalScore}</div>
                      <div className="text-xs text-muted-foreground">总分</div>
                    </div>
                  </div>
                ))}
                {stats.rankings.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    暂无排名数据
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 