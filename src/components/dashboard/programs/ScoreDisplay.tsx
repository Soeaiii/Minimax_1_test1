'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp } from 'lucide-react';

interface Score {
  id: string;
  value: number;
  comment?: string | null;
  scoringCriteria: {
    id: string;
    name: string;
    weight: number;
    maxScore: number;
  };
  createdAt: string | Date;
}

interface ScoreDisplayProps {
  scores: Score[];
}

export function ScoreDisplay({ scores }: ScoreDisplayProps) {
  if (scores.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">暂无评分数据</p>
        <p className="text-sm text-muted-foreground mt-1">
          评委尚未对此节目进行评分
        </p>
      </div>
    );
  }

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
      {/* 总分显示 */}
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
                  基于所有评分标准的加权平均分
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {totalWeightedScore.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">分</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 各评分标准详情 */}
      <div className="grid gap-4">
        {Object.entries(scoresByCriteria).map(([criteriaId, criteriaScores]) => {
          const criteria = criteriaScores[0].scoringCriteria;
          const stats = getStatistics(criteriaScores);
          const percentage = (stats.average / criteria.maxScore) * 100;

          return (
            <Card key={criteriaId}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{criteria.name}</CardTitle>
                    <CardDescription>
                      权重: {criteria.weight} • 满分: {criteria.maxScore} • 
                      {stats.count} 位评委评分
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {stats.average.toFixed(2)} / {criteria.maxScore}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 进度条 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>平均分</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>

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
                    {criteriaScores.map((score, index) => (
                      <div key={score.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">评委 {index + 1}</span>
                          {score.comment && (
                            <span className="text-xs text-muted-foreground">
                              "{score.comment.substring(0, 30)}{score.comment.length > 30 ? '...' : ''}"
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={score.value >= criteria.maxScore * 0.8 ? 'default' : 'secondary'}>
                            {score.value}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 