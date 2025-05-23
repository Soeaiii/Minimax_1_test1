'use client';

import { useState, useEffect } from 'react';
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
  programs: any[]; // 简化类型
}

// 获取比赛状态显示标签样式
const getStatusStyles = (status: CompetitionStatus) => {
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

export function CompetitionList() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取比赛列表
  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/competitions');
      
      if (!response.ok) {
        throw new Error('获取比赛列表失败');
      }
      
      const data = await response.json();
      setCompetitions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('获取比赛列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 归档比赛
  const archiveCompetition = async (id: string) => {
    try {
      const response = await fetch(`/api/competitions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('归档比赛失败');
      }
      
      // 重新获取比赛列表
      fetchCompetitions();
    } catch (err) {
      console.error('Error archiving competition:', err);
      setError('归档比赛失败，请稍后重试');
    }
  };
  
  // 首次加载时获取数据
  useEffect(() => {
    fetchCompetitions();
  }, []);
  
  // 显示加载状态
  if (loading && competitions.length === 0) {
    return (
      <div className="col-span-full">
        <p className="text-center text-muted-foreground py-8">
          加载比赛数据中...
        </p>
      </div>
    );
  }
  
  // 显示错误信息
  if (error && competitions.length === 0) {
    return (
      <div className="col-span-full">
        <p className="text-center text-destructive py-8">
          {error}
        </p>
        <div className="flex justify-center">
          <Button variant="outline" onClick={fetchCompetitions}>
            重试
          </Button>
        </div>
      </div>
    );
  }
  
  // 没有数据
  if (competitions.length === 0) {
    return (
      <div className="col-span-full">
        <p className="text-center text-muted-foreground py-8">
          暂无比赛数据，请点击"创建比赛"按钮添加
        </p>
      </div>
    );
  }
  
  // 渲染比赛列表
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {competitions.map((competition) => (
        <Card key={competition.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {competition.name}
              </CardTitle>
              <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusStyles(competition.status)}`}>
                {getStatusName(competition.status)}
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
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => archiveCompetition(competition.id)}
                  >
                    归档
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 