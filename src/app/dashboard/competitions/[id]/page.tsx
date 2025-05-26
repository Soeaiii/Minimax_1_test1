'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Edit, Archive, Monitor, Trash2 } from "lucide-react";
import { CompetitionDetail } from "@/components/dashboard/competitions/CompetitionDetail";
import { CompetitionTabs } from "@/components/dashboard/competitions/CompetitionTabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Competition {
  id: string;
  name: string;
  description?: string;
  status: string;
  organizerId: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  programs: Array<{
    id: string;
    name: string;
    order: number;
    currentStatus: string;
    participants: Array<{
      id: string;
      name: string;
      team?: string;
      bio?: string;
    }>;
  }>;
  scoringCriteria: Array<{
    id: string;
    name: string;
    weight: number;
    maxScore: number;
  }>;
  rankings: Array<{
    id: string;
    rank: number;
    totalScore: number;
    program: {
      id: string;
      name: string;
    };
  }>;
}

export default function CompetitionDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // 获取比赛详情
  const fetchCompetition = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/competitions/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('比赛不存在');
        } else if (response.status === 403) {
          throw new Error('您没有权限查看此比赛');
        } else if (response.status === 401) {
          throw new Error('请先登录');
        } else {
          throw new Error('获取比赛详情失败');
        }
      }
      
      const data = await response.json();
      setCompetition(data);
      setError(null);
    } catch (error) {
      console.error('获取比赛详情失败:', error);
      setError(error instanceof Error ? error.message : '获取比赛详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 检查用户权限
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push(`/auth/login?callbackUrl=/dashboard/competitions/${id}`);
      return;
    }

    fetchCompetition();
  }, [session, status, id, router]);

  // 归档比赛
  const handleArchive = async () => {
    if (!competition) return;
    
    try {
      setArchiving(true);
      const response = await fetch(`/api/competitions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('归档比赛失败');
      }

      // 更新本地状态
      setCompetition(prev => prev ? { ...prev, status: 'ARCHIVED' } : null);
      
      // 可选：显示成功消息
      alert('比赛已成功归档');
    } catch (error) {
      console.error('归档比赛失败:', error);
      alert('归档比赛失败，请稍后重试');
    } finally {
      setArchiving(false);
    }
  };

  // 真正删除比赛
  const handleDelete = async () => {
    if (!competition) return;
    
    try {
      setDeleting(true);
      
      // 创建一个真正删除的API端点
      const response = await fetch(`/api/competitions/${id}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除比赛失败');
      }

      // 删除成功，跳转到比赛列表
      router.push('/dashboard/competitions');
    } catch (error) {
      console.error('删除比赛失败:', error);
      alert(error instanceof Error ? error.message : '删除比赛失败，请稍后重试');
    } finally {
      setDeleting(false);
    }
  };

  // 检查用户权限
  const hasPermission = (competition: Competition) => {
    if (!session) return false;
    
    return (
      session.user.role === 'ADMIN' || 
      competition.organizerId === session.user.id ||
      session.user.role === 'JUDGE' ||
      ['ACTIVE', 'FINISHED'].includes(competition.status)
    );
  };

  // 检查是否可以删除/归档
  const canModify = (competition: Competition) => {
    if (!session) return false;
    
    return (
      session.user.role === 'ADMIN' || 
      competition.organizerId === session.user.id
    );
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
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" asChild className="self-start">
            <Link href="/dashboard/competitions">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Link>
          </Button>
          <div className="rounded-md border border-destructive bg-destructive/10 p-6 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">
              {error === '比赛不存在' ? '比赛不存在' : 
               error === '您没有权限查看此比赛' ? '访问被拒绝' : 
               '获取比赛详情失败'}
            </h1>
            <p>{error}</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/competitions">返回比赛列表</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" asChild className="self-start">
            <Link href="/dashboard/competitions">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Link>
          </Button>
          <div className="rounded-md border border-destructive bg-destructive/10 p-6 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">比赛不存在</h1>
            <p>无法找到指定的比赛。</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/competitions">返回比赛列表</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasPermission(competition)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" asChild className="self-start">
            <Link href="/dashboard/competitions">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Link>
          </Button>
          <div className="rounded-md border border-destructive bg-destructive/10 p-6 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">访问被拒绝</h1>
            <p>您没有权限查看此比赛。</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/competitions">返回比赛列表</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/dashboard/competitions">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{competition.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/display/${id}`}>
              <Monitor className="h-4 w-4 mr-2" />
              大屏幕管理
            </Link>
          </Button>
          
          {canModify(competition) && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/competitions/${id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </Link>
              </Button>
              
              {competition.status !== 'ARCHIVED' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleArchive}
                  disabled={archiving}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {archiving ? '归档中...' : '归档'}
                </Button>
              )}
              
              {/* 删除确认对话框 */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除比赛</AlertDialogTitle>
                    <AlertDialogDescription>
                      您确定要删除比赛 "{competition.name}" 吗？
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
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleting ? '删除中...' : '确认删除'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <CompetitionDetail competition={competition} />
      
      {/* 使用客户端组件处理所有Tab内容 */}
      <CompetitionTabs competition={competition} competitionId={id} />
    </div>
  );
} 