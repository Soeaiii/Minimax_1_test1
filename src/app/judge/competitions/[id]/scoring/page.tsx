'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, CheckCircle, ArrowLeft, ArrowRight, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import { JudgeHeader } from '@/components/judge/JudgeHeader';

interface ScoringCriteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
}

interface Program {
  id: string;
  name: string;
  description?: string;
  order: number;
  participants: Array<{
    id: string;
    name: string;
  }>;
}

interface Competition {
  id: string;
  name: string;
  description?: string;
  scoringCriteria: ScoringCriteria[];
  programs: Program[];
}

interface ExistingScore {
  criteriaId: string;
  value: number;
  comment?: string;
}

type FormValues = Record<string, string | number>;

export default function ScoringPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const competitionId = params.id as string;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);
  const [existingScores, setExistingScores] = useState<ExistingScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 在顶层初始化表单
  const form = useForm<FormValues>({
    defaultValues: {},
  });

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

  // 处理URL参数中的节目索引
  useEffect(() => {
    const programParam = searchParams.get('program');
    if (programParam !== null && competition) {
      const programIndex = parseInt(programParam, 10);
      if (programIndex >= 0 && programIndex < competition.programs.length) {
        setCurrentProgramIndex(programIndex);
        loadExistingScores(competition.programs[programIndex].id);
      }
    }
  }, [searchParams, competition]);

  // 当比赛数据或评分变化时，更新表单默认值
  useEffect(() => {
    if (competition && competition.scoringCriteria.length > 0) {
      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
    }
  }, [competition, currentProgramIndex, existingScores, form]);

  const fetchCompetitionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/judge/competitions/${competitionId}`);
      if (!response.ok) {
        throw new Error('获取比赛数据失败');
      }
      const data = await response.json();
      setCompetition(data);
      
      // 加载当前节目的现有评分
      if (data.programs.length > 0) {
        const programParam = searchParams.get('program');
        const initialIndex = programParam !== null ? parseInt(programParam, 10) : 0;
        const programIndex = initialIndex >= 0 && initialIndex < data.programs.length ? initialIndex : 0;
        setCurrentProgramIndex(programIndex);
        await loadExistingScores(data.programs[programIndex].id);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '加载比赛数据失败');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingScores = async (programId: string) => {
    try {
      const response = await fetch(`/api/judge/programs/${programId}/scores`);
      if (response.ok) {
        const scores = await response.json();
        setExistingScores(scores);
      }
    } catch (error) {
      console.error('Failed to load existing scores:', error);
    }
  };

  const getDefaultValues = (): FormValues => {
    if (!competition) return {};
    
    const values: FormValues = {};
    competition.scoringCriteria.forEach(criterion => {
      const existingScore = existingScores.find(s => s.criteriaId === criterion.id);
      values[`score_${criterion.id}`] = existingScore?.value || 0;
      values[`comment_${criterion.id}`] = existingScore?.comment || '';
    });
    return values;
  };

  const onSubmit = async (data: FormValues) => {
    if (!competition || !competition.programs[currentProgramIndex]) return;

    setSaving(true);
    setError(null);

    try {
      const currentProgram = competition.programs[currentProgramIndex];
      const scores = competition.scoringCriteria.map(criterion => ({
        criteriaId: criterion.id,
        value: Number(data[`score_${criterion.id}`]) || 0,
        comment: String(data[`comment_${criterion.id}`] || ''),
      }));

      const response = await fetch(`/api/judge/programs/${currentProgram.id}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scores }),
      });

      if (!response.ok) {
        throw new Error('保存评分失败');
      }

      // 重新加载现有评分
      await loadExistingScores(currentProgram.id);
      
      // 如果还有下一个节目，自动切换
      if (currentProgramIndex < competition.programs.length - 1) {
        nextProgram();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存评分失败');
    } finally {
      setSaving(false);
    }
  };

  const nextProgram = async () => {
    if (currentProgramIndex < (competition?.programs.length || 0) - 1) {
      const newIndex = currentProgramIndex + 1;
      setCurrentProgramIndex(newIndex);
      if (competition) {
        await loadExistingScores(competition.programs[newIndex].id);
      }
    }
  };

  const previousProgram = async () => {
    if (currentProgramIndex > 0) {
      const newIndex = currentProgramIndex - 1;
      setCurrentProgramIndex(newIndex);
      if (competition) {
        await loadExistingScores(competition.programs[newIndex].id);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <JudgeHeader showBackButton title="节目评分" />
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-background">
        <JudgeHeader showBackButton title="节目评分" />
        <div className="container mx-auto p-6">
          <div className="text-center">
            <p className="text-red-500">比赛数据加载失败</p>
          </div>
        </div>
      </div>
    );
  }

  const currentProgram = competition.programs[currentProgramIndex];
  const progress = ((currentProgramIndex + 1) / competition.programs.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <JudgeHeader showBackButton title={`节目评分 - ${competition.name}`} />
      
      <div className="container max-w-4xl mx-auto p-6">
        {/* 比赛信息 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{competition.name}</h1>
          <p className="text-muted-foreground">{competition.description}</p>
          
          {/* 进度条 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>评分进度</span>
              <span>{currentProgramIndex + 1} / {competition.programs.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive mb-6">
            {error}
          </div>
        )}

        {/* 当前节目信息 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  节目 {currentProgram.order}: {currentProgram.name}
                </CardTitle>
                <CardDescription>
                  {currentProgram.description}
                </CardDescription>
              </div>
              <Badge variant="outline">
                {existingScores.length > 0 ? (
                  <><CheckCircle className="h-3 w-3 mr-1" />已评分</>
                ) : (
                  <>待评分</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground">参赛者:</span>
              {currentProgram.participants.map((participant) => (
                <Badge key={participant.id} variant="secondary">
                  {participant.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 评分表单 */}
        <Card>
          <CardHeader>
            <CardTitle>评分标准</CardTitle>
            <CardDescription>
              请根据各项标准对节目进行评分
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {competition.scoringCriteria.map((criterion) => (
                  <Card key={criterion.id} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">{criterion.name}</h3>
                      <Badge variant="outline">
                        权重: {criterion.weight} | 满分: {criterion.maxScore}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`score_${criterion.id}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>分数 (0-{criterion.maxScore})</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max={criterion.maxScore}
                                step="0.01"
                                placeholder="输入分数"
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`comment_${criterion.id}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>评语 (可选)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="输入评语..."
                                className="min-h-[60px]"
                                value={field.value || ''}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}

                {/* 操作按钮 */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousProgram}
                    disabled={currentProgramIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    上一个节目
                  </Button>

                  <Button type="submit" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? '保存中...' : '保存评分'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={nextProgram}
                    disabled={currentProgramIndex === competition.programs.length - 1}
                  >
                    下一个节目
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 