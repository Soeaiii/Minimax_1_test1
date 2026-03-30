'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { UserRole } from '@/lib/types';
import { Search, Clock, Eye, Download, Filter, AlertTriangle, CheckCircle, XCircle, Info, User, Shield, Database } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  result: 'success' | 'failure' | 'warning';
  reason?: string;
  ipAddress: string;
  userAgent: string;
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
}

interface PermissionAuditProps {
  userId?: string;
  resourceType?: string;
  showFilters?: boolean;
  maxHeight?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// 操作类型映射
const ACTION_NAMES: Record<string, string> = {
  'permission.grant': '授予权限',
  'permission.revoke': '撤销权限',
  'role.assign': '分配角色',
  'role.remove': '移除角色',
  'user.create': '创建用户',
  'user.update': '更新用户',
  'user.delete': '删除用户',
  'login.success': '登录成功',
  'login.failure': '登录失败',
  'logout': '退出登录',
  'password.change': '修改密码',
  'data.access': '数据访问',
  'data.export': '数据导出',
  'system.config': '系统配置',
};

// 资源类型映射
const RESOURCE_NAMES: Record<string, string> = {
  user: '用户',
  role: '角色',
  permission: '权限',
  competition: '比赛',
  program: '节目',
  judge: '评委',
  system: '系统',
  data: '数据',
};

// 结果状态映射
const RESULT_CONFIG = {
  success: {
    name: '成功',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  failure: {
    name: '失败',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  warning: {
    name: '警告',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
};

// 角色颜色映射
const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  ORGANIZER: 'bg-blue-100 text-blue-800',
  JUDGE: 'bg-green-100 text-green-800',
  USER: 'bg-gray-100 text-gray-800',
};

// 角色名称映射
const ROLE_NAMES: Record<UserRole, string> = {
  ADMIN: '管理员',
  ORGANIZER: '组织者',
  JUDGE: '评委',
  USER: '普通用户',
};

export function PermissionAudit({
  userId,
  resourceType,
  showFilters = true,
  maxHeight = '400px',
  autoRefresh = false,
  refreshInterval = 30000,
}: PermissionAuditProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<string>(resourceType || 'all');
  const [selectedResult, setSelectedResult] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>(userId || 'all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // 获取审计日志
  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedAction !== 'all') params.append('action', selectedAction);
      if (selectedResource !== 'all') params.append('resource', selectedResource);
      if (selectedResult !== 'all') params.append('result', selectedResult);
      if (selectedUser !== 'all') params.append('userId', selectedUser);
      params.append('startDate', dateRange.start);
      params.append('endDate', dateRange.end);

      const response = await fetch(`/api/audit-logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // 导出审计日志
  const exportAuditLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedAction !== 'all') params.append('action', selectedAction);
      if (selectedResource !== 'all') params.append('resource', selectedResource);
      if (selectedResult !== 'all') params.append('result', selectedResult);
      if (selectedUser !== 'all') params.append('userId', selectedUser);
      params.append('startDate', dateRange.start);
      params.append('endDate', dateRange.end);
      params.append('format', 'csv');

      const response = await fetch(`/api/audit-logs/export?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting audit logs:', error);
    }
  };

  // 格式化值显示
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  // 获取操作描述
  const getActionDescription = (log: AuditLog): string => {
    const actionName = ACTION_NAMES[log.action] || log.action;
    const resourceName = RESOURCE_NAMES[log.resource] || log.resource;
    
    if (log.resourceId) {
      return `${actionName} ${resourceName} (ID: ${log.resourceId})`;
    }
    return `${actionName} ${resourceName}`;
  };

  // 获取变更摘要
  const getChangeSummary = (log: AuditLog): string => {
    if (!log.oldValue && !log.newValue) return '';
    
    if (log.action.includes('role')) {
      if (log.action === 'role.assign') {
        return `角色: ${log.newValue}`;
      } else if (log.action === 'role.remove') {
        return `移除角色: ${log.oldValue}`;
      }
    }
    
    if (log.action.includes('permission')) {
      if (log.action === 'permission.grant') {
        return `授予权限: ${log.newValue}`;
      } else if (log.action === 'permission.revoke') {
        return `撤销权限: ${log.oldValue}`;
      }
    }
    
    return '';
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [searchTerm, selectedAction, selectedResource, selectedResult, selectedUser, dateRange]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchAuditLogs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          权限审计日志
        </CardTitle>
        <CardDescription>
          查看权限相关操作的详细审计记录
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 筛选器 */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label>搜索</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>操作类型</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部操作</SelectItem>
                  {Object.entries(ACTION_NAMES).map(([key, name]) => (
                    <SelectItem key={key} value={key}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>资源类型</Label>
              <Select value={selectedResource} onValueChange={setSelectedResource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部资源</SelectItem>
                  {Object.entries(RESOURCE_NAMES).map(([key, name]) => (
                    <SelectItem key={key} value={key}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>结果状态</Label>
              <Select value={selectedResult} onValueChange={setSelectedResult}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="success">成功</SelectItem>
                  <SelectItem value="failure">失败</SelectItem>
                  <SelectItem value="warning">警告</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>开始日期</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>结束日期</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchAuditLogs}>
            <Clock className="h-4 w-4 mr-1" />
            刷新
          </Button>
          <Button variant="outline" size="sm" onClick={exportAuditLogs}>
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
          <div className="ml-auto text-sm text-muted-foreground">
            共 {auditLogs.length} 条记录
          </div>
        </div>

        <Separator />

        {/* 审计日志列表 */}
        <ScrollArea style={{ height: maxHeight }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>操作</TableHead>
                <TableHead>结果</TableHead>
                <TableHead>变更</TableHead>
                <TableHead>详情</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => {
                const resultConfig = RESULT_CONFIG[log.result];
                const ResultIcon = resultConfig.icon;
                
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(log.timestamp).toLocaleString('zh-CN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">{log.user.name}</div>
                          <Badge className={ROLE_COLORS[log.user.role]} variant="secondary">
                            {ROLE_NAMES[log.user.role]}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">
                            {ACTION_NAMES[log.action] || log.action}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {RESOURCE_NAMES[log.resource] || log.resource}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ResultIcon className={`h-4 w-4 ${resultConfig.color}`} />
                        <Badge className={resultConfig.bgColor}>
                          {resultConfig.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {getChangeSummary(log) || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>审计日志详情</DialogTitle>
                            <DialogDescription>
                              {getActionDescription(log)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">操作时间</Label>
                                <p className="text-sm">
                                  {new Date(log.timestamp).toLocaleString('zh-CN')}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">操作用户</Label>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm">{log.user.name}</p>
                                  <Badge className={ROLE_COLORS[log.user.role]}>
                                    {ROLE_NAMES[log.user.role]}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">IP地址</Label>
                                <p className="text-sm font-mono">{log.ipAddress}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">操作结果</Label>
                                <div className="flex items-center gap-2">
                                  <ResultIcon className={`h-4 w-4 ${resultConfig.color}`} />
                                  <span className="text-sm">{resultConfig.name}</span>
                                </div>
                              </div>
                            </div>
                            
                            {log.reason && (
                              <div>
                                <Label className="text-sm font-medium">原因/说明</Label>
                                <p className="text-sm bg-gray-50 p-2 rounded">{log.reason}</p>
                              </div>
                            )}
                            
                            {(log.oldValue || log.newValue) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {log.oldValue && (
                                  <div>
                                    <Label className="text-sm font-medium">变更前</Label>
                                    <pre className="text-xs bg-red-50 p-2 rounded border overflow-auto max-h-32">
                                      {formatValue(log.oldValue)}
                                    </pre>
                                  </div>
                                )}
                                {log.newValue && (
                                  <div>
                                    <Label className="text-sm font-medium">变更后</Label>
                                    <pre className="text-xs bg-green-50 p-2 rounded border overflow-auto max-h-32">
                                      {formatValue(log.newValue)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div>
                              <Label className="text-sm font-medium">用户代理</Label>
                              <p className="text-xs text-muted-foreground font-mono break-all">
                                {log.userAgent}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>

        {auditLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>没有找到审计日志记录</p>
            <p className="text-sm">尝试调整筛选条件或时间范围</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PermissionAudit;