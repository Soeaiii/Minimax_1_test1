'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Trash2, Archive, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface Competition {
  id: string;
  name: string;
  description?: string;
  status: string;
  startTime: string;
  endTime: string;
  rankingUpdateMode: string;
  organizerId: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  programs: Array<{
    id: string;
    name: string;
  }>;
}

export default function CompetitionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // 获取比赛列表
  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/competitions');
      
      if (!response.ok) {
        throw new Error('获取比赛列表失败');
      }
      
      const data = await response.json();
      setCompetitions(data.competitions || []);
      setError(null);
    } catch (error) {
      console.error('获取比赛列表失败:', error);
      setError(error instanceof Error ? error.message : '获取比赛列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 检查用户权限
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login?callbackUrl=/dashboard/competitions');
      return;
    }

    fetchCompetitions();
  }, [session, status, router]);

  // 归档比赛
  const handleArchive = async (competition: Competition) => {
    try {
      setArchiving(true);
      const response = await fetch(`/api/competitions/${competition.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('归档比赛失败');
      }

      // 更新本地状态
      setCompetitions(prev => 
        prev.map(comp => 
          comp.id === competition.id 
            ? { ...comp, status: 'ARCHIVED' }
            : comp
        )
      );
      
      setArchiveDialogOpen(false);
      setSelectedCompetition(null);
    } catch (error) {
      console.error('归档比赛失败:', error);
      alert('归档比赛失败，请稍后重试');
    } finally {
      setArchiving(false);
    }
  };

  // 删除比赛
  const handleDelete = async (competition: Competition) => {
    try {
      setDeleting(true);
      
      const response = await fetch(`/api/competitions/${competition.id}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除比赛失败');
      }

      // 从列表中移除
      setCompetitions(prev => prev.filter(comp => comp.id !== competition.id));
      
      setDeleteDialogOpen(false);
      setSelectedCompetition(null);
    } catch (error) {
      console.error('删除比赛失败:', error);
      alert(error instanceof Error ? error.message : '删除比赛失败，请稍后重试');
    } finally {
      setDeleting(false);
    }
  };

  // 检查是否可以修改比赛
  const canModify = (competition: Competition) => {
    if (!session) return false;
    
    return (
      session.user.role === 'ADMIN' || 
      competition.organizerId === session.user.id
    );
  };

  // 过滤比赛
  const statusFilter = searchParams.get('status')?.toUpperCase();
  const filteredCompetitions = competitions.filter(comp => {
    const matchesStatus = !statusFilter || comp.status === statusFilter;
    const matchesSearch = !searchTerm || comp.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // 获取比赛状态标签
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDING: { label: '待开始', variant: 'secondary' },
      ACTIVE: { label: '进行中', variant: 'default' },
      FINISHED: { label: '已结束', variant: 'outline' },
      ARCHIVED: { label: '已归档', variant: 'destructive' },
    };
    
    const statusInfo = statusMap[status] || { label: '未知状态', variant: 'outline' };
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-destructive bg-destructive/10 p-6 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">加载失败</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchCompetitions}>重新加载</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">比赛管理</h1>
        <Button asChild>
          <Link href="/dashboard/competitions/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            创建比赛
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索比赛名称..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/competitions" className={!statusFilter ? "font-medium" : ""}>
            全部
          </Link>
          <Link href="/dashboard/competitions?status=pending" className={statusFilter === "PENDING" ? "font-medium" : ""}>
            待开始
          </Link>
          <Link href="/dashboard/competitions?status=active" className={statusFilter === "ACTIVE" ? "font-medium" : ""}>
            进行中
          </Link>
          <Link href="/dashboard/competitions?status=finished" className={statusFilter === "FINISHED" ? "font-medium" : ""}>
            已结束
          </Link>
          <Link href="/dashboard/competitions?status=archived" className={statusFilter === "ARCHIVED" ? "font-medium" : ""}>
            已归档
          </Link>
        </div>
      </div>
      
      {filteredCompetitions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? '没有找到匹配的比赛' : '当前没有比赛数据'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/dashboard/competitions/new">创建第一个比赛</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitions.map((competition) => (
            <Card key={competition.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{competition.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      组织者: {competition.organizer?.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(competition.status)}
                    {canModify(competition) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/competitions/${competition.id}/edit`}>
                              编辑比赛
                            </Link>
                          </DropdownMenuItem>
                          {competition.status !== 'ARCHIVED' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCompetition(competition);
                                setArchiveDialogOpen(true);
                              }}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              归档比赛
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCompetition(competition);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除比赛
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between">
                    <span>开始时间:</span>
                    <span>{format(new Date(competition.startTime), 'yyyy-MM-dd')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>结束时间:</span>
                    <span>{format(new Date(competition.endTime), 'yyyy-MM-dd')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>节目数量:</span>
                    <span>{competition.programs.length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span>排名更新:</span>
                    <span>{competition.rankingUpdateMode === 'REALTIME' ? '实时' : '批量'}</span>
                  </div>
                </div>
                <div className="mt-4 space-x-2 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/competitions/${competition.id}`}>查看详情</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 归档确认对话框 */}
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认归档比赛</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要归档比赛 "{selectedCompetition?.name}" 吗？
              <br />
              <br />
              归档后的比赛将不再显示在活跃比赛列表中，但数据会被保留。
              您可以随时在"已归档"标签中查看归档的比赛。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCompetition && handleArchive(selectedCompetition)}
              disabled={archiving}
            >
              {archiving ? '归档中...' : '确认归档'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除比赛</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除比赛 "{selectedCompetition?.name}" 吗？
              <br />
              <br />
              <strong className="text-red-600">
                ⚠️ 警告：此操作将永久删除比赛及其所有相关数据，包括：
              </strong>
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>所有节目和参赛者信息</li>
                <li>所有评分记录</li>
                <li>排名结果</li>
                <li>评分标准</li>
                <li>大屏幕设置</li>
              </ul>
              <br />
              <strong>此操作无法撤销！</strong>
              <br />
              <br />
              如果您只是想暂时隐藏比赛，建议使用"归档"功能。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCompetition && handleDelete(selectedCompetition)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? '删除中...' : '确认删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 