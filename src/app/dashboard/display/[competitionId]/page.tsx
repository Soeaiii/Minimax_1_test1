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
} from 'lucide-react';
import Link from 'next/link';

interface Program {
  id: string;
  name: string;
  order: number;
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
  currentProgramId: string;
  backgroundImageId: string;
  showJudgeScores: boolean;
  showParticipants: boolean;
  showProgramInfo: boolean;
  title: string;
  subtitle: string;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: string;
  titleColor: string;
  subtitleColor: string;
  judgeNameColor: string;
  judgeScoreColor: string;
  averageScoreColor: string;
  programInfoColor: string;
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

  const form = useForm<FormValues>({
    defaultValues: {
      currentProgramId: 'none',
      backgroundImageId: '',
      showJudgeScores: true,
      showParticipants: true,
      showProgramInfo: true,
      title: '',
      subtitle: '',
      autoRefresh: true,
      refreshInterval: 5,
      theme: 'MODERN',
      titleColor: '#ffffff',
      subtitleColor: '#ffffff',
      judgeNameColor: '#1f2937',
      judgeScoreColor: '#1f2937',
      averageScoreColor: '#ffffff',
      programInfoColor: '#ffffff',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ORGANIZER') {
      router.push('/unauthorized');
      return;
    }

    if (status === 'authenticated') {
      fetchDisplayData();
    }
  }, [status, session, router, competitionId]);

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
        backgroundImageId: data.settings.backgroundImageId || '',
        showJudgeScores: data.settings.showJudgeScores,
        showParticipants: data.settings.showParticipants,
        showProgramInfo: data.settings.showProgramInfo,
        title: data.settings.title || '',
        subtitle: data.settings.subtitle || '',
        autoRefresh: data.settings.autoRefresh,
        refreshInterval: data.settings.refreshInterval,
        theme: data.settings.theme,
        titleColor: data.settings.titleColor || '#ffffff',
        subtitleColor: data.settings.subtitleColor || '#ffffff',
        judgeNameColor: data.settings.judgeNameColor || '#1f2937',
        judgeScoreColor: data.settings.judgeScoreColor || '#1f2937',
        averageScoreColor: data.settings.averageScoreColor || '#ffffff',
        programInfoColor: data.settings.programInfoColor || '#ffffff',
      });

      setError(null);
    } catch (error) {
      console.error('Error fetching display data:', error);
      setError(error instanceof Error ? error.message : '加载失败');
    } finally {
      setLoading(false);
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
      // 只获取图片文件
      const imageFiles = data.filter((file: FileItem) => 
        file.mimetype.startsWith('image/')
      );
      setFiles(imageFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError(error instanceof Error ? error.message : '获取文件列表失败');
    } finally {
      setLoadingFiles(false);
    }
  };

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

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'background');

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const result = await response.json();
      
      // 更新表单中的背景图片ID
      form.setValue('backgroundImageId', result.file.id);
      setSuccessMessage('背景图片上传成功！');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveBackground = () => {
    form.setValue('backgroundImageId', '');
  };

  const handleSelectFile = (file: FileItem) => {
    form.setValue('backgroundImageId', file.id);
    setFileDialogOpen(false);
    setSuccessMessage('背景图片选择成功！');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleOpenFileDialog = () => {
    setFileDialogOpen(true);
    fetchFiles();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载大屏幕设置...</p>
        </div>
      </div>
    );
  }

  if (error && !displayData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/dashboard/competitions">
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回
            </Link>
          </Button>
        </div>
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
      </div>
    );
  }

  if (!displayData) return null;

  const { settings, competition, programs } = displayData;
  const backgroundImageId = form.watch('backgroundImageId');
  const currentBackgroundImage = settings.backgroundImage;

  return (
    <div className="space-y-6">
      {/* 头部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href={`/dashboard/competitions/${competitionId}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回比赛详情
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Monitor className="h-8 w-8 mr-3" />
            大屏幕管理
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/display/${competitionId}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              预览大屏幕
            </Link>
          </Button>
        </div>
      </div>

      {/* 比赛信息 */}
      <Card>
        <CardHeader>
          <CardTitle>{competition.name}</CardTitle>
          <CardDescription>
            {competition.description}
          </CardDescription>
        </CardHeader>
      </Card>

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
        {/* 左侧：显示设置 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>显示设置</CardTitle>
              <CardDescription>
                配置大屏幕的显示内容和样式
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 当前节目选择 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">节目控制台</Label>
                    <Button
                      type="button"
                      onClick={() => form.handleSubmit(onSubmit)()}
                      disabled={saving}
                      size="sm"
                      className="h-8"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {saving ? '保存中...' : '保存切换'}
                    </Button>
                  </div>
                  
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
                    
                    {form.watch('currentProgramId') ? (
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
                        onClick={() => form.setValue('currentProgramId', '')}
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
                            variant={form.watch('currentProgramId') === program.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => form.setValue('currentProgramId', program.id)}
                            className="h-auto p-2 flex flex-col items-center"
                            title={`${program.name} - ${program.participants.map(p => p.name).join('、')}`}
                          >
                            <span className="text-lg font-bold">{program.order}</span>
                            <span className="text-xs truncate w-full">{program.name}</span>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50 text-center">
                        暂无节目，请先在比赛管理中添加节目
                      </div>
                    )}
                  </div>

                  {/* 快捷键提示 */}
                  <div className="text-xs text-muted-foreground bg-muted/30 rounded p-2">
                    💡 提示：切换节目后点击右上角的"保存切换"按钮立即生效
                  </div>
                </div>

                {/* 标题和副标题 */}
                <div className="space-y-2">
                  <Label htmlFor="title">大屏幕标题</Label>
                  <Input
                    id="title"
                    placeholder="自定义标题（留空使用比赛名称）"
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

                {/* 主题选择 */}
                <div className="space-y-2">
                  <Label htmlFor="theme">显示主题</Label>
                  <Select
                    value={form.watch('theme')}
                    onValueChange={(value) => form.setValue('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MODERN">现代</SelectItem>
                      <SelectItem value="CLASSIC">经典</SelectItem>
                      <SelectItem value="MINIMAL">简约</SelectItem>
                      <SelectItem value="ELEGANT">优雅</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 字体颜色设置 */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">字体颜色设置</Label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleColor">标题颜色</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="titleColor"
                          type="color"
                          className="w-12 h-8 rounded cursor-pointer"
                          {...form.register('titleColor')}
                        />
                        <Input
                          type="text"
                          placeholder="#ffffff"
                          className="flex-1"
                          {...form.register('titleColor')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitleColor">副标题颜色</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="subtitleColor"
                          type="color"
                          className="w-12 h-8 rounded cursor-pointer"
                          {...form.register('subtitleColor')}
                        />
                        <Input
                          type="text"
                          placeholder="#ffffff"
                          className="flex-1"
                          {...form.register('subtitleColor')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="judgeNameColor">评委姓名颜色</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="judgeNameColor"
                          type="color"
                          className="w-12 h-8 rounded cursor-pointer"
                          {...form.register('judgeNameColor')}
                        />
                        <Input
                          type="text"
                          placeholder="#1f2937"
                          className="flex-1"
                          {...form.register('judgeNameColor')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="judgeScoreColor">评委分数颜色</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="judgeScoreColor"
                          type="color"
                          className="w-12 h-8 rounded cursor-pointer"
                          {...form.register('judgeScoreColor')}
                        />
                        <Input
                          type="text"
                          placeholder="#1f2937"
                          className="flex-1"
                          {...form.register('judgeScoreColor')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="averageScoreColor">平均分颜色</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="averageScoreColor"
                          type="color"
                          className="w-12 h-8 rounded cursor-pointer"
                          {...form.register('averageScoreColor')}
                        />
                        <Input
                          type="text"
                          placeholder="#ffffff"
                          className="flex-1"
                          {...form.register('averageScoreColor')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="programInfoColor">节目信息颜色</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="programInfoColor"
                          type="color"
                          className="w-12 h-8 rounded cursor-pointer"
                          {...form.register('programInfoColor')}
                        />
                        <Input
                          type="text"
                          placeholder="#ffffff"
                          className="flex-1"
                          {...form.register('programInfoColor')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // 重置为默认颜色
                        form.setValue('titleColor', '#ffffff');
                        form.setValue('subtitleColor', '#ffffff');
                        form.setValue('judgeNameColor', '#1f2937');
                        form.setValue('judgeScoreColor', '#1f2937');
                        form.setValue('averageScoreColor', '#ffffff');
                        form.setValue('programInfoColor', '#ffffff');
                      }}
                    >
                      重置默认颜色
                    </Button>
                  </div>
                </div>

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

                <Button type="submit" disabled={saving} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? '保存中...' : '保存设置'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：背景管理 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>背景图片管理</CardTitle>
              <CardDescription>
                上传和管理大屏幕背景图片
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 当前背景图片 */}
              {currentBackgroundImage && (
                <div className="space-y-2">
                  <Label>当前背景图片</Label>
                  <div className="relative border rounded-lg overflow-hidden">
                    <img
                      src={currentBackgroundImage.path}
                      alt="背景图片"
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        console.error('背景图片加载失败:', currentBackgroundImage.filename);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('背景图片加载成功:', currentBackgroundImage.filename);
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveBackground}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {currentBackgroundImage.filename}
                    </div>
                  </div>
                </div>
              )}

              {/* 上传新背景 */}
              <div className="space-y-2">
                <Label htmlFor="background">背景图片管理</Label>
                <div className="grid grid-cols-1 gap-3">
                  {/* 上传新图片 */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <input
                      id="background"
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                    />
                    <Label
                      htmlFor="background"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      {uploading ? (
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">
                        {uploading ? '上传中...' : '上传新图片'}
                      </span>
                    </Label>
                  </div>
                  
                  {/* 从文件库选择 */}
                  <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full h-16 flex flex-col items-center justify-center space-y-1"
                        onClick={handleOpenFileDialog}
                      >
                        <FolderOpen className="h-6 w-6" />
                        <span className="text-sm">从文件库选择</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>选择背景图片</DialogTitle>
                        <DialogDescription>
                          从已上传的图片中选择一张作为背景
                        </DialogDescription>
                      </DialogHeader>
                      <div className="overflow-y-auto max-h-96">
                        {loadingFiles ? (
                          <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-8 w-8 animate-spin" />
                            <span className="ml-2">加载文件中...</span>
                          </div>
                        ) : files.length === 0 ? (
                          <div className="text-center py-8">
                            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">没有图片文件</h3>
                            <p className="text-muted-foreground">
                              请先上传一些图片文件
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {files.map((file) => (
                              <div
                                key={file.id}
                                className="group relative cursor-pointer rounded-lg border border-muted overflow-hidden hover:border-primary transition-colors"
                                onClick={() => handleSelectFile(file)}
                              >
                                <div className="aspect-square relative">
                                  <img
                                    src={file.path}
                                    alt={file.filename}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button size="sm" variant="secondary">
                                        选择
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <p className="text-xs text-muted-foreground truncate">
                                    {file.filename}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(1)} MB
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-xs text-muted-foreground">
                  支持 JPG、PNG 格式，最大 5MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 实时预览 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
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
      </div>
    </div>
  );
} 