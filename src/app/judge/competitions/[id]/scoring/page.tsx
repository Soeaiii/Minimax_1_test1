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
import { Star, CheckCircle, ArrowLeft, ArrowRight, Save, Eye, Monitor, ArrowUpRight, ChevronDown, ChevronUp, Users } from 'lucide-react';
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

interface CurrentDisplayProgram {
  id: string;
  name: string;
  description?: string;
  order: number;
  currentStatus: string;
  participants: Array<{
    id: string;
    name: string;
    team?: string;
  }>;
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
  const [currentDisplayProgram, setCurrentDisplayProgram] = useState<CurrentDisplayProgram | null>(null);
  const [loadingDisplayInfo, setLoadingDisplayInfo] = useState(false);

  // 参赛者折叠状态
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const PARTICIPANTS_DISPLAY_LIMIT = 3; // 最多显示的参赛者数量

  // 控制是否显示所有参赛者
  const toggleParticipantsDisplay = () => {
    setShowAllParticipants(!showAllParticipants);
  };

  // 获取要显示的参赛者列表
  const getDisplayParticipants = (participants: Array<{ id: string; name: string; }>) => {
    if (participants.length <= PARTICIPANTS_DISPLAY_LIMIT || showAllParticipants) {
      return participants;
    }
    return participants.slice(0, PARTICIPANTS_DISPLAY_LIMIT);
  };

  // 在顶层初始化表单
  const form = useForm<FormValues>({
    defaultValues: {},
  });

  // 获取本地存储的键名
  const getStorageKey = () => `judge_scoring_${competitionId}_program_index`;

  // 保存当前节目索引到本地存储
  const saveCurrentProgramIndex = (index: number) => {
    try {
      localStorage.setItem(getStorageKey(), index.toString());
    } catch (error) {
      console.warn('Failed to save program index to localStorage:', error);
    }
  };

