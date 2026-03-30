'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ExcelImport } from "@/components/dashboard/ExcelImport";
import { 
  Users, 
  Plus, 
  Filter, 
  Search, 
  UserRound, 
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Upload
} from "lucide-react";
import Link from "next/link";

interface Participant {
  id: string;
  name: string;
  bio?: string;
  team?: string;
  contact?: string;
  createdAt: string;
  updatedAt: string;
  programs: Array<{
    id: string;
    name: string;
    competition: {
      id: string;
      name: string;
    };
  }>;
}

interface ParticipantsResponse {
  participants: Participant[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0
  });
  const [sortBy, setSortBy] = useState<'name' | 'team' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // 表单状态
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    team: '',
    contact: ''
  });
  
  // 删除确认状态
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);
  
  // 删除全部选手状态
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Excel导入状态
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  // 可用团队列表
  const [teams, setTeams] = useState<string[]>([]);
  
  // 获取选手数据
  const fetchParticipants = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (searchQuery) params.append('search', searchQuery);
      if (teamFilter && teamFilter !== 'all') params.append('team', teamFilter);
      
      const response = await fetch(`/api/participants?${params}`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants || data);
        
        // 如果返回的是分页数据
        if (data.pagination) {
          setPagination(data.pagination);
        } else {
          // 简单数据处理
          setPagination(prev => ({
            ...prev,
            total: data.length,
            pages: Math.ceil(data.length / prev.limit)
          }));
        }
        
        // 提取团队列表用于筛选
        const participantList = data.participants || data;
        const uniqueTeams = [...new Set(
          participantList.map((p: Participant) => p.team).filter(Boolean)
        )] as string[];
        setTeams(uniqueTeams);
      } else {
        console.error('Failed to fetch participants');
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchParticipants();
  }, []);
  
  // 处理搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchParticipants(1);
  };
  
  // 重置筛选
  const handleResetFilters = () => {
    setSearchQuery('');
    setTeamFilter('all');
    setSortBy('name');
    setSortOrder('asc');
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => fetchParticipants(1), 100);
  };

  // 排序选手数据
  const sortedParticipants = [...participants].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'team':
        const teamA = a.team || '';
        const teamB = b.team || '';
        comparison = teamA.localeCompare(teamB);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 处理排序
  const handleSort = (newSortBy: 'name' | 'team' | 'createdAt') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };
  
  // 创建选手
  const handleCreateParticipant = async () => {
    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: 'current-user-id' // 这里应该从session中获取
        }),
      });
      
      if (response.ok) {
        setShowCreateDialog(false);
        setFormData({ name: '', bio: '', team: '', contact: '' });
        fetchParticipants(pagination.page);
      } else {
        console.error('Failed to create participant');
      }
    } catch (error) {
      console.error('Error creating participant:', error);
    }
  };
  
  // 更新选手
  const handleUpdateParticipant = async () => {
    if (!selectedParticipant) return;
    
    try {
      const response = await fetch(`/api/participants/${selectedParticipant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setShowEditDialog(false);
        setSelectedParticipant(null);
        setFormData({ name: '', bio: '', team: '', contact: '' });
        fetchParticipants(pagination.page);
      } else {
        console.error('Failed to update participant');
      }
    } catch (error) {
      console.error('Error updating participant:', error);
    }
  };
  
  // 删除选手
  const handleDeleteParticipant = async () => {
    if (!participantToDelete) return;
    
    try {
      const response = await fetch(`/api/participants/${participantToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setShowDeleteDialog(false);
        setParticipantToDelete(null);
        fetchParticipants(pagination.page);
      } else {
        console.error('Failed to delete participant');
      }
    } catch (error) {
      console.error('Error deleting participant:', error);
    }
  };
  
  // 打开编辑对话框
  const openEditDialog = (participant: Participant) => {
    setSelectedParticipant(participant);
    setFormData({
      name: participant.name,
      bio: participant.bio || '',
      team: participant.team || '',
      contact: participant.contact || ''
    });
    setShowEditDialog(true);
  };
  
  // 获取参与者类型
  const getParticipantType = (participant: Participant) => {
    return participant.team ? '团队' : '个人选手';
  };
  
  // 获取参与者类型颜色
  const getParticipantTypeColor = (participant: Participant) => {
    return participant.team 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  // 处理导入完成
  const handleImportComplete = (importedData: any[]) => {
    // 刷新选手列表
    fetchParticipants(pagination.page);
    setShowImportDialog(false);
  };

  // 删除全部选手
  const handleDeleteAllParticipants = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/participants/delete-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.message}`);
        setShowDeleteAllDialog(false);
        fetchParticipants(1); // 重新加载第一页
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        const error = await response.json();
        alert(`删除失败: ${error.error}`);
      }
    } catch (error) {
      console.error('删除全部选手失败:', error);
      alert('删除过程中发生错误');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">选手管理</h1>
          <p className="text-muted-foreground mt-1">
            管理所有比赛的参赛选手，包括个人选手和团队
          </p>
        </div>
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
                <DialogTitle>批量导入选手</DialogTitle>
                <DialogDescription>
                  从Excel表格批量导入选手信息，支持姓名、简介、团队、联系方式等字段
                </DialogDescription>
              </DialogHeader>
              <ExcelImport 
                type="participants"
                onImportComplete={handleImportComplete}
              />
            </DialogContent>
          </Dialog>
          
          <Button asChild>
            <Link href="/dashboard/participants/new">
              <UserPlus className="mr-2 h-4 w-4" />
              添加选手
            </Link>
          </Button>
        </div>
      </div>
      
      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索选手姓名、简介、团队..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="筛选团队" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="individual">个人选手</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                搜索
              </Button>
              
              <Button variant="outline" onClick={handleResetFilters}>
                <X className="mr-2 h-4 w-4" />
                重置
              </Button>
              
              <Button variant="outline" onClick={() => fetchParticipants(pagination.page)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                刷新
              </Button>
              
              {participants.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setShowDeleteAllDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除全部
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{pagination.total}</div>
            </div>
            <p className="text-xs text-muted-foreground">总选手数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {participants.filter(p => !p.team).length}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">个人选手</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{teams.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">团队数量</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{pagination.page}</div>
            </div>
            <p className="text-xs text-muted-foreground">当前页</p>
          </CardContent>
        </Card>
      </div>
      
      {/* 选手列表 */}
      {loading ? (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">暂无选手数据</p>
        </div>
      ) : (
        <Card>
          <div className="p-3 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                选手列表 ({participants.length} 名选手)
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground hidden sm:inline">排序:</span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-2 text-xs ${sortBy === 'name' ? 'bg-muted' : ''}`}
                    onClick={() => handleSort('name')}
                  >
                    <span className="hidden sm:inline">姓名</span>
                    <span className="sm:hidden">名</span>
                    {sortBy === 'name' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-2 text-xs ${sortBy === 'team' ? 'bg-muted' : ''}`}
                    onClick={() => handleSort('team')}
                  >
                    <span className="hidden sm:inline">团队</span>
                    <span className="sm:hidden">队</span>
                    {sortBy === 'team' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-2 text-xs ${sortBy === 'createdAt' ? 'bg-muted' : ''}`}
                    onClick={() => handleSort('createdAt')}
                  >
                    <span className="hidden sm:inline">创建时间</span>
                    <span className="sm:hidden">时间</span>
                    {sortBy === 'createdAt' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="divide-y">
            {sortedParticipants.map((participant, index) => (
              <div key={participant.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    {/* 头像 */}
                    <div className="rounded-full bg-muted h-10 w-10 flex items-center justify-center flex-shrink-0">
                      {participant.team ? (
                        <Users className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <UserRound className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* 主要信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="font-medium text-sm">{participant.name}</h3>
                        <Badge variant="secondary" className={getParticipantTypeColor(participant)}>
                          {getParticipantType(participant)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-xs text-muted-foreground space-y-1 sm:space-y-0">
                        {participant.team && (
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">团队: {participant.team}</span>
                          </div>
                        )}
                        {participant.contact && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{participant.contact}</span>
                          </div>
                        )}
                      </div>
                      
                      {participant.bio && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-1">
                          {participant.bio}
                        </p>
                      )}
                      
                      {participant.programs && participant.programs.length > 0 && (
                        <div className="flex items-start mt-2">
                          <span className="text-xs text-muted-foreground mr-2 flex-shrink-0 mt-1">参与节目:</span>
                          <div className="flex flex-wrap gap-1">
                            {participant.programs.slice(0, 3).map((program) => (
                              <Badge key={program.id} variant="outline" className="text-xs px-1 py-0.5">
                                {program.name}
                              </Badge>
                            ))}
                            {participant.programs.length > 3 && (
                              <Badge variant="outline" className="text-xs px-1 py-0.5">
                                +{participant.programs.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="h-8 px-2 w-full sm:w-auto text-xs"
                    >
                      <Link href={`/dashboard/participants/${participant.id}`}>
                        <Eye className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">查看</span>
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2 w-full sm:w-auto text-xs"
                      onClick={() => openEditDialog(participant)}
                    >
                      <Edit className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">编辑</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 px-2 w-full sm:w-auto text-xs text-destructive hover:text-destructive"
                      onClick={() => {
                        setParticipantToDelete(participant);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">删除</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* 分页 */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            第 {pagination.page} 页，共 {pagination.pages} 页，总计 {pagination.total} 个选手
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchParticipants(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchParticipants(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              下一页
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* 创建选手对话框 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>添加选手</DialogTitle>
            <DialogDescription>
              创建新的参赛选手或团队
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">姓名/团队名称 *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名或团队名称"
              />
            </div>
            <div>
              <label className="text-sm font-medium">简介</label>
              <Input
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="简单介绍一下..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">团队名称</label>
              <Input
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                placeholder="如果是团队参赛，请填写团队名称"
              />
            </div>
            <div>
              <label className="text-sm font-medium">联系方式</label>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="邮箱或电话"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                取消
              </Button>
              <Button 
                onClick={handleCreateParticipant}
                disabled={!formData.name.trim()}
              >
                创建
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 编辑选手对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>编辑选手</DialogTitle>
            <DialogDescription>
              修改选手或团队信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">姓名/团队名称 *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名或团队名称"
              />
            </div>
            <div>
              <label className="text-sm font-medium">简介</label>
              <Input
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="简单介绍一下..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">团队名称</label>
              <Input
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                placeholder="如果是团队参赛，请填写团队名称"
              />
            </div>
            <div>
              <label className="text-sm font-medium">联系方式</label>
              <Input
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="邮箱或电话"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                取消
              </Button>
              <Button 
                onClick={handleUpdateParticipant}
                disabled={!formData.name.trim()}
              >
                更新
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 删除全部选手确认对话框 */}
      <Dialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">⚠️ 危险操作</DialogTitle>
            <DialogDescription>
              <div className="space-y-2">
                <p>确定要删除 <strong>全部 {pagination.total} 名选手</strong> 吗？</p>
                <p className="text-destructive font-medium">此操作将：</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>永久删除所有选手数据</li>
                  <li>清空所有节目的参与者关联</li>
                  <li>此操作无法撤销</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  只有管理员可以执行此操作
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteAllDialog(false)}
              disabled={isDeleting}
            >
              取消
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAllParticipants}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  确认删除全部
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除选手 "{participantToDelete?.name}" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteParticipant}>
              确认删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 