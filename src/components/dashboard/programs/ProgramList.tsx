'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListMusic } from "lucide-react";
import Link from "next/link";
import { ProgramStatus } from "@/lib/types";

// 定义节目对象类型
interface Program {
  id: string;
  name: string;
  description: string | null;
  order: number;
  currentStatus: ProgramStatus;
  competitionId: string;
  competition: {
    id: string;
    name: string;
  };
  participants: any[];
}

// 获取节目状态显示标签样式
const getStatusStyles = (status: ProgramStatus) => {
  switch (status) {
    case 'WAITING':
      return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    case 'PERFORMING':
      return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'COMPLETED':
      return 'bg-green-50 text-green-700 border-green-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100';
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

  // 获取节目列表
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      
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
      setPrograms(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('获取节目列表失败，请稍后重试');
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
      
      const result = await response.json();
      console.log('Status update success:', result);
      
      // 重新获取节目列表
      fetchPrograms();
    } catch (err) {
      console.error('Error updating program status:', err);
      setError(err instanceof Error ? err.message : '更新节目状态失败，请稍后重试');
    }
  };
  
  // 首次加载时获取数据
  useEffect(() => {
    fetchPrograms();
  }, [searchQuery, competitionId, status]);
  
  // 显示加载状态
  if (loading && programs.length === 0) {
    return (
      <div className="col-span-full">
        <p className="text-center text-muted-foreground py-8">
          加载节目数据中...
        </p>
      </div>
    );
  }
  
  // 显示错误信息
  if (error && programs.length === 0) {
    return (
      <div className="col-span-full">
        <p className="text-center text-destructive py-8">
          {error}
        </p>
        <div className="flex justify-center">
          <Button variant="outline" onClick={fetchPrograms}>
            重试
          </Button>
        </div>
      </div>
    );
  }
  
  // 没有数据
  if (programs.length === 0) {
    return (
      <div className="col-span-full">
        <p className="text-center text-muted-foreground py-8">
          暂无节目数据，请点击"创建节目"按钮添加
        </p>
      </div>
    );
  }
  
  // 渲染节目列表
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <Card key={program.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {program.name}
              </CardTitle>
              <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusStyles(program.currentStatus)}`}>
                {getStatusName(program.currentStatus)}
              </div>
            </div>
            <CardDescription className="text-xs">
              比赛: {program.competition.name} • 顺序: {program.order}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {program.description || '无描述'}
            </p>
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                <span className="flex items-center">
                  <ListMusic className="h-3 w-3 mr-1" />
                  {program.participants.length}名选手
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/programs/${program.id}`}>详情</Link>
                </Button>
                
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/programs/${program.id}/edit`}>编辑</Link>
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
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 