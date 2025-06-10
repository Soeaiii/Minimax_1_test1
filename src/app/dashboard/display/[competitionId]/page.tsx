'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Monitor,
  Upload,
  Eye,
  Save,
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  FolderOpen,
  Grid,
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

interface Competition {
  id: string;
  name: string;
  description?: string;
  status: string;
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
  // 评委卡片大小设置
  judgeCardWidth?: number;
  judgeCardPadding?: number;
  judgeCardGap?: number;
  judgeAvatarSize?: number;
  judgeNameFontSize?: number;
  judgeScoreFontSize?: number;
  showBackgroundOverlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  backgroundImage?: {
    id: string;
    filename: string;
    path: string;
  };
}

interface DisplayData {
  settings: DisplaySettings;
  competition: Competition;
  programs: Program[];
}

interface FileItem {
  id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
}

type FormValues = {
  backgroundImageId: string;
  title: string;
  subtitle: string;
  theme: string;
  titleColor: string;
  subtitleColor: string;
  judgeNameColor: string;
  judgeScoreColor: string;
  averageScoreColor: string;
  programInfoColor: string;
  showJudgeScores: boolean;
  showParticipants: boolean;
  showProgramInfo: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  selectedJudgeIds: string[];
  // 评委卡片大小设置
  judgeCardWidth: number;
  judgeCardPadding: number;
  judgeCardGap: number;
  judgeAvatarSize: number;
  judgeNameFontSize: number;
  judgeScoreFontSize: number;
  showBackgroundOverlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
};

