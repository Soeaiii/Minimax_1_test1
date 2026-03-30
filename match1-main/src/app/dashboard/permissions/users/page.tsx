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
import { toast } from 'sonner';
import { AdminGuard, OrganizerGuard } from '@/components/auth/PermissionGuard';
import { usePermissions } from '@/lib/auth/usePermissions';
import { UserRole } from '@/lib/types';
import { Users, Shield, Eye, Search, Clock, CheckCircle, XCircle, AlertTriangle, UserPlus } from 'lucide-react';
import { UserManagement } from '@/components/permissions/UserManagement';

// 用户权限信息接口
interface UserPermissionInfo {
  role: UserRole;
  permissions: string[];
  dataScope: {
    competitions: string[];
    programs: string[];
    participants: string[] | 'all';
    users?: string[] | 'all';
  };
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

// 审计日志接口
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: any;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

// 权限检查结果接口
interface PermissionCheckResult {
  hasPermission: boolean;
  user: {
    id: string;
    role: UserRole;
  };
  permission: {
    action: string;
    resource: string;
    targetId?: string;
  };
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

// 操作类型映射
const actionNames: Record<string, string> = {
  'UPDATE_USER_ROLE': '修改用户角色',
  'DELETE_USER': '删除用户',
  'CREATE_COMPETITION': '创建比赛',
  'UPDATE_COMPETITION': '更新比赛',
  'DELETE_COMPETITION': '删除比赛',
  'CREATE_PROGRAM': '创建节目',
  'UPDATE_PROGRAM': '更新节目',
  'DELETE_PROGRAM': '删除节目',
  'CREATE_SCORE': '创建评分',
  'UPDATE_SCORE': '更新评分',
  'DELETE_SCORE': '删除评分',
};

export default function UserPermissionsPage() {
  const { isAdmin, isOrganizer, user: currentUser } = usePermissions();
  const [userPermissions, setUserPermissions] = useState<UserPermissionInfo | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionTest, setPermissionTest] = useState({
    resource: '',
    action: '',
    targetId: '',
  });
  const [permissionResult, setPermissionResult] = useState<PermissionCheckResult | null>(null);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: UserRole }>>([]);

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        // 默认选择当前用户
        if (!selectedUserId && currentUser?.id) {
          setSelectedUserId(currentUser.id);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // 获取用户权限信息
  const fetchUserPermissions = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/roles?userId=${userId}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUserPermissions(data);
      } else {
        toast.error('获取用户权限信息失败');
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      toast.error('获取用户权限信息失败');
    }
  };

  // 获取审计日志
  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (selectedUserId && !isAdmin) {
        params.append('userId', selectedUserId);
      }

      const response = await fetch(`/api/audit-logs?${params}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.logs || []);
      } else {
        toast.error('获取审计日志失败');
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('获取审计日志失败');
    }
  };

  // 测试权限
  const testPermission = async () => {
    if (!permissionTest.resource || !permissionTest.action) {
      toast.error('请填写资源和操作');
      return;
    }

    try {
      const params = new URLSearchParams({
        action: permissionTest.action,
        resource: permissionTest.resource,
      });
      if (permissionTest.targetId) {
        params.append('targetId', permissionTest.targetId);
      }

      const response = await fetch(`/api/permissions?${params}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setPermissionResult(data);
      } else {
        toast.error('权限检查失败');
      }
    } catch (error) {
      console.error('Error testing permission:', error);
      toast.error('权限检查失败');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserPermissions(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    fetchAuditLogs();
  }, [searchTerm, selectedUserId]);

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
            <h1 className="text-3xl font-bold tracking-tight">用户权限</h1>
            <p className="text-muted-foreground">
              查看用户权限详情、权限审计和访问控制
            </p>
          </div>
        </div>

        <Tabs defaultValue="management" className="space-y-4">
          <TabsList>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              用户管理
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              权限详情
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              权限审计
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              权限测试
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-4">
            <AdminGuard showError>
              <UserManagement />
            </AdminGuard>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>用户权限详情</CardTitle>
                <CardDescription>
                  查看指定用户的角色、权限和数据访问范围
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 用户选择 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">选择用户</label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择要查看的用户" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <span>{user.name}</span>
                            <Badge className={roleColors[user.role]} variant="secondary">
                              {roleNames[user.role]}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 权限信息 */}
                {userPermissions && (
                  <div className="space-y-6">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">用户信息</h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>姓名:</strong> {userPermissions.user.name}</div>
                          <div><strong>邮箱:</strong> {userPermissions.user.email}</div>
                          <div><strong>创建时间:</strong> {new Date(userPermissions.user.createdAt).toLocaleDateString('zh-CN')}</div>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">角色信息</h3>
                        <Badge className={roleColors[userPermissions.role]}>
                          {roleNames[userPermissions.role]}
                        </Badge>
                        <div className="mt-2 text-sm text-muted-foreground">
                          共有 {userPermissions.permissions.length} 个权限
                        </div>
                      </div>
                    </div>

                    {/* 权限列表 */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">权限列表</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {userPermissions.permissions.map((permission) => (
                          <div
                            key={permission}
                            className="text-sm bg-green-50 text-green-800 px-2 py-1 rounded border"
                          >
                            {permission}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 数据访问范围 */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">数据访问范围</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">可访问的比赛</h4>
                          <div className="text-sm">
                            {Array.isArray(userPermissions.dataScope.competitions) ? (
                              userPermissions.dataScope.competitions.length > 0 ? (
                                <div className="space-y-1">
                                  {userPermissions.dataScope.competitions.slice(0, 5).map((id) => (
                                    <div key={id} className="bg-gray-50 px-2 py-1 rounded">{id}</div>
                                  ))}
                                  {userPermissions.dataScope.competitions.length > 5 && (
                                    <div className="text-muted-foreground">... 还有 {userPermissions.dataScope.competitions.length - 5} 个</div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">无</span>
                              )
                            ) : (
                              <span className="text-green-600">全部</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">可访问的节目</h4>
                          <div className="text-sm">
                            {Array.isArray(userPermissions.dataScope.programs) ? (
                              userPermissions.dataScope.programs.length > 0 ? (
                                <div className="space-y-1">
                                  {userPermissions.dataScope.programs.slice(0, 5).map((id) => (
                                    <div key={id} className="bg-gray-50 px-2 py-1 rounded">{id}</div>
                                  ))}
                                  {userPermissions.dataScope.programs.length > 5 && (
                                    <div className="text-muted-foreground">... 还有 {userPermissions.dataScope.programs.length - 5} 个</div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">无</span>
                              )
                            ) : (
                              <span className="text-green-600">全部</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>权限审计日志</CardTitle>
                <CardDescription>
                  查看用户权限相关的操作记录
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 搜索 */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="搜索操作记录..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 审计日志列表 */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>操作者</TableHead>
                        <TableHead>操作类型</TableHead>
                        <TableHead>目标</TableHead>
                        <TableHead>时间</TableHead>
                        <TableHead>详情</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{log.user.name}</div>
                              <div className="text-sm text-muted-foreground">{log.user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {actionNames[log.action] || log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{log.targetType}</div>
                              <div className="text-muted-foreground">{log.targetId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(log.createdAt).toLocaleString('zh-CN')}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>操作详情</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2">
                                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {auditLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    没有找到审计日志记录
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>权限测试</CardTitle>
                <CardDescription>
                  测试当前用户对特定资源和操作的权限
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">资源类型</label>
                      <Select
                        value={permissionTest.resource}
                        onValueChange={(value) => setPermissionTest(prev => ({ ...prev, resource: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择资源" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">用户</SelectItem>
                          <SelectItem value="competition">比赛</SelectItem>
                          <SelectItem value="program">节目</SelectItem>
                          <SelectItem value="participant">参赛者</SelectItem>
                          <SelectItem value="score">评分</SelectItem>
                          <SelectItem value="judge">评委</SelectItem>
                          <SelectItem value="system">系统</SelectItem>
                          <SelectItem value="data">数据</SelectItem>
                          <SelectItem value="audit">审计</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">操作类型</label>
                      <Select
                        value={permissionTest.action}
                        onValueChange={(value) => setPermissionTest(prev => ({ ...prev, action: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择操作" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="create">创建</SelectItem>
                          <SelectItem value="read">查看</SelectItem>
                          <SelectItem value="update">更新</SelectItem>
                          <SelectItem value="delete">删除</SelectItem>
                          <SelectItem value="manage">管理</SelectItem>
                          <SelectItem value="assign">分配</SelectItem>
                          <SelectItem value="remove">移除</SelectItem>
                          <SelectItem value="settings">设置</SelectItem>
                          <SelectItem value="export">导出</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">目标ID（可选）</label>
                      <Input
                        placeholder="输入目标资源ID"
                        value={permissionTest.targetId}
                        onChange={(e) => setPermissionTest(prev => ({ ...prev, targetId: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={testPermission} className="w-full">
                    测试权限
                  </Button>

                  {/* 测试结果 */}
                  {permissionResult && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {permissionResult.hasPermission ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          permissionResult.hasPermission ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {permissionResult.hasPermission ? '有权限' : '无权限'}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div><strong>用户角色:</strong> {roleNames[permissionResult.user.role]}</div>
                        <div><strong>测试权限:</strong> {permissionResult.permission.resource}:{permissionResult.permission.action}</div>
                        {permissionResult.permission.targetId && (
                          <div><strong>目标ID:</strong> {permissionResult.permission.targetId}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </OrganizerGuard>
  );
}