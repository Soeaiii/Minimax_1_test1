'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompetitionStatus, RankingUpdateMode } from "@/lib/types";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

// 获取比赛状态显示样式
const getStatusBadgeClass = (status: CompetitionStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    case 'ACTIVE':
      return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'FINISHED':
      return 'bg-green-50 text-green-700 border-green-100';
    case 'ARCHIVED':
      return 'bg-gray-50 text-gray-700 border-gray-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};

// 获取比赛状态中文名称
const getStatusName = (status: CompetitionStatus) => {
  switch (status) {
    case 'PENDING':
      return '待开始';
    case 'ACTIVE':
      return '进行中';
    case 'FINISHED':
      return '已完成';
    case 'ARCHIVED':
      return '已归档';
    default:
      return '未知状态';
  }
};

// 获取排名更新模式中文名称
const getRankingUpdateModeName = (mode: RankingUpdateMode) => {
  switch (mode) {
    case 'REALTIME':
      return '实时更新';
    case 'BATCH':
      return '批量更新';
    default:
      return '未知模式';
  }
};

// 格式化日期显示
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface CompetitionDetailProps {
  competition: any; // 比赛详情数据
}

export function CompetitionDetail({ competition }: CompetitionDetailProps) {
  // 获取比赛状态的中文名称和样式
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDING: { label: '待开始', variant: 'secondary' },
      ACTIVE: { label: '进行中', variant: 'default' },
      FINISHED: { label: '已结束', variant: 'outline' },
      ARCHIVED: { label: '已归档', variant: 'destructive' },
    };
    
    const statusInfo = statusMap[status] || { label: '未知状态', variant: 'outline' };
    
    return (
      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
    );
  };
  
  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '未设置';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return '日期格式错误';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>比赛详情</CardTitle>
        <CardDescription>查看比赛的基本信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">比赛名称</h3>
            <p className="text-base">{competition.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">状态</h3>
            <div className="mt-1">{getStatusBadge(competition.status)}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">主办方</h3>
            <p className="text-base">{competition.organizer?.name || '未指定'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">排名更新模式</h3>
            <p className="text-base">
              {competition.rankingUpdateMode === 'REALTIME' ? '实时更新' : '批量更新'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">开始时间</h3>
            <p className="text-base">{formatDateTime(competition.startTime)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">结束时间</h3>
            <p className="text-base">{formatDateTime(competition.endTime)}</p>
          </div>
        </div>
        
        {competition.description && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">比赛描述</h3>
            <div className="prose prose-sm max-w-none">
              {competition.description}
            </div>
          </div>
        )}
        
        {competition.scoringCriteria && competition.scoringCriteria.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">评分标准</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">评分项</th>
                    <th className="text-right py-2 font-medium">权重</th>
                    <th className="text-right py-2 font-medium">最高分</th>
                  </tr>
                </thead>
                <tbody>
                  {competition.scoringCriteria.map((criteria: any) => (
                    <tr key={criteria.id} className="border-b">
                      <td className="py-2">{criteria.name}</td>
                      <td className="text-right py-2">{criteria.weight * 100}%</td>
                      <td className="text-right py-2">{criteria.maxScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 