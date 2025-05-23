import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, User, Clock, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Competition {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  organizer: {
    name: string;
  };
  _count: {
    programs: number;
  };
}

interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  targetId?: string;
  user: {
    name: string;
  };
}

interface RecentActivitiesProps {
  competitions: Competition[];
  auditLogs: AuditLog[];
}

export function RecentActivities({ competitions, auditLogs }: RecentActivitiesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'FINISHED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '进行中';
      case 'PENDING':
        return '待开始';
      case 'FINISHED':
        return '已结束';
      case 'ARCHIVED':
        return '已归档';
      default:
        return status;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'CREATE_COMPETITION':
        return '创建比赛';
      case 'CREATE_PROGRAM':
        return '创建节目';
      case 'CREATE':
        return '创建';
      case 'UPDATE':
        return '更新';
      case 'DELETE':
        return '删除';
      default:
        return action;
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            最近的比赛
          </CardTitle>
          <CardDescription>
            显示最近创建或更新的比赛
          </CardDescription>
        </CardHeader>
        <CardContent>
          {competitions.length > 0 ? (
            <div className="space-y-4">
              {competitions.map((competition) => (
                <div key={competition.id} className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <Trophy className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {competition.name}
                      </p>
                      <Badge variant={getStatusColor(competition.status)}>
                        {getStatusText(competition.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{competition.organizer.name}</span>
                      <span>•</span>
                      <span>{competition._count.programs} 个节目</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(competition.createdAt), {
                          addSuffix: true,
                          locale: zhCN
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">暂无比赛数据</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            系统活动
          </CardTitle>
          <CardDescription>
            最近的系统活动记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditLogs.length > 0 ? (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {log.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs">
                      <span className="font-medium">{log.user.name}</span>
                      <span className="text-muted-foreground"> {getActionText(log.action)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.timestamp), {
                        addSuffix: true,
                        locale: zhCN
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">暂无活动记录</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 