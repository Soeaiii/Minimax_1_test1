'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AdminGuard } from '@/components/auth/PermissionGuard';
import { usePermissions } from '@/lib/auth/usePermissions';
import { UserRole } from '@/lib/types';
import { Users, Shield, Settings, Eye, Edit, Trash2, Plus, Search } from 'lucide-react';

// 用户数据接口
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// 权限配置接口
interface PermissionConfig {
  resources: Array<{
    name: string;
    label: string;
    actions: Array<{
      name: string;
      label: string;
    }>;
  }>;
  rolePermissions: Record<UserRole, string[]>;
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

export default function RoleManagementPage() {
  const { isAdmin } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [permissionConfig, setPermissionConfig] = useState<PermissionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'ALL'>('ALL');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('USER');
  const [reason, setReason] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedRole !== 'ALL') {
        params.append('role', selectedRole);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error('获取用户列表失败');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('获取用户列表失败');
    }
  };

  // 获取权限配置
  const fetchPermissionConfig = async () => {
    try {
      const response = await fetch('/api/permissions', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setPermissionConfig(data.permissions);
      } else {
        toast.error('获取权限配置失败');
      }
    } catch (error) {
      console.error('Error fetching permission config:', error);
      toast.error('获取权限配置失败');
    }
  };

  // 更新用户角色
  const updateUserRole = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/roles/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: newRole,
          reason,
        }),
      });

      if (response.ok) {
        toast.success('用户角色更新成功');
        setIsDialogOpen(false);
        setEditingUser(null);
        setReason('');
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || '更新用户角色失败');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('更新用户角色失败');
    }
  };

  // 删除用户
  const deleteUser = async (user: User) => {
    if (!confirm(`确定要删除用户 ${user.name} 吗？`)) return;

    try {
      const response = await fetch(`/api/users/roles/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: '管理员删除用户',
        }),
      });

      if (response.ok) {
        toast.success('用户删除成功');
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || '删除用户失败');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('删除用户失败');
    }
  };

  // 打开编辑对话框
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setNewRole(user.role);
    setReason('');
    setIsDialogOpen(true);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchPermissionConfig()]);
      setLoading(false);
    };
    loadData();
  }, [searchTerm, selectedRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminGuard showError>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">角色管理</h1>
            <p className="text-muted-foreground">
              管理用户角色和权限配置
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              用户角色
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              权限配置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>用户角色管理</CardTitle>
                <CardDescription>
                  查看和管理系统中所有用户的角色分配
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 搜索和筛选 */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="搜索用户姓名或邮箱..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | 'ALL')}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">所有角色</SelectItem>
                      <SelectItem value="ADMIN">管理员</SelectItem>
                      <SelectItem value="ORGANIZER">组织者</SelectItem>
                      <SelectItem value="JUDGE">评委</SelectItem>
                      <SelectItem value="USER">普通用户</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 用户列表 */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>用户信息</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={roleColors[user.role]}>
                              {roleNames[user.role]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteUser(user)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {users.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    没有找到符合条件的用户
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>权限配置</CardTitle>
                <CardDescription>
                  查看各角色的权限配置详情
                </CardDescription>
              </CardHeader>
              <CardContent>
                {permissionConfig && (
                  <div className="space-y-6">
                    {Object.entries(permissionConfig.rolePermissions).map(([role, permissions]) => (
                      <div key={role} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={roleColors[role as UserRole]}>
                            {roleNames[role as UserRole]}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ({permissions.length} 个权限)
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {permissions.map((permission) => (
                            <div
                              key={permission}
                              className="text-sm bg-gray-50 px-2 py-1 rounded border"
                            >
                              {permission}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 编辑用户角色对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑用户角色</DialogTitle>
              <DialogDescription>
                修改用户 {editingUser?.name} 的角色
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">新角色</Label>
                <Select value={newRole} onValueChange={(value) => setNewRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">管理员</SelectItem>
                    <SelectItem value="ORGANIZER">组织者</SelectItem>
                    <SelectItem value="JUDGE">评委</SelectItem>
                    <SelectItem value="USER">普通用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">修改原因</Label>
                <Textarea
                  id="reason"
                  placeholder="请输入修改角色的原因..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={updateUserRole}>
                确认修改
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}