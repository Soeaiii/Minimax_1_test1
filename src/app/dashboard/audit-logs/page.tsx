'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Filter, 
  Search, 
  Download, 
  CalendarIcon,
  RefreshCw,
  AlertCircle,
  User,
  Activity,
  Calendar as CalendarDay,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AuditLogDetailDialog } from "@/components/dashboard/audit-logs/AuditLogDetailDialog";

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetId?: string;
  details?: any;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface AuditLogResponse {
  logs: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  });
  
  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [userIdFilter, setUserIdFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  
  // UI状态
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  
  // 获取审计日志数据
  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (searchQuery) params.append('search', searchQuery);
      if (actionFilter) params.append('action', actionFilter);
      if (userIdFilter) params.append('userId', userIdFilter);
      if (dateRange.from) params.append('startDate', dateRange.from.toISOString());
      if (dateRange.to) params.append('endDate', dateRange.to.toISOString());
      
      const response = await fetch(`/api/audit-logs?${params}`);
      if (response.ok) {
        const data: AuditLogResponse = await response.json();
        setLogs(data.logs);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch audit logs');
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取用户列表（用于筛选）
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);
  
  // 处理搜索
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs(1);
  };
  
  // 处理重置筛选
  const handleResetFilters = () => {
    setSearchQuery('');
    setActionFilter('');
    setUserIdFilter('');
    setDateRange({});
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => fetchLogs(1), 100);
  };
  
  // 处理导出
  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (actionFilter) params.append('action', actionFilter);
      if (userIdFilter) params.append('userId', userIdFilter);
      if (dateRange.from) params.append('startDate', dateRange.from.toISOString());
      if (dateRange.to) params.append('endDate', dateRange.to.toISOString());
      params.append('export', 'true');
      
      const response = await fetch(`/api/audit-logs?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  // 处理清理审计日志
  const handleCleanup = async () => {
    if (!confirm('确定要清理审计日志吗？这将删除超过200条的旧记录，此操作不可撤销。')) {
      return;
    }
    
    setCleanupLoading(true);
    try {
      const response = await fetch('/api/audit-logs', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`清理完成！删除了 ${result.deletedCount} 条旧记录，当前保留 ${result.afterCount} 条记录。`);
        // 刷新数据
        fetchLogs(1);
      } else {
        const error = await response.json();
        alert(`清理失败：${error.error}`);
      }
    } catch (error) {
      console.error('Error cleaning up logs:', error);
      alert('清理失败，请稍后重试');
    } finally {
      setCleanupLoading(false);
    }
  };
  
  // 获取操作类型的显示信息
  const getActionInfo = (action: string) => {
    const actionMap: Record<string, { label: string; color: string }> = {
      'CREATE': { label: '创建', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'UPDATE': { label: '更新', color: 'bg-green-100 text-green-800 border-green-200' },
      'DELETE': { label: '删除', color: 'bg-red-100 text-red-800 border-red-200' },
      'SCORE': { label: '评分', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      'LOGIN': { label: '登录', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'LOGOUT': { label: '登出', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      'ARCHIVE': { label: '归档', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'RESTORE': { label: '恢复', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    };
    
    return actionMap[action] || { label: action, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };
  
  // 格式化详情信息
  const formatDetails = (details: any) => {
    if (!details) return '无详情';
    if (typeof details === 'string') return details;
    if (typeof details === 'object') {
      return Object.entries(details)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return JSON.stringify(details);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">审计日志</h1>
          <p className="text-muted-foreground mt-1">
            查看系统中的操作日志，包括用户活动、比赛管理、节目和评分等操作记录
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-muted")}
          >
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出日志
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCleanup}
            disabled={cleanupLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {cleanupLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {cleanupLoading ? '清理中...' : '清理日志'}
          </Button>
          <Button variant="outline" onClick={() => fetchLogs(pagination.page)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
        </div>
      </div>
      
      {/* 筛选面板 */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">筛选条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 搜索框 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">搜索</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索操作、目标ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              {/* 操作类型筛选 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">操作类型</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部操作" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部操作</SelectItem>
                    <SelectItem value="CREATE">创建</SelectItem>
                    <SelectItem value="UPDATE">更新</SelectItem>
                    <SelectItem value="DELETE">删除</SelectItem>
                    <SelectItem value="SCORE">评分</SelectItem>
                    <SelectItem value="LOGIN">登录</SelectItem>
                    <SelectItem value="LOGOUT">登出</SelectItem>
                    <SelectItem value="ARCHIVE">归档</SelectItem>
                    <SelectItem value="RESTORE">恢复</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 用户筛选 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">操作用户</label>
                <Select value={userIdFilter} onValueChange={setUserIdFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部用户" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部用户</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* 日期范围 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">时间范围</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MM/dd")} - {format(dateRange.to, "MM/dd")}
                          </>
                        ) : (
                          format(dateRange.from, "MM/dd/yyyy")
                        )
                      ) : (
                        "选择日期范围"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      selected={{
                        from: dateRange.from,
                        to: dateRange.to,
                      }}
                      onSelect={(range) => setDateRange(range || {})}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleResetFilters}>
                <X className="mr-2 h-4 w-4" />
                清除筛选
              </Button>
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                应用筛选
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{pagination.total}</div>
            </div>
            <p className="text-xs text-muted-foreground">总操作数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{users.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">活跃用户</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CalendarDay className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{Math.ceil(pagination.total / pagination.limit)}</div>
            </div>
            <p className="text-xs text-muted-foreground">总页数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{pagination.page}</div>
            </div>
            <p className="text-xs text-muted-foreground">当前页</p>
          </CardContent>
        </Card>
      </div>
      
      {/* 日志列表 */}
      <Card>
        <CardHeader>
          <CardTitle>操作日志</CardTitle>
          <CardDescription>
            显示第 {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} 条记录，共 {pagination.total} 条
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">加载中...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">暂无日志数据</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => {
                const actionInfo = getActionInfo(log.action);
                return (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Badge className={actionInfo.color}>
                            {actionInfo.label}
                          </Badge>
                          <span className="text-sm font-medium">{log.user.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(log.timestamp), 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN })}
                          </span>
                        </div>
                        <div className="text-sm">
                          {log.targetId && (
                            <span className="text-muted-foreground">
                              目标: <span className="font-mono">{log.targetId}</span>
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDetails(log.details)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* 分页 */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                第 {pagination.page} 页，共 {pagination.pages} 页
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchLogs(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchLogs(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  下一页
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 详情对话框 */}
      <AuditLogDetailDialog 
        log={selectedLog}
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      />
    </div>
  );
} 