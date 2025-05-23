'use client';

import { useEffect, useState } from 'react';
import { Trophy, Users, ListMusic, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ProgramStatusChart } from '@/components/dashboard/ProgramStatusChart';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

interface DashboardStats {
  competitions: {
    total: number;
    active: number;
  };
  programs: {
    total: number;
    waiting: number;
    performing: number;
    completed: number;
  };
  participants: {
    total: number;
    teams: number;
  };
  auditLogs: {
    total: number;
    today: number;
  };
  recent: {
    competitions: Array<{
      id: string;
      name: string;
      status: string;
      createdAt: string;
      organizer: { name: string };
      _count: { programs: number };
    }>;
    auditLogs: Array<{
      id: string;
      action: string;
      timestamp: string;
      targetId?: string;
      user: { name: string };
    }>;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('获取统计数据失败');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 欢迎头部 */}
      <WelcomeHeader />

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="总比赛数"
          value={stats.competitions.total}
          subtitle={`活跃比赛: ${stats.competitions.active}`}
          icon={Trophy}
          badges={[
            { label: '活跃', value: stats.competitions.active, variant: 'default' }
          ]}
        />
        
        <StatsCard
          title="节目总数"
          value={stats.programs.total}
          subtitle="节目状态分布"
          icon={ListMusic}
          badges={[
            { label: '等待中', value: stats.programs.waiting, variant: 'secondary' },
            { label: '表演中', value: stats.programs.performing, variant: 'default' },
            { label: '已完成', value: stats.programs.completed, variant: 'outline' }
          ]}
        />
        
        <StatsCard
          title="选手数量"
          value={stats.participants.total}
          subtitle={`团队: ${stats.participants.teams}`}
          icon={Users}
          progress={{
            value: stats.participants.teams,
            max: Math.max(stats.participants.total, 1),
            label: '团队占比'
          }}
        />
        
        <StatsCard
          title="日志数量"
          value={stats.auditLogs.total}
          subtitle={`今日: ${stats.auditLogs.today}`}
          icon={FileText}
          trend={{
            value: stats.auditLogs.today,
            label: '今日新增',
            isPositive: stats.auditLogs.today > 0
          }}
        />
      </div>

      {/* 数据可视化和系统状态 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProgramStatusChart data={stats.programs} />
        <SystemStatus stats={stats} />
        <QuickActions />
      </div>

      {/* 最近活动 */}
      <RecentActivities 
        competitions={stats.recent.competitions}
        auditLogs={stats.recent.auditLogs}
      />
    </div>
  );
} 