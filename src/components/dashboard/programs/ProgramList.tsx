'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { ListMusic, Edit, Trash2, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ProgramStatus } from "@/lib/types";
import { DeleteProgramButton } from "./delete-program-button";
import { toast } from "sonner";
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 定义节目对象类型
interface Program {
  id: string;
  name: string;
  description: string | null;
  order: number;
  currentStatus: ProgramStatus;
  competitionId: string;
  createdAt: string;
  updatedAt: string;
  competition: {
    id: string;
    name: string;
    status: string;
  };
  participantPrograms: {
    participant: {
      id: string;
      name: string;
      team: string | null;
    };
  }[];
  scores?: any[];
  id: string;
  name: string;
  description: string | null;
  order: number;
  currentStatus: ProgramStatus;
  competitionId: string;
  createdAt: string;
  updatedAt: string;
  competition: {
    id: string;
    name: string;
    status: string;
  };
  participants: any[];
  scores?: any[];
}

// 获取节目状态显示标签样式
const getStatusVariant = (status: ProgramStatus) => {
  switch (status) {
    case 'WAITING':
      return 'secondary';
    case 'PERFORMING':
      return 'default';
    case 'COMPLETED':
      return 'outline';
    default:
      return 'secondary';
  }
};

// 获取节目状态中文名称
const getStatusName = (status: ProgramStatus) => {
  switch (status) {
    case 'WAITING':
      return '等待中';
    case 'PERFORMING':
      return '进行中';
    case 'COMPLETED':
      return '已完成';
    default:
      return '未知状态';
  }
};

interface ProgramListProps {
  searchQuery?: string;
  competitionId?: string;
  status?: ProgramStatus;
}

