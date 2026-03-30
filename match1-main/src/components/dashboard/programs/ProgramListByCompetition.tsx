'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListMusic, ChevronDown, ChevronRight, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { ProgramStatus } from "@/lib/types";
import { DeleteProgramButton } from "./delete-program-button";

// 定义节目对象类型
interface Program {
  id: string;
  name: string;
  description: string | null;
  order: number;
  currentStatus: ProgramStatus;
  competitionId: string;
  participants: any[];
  scores?: any[];
  competition?: {
    id: string;
    status: string;
  };
}

// 定义比赛对象类型
interface Competition {
  id: string;
  name: string;
  description: string | null;
  startTime: string;
  endTime: string;
  status: string;
  programs: Program[];
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

// 获取比赛状态的样式
const getCompetitionStatusStyles = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800';
    case 'FINISHED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 获取比赛状态的中文名称
const getCompetitionStatusName = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return '进行中';
    case 'DRAFT':
      return '草稿';
    case 'FINISHED':
      return '已结束';
    default:
      return '未知';
  }
};

interface ProgramListByCompetitionProps {
  searchQuery?: string;
  statusFilter?: ProgramStatus;
}

export function ProgramListByCompetition({ searchQuery = '', statusFilter }: ProgramListByCompetitionProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCompetitions, setOpenCompetitions] = useState<Record<string, boolean>>({});

  // 获取比赛和节目数据
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 获取比赛列表
      const competitionsResponse = await fetch('/api/competitions');
      if (!competitionsResponse.ok) {
        throw new Error('获取比赛列表失败');
      }
      const competitionsResponse_data = await competitionsResponse.json();
      const competitionsData = competitionsResponse_data.competitions || competitionsResponse_data;
      
      // 获取节目列表
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);
      
      const queryString = params.toString();
      const programsUrl = `/api/programs${queryString ? `?${queryString}` : ''}`;
      
      const programsResponse = await fetch(programsUrl);
      if (!programsResponse.ok) {
        throw new Error('获取节目列表失败');
      }
      const programsData = await programsResponse.json();
      
      // 将节目按比赛分组
      const competitionMap = new Map();
      competitionsData.forEach((comp: any) => {
        competitionMap.set(comp.id, { ...comp, programs: [] });
      });
      
      programsData.forEach((program: any) => {
        if (competitionMap.has(program.competitionId)) {
          competitionMap.get(program.competitionId).programs.push(program);
        }
      });
      
      // 转换为数组并过滤掉没有节目的比赛（如果有搜索条件）
      const competitionsWithPrograms = Array.from(competitionMap.values()).filter(
        (comp: Competition) => !searchQuery && !statusFilter ? true : comp.programs.length > 0
      );
      
      setCompetitions(competitionsWithPrograms);
      
      // 默认展开第一个有节目的比赛
      const firstCompetitionWithPrograms = competitionsWithPrograms.find(comp => comp.programs.length > 0);
      if (firstCompetitionWithPrograms) {
        setOpenCompetitions({ [firstCompetitionWithPrograms.id]: true });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('获取数据失败，请稍后重试');
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
      
      // 重新获取数据
      fetchData();
    } catch (err) {
      console.error('Error updating program status:', err);
      setError(err instanceof Error ? err.message : '更新节目状态失败，请稍后重试');
    }
  };
  
  // 切换比赛展开/折叠状态
  const toggleCompetition = (competitionId: string) => {
    setOpenCompetitions(prev => ({
      ...prev,
      [competitionId]: !prev[competitionId]
    }));
  };
  
  // 首次加载时获取数据
  useEffect(() => {
    fetchData();
  }, [searchQuery, statusFilter]);
  
  // 显示加载状态
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载数据中...</p>
        </div>
      </div>
    );
  }
  
  // 显示错误信息
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={fetchData}>
          重试
        </Button>
      </div>
    );
  }
  
  // 没有数据
  if (competitions.length === 0) {
    return (
      <div className="text-center py-12">
        <ListMusic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-medium text-muted-foreground mb-2">暂无比赛数据</p>
        <p className="text-muted-foreground mb-6">
          请先创建比赛，然后添加节目
        </p>
        <Button asChild>
          <Link href="/dashboard/competitions/new">创建比赛</Link>
        </Button>
      </div>
    );
  }
  
  // 计算统计信息
  const getCompetitionStats = (programs: Program[]) => {
    const waitingCount = programs.filter(p => p.currentStatus === 'WAITING').length;
    const performingCount = programs.filter(p => p.currentStatus === 'PERFORMING').length;
    const completedCount = programs.filter(p => p.currentStatus === 'COMPLETED').length;
    const totalParticipants = programs.reduce((sum, p) => sum + p.participants.length, 0);
    
    return { waitingCount, performingCount, completedCount, totalParticipants };
  };
  
  return (
    <div className="space-y-4">
      {competitions.map((competition) => {
        const stats = getCompetitionStats(competition.programs);
        const isOpen = openCompetitions[competition.id] || false;
        
        return (
          <Card key={competition.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleCompetition(competition.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <CardTitle className="text-lg">{competition.name}</CardTitle>
                  <Badge className={`text-xs ${getCompetitionStatusStyles(competition.status)}`}>
                    {getCompetitionStatusName(competition.status)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <ListMusic className="h-4 w-4 mr-1" />
                    {competition.programs.length} 个节目
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {stats.totalParticipants} 名选手
                  </span>
                </div>
              </div>
              
              {competition.description && (
                <CardDescription className="mt-2">
                  {competition.description}
                </CardDescription>
              )}
              
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(competition.startTime).toLocaleDateString()} - {new Date(competition.endTime).toLocaleDateString()}
                </div>
                
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                    等待: {stats.waitingCount}
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                    进行: {stats.performingCount}
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    完成: {stats.completedCount}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            {isOpen && (
              <CardContent className="pt-0">
                {competition.programs.length === 0 ? (
                  <div className="text-center py-8 border-t">
                    <p className="text-muted-foreground mb-4">此比赛暂无节目</p>
                    <Button asChild size="sm">
                      <Link href="/dashboard/programs/new">添加节目</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 border-t pt-4">
                    {competition.programs
                      .sort((a, b) => a.order - b.order)
                      .map((program) => (
                        <Card key={program.id} className="relative">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">
                                {program.name}
                              </CardTitle>
                              <div className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors ${getStatusStyles(program.currentStatus)}`}>
                                {getStatusName(program.currentStatus)}
                              </div>
                            </div>
                            <CardDescription className="text-xs">
                              顺序: {program.order} • {program.participants.length} 名选手
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                              {program.description || '无描述'}
                            </p>
                            <div className="flex gap-1 flex-wrap">
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
                              
                              <DeleteProgramButton
                                programId={program.id}
                                programName={program.name}
                                hasScores={false}
                                competitionStatus={competition.status}
                                onSuccess={fetchData}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
} 