'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Star, TrendingUp, MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ScoreEditDialog } from './ScoreEditDialog';
import { useSession } from 'next-auth/react';

interface Score {
  id: string;
  value: number;
  comment?: string | null;
  judgeId: string;
  scoringCriteria: {
    id: string;
    name: string;
    weight: number;
    maxScore: number;
  };
  createdAt: string | Date;
}

interface Judge {
  id: string;
  name: string;
  email: string;
}

interface ScoringCriteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
}

interface ScoreDisplayProps {
  scores: Score[];
  programId: string;
  judges: Judge[];
  criteria: ScoringCriteria[];
  canEdit?: boolean;
  onScoresUpdated: () => void;
}

export function ScoreDisplay({ scores, programId, judges, criteria, canEdit = false, onScoresUpdated }: ScoreDisplayProps) {
  const { data: session } = useSession();
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deletingScore, setDeletingScore] = useState<Score | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 删除评分
  const handleDeleteScore = async (score: Score) => {
    try {
      const response = await fetch(`/api/programs/${programId}/scores?scoreId=${score.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('评分删除成功');
        onScoresUpdated();
      } else {
        const error = await response.json();
        toast.error(error.error || '删除失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setShowDeleteDialog(false);
      setDeletingScore(null);
    }
  };

  // 获取评委名称
  const getJudgeName = (judgeId: string) => {
    const judge = judges.find(j => j.id === judgeId);
    return judge ? judge.name : `评委 ${judgeId.slice(-4)}`;
  };

  // 按评分标准分组
  const scoresByCriteria = scores.reduce((acc, score) => {
    const criteriaId = score.scoringCriteria.id;
    if (!acc[criteriaId]) {
      acc[criteriaId] = [];
    }
    acc[criteriaId].push(score);
    return acc;
  }, {} as Record<string, Score[]>);

  // 计算统计数据
  const getStatistics = (criteriaScores: Score[]) => {
    const values = criteriaScores.map(s => s.value);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    return { average, maxValue, minValue, count: values.length };
  };

  // 计算总加权分数
  const totalWeightedScore = Object.values(scoresByCriteria).reduce((total, criteriaScores) => {
    const stats = getStatistics(criteriaScores);
    const criteria = criteriaScores[0].scoringCriteria;
    return total + (stats.average * criteria.weight);
  }, 0);

  return (
    <div className="space-y-6">
      {/* 总分显示 - 始终显示 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">总加权分数</h3>
                <p className="text-sm text-muted-foreground">
                  {scores.length > 0 ? '基于所有评分标准的加权平均分' : '暂无评分数据'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {scores.length > 0 ? totalWeightedScore.toFixed(2) : '0.00'}
                </div>
                <div className="text-sm text-muted-foreground">分</div>
              </div>
              {canEdit && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingScore(null);
                    setShowEditDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加评分
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 如果没有评分，显示提示信息 */}
      {scores.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">暂无评分数据</p>
            <p className="text-sm text-muted-foreground mb-4">
              评委尚未对此节目进行评分
            </p>
            {canEdit && (
              <Button 
                onClick={() => {
                  setEditingScore(null);
                  setShowEditDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                开始评分
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        /* 各评分标准详情 */
        <div className="grid gap-4">
          {Object.entries(scoresByCriteria).map(([criteriaId, criteriaScores]) => {
            const criteriaInfo = criteriaScores[0].scoringCriteria;
            const stats = getStatistics(criteriaScores);

            return (
              <Card key={criteriaId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{criteriaInfo.name}</CardTitle>
                      <CardDescription>
                        权重: {criteriaInfo.weight} • 满分: {criteriaInfo.maxScore} • 
                        {stats.count} 位评委评分
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      平均: {stats.average.toFixed(2)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 统计信息 */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-green-600">{stats.maxValue}</div>
                      <div className="text-muted-foreground">最高分</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{stats.average.toFixed(2)}</div>
                      <div className="text-muted-foreground">平均分</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-orange-600">{stats.minValue}</div>
                      <div className="text-muted-foreground">最低分</div>
                    </div>
                  </div>

                  {/* 各评委评分详情 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">评委评分详情</h4>
                    <div className="grid gap-2">
                      {criteriaScores.map((score) => (
                        <div key={score.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{getJudgeName(score.judgeId)}</span>
                              <Badge variant="default">
                                {score.value}
                              </Badge>
                            </div>
                            {score.comment && (
                              <p className="text-xs text-muted-foreground">
                                "{score.comment}"
                              </p>
                            )}
                          </div>
                          {canEdit && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingScore(score);
                                    setShowEditDialog(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  编辑评分
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setDeletingScore(score);
                                    setShowDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  删除评分
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 评分编辑对话框 */}
      <ScoreEditDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        programId={programId}
        score={editingScore}
        onScoreUpdated={() => {
          onScoresUpdated();
          setEditingScore(null);
        }}
        judges={judges}
        criteria={criteria}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除评分</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除 {deletingScore && getJudgeName(deletingScore.judgeId)} 对 "{deletingScore?.scoringCriteria.name}" 的评分吗？
              此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingScore && handleDeleteScore(deletingScore)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 