export function ProgramList({ searchQuery = '', competitionId, status }: ProgramListProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deleteAllError, setDeleteAllError] = useState<{
    programsWithScoresCount: number;
    totalProgramsCount: number;
    canSkipWithScores: boolean;
    canForceDelete: boolean;
  } | null>(null);

  // 获取节目列表
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 构建查询参数
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (competitionId) params.append('competitionId', competitionId);
      if (status) params.append('status', status);
      
      const queryString = params.toString();
      const url = `/api/programs${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('获取节目列表失败');
      }
      
      const data = await response.json();
      setPrograms(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      const errorMessage = err instanceof Error ? err.message : '获取节目列表失败，请稍后重试';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // 更新节目状态
  const updateProgramStatus = async (id: string, newStatus: ProgramStatus) => {
    try {
      const response = await fetch(`/api/programs/${id}/simple-update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentStatus: newStatus
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新节目状态失败');
      }
      
      toast.success('节目状态更新成功');
      // 重新获取节目列表
      fetchPrograms();
    } catch (err) {
      console.error('Error updating program status:', err);
      const errorMessage = err instanceof Error ? err.message : '更新节目状态失败，请稍后重试';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // 打开删除所有节目对话框
  const openDeleteAllDialog = () => {
    setDeleteAllDialogOpen(true);
    setDeleteAllError(null);
  };
  
  // 关闭删除所有节目对话框
  const closeDeleteAllDialog = () => {
    setDeleteAllDialogOpen(false);
    setDeleteAllError(null);
    setDeletingAll(false);
  };
  
  // 删除所有节目
  const handleDeleteAllPrograms = async (options: { skipWithScores?: boolean, force?: boolean } = {}) => {
    try {
      setDeletingAll(true);
      setError(null);
      
      // 构建URL和查询参数
      let url = '/api/programs/delete-all';
      const params = new URLSearchParams();
      
      if (options.skipWithScores) {
        params.append('skipWithScores', 'true');
      }
      
      if (options.force) {
        params.append('force', 'true');
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.canSkipWithScores || data.canForceDelete) {
          // 设置错误状态，显示额外选项
          setDeleteAllError({
            programsWithScoresCount: data.programsWithScoresCount,
            totalProgramsCount: data.totalProgramsCount,
            canSkipWithScores: data.canSkipWithScores,
            canForceDelete: data.canForceDelete,
          });
          return; // 不关闭对话框，让用户选择下一步操作
        } else {
          throw new Error(data.error || '删除所有节目失败');
        }
      }

      // 删除成功
      toast.success(data.message);
      closeDeleteAllDialog();
      // 重新获取节目列表
      fetchPrograms();
    } catch (err) {
      console.error('Error deleting all programs:', err);
      const errorMessage = err instanceof Error ? err.message : '删除所有节目失败';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDeletingAll(false);
    }
  };
  
  // 首次加载时获取数据，当筛选条件变化时重新获取
  useEffect(() => {
    fetchPrograms();
  }, [searchQuery, competitionId, status]);
  
  // 显示加载状态
  if (loading && programs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-muted-foreground">加载节目数据中...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // 显示错误信息
  if (error && programs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={fetchPrograms}>
              重试
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // 没有数据
  if (programs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              暂无节目数据，请点击"创建节目"按钮添加
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // 渲染节目列表
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>节目列表</CardTitle>
            <CardDescription>
              {competitionId && competitionId !== 'ALL' ? (
                <>共 {programs.length} 个节目 (已按比赛筛选)</>
              ) : (
                <>共 {programs.length} 个节目</>
              )}
            </CardDescription>
          </div>
          {programs.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              disabled={deletingAll}
              onClick={openDeleteAllDialog}
            >
              {deletingAll ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  删除中...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除所有节目
                </>
              )}
            </Button>
          )}
          
          {/* 删除所有节目对话框 */}
          {deleteAllDialogOpen && (
            <AlertDialog open={deleteAllDialogOpen} onOpenChange={closeDeleteAllDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                    确认删除所有节目
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    您确定要删除{competitionId && competitionId !== 'ALL' ? '当前筛选的' : '所有'} {programs.length} 个节目吗？
                    {!deleteAllError && (
                      <>
                        <br />
                        <span className="text-red-600 font-medium">
                          此操作无法撤销，如果节目已有评分记录，将无法删除。
                        </span>
                      </>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                {/* 显示评分记录警告和额外选项 */}
                {deleteAllError && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex items-start">
                        <div className="text-yellow-600 mr-2 mt-0.5">⚠️</div>
                        <div>
                          <p className="text-yellow-800 font-medium">部分节目有评分记录</p>
                          <p className="text-yellow-700 text-sm mt-1">
                            共有 {deleteAllError.programsWithScoresCount} 个节目包含评分记录，常规删除无法进行。
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteAllPrograms({ skipWithScores: true })}
                        disabled={deletingAll}
                      >
                        {deletingAll ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            处理中...
                          </>
                        ) : (
                          '仅删除没有评分记录的节目'
                        )}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteAllPrograms({ force: true })}
                        disabled={deletingAll}
                      >
                        {deletingAll ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            处理中...
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            强制删除所有节目（包括评分记录）
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                
                <AlertDialogFooter>
                  <Button
                    variant="outline"
                    onClick={closeDeleteAllDialog}
                    disabled={deletingAll}
                    className="mt-2 sm:mt-0"
                  >
                    取消
                  </Button>
                  
                  {!deleteAllError && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteAllPrograms()}
                      disabled={deletingAll}
                    >
                      {deletingAll ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          删除中...
                        </>
                      ) : (
                        '确认删除所有'
                      )}
                    </Button>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        {error && (
          <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive flex items-center justify-between">
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>节目信息</TableHead>
              <TableHead>比赛</TableHead>
              <TableHead>参与者</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{program.name}</div>
                    <div className="text-sm text-muted-foreground">
                      顺序: {program.order}
                    </div>
                    {program.description && (
                      <div className="text-sm text-muted-foreground mt-1 max-w-xs truncate">
                        {program.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm font-medium">
                      {program.competition.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {program.competition.status === 'ACTIVE' && '进行中'}
                      {program.competition.status === 'PENDING' && '待开始'}
                      {program.competition.status === 'FINISHED' && '已结束'}
                      {program.competition.status === 'ARCHIVED' && '已归档'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ListMusic className="h-4 w-4 mr-1" />
                    {program.participants.length} 名选手
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(program.currentStatus)}>
                    {getStatusName(program.currentStatus)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(program.createdAt), 'PPP', { locale: zhCN })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/programs/${program.id}`}>
                        详情
                      </Link>
                    </Button>
                    
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/programs/${program.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    
                    {program.currentStatus === 'WAITING' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => updateProgramStatus(program.id, 'PERFORMING')}
                      >
                        开始
                      </Button>
                    )}
                    
                    {program.currentStatus === 'PERFORMING' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => updateProgramStatus(program.id, 'COMPLETED')}
                      >
                        完成
                      </Button>
                    )}
                    
                    {program.currentStatus === 'COMPLETED' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => updateProgramStatus(program.id, 'WAITING')}
                      >
                        重置
                      </Button>
                    )}
                    
                    <DeleteProgramButton
                      programId={program.id}
                      programName={program.name}
                      hasScores={(program.scores?.length || 0) > 0}
                      competitionStatus={program.competition.status}
                      onSuccess={fetchPrograms}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 