  // 从本地存储获取节目索引
  const getStoredProgramIndex = (): number => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      return stored ? parseInt(stored, 10) : 0;
    } catch (error) {
      console.warn('Failed to get program index from localStorage:', error);
      return 0;
    }
  };

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
        saveCurrentProgramIndex(programIndex);
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

  // 监听页面可见性变化，保存当前状态
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // 页面隐藏时保存当前节目索引
        saveCurrentProgramIndex(currentProgramIndex);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentProgramIndex]);

  // 页面卸载时保存状态
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentProgramIndex(currentProgramIndex);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentProgramIndex]);

  // 定期获取当前大屏幕节目信息
  useEffect(() => {
    if (status !== 'authenticated' || !competition) {
      return;
    }

    const fetchDisplayInfo = async () => {
      try {
        setLoadingDisplayInfo(true);
        const response = await fetch(`/api/judge/competitions/${competitionId}/current-display`);
        if (!response.ok) {
          throw new Error('获取大屏幕信息失败');
        }
        const data = await response.json();
        setCurrentDisplayProgram(data.currentProgram);
      } catch (error) {
        console.error('获取大屏幕节目信息失败:', error);
      } finally {
        setLoadingDisplayInfo(false);
      }
    };

    fetchDisplayInfo();

    const intervalId = setInterval(fetchDisplayInfo, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [competitionId, status, competition]);

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
        // 优先使用URL参数，其次使用本地存储，最后默认为0
        const programParam = searchParams.get('program');
        let initialIndex = 0;
        
        if (programParam !== null) {
          initialIndex = parseInt(programParam, 10);
        } else {
          // 从本地存储获取上次的节目索引
          initialIndex = getStoredProgramIndex();
        }
        
        // 确保索引在有效范围内
        const programIndex = initialIndex >= 0 && initialIndex < data.programs.length ? initialIndex : 0;
        setCurrentProgramIndex(programIndex);
        saveCurrentProgramIndex(programIndex);
        
        // 如果URL中没有program参数，添加它
        if (programParam === null) {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('program', programIndex.toString());
          window.history.replaceState({}, '', newUrl.toString());
        }
        
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
        await nextProgram();
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
      saveCurrentProgramIndex(newIndex);
      
      // 更新URL参数
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('program', newIndex.toString());
      window.history.replaceState({}, '', newUrl.toString());
      
      if (competition) {
        await loadExistingScores(competition.programs[newIndex].id);
      }
    }
  };

  const previousProgram = async () => {
    if (currentProgramIndex > 0) {
      const newIndex = currentProgramIndex - 1;
      setCurrentProgramIndex(newIndex);
      saveCurrentProgramIndex(newIndex);
      
      // 更新URL参数
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('program', newIndex.toString());
      window.history.replaceState({}, '', newUrl.toString());
      
      if (competition) {
        await loadExistingScores(competition.programs[newIndex].id);
      }
    }
  };

  // 找到大屏幕当前节目在比赛节目列表中的索引
  const findDisplayProgramIndex = () => {
    if (!currentDisplayProgram || !competition) return -1;
    return competition.programs.findIndex(p => p.id === currentDisplayProgram.id);
  };

  // 判断当前评分节目是否与大屏幕显示的节目相同
  const isCurrentProgramSameAsDisplay = () => {
    return currentDisplayProgram && currentProgram.id === currentDisplayProgram.id;
  };

  // 跳转到当前大屏幕显示的节目
  const jumpToDisplayProgram = async () => {
    const index = findDisplayProgramIndex();
    if (index >= 0) {
      setCurrentProgramIndex(index);
      saveCurrentProgramIndex(index);
      
      // 更新URL参数
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('program', index.toString());
      window.history.replaceState({}, '', newUrl.toString());
      
      if (competition) {
        await loadExistingScores(competition.programs[index].id);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <JudgeHeader showBackButton title="节目评分" />
        <div className="container mx-auto p-4 sm:p-6">
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
        <div className="container mx-auto p-4 sm:p-6">
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
      <JudgeHeader 
        showBackButton 
        title={`节目评分 - ${competition.name}`}
      />
      
      <div className="container max-w-4xl mx-auto p-4 sm:p-6">
        {/* 比赛信息 */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{competition.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{competition.description}</p>
          
          {/* 进度条 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>评分进度</span>
              <span>{currentProgramIndex + 1} / {competition.programs.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* 大屏幕节目按钮 */}
            {currentDisplayProgram && !isCurrentProgramSameAsDisplay() && (
              <div className="mt-3 flex justify-end">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={jumpToDisplayProgram}
                  className="h-8 flex items-center gap-1 border-dashed border-primary/50 bg-primary/5"
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span className="text-xs">当前节目：{currentDisplayProgram.name}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            )}
            {currentDisplayProgram && isCurrentProgramSameAsDisplay() && (
              <div className="mt-3 flex justify-end">
                <Badge variant="outline" className="h-8 flex items-center gap-1 border-dashed border-primary/50 bg-primary/5">
                  <Monitor className="h-3.5 w-3.5" />
                  <span className="text-xs">当前正在评分的节目正在大屏幕显示</span>
                </Badge>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive mb-4 sm:mb-6">
            {error}
          </div>
        )}

        {/* 当前节目信息 */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                  节目 {currentProgram.order}: {currentProgram.name}
                </CardTitle>
                <CardDescription className="mt-1 text-sm">
                  {currentProgram.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="self-start sm:self-center">
                {existingScores.length > 0 ? (
                  <><CheckCircle className="h-3 w-3 mr-1" />已评分</>
                ) : (
                  <>待评分</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
              <span className="text-sm text-muted-foreground pt-1">
                <Users className="h-4 w-4 inline-block mr-1" />
                参赛者:
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {getDisplayParticipants(currentProgram.participants).map((participant) => (
                    <Badge key={`program-participant-${participant.id}`} variant="secondary" className="text-xs">
                      {participant.name}
                    </Badge>
                  ))}
                  
                  {/* 显示参赛者总数 */}
                  {currentProgram.participants.length > PARTICIPANTS_DISPLAY_LIMIT && !showAllParticipants && (
                    <Badge variant="outline" className="text-xs cursor-pointer" onClick={toggleParticipantsDisplay}>
                      +{currentProgram.participants.length - PARTICIPANTS_DISPLAY_LIMIT}人 <ChevronDown className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                </div>
                
                {/* 折叠/展开按钮 */}
                {currentProgram.participants.length > PARTICIPANTS_DISPLAY_LIMIT && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleParticipantsDisplay}
                    className="text-xs h-6 mt-1 px-2"
                  >
                    {showAllParticipants ? (
                      <>收起 <ChevronUp className="h-3 w-3 ml-1" /></>
                    ) : (
                      <>显示全部{currentProgram.participants.length}名参赛者 <ChevronDown className="h-3 w-3 ml-1" /></>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 评分表单 */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">评分标准</CardTitle>
            <CardDescription className="text-sm">
              请根据各项标准对节目进行评分
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {competition.scoringCriteria.map((criterion) => (
                  <Card key={criterion.id} className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
                      <h3 className="font-semibold text-base sm:text-lg">{criterion.name}</h3>
                      <Badge variant="outline" className="self-start sm:self-center text-xs">
                        权重: {criterion.weight} | 满分: {criterion.maxScore}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      <FormField
                        control={form.control}
                        name={`score_${criterion.id}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">分数 (0-{criterion.maxScore})</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max={criterion.maxScore}
                                step="0.01"
                                placeholder="输入分数"
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                className="text-base"
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
                            <FormLabel className="text-sm">评语 (可选)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="输入评语..."
                                className="min-h-[60px] text-base"
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

                {/* 操作按钮 - 手机优化布局 */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousProgram}
                    disabled={currentProgramIndex === 0}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    上一个节目
                  </Button>

                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? '保存中...' : '保存评分'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={nextProgram}
                    disabled={currentProgramIndex === competition.programs.length - 1}
                    className="w-full sm:w-auto order-3"
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