'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Monitor,
  Save,
  ExternalLink,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface Judge {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Program {
  id: string;
  name: string;
  order: number;
  currentStatus: 'WAITING' | 'PERFORMING' | 'COMPLETED';
  participants: Array<{
    id: string;
    name: string;
    team?: string;
  }>;
}

interface DisplaySettings {
  id: string;
  competitionId: string;
  currentProgramId?: string;
  backgroundImageId?: string;
  showJudgeScores: boolean;
  showParticipants: boolean;
  showProgramInfo: boolean;
  title?: string;
  subtitle?: string;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: string;
  titleColor?: string;
  subtitleColor?: string;
  judgeNameColor?: string;
  judgeScoreColor?: string;
  averageScoreColor?: string;
  programInfoColor?: string;
  selectedJudgeIds?: string[];
}

interface DisplayData {
  settings: DisplaySettings;
  programs: Program[];
}

type FormValues = {
  currentProgramId: string;
  showJudgeScores: boolean;
  showParticipants: boolean;
  showProgramInfo: boolean;
  title: string;
  subtitle: string;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: string;
  selectedJudgeIds: string[];
};

interface DisplayManagementProps {
  competitionId: string;
}

export function DisplayManagement({ competitionId }: DisplayManagementProps) {
  const [displayData, setDisplayData] = useState<DisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loadingJudges, setLoadingJudges] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      currentProgramId: 'none',
      showJudgeScores: true,
      showParticipants: true,
      showProgramInfo: true,
      title: '',
      subtitle: '',
      autoRefresh: true,
      refreshInterval: 5,
      theme: 'MODERN',
      selectedJudgeIds: [],
    },
  });

  const fetchDisplayData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/display/${competitionId}/data`);
      if (!response.ok) {
        throw new Error('获取显示数据失败');
      }
      const data = await response.json();
      setDisplayData(data);

      // 更新表单默认值
      form.reset({
        currentProgramId: data.settings.currentProgramId || 'none',
        showJudgeScores: data.settings.showJudgeScores,
        showParticipants: data.settings.showParticipants,
        showProgramInfo: data.settings.showProgramInfo,
        title: data.settings.title || '',
        subtitle: data.settings.subtitle || '',
        autoRefresh: data.settings.autoRefresh,
        refreshInterval: data.settings.refreshInterval,
        theme: data.settings.theme,
        selectedJudgeIds: data.settings.selectedJudgeIds || [],
      });

      setError(null);
    } catch (error) {
      console.error('Error fetching display data:', error);
      setError(error instanceof Error ? error.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchJudges = async () => {
    try {
      setLoadingJudges(true);
      const response = await fetch('/api/users?role=JUDGE');
      if (!response.ok) {
        throw new Error('获取评委列表失败');
      }
      const data = await response.json();
      setJudges(data.users || []);
    } catch (error) {
      console.error('Error fetching judges:', error);
      setError(error instanceof Error ? error.message : '获取评委列表失败');
    } finally {
      setLoadingJudges(false);
    }
  };

  useEffect(() => {
    fetchDisplayData();
    fetchJudges();
  }, [competitionId]);

  const onSubmit = async (data: FormValues) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/display/${competitionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('保存设置失败');
      }

      setSuccessMessage('设置保存成功！');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // 重新获取数据
      await fetchDisplayData();
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存设置失败');
    } finally {
      setSaving(false);
    }
  };

  // 获取节目状态样式
  const getProgramStatusStyles = (status: 'WAITING' | 'PERFORMING' | 'COMPLETED', isSelected: boolean) => {
    const baseStyles = "h-auto p-2 flex flex-col items-center transition-all duration-200";
    
    if (isSelected) {
      switch (status) {
        case 'WAITING':
          return `${baseStyles} bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600`;
        case 'PERFORMING':
          return `${baseStyles} bg-blue-500 hover:bg-blue-600 text-white border-blue-600`;
        case 'COMPLETED':
          return `${baseStyles} bg-green-500 hover:bg-green-600 text-white border-green-600`;
        default:
          return `${baseStyles} bg-primary hover:bg-primary/80 text-primary-foreground`;
      }
    } else {
      switch (status) {
        case 'WAITING':
          return `${baseStyles} bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200 border`;
        case 'PERFORMING':
          return `${baseStyles} bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 border`;
        case 'COMPLETED':
          return `${baseStyles} bg-green-50 hover:bg-green-100 text-green-700 border-green-200 border`;
        default:
          return `${baseStyles} bg-muted hover:bg-muted/80 text-muted-foreground border border-muted`;
      }
    }
  };

  // 获取节目状态文本
  const getProgramStatusText = (status: 'WAITING' | 'PERFORMING' | 'COMPLETED') => {
    switch (status) {
      case 'WAITING':
        return '等待中';
      case 'PERFORMING':
        return '进行中';
      case 'COMPLETED':
        return '已完成';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">加载大屏幕设置...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !displayData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">加载失败</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDisplayData}>重新加载</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!displayData) return null;

  const { settings, programs } = displayData;

  return (
    <div className="space-y-6">
      {/* 成功/错误消息 */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：节目控制 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              节目控制台
            </CardTitle>
            <CardDescription>
              选择当前显示的节目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 当前节目显示 */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">当前节目</span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentIndex = programs.findIndex(p => p.id === form.watch('currentProgramId'));
                        if (currentIndex > 0) {
                          form.setValue('currentProgramId', programs[currentIndex - 1].id);
                        }
                      }}
                      disabled={!form.watch('currentProgramId') || programs.findIndex(p => p.id === form.watch('currentProgramId')) <= 0}
                      className="h-8 px-2"
                    >
                      ← 上一个
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentIndex = programs.findIndex(p => p.id === form.watch('currentProgramId'));
                        if (currentIndex >= 0 && currentIndex < programs.length - 1) {
                          form.setValue('currentProgramId', programs[currentIndex + 1].id);
                        }
                      }}
                      disabled={!form.watch('currentProgramId') || programs.findIndex(p => p.id === form.watch('currentProgramId')) >= programs.length - 1}
                      className="h-8 px-2"
                    >
                      下一个 →
                    </Button>
                  </div>
                </div>
                
                {form.watch('currentProgramId') && form.watch('currentProgramId') !== 'none' ? (
                  (() => {
                    const currentProgram = programs.find(p => p.id === form.watch('currentProgramId'));
                    return currentProgram ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            第 {currentProgram.order} 号
                          </Badge>
                          <h3 className="text-lg font-semibold">{currentProgram.name}</h3>
                        </div>
                        {currentProgram.participants.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            参赛者：{currentProgram.participants.map(p => p.name).join('、')}
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()
                ) : (
                  <div className="text-center py-2">
                    <span className="text-muted-foreground">未选择节目</span>
                  </div>
                )}
              </div>

              {/* 快速切换网格 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">快速切换</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => form.setValue('currentProgramId', 'none')}
                    className="h-8 px-3 text-xs"
                  >
                    清除选择
                  </Button>
                </div>
                
                {programs.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {programs.map((program) => (
                      <Button
                        key={program.id}
                        type="button"
                        size="sm"
                        onClick={() => form.setValue('currentProgramId', program.id)}
                        className={getProgramStatusStyles(program.currentStatus, form.watch('currentProgramId') === program.id)}
                        title={`${program.name} - ${program.participants.map(p => p.name).join('、')} (${getProgramStatusText(program.currentStatus)})`}
                      >
                        <div className="flex flex-col items-center space-y-1 w-full">
                          <span className="text-lg font-bold">{program.order}</span>
                          <span className="text-xs truncate w-full">{program.name}</span>
                          <span className="text-xs opacity-80">
                            {getProgramStatusText(program.currentStatus)}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50 text-center">
                    暂无节目，请先添加节目
                  </div>
                )}
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存节目设置'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 右侧：评委管理 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              评委管理
            </CardTitle>
            <CardDescription>
              选择在大屏幕上显示的评委
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 显示开关 */}
              <div className="flex items-center justify-between">
                <Label htmlFor="showJudgeScores">显示裁判评分</Label>
                <Switch
                  id="showJudgeScores"
                  checked={form.watch('showJudgeScores')}
                  onCheckedChange={(checked) => form.setValue('showJudgeScores', checked)}
                />
              </div>

              {/* 评委选择 */}
              {form.watch('showJudgeScores') && (
                <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">评委选择</Label>
                    <Badge variant="secondary">
                      已选择 {form.watch('selectedJudgeIds').length}/{judges.length}
                    </Badge>
                  </div>
                  
                  {loadingJudges ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-sm">加载评委列表...</span>
                    </div>
                  ) : judges.length > 0 ? (
                    <>
                      {/* 快速选择按钮 */}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => form.setValue('selectedJudgeIds', judges.map(j => j.id))}
                          disabled={form.watch('selectedJudgeIds').length === judges.length}
                        >
                          全选
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => form.setValue('selectedJudgeIds', [])}
                          disabled={form.watch('selectedJudgeIds').length === 0}
                        >
                          全不选
                        </Button>
                      </div>

                      {/* 评委列表 */}
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {judges.map((judge) => (
                          <div key={judge.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50">
                            <input
                              type="checkbox"
                              id={`judge-${judge.id}`}
                              checked={form.watch('selectedJudgeIds').includes(judge.id)}
                              onChange={(e) => {
                                const currentIds = form.watch('selectedJudgeIds');
                                if (e.target.checked) {
                                  form.setValue('selectedJudgeIds', [...currentIds, judge.id]);
                                } else {
                                  form.setValue('selectedJudgeIds', currentIds.filter(id => id !== judge.id));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {judge.name.charAt(0)}
                            </div>
                            <label 
                              htmlFor={`judge-${judge.id}`}
                              className="flex-1 text-sm font-medium cursor-pointer"
                            >
                              {judge.name}
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* 选择提示 */}
                      {form.watch('selectedJudgeIds').length === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                          <p className="text-yellow-800 text-xs">
                            ⚠️ 未选择任何评委，大屏幕将不显示评分数据
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      暂无评委数据
                    </div>
                  )}
                </div>
              )}

              {/* 其他显示设置 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showParticipants">显示参赛者信息</Label>
                  <Switch
                    id="showParticipants"
                    checked={form.watch('showParticipants')}
                    onCheckedChange={(checked) => form.setValue('showParticipants', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showProgramInfo">显示节目信息</Label>
                  <Switch
                    id="showProgramInfo"
                    checked={form.watch('showProgramInfo')}
                    onCheckedChange={(checked) => form.setValue('showProgramInfo', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoRefresh">自动刷新</Label>
                  <Switch
                    id="autoRefresh"
                    checked={form.watch('autoRefresh')}
                    onCheckedChange={(checked) => form.setValue('autoRefresh', checked)}
                  />
                </div>
              </div>

              {/* 刷新间隔 */}
              {form.watch('autoRefresh') && (
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">刷新间隔（秒）</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="1"
                    max="60"
                    {...form.register('refreshInterval', { valueAsNumber: true })}
                  />
                </div>
              )}

              <Button type="submit" disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存评委设置'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 快速预览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExternalLink className="h-5 w-5 mr-2" />
            快速预览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              点击下方链接在新窗口中查看大屏幕效果
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/display/${competitionId}`} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                在新窗口中预览
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 