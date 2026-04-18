'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Star,
  CheckCircle,
  PlayCircle,
  BarChart3,
  Clock,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { JudgeHeader } from '@/components/judge/JudgeHeader';

interface ScoringCriteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
}

interface Participant {
  id: string;
  name: string;
}

interface Program {
  id: string;
  name: string;
  description?: string;
  order: number;
  participants: Participant[];
}

interface Competition {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  venue?: string;
  status: string;
  maxParticipants?: number;
  scoringCriteria: ScoringCriteria[];
  programs: Program[];
}

interface ProgramScore {
  programId: string;
  completedCriteria: number;
  totalCriteria: number;
  isCompleted: boolean;
}

export default function JudgeCompetitionDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const competitionId = params.id as string;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [programScores, setProgramScores] = useState<ProgramScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/judge/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'JUDGE') {
      router.push('/judge/login');
      return;
    }

    if (status === 'authenticated') {
      fetchCompetitionData();
    }
  }, [status, session, router, competitionId]);

  const fetchCompetitionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/judge/competitions/${competitionId}`);
      if (!response.ok) {
        throw new Error('获取比赛数据失败');
      }
      const data = await response.json();
      setCompetition(data);

      // 获取评分进度
      await fetchScoringProgress(data.programs);
    } catch (error) {
      setError(error instanceof Error ? error.message : '加载比赛数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchScoringProgress = async (programs: Program[]) => {
    try {
      const progressPromises = programs.map(async (program) => {
        const response = await fetch(`/api/judge/programs/${program.id}/scores`);
        if (response.ok) {
          const scores = await response.json();
          const completedCriteria = scores.length;
          const totalCriteria = competition?.scoringCriteria.length || 0;
          return {
            programId: program.id,
            completedCriteria,
            totalCriteria,
            isCompleted: completedCriteria === totalCriteria && totalCriteria > 0,
          };
        }
        return {
          programId: program.id,
          completedCriteria: 0,
          totalCriteria: competition?.scoringCriteria.length || 0,
          isCompleted: false,
        };
      });

      const progress = await Promise.all(progressPromises);
      setProgramScores(progress);
    } catch (error) {
      console.error('Failed to fetch scoring progress:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'FINISHED':
        return 'bg-gray-100 text-gray-800';
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return '即将开始';
      case 'ACTIVE':
        return '进行中';
      case 'FINISHED':
        return '已结束';
      case 'ARCHIVED':
        return '已归档';
      default:
        return '未知状态';
    }
  };

  const calculateOverallProgress = () => {
    if (programScores.length === 0) return 0;
    const totalCompleted = programScores.filter(p => p.isCompleted).length;
    return Math.round((totalCompleted / programScores.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <JudgeHeader showBackButton title="比赛详情" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载比赛信息...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-background">
        <JudgeHeader showBackButton title="比赛详情" />
        <div className="container mx-auto p-6 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">加载失败</h2>
                <p className="text-muted-foreground mb-4">
                  {error || '无法加载比赛信息，请稍后重试'}
                </p>
                <Button onClick={fetchCompetitionData}>重新加载</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <JudgeHeader showBackButton title={competition.name} />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* 比赛操作按钮 */}
        <div className="flex justify-end">
          <Button asChild>
            <Link href={`/judge/competitions/${competitionId}/scoring`}>
              <PlayCircle className="h-4 w-4 mr-2" />
              开始评分
            </Link>
          </Button>
        </div>

        {/* 比赛基本信息 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{competition.name}</CardTitle>
                <CardDescription className="mt-2">
                  {competition.description || '暂无比赛描述'}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(competition.status)}>
                {getStatusText(competition.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">开始时间</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(competition.startDate).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">结束时间</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(competition.endDate).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
              {competition.venue && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">比赛地点</p>
                    <p className="text-sm text-muted-foreground">{competition.venue}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">参赛节目</p>
                  <p className="text-sm text-muted-foreground">
                    {competition.programs.length} 个节目
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 评分进度概览 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              评分进度
            </CardTitle>
            <CardDescription>
              您的整体评分进度：{programScores.filter(p => p.isCompleted).length} / {competition.programs.length} 个节目已完成
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>总进度</span>
                <span>{calculateOverallProgress()}%</span>
              </div>
              <Progress value={calculateOverallProgress()} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* 评分标准 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              评分标准
            </CardTitle>
            <CardDescription>
              本次比赛共有 {competition.scoringCriteria.length} 项评分标准
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competition.scoringCriteria.map((criteria) => (
                <div
                  key={criteria.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{criteria.name}</h4>
                    <Badge variant="outline">{criteria.maxScore}分</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    权重：{criteria.weight}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 参赛节目列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              参赛节目
            </CardTitle>
            <CardDescription>
              共有 {competition.programs.length} 个参赛节目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competition.programs.map((program) => {
                const scoreInfo = programScores.find(p => p.programId === program.id);
                const progressPercentage = scoreInfo 
                  ? Math.round((scoreInfo.completedCriteria / scoreInfo.totalCriteria) * 100)
                  : 0;

                return (
                  <div
                    key={program.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline">第{program.order}号</Badge>
                          <h4 className="font-medium">{program.name}</h4>
                          {scoreInfo?.isCompleted && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              已完成
                            </Badge>
                          )}
                        </div>
                        {program.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {program.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            参赛者：{program.participantPrograms.map(pp => pp.participant.name).join('、')}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Button
                          size="sm"
                          asChild
                          variant={scoreInfo?.isCompleted ? "outline" : "default"}
                        >
                          <Link href={`/judge/competitions/${competitionId}/scoring?program=${program.order - 1}`}>
                            {scoreInfo?.isCompleted ? '查看评分' : '开始评分'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* 评分进度条 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>评分进度</span>
                        <span>
                          {scoreInfo?.completedCriteria || 0} / {scoreInfo?.totalCriteria || 0} 项标准
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 