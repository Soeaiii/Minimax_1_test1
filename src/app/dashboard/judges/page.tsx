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
import { UserPlus, Search, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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

  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users?role=JUDGE');
      if (!response.ok) {
        throw new Error('获取评委列表失败');
      }
      const data = await response.json();
      setJudges(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取评委列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJudge = async (judgeId: string) => {
    try {
      setDeletingId(judgeId);
      const response = await fetch(`/api/judges/${judgeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除评委失败');
      }

      // 从列表中移除已删除的评委
      setJudges(judges.filter(judge => judge.id !== judgeId));
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '删除评委失败');
    } finally {
      setDeletingId(null);
    }
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
          <div className="text-lg">加载中...</div>
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
        <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive mb-6">
          {error}
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
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={deletingId === judge.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除评委</AlertDialogTitle>
                              <AlertDialogDescription>
                                您确定要删除评委 "{judge.name}" 吗？
                                <br />
                                <span className="text-red-600 font-medium">
                                  此操作无法撤销，如果该评委已有评分记录，将无法删除。
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteJudge(judge.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={deletingId === judge.id}
                              >
                                {deletingId === judge.id ? '删除中...' : '确认删除'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 