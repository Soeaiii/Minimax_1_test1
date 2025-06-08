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
  Play,
  Pause,
  CheckCircle,
  Clock,
  Settings,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

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
  title: string;
  subtitle: string;
  theme: string;
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
  const [pendingStatusUpdates, setPendingStatusUpdates] = useState<Record<string, 'WAITING' | 'PERFORMING' | 'COMPLETED'>>({});

  const form = useForm<FormValues>({
    defaultValues: {
      currentProgramId: 'none',
      title: '',
      subtitle: '',
      theme: 'MODERN',
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
        title: data.settings.title || '',
        subtitle: data.settings.subtitle || '',
        theme: data.settings.theme,
      });

      // 清空待保存的状态更新
      setPendingStatusUpdates({});
      setError(null);
    } catch (error) {
      console.error('Error fetching display data:', error);
      setError(error instanceof Error ? error.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisplayData();
  }, [competitionId]);

  // 设置待保存的状态（不立即保存）
  const setPendingProgramStatus = (programId: string, newStatus: 'WAITING' | 'PERFORMING' | 'COMPLETED') => {
    setPendingStatusUpdates(prev => ({
      ...prev,
      [programId]: newStatus
    }));
  };

  // 智能状态切换（设置待保存状态）
  const smartStatusUpdate = (programId: string) => {
    const program = displayData?.programs.find(p => p.id === programId);
    if (!program) return;

    // 如果有待保存的状态，使用待保存的状态，否则使用当前状态
    const currentStatus = pendingStatusUpdates[programId] || program.currentStatus;
    
    let newStatus: 'WAITING' | 'PERFORMING' | 'COMPLETED';
    
    // 智能状态切换逻辑
    switch (currentStatus) {
      case 'WAITING':
        newStatus = 'PERFORMING';
        break;
      case 'PERFORMING':
        newStatus = 'COMPLETED';
        break;
      case 'COMPLETED':
        newStatus = 'WAITING';
        break;
      default:
        newStatus = 'WAITING';
    }

    setPendingProgramStatus(programId, newStatus);
  };

  // 批量设置待保存状态
  const setBatchPendingStatus = (statusMap: Record<string, 'WAITING' | 'PERFORMING' | 'COMPLETED'>) => {
    setPendingStatusUpdates(prev => ({
      ...prev,
      ...statusMap
    }));
  };

  // 获取程序的显示状态（优先显示待保存状态）
  const getProgramDisplayStatus = (programId: string) => {
    const program = displayData?.programs.find(p => p.id === programId);
    if (!program) return 'WAITING';
    return pendingStatusUpdates[programId] || program.currentStatus;
  };

  // 检查是否有未保存的更改
  const hasUnsavedChanges = Object.keys(pendingStatusUpdates).length > 0;

  const onSubmit = async (data: FormValues) => {
    try {
      setSaving(true);
      setError(null);

      // 1. 保存显示设置
      const displayResponse = await fetch(`/api/display/${competitionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!displayResponse.ok) {
        throw new Error('保存显示设置失败');
      }

      // 2. 批量更新节目状态
      if (hasUnsavedChanges) {
        const statusUpdatePromises = Object.entries(pendingStatusUpdates).map(async ([programId, status]) => {
          const response = await fetch(`/api/programs/${programId}/simple-update`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentStatus: status }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`更新节目状态失败: ${errorData.error || '未知错误'}`);
          }

          return response.json();
        });

        await Promise.all(statusUpdatePromises);
      }

      setSuccessMessage(
        hasUnsavedChanges 
          ? `设置和节目状态保存成功！更新了 ${Object.keys(pendingStatusUpdates).length} 个节目的状态。`
          : '设置保存成功！'
      );
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // 重新获取数据
      await fetchDisplayData();
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存失败');
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

      <div className="grid grid-cols-1 gap-6">
        {/* 节目控制 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              节目控制台
            </CardTitle>
            <CardDescription>
              选择当前显示的节目并控制节目状态
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
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            第 {currentProgram.order} 号
                          </Badge>
                          <h3 className="text-lg font-semibold">{currentProgram.name}</h3>
                          <Badge variant={
                            getProgramDisplayStatus(currentProgram.id) === 'WAITING' ? 'outline' :
                            getProgramDisplayStatus(currentProgram.id) === 'PERFORMING' ? 'default' : 'secondary'
                          }>
                            {getProgramStatusText(getProgramDisplayStatus(currentProgram.id))}
                            {pendingStatusUpdates[currentProgram.id] && (
                              <span className="ml-1 text-xs">*</span>
                            )}
                          </Badge>
                        </div>
                        {currentProgram.participants.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            参赛者：{currentProgram.participants.map(p => p.name).join('、')}
                          </div>
                        )}
                        
                        {/* 节目状态控制按钮 */}
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            type="button"
                            variant={getProgramDisplayStatus(currentProgram.id) === 'WAITING' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPendingProgramStatus(currentProgram.id, 'WAITING')}
                            disabled={getProgramDisplayStatus(currentProgram.id) === 'WAITING'}
                            className="flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            等待中
                          </Button>
                          <Button
                            type="button"
                            variant={getProgramDisplayStatus(currentProgram.id) === 'PERFORMING' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPendingProgramStatus(currentProgram.id, 'PERFORMING')}
                            disabled={getProgramDisplayStatus(currentProgram.id) === 'PERFORMING'}
                            className="flex items-center gap-1"
                          >
                            <Play className="h-3 w-3" />
                            进行中
                          </Button>
                          <Button
                            type="button"
                            variant={getProgramDisplayStatus(currentProgram.id) === 'COMPLETED' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPendingProgramStatus(currentProgram.id, 'COMPLETED')}
                            disabled={getProgramDisplayStatus(currentProgram.id) === 'COMPLETED'}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            已完成
                          </Button>
                          <div className="flex-1" />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => smartStatusUpdate(currentProgram.id)}
                            disabled={false}
                            className="flex items-center gap-1"
                            title="智能切换：等待中→进行中→已完成→等待中"
                          >
                            <Settings className="h-3 w-3" />
                            智能切换
                          </Button>
                        </div>
                        
                        {/* 显示待保存状态提示 */}
                        {pendingStatusUpdates[currentProgram.id] && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                            <span className="font-medium">待保存状态：</span>
                            {getProgramStatusText(pendingStatusUpdates[currentProgram.id])}
                            <span className="ml-2 text-xs">（点击下方保存按钮确认更改）</span>
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
                  <span className="text-sm font-medium">快速切换节目</span>
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
                        className={getProgramStatusStyles(getProgramDisplayStatus(program.id), form.watch('currentProgramId') === program.id)}
                        title={`${program.name} - ${program.participants.map(p => p.name).join('、')} (${getProgramStatusText(getProgramDisplayStatus(program.id))})`}
                      >
                        <div className="flex flex-col items-center space-y-1 w-full">
                          <span className="text-lg font-bold">{program.order}</span>
                          <span className="text-xs truncate w-full">{program.name}</span>
                          <span className="text-xs opacity-80">
                            {getProgramStatusText(getProgramDisplayStatus(program.id))}
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

              {/* 批量状态控制 */}
              <div className="space-y-3">
                <div className="text-sm font-medium">批量状态控制</div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updates: Record<string, 'WAITING' | 'PERFORMING' | 'COMPLETED'> = {};
                      programs.forEach(program => {
                        updates[program.id] = 'WAITING';
                      });
                      setBatchPendingStatus(updates);
                    }}
                    disabled={saving}
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    全部设为等待中
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updates: Record<string, 'WAITING' | 'PERFORMING' | 'COMPLETED'> = {};
                      programs.forEach((program, index) => {
                        updates[program.id] = index === 0 ? 'PERFORMING' : 'WAITING';
                      });
                      setBatchPendingStatus(updates);
                    }}
                    disabled={saving}
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    重置为开始状态
                  </Button>
                  {hasUnsavedChanges && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPendingStatusUpdates({})}
                      disabled={saving}
                      className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      清除未保存更改
                    </Button>
                  )}
                </div>
              </div>

              {/* 未保存更改提示 */}
              {hasUnsavedChanges && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-amber-800">
                      您有 {Object.keys(pendingStatusUpdates).length} 个节目的状态更改尚未保存
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">
                    点击下方"保存节目设置"按钮来保存所有更改，或使用"清除未保存更改"来撤销。
                  </p>
                </div>
              )}

              <Button type="submit" disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : hasUnsavedChanges ? `保存节目设置 (${Object.keys(pendingStatusUpdates).length} 项更改)` : '保存节目设置'}
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