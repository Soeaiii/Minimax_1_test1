'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListMusic, Plus, Filter, Search, Grid, List } from "lucide-react";
import Link from "next/link";
import { ProgramList } from "@/components/dashboard/programs/ProgramList";
import { ProgramListByCompetition } from "@/components/dashboard/programs/ProgramListByCompetition";
import { ProgramStatus } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProgramStatus | 'ALL'>('ALL');
  const [competitionFilter, setCompetitionFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'competition'>('competition'); // 默认使用比赛分类视图
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.currentTarget.value);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">节目管理</h1>
        <Button asChild>
          <Link href="/dashboard/programs/new">
            <Plus className="mr-2 h-4 w-4" />
            创建节目
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">
        管理所有比赛的节目，安排节目顺序，更新节目状态。
      </p>
      
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="搜索节目名称或描述..."
            className="pl-8 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onKeyDown={handleSearch}
            defaultValue={searchQuery}
          />
        </div>
        
        <Select 
          value={statusFilter} 
          onValueChange={(value: ProgramStatus | 'ALL') => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部状态</SelectItem>
            <SelectItem value="WAITING">等待中</SelectItem>
            <SelectItem value="PERFORMING">进行中</SelectItem>
            <SelectItem value="COMPLETED">已完成</SelectItem>
          </SelectContent>
        </Select>

        {/* 只在列表视图时显示比赛筛选 */}
        {viewMode === 'list' && (
          <Select 
            value={competitionFilter} 
            onValueChange={(value: string) => setCompetitionFilter(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="比赛筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部比赛</SelectItem>
              {/* 这里需要获取比赛列表 */}
            </SelectContent>
          </Select>
        )}

        {/* 视图模式切换按钮 */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === 'competition' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('competition')}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4 mr-1" />
            按比赛分类
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none border-l"
          >
            <List className="h-4 w-4 mr-1" />
            列表视图
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={() => {
          setSearchQuery('');
          setStatusFilter('ALL');
          setCompetitionFilter('ALL');
        }}>
          清除筛选
        </Button>
      </div>
      
      {/* 根据视图模式显示不同的组件 */}
      {viewMode === 'competition' ? (
        <ProgramListByCompetition 
          searchQuery={searchQuery} 
          statusFilter={statusFilter === 'ALL' ? undefined : statusFilter}
        />
      ) : (
        <ProgramList 
          searchQuery={searchQuery} 
          status={statusFilter === 'ALL' ? undefined : statusFilter}
          competitionId={competitionFilter === 'ALL' ? undefined : competitionFilter}
        />
      )}
    </div>
  );
} 