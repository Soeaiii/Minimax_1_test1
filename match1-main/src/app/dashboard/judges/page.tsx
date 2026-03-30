'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

interface Judge {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
  createdAt: string;
}

export default function JudgesPage() {
  const router = useRouter();
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [judgeToDelete, setJudgeToDelete] = useState<Judge | null>(null);
  const [deleteError, setDeleteError] = useState<{
    hasScores: boolean;
    scoresCount: number;
    canForceDelete: boolean;
  } | null>(null);

  useEffect(() => {
    fetchJudges();
  }, []);



  const fetchJudges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/users?role=JUDGE');
      if (!response.ok) {
        throw new Error('获取评委列表失败');
      }
      const data = await response.json();
      setJudges(data.users || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取评委列表失败';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 检查评委是否有评分记录
  const checkJudgeScores = async (judgeId: string) => {
    try {
      setDeletingId(judgeId);
      
      const response = await fetch(`/api/judges/${judgeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('未授权访问，请重新登录');
          router.push('/auth/login');
          return false;
        }
        
        if (data.hasScores && data.canForceDelete) {
          // 设置删除错误信息，显示强制删除选项
          setDeleteError({
            hasScores: data.hasScores,
            scoresCount: data.scoresCount,
            canForceDelete: data.canForceDelete,
          });
          return true; // 有评分记录
        } else {
          toast.error(data.error || '检查评委评分记录失败');
          return false;
        }
      }
      
      // 没有评分记录，可以直接删除
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '检查评委评分记录失败';
      toast.error(errorMessage);
      return false;
    } finally {
      setDeletingId(null);
    }
  };
  
  // 实际执行删除操作
  const performDelete = async (judgeId: string, judgeName: string, force: boolean) => {
    try {
      setDeletingId(judgeId);
      
      const url = `/api/judges/${judgeId}${force ? '?force=true' : ''}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '删除评委失败');
      }
      
      // 删除成功
      setJudges(judges.filter(judge => judge.id !== judgeId));
      toast.success(data.message || `评委 "${judgeName}" 已成功删除`);
      setDeleteDialogOpen(false);
      setJudgeToDelete(null);
      setDeleteError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除评委失败';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };
  
  // 处理删除按钮点击
  const handleDeleteJudge = async (judgeId: string, judgeName: string, force: boolean = false) => {
    if (force) {
      // 强制删除，直接执行
      await performDelete(judgeId, judgeName, true);
    } else {
      // 常规删除，先检查是否有评分记录
      const hasScores = await checkJudgeScores(judgeId);
      if (!hasScores) {
        // 没有评分记录，执行删除
        await performDelete(judgeId, judgeName, false);
      }
      // 如果有评分记录，checkJudgeScores已经设置了deleteError状态，会显示强制删除选项
    }
  };

  const openDeleteDialog = (judge: Judge) => {
    setJudgeToDelete(judge);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setJudgeToDelete(null);
    setDeleteError(null);
    setDeletingId(null);
  };

  const filteredJudges = judges.filter(
    judge =>
      judge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      judge.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <div className="text-lg">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">评委管理</h1>
          <p className="text-muted-foreground">
            管理比赛评委，创建和编辑评委信息
          </p>
        </div>
        <Link href="/dashboard/judges/new">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            创建评委
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive mb-6 flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="text-destructive hover:text-destructive/80"
          >
            ×
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>评委列表</CardTitle>
          <CardDescription>
            查看和管理所有评委用户
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索评委姓名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              onClick={fetchJudges}
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                '刷新'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredJudges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? '没有找到匹配的评委' : '还没有创建任何评委'}
              </p>
              {!searchTerm && (
                <Link href="/dashboard/judges/new" className="mt-4 inline-block">
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    创建第一个评委
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>评委信息</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>个人简介</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJudges.map((judge) => (
                  <TableRow key={judge.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={judge.avatar} 
                            alt={judge.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {judge.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{judge.name}</div>
                          <div className="text-sm text-muted-foreground">
                            评委 #{judge.id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {judge.email}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-muted-foreground">
                        {judge.bio || (
                          <span className="italic text-muted-foreground/70">未填写</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(judge.createdAt), 'PPP', { locale: zhCN })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        活跃
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/judges/${judge.id}/edit`)}
                          disabled={deletingId === judge.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(judge)}
                          disabled={deletingId === judge.id}
                        >
                          {deletingId === judge.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

            {/* 删除确认对话框 */}
      {deleteDialogOpen && judgeToDelete && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                确认删除评委
              </AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除评委 "{judgeToDelete.name}" ({judgeToDelete.email}) 吗？
                {!deleteError && (
                  <>
                    <br />
                    <span className="text-red-600 font-medium">
                      此操作无法撤销，如果该评委已有评分记录，将无法删除。
                    </span>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* 显示评分记录警告和强制删除选项 */}
            {deleteError && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex items-start">
                    <div className="text-yellow-600 mr-2 mt-0.5">⚠️</div>
                    <div>
                      <p className="text-yellow-800 font-medium">该评委有评分记录</p>
                      <p className="text-yellow-700 text-sm mt-1">
                        该评委已有 {deleteError.scoresCount} 条评分记录，常规删除无法进行。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-start">
                    <div className="text-red-600 mr-2 mt-0.5">🚨</div>
                    <div>
                      <p className="text-red-800 font-medium">强制删除选项</p>
                      <p className="text-red-700 text-sm mt-1">
                        您可以选择强制删除，这将同时删除该评委的所有评分记录。
                        <br />
                        <span className="font-medium">此操作不可逆转，请谨慎操作！</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  closeDeleteDialog();
                }}
                disabled={deletingId === judgeToDelete.id}
                className="mt-2 sm:mt-0"
              >
                取消
              </Button>
              
              {!deleteError ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteJudge(judgeToDelete.id, judgeToDelete.name, false);
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deletingId === judgeToDelete.id}
                >
                  {deletingId === judgeToDelete.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      删除中...
                    </>
                  ) : (
                    '确认删除'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteJudge(judgeToDelete.id, judgeToDelete.name, true);
                  }}
                  className="bg-red-600 text-white hover:bg-red-700"
                  disabled={deletingId === judgeToDelete.id}
                >
                  {deletingId === judgeToDelete.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      强制删除中...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      强制删除
                    </>
                  )}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
} 