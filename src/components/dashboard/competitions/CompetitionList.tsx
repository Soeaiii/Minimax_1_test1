'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { CompetitionStatus } from "@/lib/types";

// 定义比赛对象类型
interface Competition {
  id: string;
  name: string;
  description: string | null;
  status: CompetitionStatus;
  startTime: string;
  endTime: string;
  organizer: {
    id: string;
    name: string;
  };
  programs: { id: string }[];
}

const statusStyles: Record<CompetitionStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  ACTIVE: 'bg-blue-50 text-blue-700 border-blue-100',
  FINISHED: 'bg-green-50 text-green-700 border-green-100',
  ARCHIVED: 'bg-gray-50 text-gray-700 border-gray-100',
}

const statusNames: Record<CompetitionStatus, string> = {
  PENDING: '待开始',
  ACTIVE: '进行中',
  FINISHED: '已完成',
  ARCHIVED: '已归档',
}

const CompetitionCard = memo(({ competition, onArchive }: { competition: Competition; onArchive: (id: string) => void }) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base">{competition.name}</CardTitle>
        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${statusStyles[competition.status]}`}>
          {statusNames[competition.status]}
        </div>
      </div>
      <CardDescription className="text-xs">
        组织者: {competition.organizer.name} • 开始于: {new Date(competition.startTime).toLocaleDateString()}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {competition.description || '无描述'}
      </p>
      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          <span className="flex items-center">
            <Trophy className="h-3 w-3 mr-1" />
            {competition.programs.length}个节目
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/competitions/${competition.id}`}>管理</Link>
          </Button>
          {competition.status !== 'ARCHIVED' && (
            <Button variant="destructive" size="sm" onClick={() => onArchive(competition.id)}>
              归档
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
))

export function CompetitionList() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/competitions');
      if (!response.ok) throw new Error('获取比赛列表失败');
      const data = await response.json();
      setCompetitions(data.competitions || data);
      setError(null);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('获取比赛列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  const archiveCompetition = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/competitions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('归档比赛失败');
      fetchCompetitions();
    } catch (err) {
      console.error('Error archiving competition:', err);
      setError('归档比赛失败，请稍后重试');
    }
  }, [fetchCompetitions]);

  useEffect(() => { fetchCompetitions(); }, [fetchCompetitions]);

  if (loading && competitions.length === 0) {
    return <div className="col-span-full"><p className="text-center text-muted-foreground py-8">加载比赛数据中...</p></div>;
  }

  if (error && competitions.length === 0) {
    return (
      <div className="col-span-full">
        <p className="text-center text-destructive py-8">{error}</p>
        <div className="flex justify-center">
          <Button variant="outline" onClick={fetchCompetitions}>重试</Button>
        </div>
      </div>
    );
  }

  if (competitions.length === 0) {
    return <div className="col-span-full"><p className="text-center text-muted-foreground py-8">暂无比赛数据，请点击"创建比赛"按钮添加</p></div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {competitions.map((competition) => (
        <CompetitionCard key={competition.id} competition={competition} onArchive={archiveCompetition} />
      ))}
    </div>
  );
} 