export default function DisplayManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const competitionId = params.competitionId as string;

  const [displayData, setDisplayData] = useState<DisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loadingJudges, setLoadingJudges] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      backgroundImageId: '',
      title: '',
      subtitle: '',
      theme: 'MODERN',
      titleColor: '#ffffff',
      subtitleColor: '#ffffff',
      judgeNameColor: '#1f2937',
      judgeScoreColor: '#1f2937',
      averageScoreColor: '#ffffff',
      programInfoColor: '#ffffff',
      showJudgeScores: true,
      showParticipants: true,
      showProgramInfo: true,
      autoRefresh: true,
      refreshInterval: 5,
      selectedJudgeIds: [],
      judgeCardWidth: 288,
      judgeCardPadding: 32,
      judgeCardGap: 40,
      judgeAvatarSize: 176,
      judgeNameFontSize: 20,
      judgeScoreFontSize: 36,
      showBackgroundOverlay: true,
      overlayColor: '#000000',
      overlayOpacity: 0.4,
    },
  });

  // 检查用户权限
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push(`/auth/login?callbackUrl=/dashboard/display/${competitionId}`);
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, router, competitionId]);

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
        backgroundImageId: data.settings.backgroundImageId || '',
        title: data.settings.title || '',
        subtitle: data.settings.subtitle || '',
        theme: data.settings.theme || 'MODERN',
        titleColor: data.settings.titleColor || '#ffffff',
        subtitleColor: data.settings.subtitleColor || '#ffffff',
        judgeNameColor: data.settings.judgeNameColor || '#1f2937',
        judgeScoreColor: data.settings.judgeScoreColor || '#1f2937',
        averageScoreColor: data.settings.averageScoreColor || '#ffffff',
        programInfoColor: data.settings.programInfoColor || '#ffffff',
        showJudgeScores: data.settings.showJudgeScores ?? true,
        showParticipants: data.settings.showParticipants ?? true,
        showProgramInfo: data.settings.showProgramInfo ?? true,
        autoRefresh: data.settings.autoRefresh ?? true,
        refreshInterval: data.settings.refreshInterval || 5,
        selectedJudgeIds: data.settings.selectedJudgeIds || [],
        judgeCardWidth: data.settings.judgeCardWidth || 288,
        judgeCardPadding: data.settings.judgeCardPadding || 32,
        judgeCardGap: data.settings.judgeCardGap || 40,
        judgeAvatarSize: data.settings.judgeAvatarSize || 176,
        judgeNameFontSize: data.settings.judgeNameFontSize || 20,
        judgeScoreFontSize: data.settings.judgeScoreFontSize || 36,
        showBackgroundOverlay: data.settings.showBackgroundOverlay ?? true,
        overlayColor: data.settings.overlayColor || '#000000',
        overlayOpacity: data.settings.overlayOpacity ?? 0.4,
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

  const fetchFiles = async () => {
    try {
      setLoadingFiles(true);
      const response = await fetch('/api/files');
      if (!response.ok) {
        throw new Error('获取文件列表失败');
      }
      const data = await response.json();
      // 过滤出图片文件
      const imageFiles = data.filter((file: FileItem) => file.mimetype.startsWith('image/'));
      setFiles(imageFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError(error instanceof Error ? error.message : '获取文件列表失败');
    } finally {
      setLoadingFiles(false);
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

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    // 检查文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过 10MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const result = await response.json();
      form.setValue('backgroundImageId', result.file.id);
      setSuccessMessage('背景图片上传成功！');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传失败');
    } finally {
      setUploading(false);
      // 重置文件输入
      event.target.value = '';
    }
  };

  const handleRemoveBackground = () => {
    form.setValue('backgroundImageId', '');
  };

  const handleSelectFile = (file: FileItem) => {
    form.setValue('backgroundImageId', file.id);
    setFileDialogOpen(false);
  };

  const handleOpenFileDialog = () => {
    fetchFiles();
    setFileDialogOpen(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  if (error && !displayData) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">加载失败</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDisplayData}>重新加载</Button>
        </div>
      </div>
    );
  }

  if (!displayData) return null;

  const { settings, competition, programs } = displayData;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/competitions/${competitionId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回比赛管理
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">大屏幕设置</h1>
            <p className="text-muted-foreground">{competition.name}</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/display/${competitionId}`} target="_blank">
            <ExternalLink className="h-4 w-4 mr-2" />
            预览大屏幕
          </Link>
        </Button>
      </div>

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

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 基本设置 */}
          <Card>
            <CardHeader>
              <CardTitle>基本设置</CardTitle>
              <CardDescription>配置大屏幕的基本显示信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  placeholder="比赛标题（留空使用比赛名称）"
                  {...form.register('title')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">副标题</Label>
                <Input
                  id="subtitle"
                  placeholder="副标题（可选）"
                  {...form.register('subtitle')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">主题</Label>
                <Select
                  value={form.watch('theme')}
                  onValueChange={(value) => form.setValue('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MODERN">现代风格</SelectItem>
                    <SelectItem value="CLASSIC">经典风格</SelectItem>
                    <SelectItem value="MINIMAL">简约风格</SelectItem>
                    <SelectItem value="ELEGANT">优雅风格</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 背景设置 */}
          <Card>
            <CardHeader>
              <CardTitle>背景设置</CardTitle>
              <CardDescription>设置大屏幕的背景图片和遮罩</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 当前背景预览 */}
              {form.watch('backgroundImageId') && (
                <div className="space-y-2">
                  <Label>当前背景</Label>
                  <div className="relative">
                    <img
                      src={`/api/files/${form.watch('backgroundImageId')}/preview`}
                      alt="背景预览"
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveBackground}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* 背景上传 */}
              <div className="space-y-2">
                <Label>背景图片</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      disabled={uploading}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOpenFileDialog}
                    disabled={uploading}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    选择已有
                  </Button>
                </div>
                {uploading && (
                  <p className="text-sm text-muted-foreground">上传中...</p>
                )}
              </div>

              {/* 遮罩设置 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showBackgroundOverlay">启用背景遮罩</Label>
                  <Switch
                    id="showBackgroundOverlay"
                    checked={form.watch('showBackgroundOverlay')}
                    onCheckedChange={(checked) => form.setValue('showBackgroundOverlay', checked)}
                  />
                </div>

                {form.watch('showBackgroundOverlay') && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="overlayColor">遮罩颜色</Label>
                      <Input
                        id="overlayColor"
                        type="color"
                        {...form.register('overlayColor')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overlayOpacity">遮罩透明度</Label>
                      <Input
                        id="overlayOpacity"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        {...form.register('overlayOpacity', { valueAsNumber: true })}
                      />
                      <p className="text-sm text-muted-foreground">
                        当前值: {form.watch('overlayOpacity')}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 颜色设置 */}
        <Card>
          <CardHeader>
            <CardTitle>颜色设置</CardTitle>
            <CardDescription>自定义各个元素的颜色</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titleColor">标题颜色</Label>
                <Input
                  id="titleColor"
                  type="color"
                  {...form.register('titleColor')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitleColor">副标题颜色</Label>
                <Input
                  id="subtitleColor"
                  type="color"
                  {...form.register('subtitleColor')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="judgeNameColor">评委姓名颜色</Label>
                <Input
                  id="judgeNameColor"
                  type="color"
                  {...form.register('judgeNameColor')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="judgeScoreColor">评委分数颜色</Label>
                <Input
                  id="judgeScoreColor"
                  type="color"
                  {...form.register('judgeScoreColor')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageScoreColor">平均分颜色</Label>
                <Input
                  id="averageScoreColor"
                  type="color"
                  {...form.register('averageScoreColor')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programInfoColor">节目信息颜色</Label>
                <Input
                  id="programInfoColor"
                  type="color"
                  {...form.register('programInfoColor')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 评委管理 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              评委管理
            </CardTitle>
            <CardDescription>
              选择在大屏幕上显示的评委和其他显示选项
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 显示开关 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showJudgeScores">显示裁判评分</Label>
                <Switch
                  id="showJudgeScores"
                  checked={form.watch('showJudgeScores')}
                  onCheckedChange={(checked) => form.setValue('showJudgeScores', checked)}
                />
              </div>

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

            {/* 评委选择 */}
            {form.watch('showJudgeScores') && (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">评委选择</Label>
                    <p className="text-xs text-muted-foreground mt-1">选择要在大屏幕上显示评分的评委</p>
                  </div>
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
                        className="flex-1"
                      >
                        <Users className="h-4 w-4 mr-1" />
                        全选
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue('selectedJudgeIds', [])}
                        disabled={form.watch('selectedJudgeIds').length === 0}
                        className="flex-1"
                      >
                        全不选
                      </Button>
                    </div>

                    {/* 评委列表 */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {judges.map((judge) => (
                        <div key={judge.id} className="flex items-center space-x-3 p-3 rounded hover:bg-muted/50 border border-transparent hover:border-border">
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
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {judge.name.charAt(0)}
                          </div>
                          <label 
                            htmlFor={`judge-${judge.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="text-sm font-medium">
                              {judge.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {judge.email}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* 选择提示 */}
                    {form.watch('selectedJudgeIds').length === 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex items-center">
                          <div className="text-yellow-600 mr-2">⚠️</div>
                          <p className="text-yellow-800 text-sm">
                            未选择任何评委，大屏幕将不显示评分数据
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* 选择统计 */}
                    {form.watch('selectedJudgeIds').length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center">
                          <div className="text-green-600 mr-2">✓</div>
                          <p className="text-green-800 text-sm">
                            已选择 {form.watch('selectedJudgeIds').length} 位评委，大屏幕将显示他们的评分数据
                          </p>
                        </div>
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
          </CardContent>
        </Card>

        {/* 评委卡片设置 */}
        <Card>
          <CardHeader>
            <CardTitle>评委卡片设置</CardTitle>
            <CardDescription>调整评委卡片的大小和间距</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="judgeCardWidth">卡片宽度 (px)</Label>
                <Input
                  id="judgeCardWidth"
                  type="number"
                  min="200"
                  max="600"
                  {...form.register('judgeCardWidth', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="judgeCardPadding">卡片内边距 (px)</Label>
                <Input
                  id="judgeCardPadding"
                  type="number"
                  min="16"
                  max="100"
                  {...form.register('judgeCardPadding', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="judgeCardGap">卡片间距 (px)</Label>
                <Input
                  id="judgeCardGap"
                  type="number"
                  min="20"
                  max="150"
                  {...form.register('judgeCardGap', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="judgeAvatarSize">头像大小 (px)</Label>
                <Input
                  id="judgeAvatarSize"
                  type="number"
                  min="100"
                  max="400"
                  {...form.register('judgeAvatarSize', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="judgeNameFontSize">姓名字体大小 (px)</Label>
                <Input
                  id="judgeNameFontSize"
                  type="number"
                  min="14"
                  max="50"
                  {...form.register('judgeNameFontSize', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="judgeScoreFontSize">分数字体大小 (px)</Label>
                <Input
                  id="judgeScoreFontSize"
                  type="number"
                  min="24"
                  max="150"
                  {...form.register('judgeScoreFontSize', { valueAsNumber: true })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </form>

      {/* 文件选择对话框 */}
      <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>选择背景图片</DialogTitle>
            <DialogDescription>
              从已上传的图片中选择一张作为背景
            </DialogDescription>
          </DialogHeader>
          
          {loadingFiles ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">加载文件列表...</span>
            </div>
          ) : files.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border rounded-lg p-2 hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => handleSelectFile(file)}
                >
                  <img
                    src={`/api/files/${file.id}/preview`}
                    alt={file.filename}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <p className="text-sm font-medium truncate">{file.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">暂无图片文件</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 