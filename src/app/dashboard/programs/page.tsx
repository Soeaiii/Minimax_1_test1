'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ListMusic, Plus, Filter, Search, Grid, List, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProgramList } from "@/components/dashboard/programs/ProgramList";
import { ProgramListByCompetition } from "@/components/dashboard/programs/ProgramListByCompetition";
import { ExcelImport } from "@/components/dashboard/ExcelImport";
import { ProgramStatus } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Competition {
  id: string;
  name: string;
  status: string;
  organizerId: string;
  startTime: string;
  endTime: string;
}

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProgramStatus | 'ALL'>('ALL');
  const [competitionFilter, setCompetitionFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'competition'>('list'); // 默认使用列表视图
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loadingCompetitions, setLoadingCompetitions] = useState(false);
  
  // 获取比赛列表
  const fetchCompetitions = async () => {
    try {
      setLoadingCompetitions(true);
      const response = await fetch('/api/competitions', {
        credentials: 'include', // 关键：包含凭据
      });
      if (!response.ok) {
        throw new Error('获取比赛列表失败');
      }
      const data = await response.json();
      setCompetitions(data.competitions || []);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      toast.error('获取比赛列表失败');
    } finally {
      setLoadingCompetitions(false);
    }
  };

  // 页面加载时获取比赛列表
  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.currentTarget.value);
    }
  };

  // 处理导入完成
  const handleImportComplete = (importedData: any[]) => {
    // 刷新页面数据 - 这里可以根据需要实现更精细的刷新逻辑
    window.location.reload();
    setShowImportDialog(false);
  };

  // 清除所有筛选条件
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCompetitionFilter('ALL');
    // 清除搜索输入框
    const searchInput = document.querySelector('input[placeholder*="搜索节目"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">节目管理</h1>
        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                批量导入
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>批量导入节目</DialogTitle>
                <DialogDescription>
                  从Excel表格批量导入节目信息，支持节目名称、描述、顺序、选手姓名等字段
                </DialogDescription>
              </DialogHeader>
              <ExcelImport 
                type="programs"
                onImportComplete={handleImportComplete}
              />
            </DialogContent>
          </Dialog>
          
          <Button asChild>
            <Link href="/dashboard/programs/new">
              <Plus className="mr-2 h-4 w-4" />
              创建节目
            </Link>
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        管理所有比赛的节目，安排节目顺序，更新节目状态。支持批量删除所有节目。
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
            disabled={loadingCompetitions}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="比赛筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部比赛</SelectItem>
              {loadingCompetitions ? (
                <SelectItem value="loading" disabled>
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    加载中...
                  </div>
                </SelectItem>
              ) : (
                competitions.map((competition) => (
                  <SelectItem key={competition.id} value={competition.id}>
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{competition.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {competition.status === 'ACTIVE' && '进行中'}
                        {competition.status === 'PENDING' && '待开始'}
                        {competition.status === 'FINISHED' && '已结束'}
                        {competition.status === 'ARCHIVED' && '已归档'}
                      </span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}

        {/* 视图模式切换按钮 */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-r-none"
          >
            <List className="h-4 w-4 mr-1" />
            列表视图
          </Button>
          <Button
            variant={viewMode === 'competition' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('competition')}
            className="rounded-l-none border-l"
          >
            <Grid className="h-4 w-4 mr-1" />
            按比赛分类
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={clearFilters}>
          <Filter className="h-4 w-4 mr-1" />
          清除筛选
        </Button>
      </div>
      
      {/* 显示当前筛选条件 */}
      {(searchQuery || statusFilter !== 'ALL' || competitionFilter !== 'ALL') && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>当前筛选:</span>
          {searchQuery && (
            <span className="bg-secondary px-2 py-1 rounded">
              搜索: "{searchQuery}"
            </span>
          )}
          {statusFilter !== 'ALL' && (
            <span className="bg-secondary px-2 py-1 rounded">
              状态: {statusFilter === 'WAITING' ? '等待中' : statusFilter === 'PERFORMING' ? '进行中' : '已完成'}
            </span>
          )}
          {competitionFilter !== 'ALL' && (
            <span className="bg-secondary px-2 py-1 rounded">
              比赛: {competitions.find(c => c.id === competitionFilter)?.name || '未知比赛'}
            </span>
          )}
        </div>
      )}
      
      {/* 根据视图模式显示不同的组件 */}
      {viewMode === 'list' ? (
        <ProgramList 
          searchQuery={searchQuery} 
          status={statusFilter === 'ALL' ? undefined : statusFilter}
          competitionId={competitionFilter === 'ALL' ? undefined : competitionFilter}
        />
      ) : (
        <ProgramListByCompetition 
          searchQuery={searchQuery} 
          statusFilter={statusFilter === 'ALL' ? undefined : statusFilter}
        />
      )}
    </div>
  );
}
