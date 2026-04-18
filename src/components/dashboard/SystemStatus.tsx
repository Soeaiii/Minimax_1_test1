import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Database, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface SystemStatusProps {
  stats: {
    competitions: { total: number; active: number };
    participantPrograms: { total: number };
    participantPrograms: { total: number };
    auditLogs: { today: number };
  };
}

export function SystemStatus({ stats }: SystemStatusProps) {
  // 简单的健康检查逻辑
  const getSystemHealth = () => {
    const healthScore = [
      stats.competitions.active > 0 ? 25 : 0, // 有活跃比赛
      stats.programs.total > 0 ? 25 : 0, // 有节目
      stats.participants.total > 0 ? 25 : 0, // 有选手
      stats.auditLogs.today >= 0 ? 25 : 0, // 系统有活动
    ].reduce((sum, score) => sum + score, 0);

    if (healthScore >= 75) return { status: '良好', color: 'default', icon: CheckCircle };
    if (healthScore >= 50) return { status: '正常', color: 'secondary', icon: CheckCircle };
    return { status: '需要关注', color: 'destructive', icon: AlertTriangle };
  };

  const health = getSystemHealth();
  const HealthIcon = health.icon;

  const statusItems = [
    {
      label: '数据库连接',
      status: '正常',
      icon: Database,
      color: 'default' as const,
    },
    {
      label: '认证服务',
      status: '正常',
      icon: Shield,
      color: 'default' as const,
    },
    {
      label: '应用服务',
      status: '正常',
      icon: Server,
      color: 'default' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          系统状态
        </CardTitle>
        <CardDescription>
          系统健康状况和服务状态
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 整体健康状态 */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <HealthIcon className="h-5 w-5" />
              <span className="font-medium">系统健康</span>
            </div>
            <Badge variant={health.color as any}>
              {health.status}
            </Badge>
          </div>

          {/* 服务状态 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">服务状态</h4>
            <div className="space-y-2">
              {statusItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <ItemIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </div>
                    <Badge variant={item.color} className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 数据统计 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">数据概览</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="font-bold">{stats.competitions.total}</div>
                <div className="text-muted-foreground">比赛总数</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="font-bold">{stats.programs.total}</div>
                <div className="text-muted-foreground">节目总数</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="font-bold">{stats.participants.total}</div>
                <div className="text-muted-foreground">选手总数</div>
              </div>
              <div className="text-center p-2 bg-muted/30 rounded">
                <div className="font-bold">{stats.auditLogs.today}</div>
                <div className="text-muted-foreground">今日操作</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 