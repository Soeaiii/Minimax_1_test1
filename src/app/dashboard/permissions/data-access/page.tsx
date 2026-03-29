'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AdminGuard, OrganizerGuard } from '@/components/auth/PermissionGuard';
import { usePermissions } from '@/lib/auth/usePermissions';
import { UserRole } from '@/lib/types';
import { Database, Shield, Eye, Search, Clock, Settings, Users, Trophy, FileText, Star } from 'lucide-react';

// 数据访问规则接口
interface DataAccessRule {
  id: string;
  resource: string;
  role: UserRole;
  scope: 'all' | 'own' | 'assigned' | 'public';
  conditions?: Record<string, any>;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// 访问日志接口
interface AccessLog {
  id: string;
  userId: string;
  resource: string;
  action: string;
  targetId: string;
  allowed: boolean;
  reason?: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
}

// 资源统计接口
interface ResourceStats {
  resource: string;
  totalAccess: number;
  allowedAccess: number;
  deniedAccess: number;
  uniqueUsers: number;
}

// 角色标签颜色映射
const roleColors: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  ORGANIZER: 'bg-blue-100 text-blue-800',
  JUDGE: 'bg-green-100 text-green-800',
  USER: 'bg-gray-100 text-gray-800',
};

// 角色名称映射
const roleNames: Record<UserRole, string> = {
  ADMIN: '管理员',
  ORGANIZER: '组织者',
  JUDGE: '评委',
  USER: '普通用户',
};

// 资源名称映射
const resourceNames: Record<string, string> = {
  user: '用户',
  competition: '比赛',
  program: '节目',
  participant: '参赛者',
  score: '评分',
  judge: '评委',
  system: '系统',
  data: '数据',
  audit: '审计',
};

// 访问范围映射
const scopeNames: Record<string, string> = {
  all: '全部数据',
  own: '自己创建的数据',
  assigned: '分配给自己的数据',
  public: '公开数据',
};

