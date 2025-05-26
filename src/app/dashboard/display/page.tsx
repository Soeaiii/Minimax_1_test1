'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Monitor,
  Search,
  Eye,
  Settings,
  Calendar,
  User,
  ExternalLink,
  Maximize2,
} from 'lucide-react';

interface Competition {
  id: string;
  name: string;
  description?: string;
  status: 'PENDING' | 'ACTIVE' | 'FINISHED' | 'ARCHIVED';
  startTime: string;
  endTime: string;
  organizer: {
    id: string;
    name: string;
  };
  programs: Array<{
    id: string;
    name: string;
  }>;
}

const statusMap = {
  PENDING: { label: '待开始', className: 'bg-yellow-100 text-yellow-800' },
  ACTIVE: { label: '进行中', className: 'bg-green-100 text-green-800' },
  FINISHED: { label: '已结束', className: 'bg-blue-100 text-blue-800' },
  ARCHIVED: { label: '已归档', className: 'bg-gray-100 text-gray-800' },
};

export default function DisplayManagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      fetchCompetitions();
    }
  }, [status, session, router]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/competitions');
      if (!response.ok) {
        throw new Error('获取比赛列表失败');
      }
      const data = await response.json();
      setCompetitions(data.competitions || data);
      setError(null);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      setError(error instanceof Error ? error.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompetitions = competitions.filter(competition =>
    competition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competition.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载比赛列表...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Monitor className="h-8 w-8 mr-3" />
            大屏幕管理
          </h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">加载失败</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchCompetitions}>重新加载</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <Monitor className="h-8 w-8 mr-3" />
          大屏幕管理
        </h1>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{competitions.length}</div>
              <p className="text-xs text-muted-foreground">总比赛数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {competitions.filter(c => c.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-muted-foreground">进行中</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {competitions.filter(c => c.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">待开始</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {competitions.filter(c => c.status === 'FINISHED').length}
              </div>
              <p className="text-xs text-muted-foreground">已结束</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索框 */}
      <Card>
        <CardHeader>
          <CardTitle>选择比赛</CardTitle>
          <CardDescription>
            选择需要管理大屏幕显示的比赛
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索比赛名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-blue-600" />
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <Settings className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">管理设置</p>
                <p className="text-blue-700">配置大屏幕显示内容、主题和背景</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Eye className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">预览模式</p>
                <p className="text-blue-700">在新窗口中查看大屏幕效果</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Maximize2 className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">全屏显示</p>
                <p className="text-blue-700">适合投影仪或大屏幕设备使用</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 快速操作 */}
      {competitions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">快速操作</CardTitle>
            <CardDescription>
              对多个比赛进行批量操作
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const activeCompetitions = competitions.filter(c => c.status === 'ACTIVE');
                  if (activeCompetitions.length === 0) {
                    alert('没有正在进行的比赛');
                    return;
                  }
                  activeCompetitions.forEach((comp, index) => {
                    setTimeout(() => {
                      window.open(`/display/${comp.id}`, `display-${comp.id}`, 'fullscreen=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no');
                    }, index * 500); // 延迟500ms避免浏览器阻止弹窗
                  });
                }}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                打开所有进行中的比赛大屏幕
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (competitions.length === 0) return;
                  const urls = competitions.map(c => `/dashboard/display/${c.id}`).join('\n');
                  navigator.clipboard.writeText(urls).then(() => {
                    alert('管理链接已复制到剪贴板');
                  });
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                复制所有管理链接
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (competitions.length === 0) return;
                  const urls = competitions.map(c => `${window.location.origin}/display/${c.id}`).join('\n');
                  navigator.clipboard.writeText(urls).then(() => {
                    alert('大屏幕链接已复制到剪贴板');
                  });
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                复制所有大屏幕链接
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 比赛列表 */}
      {filteredCompetitions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Monitor className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">暂无比赛</h2>
              <p className="text-muted-foreground">
                {searchTerm ? '没有找到匹配的比赛' : '还没有创建任何比赛'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitions.map((competition) => (
            <Card key={competition.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{competition.name}</CardTitle>
                    <CardDescription>
                      {competition.description || '暂无描述'}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={statusMap[competition.status].className}
                  >
                    {statusMap[competition.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    组织者：{competition.organizer.name}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(competition.startTime).toLocaleDateString()} - {new Date(competition.endTime).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Monitor className="h-4 w-4 mr-2" />
                    {competition.programs.length} 个节目
                  </div>
                  
                  {/* 状态提示 */}
                  {competition.status === 'ACTIVE' && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-2">
                      <p className="text-xs text-green-700 flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        比赛进行中，大屏幕可实时显示
                      </p>
                    </div>
                  )}
                  
                  {competition.status === 'PENDING' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                      <p className="text-xs text-yellow-700">
                        比赛尚未开始，可提前配置大屏幕设置
                      </p>
                    </div>
                  )}
                  
                  {competition.status === 'FINISHED' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                      <p className="text-xs text-blue-700">
                        比赛已结束，可查看最终结果展示
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/dashboard/display/${competition.id}`}>
                        <Settings className="h-4 w-4 mr-2" />
                        管理设置
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/display/${competition.id}`} target="_blank">
                        <Eye className="h-4 w-4 mr-2" />
                        预览
                      </Link>
                    </Button>
                  </div>
                  
                  {/* 快速打开选项 */}
                  <div className="flex gap-2 pt-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => {
                        const url = `/display/${competition.id}`;
                        window.open(url, '_blank', 'fullscreen=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no');
                      }}
                    >
                      <Maximize2 className="h-3 w-3 mr-1" />
                      全屏打开
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="text-xs">
                      <Link href={`/display/${competition.id}`} target="_blank">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        新窗口
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 