export default function DataAccessControlPage() {
  const { isAdmin, isOrganizer } = usePermissions();
  const [accessRules, setAccessRules] = useState<DataAccessRule[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [resourceStats, setResourceStats] = useState<ResourceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // 获取数据访问规则
  const fetchAccessRules = async () => {
    try {
      const response = await fetch('/api/permissions/data-access/rules', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setAccessRules(data.rules || []);
      } else {
        toast.error('获取数据访问规则失败');
      }
    } catch (error) {
      console.error('Error fetching access rules:', error);
      toast.error('获取数据访问规则失败');
    }
  };

  // 获取访问日志
  const fetchAccessLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedResource !== 'all') params.append('resource', selectedResource);
      if (selectedRole !== 'all') params.append('role', selectedRole);
      params.append('startDate', dateRange.start);
      params.append('endDate', dateRange.end);

      const response = await fetch(`/api/permissions/data-access/logs?${params}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setAccessLogs(data.logs || []);
      } else {
        toast.error('获取访问日志失败');
      }
    } catch (error) {
      console.error('Error fetching access logs:', error);
      toast.error('获取访问日志失败');
    }
  };

  // 获取资源统计
  const fetchResourceStats = async () => {
    try {
      const params = new URLSearchParams();
      params.append('startDate', dateRange.start);
      params.append('endDate', dateRange.end);

      const response = await fetch(`/api/permissions/data-access/stats?${params}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setResourceStats(data.stats || []);
      } else {
        toast.error('获取资源统计失败');
      }
    } catch (error) {
      console.error('Error fetching resource stats:', error);
      toast.error('获取资源统计失败');
    }
  };

  // 更新访问规则
  const updateAccessRule = async (ruleId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/permissions/data-access/rules/${ruleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        toast.success('访问规则更新成功');
        fetchAccessRules();
      } else {
        toast.error('更新访问规则失败');
      }
    } catch (error) {
      console.error('Error updating access rule:', error);
      toast.error('更新访问规则失败');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAccessRules(),
        fetchAccessLogs(),
        fetchResourceStats(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    fetchAccessLogs();
    fetchResourceStats();
  }, [searchTerm, selectedResource, selectedRole, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <OrganizerGuard showError>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">数据访问控制</h1>
            <p className="text-muted-foreground">
              管理资源权限设置、数据范围限制和访问日志
            </p>
          </div>
        </div>

        <Tabs defaultValue="rules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              访问规则
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              访问日志
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              统计分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>数据访问规则</CardTitle>
                <CardDescription>
                  配置不同角色对各种资源的访问权限和数据范围
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 规则列表 */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>资源</TableHead>
                          <TableHead>角色</TableHead>
                          <TableHead>访问范围</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>更新时间</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accessRules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {rule.resource === 'competition' && <Trophy className="h-4 w-4" />}
                                {rule.resource === 'program' && <FileText className="h-4 w-4" />}
                                {rule.resource === 'user' && <Users className="h-4 w-4" />}
                                {rule.resource === 'score' && <Star className="h-4 w-4" />}
                                <span>{resourceNames[rule.resource] || rule.resource}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={roleColors[rule.role]}>
                                {roleNames[rule.role]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {scopeNames[rule.scope] || rule.scope}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={rule.enabled}
                                  onCheckedChange={(enabled) => updateAccessRule(rule.id, enabled)}
                                  disabled={!isAdmin}
                                />
                                <span className={rule.enabled ? 'text-green-600' : 'text-gray-400'}>
                                  {rule.enabled ? '启用' : '禁用'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(rule.updatedAt).toLocaleDateString('zh-CN')}
                            </TableCell>
                            <TableCell className="text-right">
                              <AdminGuard>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </AdminGuard>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {accessRules.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      没有找到数据访问规则
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>访问日志</CardTitle>
                <CardDescription>
                  查看用户对各种资源的访问记录和权限检查结果
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 筛选条件 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label>搜索</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="搜索用户或操作..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>资源类型</Label>
                    <Select value={selectedResource} onValueChange={setSelectedResource}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有资源</SelectItem>
                        <SelectItem value="user">用户</SelectItem>
                        <SelectItem value="competition">比赛</SelectItem>
                        <SelectItem value="program">节目</SelectItem>
                        <SelectItem value="participant">参赛者</SelectItem>
                        <SelectItem value="score">评分</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>用户角色</Label>
                    <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | 'all')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有角色</SelectItem>
                        <SelectItem value="ADMIN">管理员</SelectItem>
                        <SelectItem value="ORGANIZER">组织者</SelectItem>
                        <SelectItem value="JUDGE">评委</SelectItem>
                        <SelectItem value="USER">普通用户</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>时间范围</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* 访问日志列表 */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>用户</TableHead>
                        <TableHead>资源</TableHead>
                        <TableHead>操作</TableHead>
                        <TableHead>目标ID</TableHead>
                        <TableHead>结果</TableHead>
                        <TableHead>时间</TableHead>
                        <TableHead>详情</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{log.user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                <Badge className={roleColors[log.user.role]} variant="secondary">
                                  {roleNames[log.user.role]}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {log.resource === 'competition' && <Trophy className="h-4 w-4" />}
                              {log.resource === 'program' && <FileText className="h-4 w-4" />}
                              {log.resource === 'user' && <Users className="h-4 w-4" />}
                              {log.resource === 'score' && <Star className="h-4 w-4" />}
                              <span>{resourceNames[log.resource] || log.resource}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-1 rounded">
                              {log.targetId}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {log.allowed ? (
                                <Badge className="bg-green-100 text-green-800">允许</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">拒绝</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(log.timestamp).toLocaleString('zh-CN')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.reason && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>访问详情</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-2">
                                    <div><strong>原因:</strong> {log.reason}</div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {accessLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    没有找到访问日志记录
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>访问统计分析</CardTitle>
                <CardDescription>
                  查看各种资源的访问统计和趋势分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {resourceStats.map((stat) => (
                    <Card key={stat.resource}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {resourceNames[stat.resource] || stat.resource}
                            </p>
                            <p className="text-2xl font-bold">{stat.totalAccess}</p>
                            <p className="text-xs text-muted-foreground">
                              总访问次数
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-green-600">
                              {stat.allowedAccess} 允许
                            </div>
                            <div className="text-sm text-red-600">
                              {stat.deniedAccess} 拒绝
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stat.uniqueUsers} 用户
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${(stat.allowedAccess / stat.totalAccess) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {((stat.allowedAccess / stat.totalAccess) * 100).toFixed(1)}% 成功率
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {resourceStats.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    没有找到统计数据
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </OrganizerGuard>
  );
}