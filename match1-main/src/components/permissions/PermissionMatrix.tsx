'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { UserRole } from '@/lib/types';
import { ROLE_PERMISSIONS } from '@/lib/auth/permissions';
import { Search, Grid, List, Download, Upload, Save, RotateCcw, Eye, Edit, Trash2, Plus, Check, X } from 'lucide-react';

interface PermissionMatrixProps {
  editable?: boolean;
  onSave?: (matrix: RolePermissionMatrix) => void;
  initialMatrix?: RolePermissionMatrix;
  showActions?: boolean;
}

interface RolePermissionMatrix {
  [role: string]: {
    [permission: string]: boolean;
  };
}

// 权限分类
const PERMISSION_CATEGORIES = {
  user: {
    name: '用户管理',
    permissions: ['user.create', 'user.read', 'user.update', 'user.delete', 'user.manage_roles'],
  },
  competition: {
    name: '比赛管理',
    permissions: ['competition.create', 'competition.read', 'competition.update', 'competition.delete', 'competition.manage'],
  },
  program: {
    name: '节目管理',
    permissions: ['program.create', 'program.read', 'program.update', 'program.delete', 'program.score'],
  },
  judge: {
    name: '评委管理',
    permissions: ['judge.create', 'judge.read', 'judge.update', 'judge.delete', 'judge.assign'],
  },
  system: {
    name: '系统管理',
    permissions: ['system.config', 'system.audit', 'system.backup', 'system.monitor'],
  },
  data: {
    name: '数据管理',
    permissions: ['data.export', 'data.import', 'data.backup', 'data.restore'],
  },
};

// 权限名称映射
const PERMISSION_NAMES: Record<string, string> = {
  'user.create': '创建用户',
  'user.read': '查看用户',
  'user.update': '编辑用户',
  'user.delete': '删除用户',
  'user.manage_roles': '管理角色',
  'competition.create': '创建比赛',
  'competition.read': '查看比赛',
  'competition.update': '编辑比赛',
  'competition.delete': '删除比赛',
  'competition.manage': '管理比赛',
  'program.create': '创建节目',
  'program.read': '查看节目',
  'program.update': '编辑节目',
  'program.delete': '删除节目',
  'program.score': '评分节目',
  'judge.create': '创建评委',
  'judge.read': '查看评委',
  'judge.update': '编辑评委',
  'judge.delete': '删除评委',
  'judge.assign': '分配评委',
  'system.config': '系统配置',
  'system.audit': '审计日志',
  'system.backup': '系统备份',
  'system.monitor': '系统监控',
  'data.export': '数据导出',
  'data.import': '数据导入',
  'data.backup': '数据备份',
  'data.restore': '数据恢复',
};

// 角色名称映射
const ROLE_NAMES: Record<UserRole, string> = {
  ADMIN: '管理员',
  ORGANIZER: '组织者',
  JUDGE: '评委',
  USER: '普通用户',
};

// 角色颜色映射
const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  ORGANIZER: 'bg-blue-100 text-blue-800',
  JUDGE: 'bg-green-100 text-green-800',
  USER: 'bg-gray-100 text-gray-800',
};

export function PermissionMatrix({
  editable = false,
  onSave,
  initialMatrix,
  showActions = true,
}: PermissionMatrixProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [matrix, setMatrix] = useState<RolePermissionMatrix>(() => {
    if (initialMatrix) return initialMatrix;
    
    // 从 ROLE_PERMISSIONS 构建初始矩阵
    const defaultMatrix: RolePermissionMatrix = {};
    const roles = Object.keys(ROLE_PERMISSIONS) as UserRole[];
    const allPermissions = new Set<string>();
    
    // 收集所有权限
    Object.values(PERMISSION_CATEGORIES).forEach(category => {
      category.permissions.forEach(permission => allPermissions.add(permission));
    });
    
    roles.forEach(role => {
      defaultMatrix[role] = {};
      allPermissions.forEach(permission => {
        const hasPermission = ROLE_PERMISSIONS[role]?.some(p => 
          `${p.resource}:${p.action}` === permission
        ) || false;
        defaultMatrix[role][permission] = hasPermission;
      });
    });
    
    return defaultMatrix;
  });
  const [hasChanges, setHasChanges] = useState(false);

  // 获取所有权限
  const getAllPermissions = () => {
    return Object.values(PERMISSION_CATEGORIES)
      .flatMap(category => category.permissions);
  };

  // 获取过滤后的权限
  const getFilteredPermissions = () => {
    let permissions = getAllPermissions();
    
    // 按分类过滤
    if (selectedCategory !== 'all') {
      const category = PERMISSION_CATEGORIES[selectedCategory as keyof typeof PERMISSION_CATEGORIES];
      permissions = category ? category.permissions : [];
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      permissions = permissions.filter(permission => {
        const name = PERMISSION_NAMES[permission] || permission;
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               permission.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    return permissions;
  };

  // 切换权限
  const togglePermission = (role: UserRole, permission: string) => {
    if (!editable) return;
    
    setMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role]?.[permission],
      },
    }));
    setHasChanges(true);
  };

  // 切换角色的所有权限
  const toggleRolePermissions = (role: UserRole, enabled: boolean) => {
    if (!editable) return;
    
    const permissions = getFilteredPermissions();
    setMatrix(prev => {
      const newMatrix = { ...prev };
      permissions.forEach(permission => {
        if (!newMatrix[role]) newMatrix[role] = {};
        newMatrix[role][permission] = enabled;
      });
      return newMatrix;
    });
    setHasChanges(true);
  };

  // 切换权限的所有角色
  const togglePermissionRoles = (permission: string, enabled: boolean) => {
    if (!editable) return;
    
    const roles = Object.keys(ROLE_NAMES) as UserRole[];
    setMatrix(prev => {
      const newMatrix = { ...prev };
      roles.forEach(role => {
        if (!newMatrix[role]) newMatrix[role] = {};
        newMatrix[role][permission] = enabled;
      });
      return newMatrix;
    });
    setHasChanges(true);
  };

  // 保存更改
  const handleSave = () => {
    if (onSave) {
      onSave(matrix);
      setHasChanges(false);
    }
  };

  // 重置更改
  const handleReset = () => {
    if (initialMatrix) {
      setMatrix(initialMatrix);
      setHasChanges(false);
    }
  };

  // 导出矩阵
  const exportMatrix = () => {
    const dataStr = JSON.stringify(matrix, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'permission-matrix.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // 导入矩阵
  const importMatrix = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedMatrix = JSON.parse(e.target?.result as string);
        setMatrix(importedMatrix);
        setHasChanges(true);
      } catch (error) {
        console.error('Error importing matrix:', error);
      }
    };
    reader.readAsText(file);
  };

  const filteredPermissions = getFilteredPermissions();
  const roles = Object.keys(ROLE_NAMES) as UserRole[];

  // 计算统计信息
  const stats = useMemo(() => {
    const roleStats: Record<UserRole, number> = {} as Record<UserRole, number>;
    const permissionStats: Record<string, number> = {};
    
    roles.forEach(role => {
      roleStats[role] = filteredPermissions.filter(permission => 
        matrix[role]?.[permission]
      ).length;
    });
    
    filteredPermissions.forEach(permission => {
      permissionStats[permission] = roles.filter(role => 
        matrix[role]?.[permission]
      ).length;
    });
    
    return { roleStats, permissionStats };
  }, [matrix, filteredPermissions, roles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid className="h-5 w-5" />
          权限矩阵
        </CardTitle>
        <CardDescription>
          查看和管理角色与权限的对应关系
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 工具栏 */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索权限..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Label>分类:</Label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">全部</option>
              {Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={exportMatrix}>
                <Download className="h-4 w-4 mr-1" />
                导出
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-1" />
                    导入
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importMatrix}
                  className="hidden"
                />
              </label>
              {editable && hasChanges && (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    保存
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    重置
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {roles.map(role => (
            <div key={role} className="text-center">
              <Badge className={ROLE_COLORS[role]}>
                {ROLE_NAMES[role]}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">
                {stats.roleStats[role]}/{filteredPermissions.length} 权限
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* 权限矩阵 */}
        {viewMode === 'grid' ? (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {/* 表头 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                <div className="font-medium">权限</div>
                {roles.map(role => (
                  <div key={role} className="text-center">
                    <Badge className={ROLE_COLORS[role]} variant="outline">
                      {ROLE_NAMES[role]}
                    </Badge>
                    {editable && (
                      <div className="flex justify-center gap-1 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRolePermissions(role, true)}
                          className="h-6 px-2 text-xs"
                        >
                          全选
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRolePermissions(role, false)}
                          className="h-6 px-2 text-xs"
                        >
                          清除
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* 权限行 */}
              {filteredPermissions.map(permission => (
                <div key={permission} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center py-2 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">
                        {PERMISSION_NAMES[permission] || permission}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {permission}
                      </div>
                    </div>
                    {editable && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePermissionRoles(permission, true)}
                          className="h-6 px-2 text-xs"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePermissionRoles(permission, false)}
                          className="h-6 px-2 text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {roles.map(role => (
                    <div key={`${role}-${permission}`} className="flex justify-center">
                      <Checkbox
                        checked={matrix[role]?.[permission] || false}
                        onCheckedChange={() => togglePermission(role, permission)}
                        disabled={!editable}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <Tabs defaultValue={roles[0]} className="space-y-4">
            <TabsList>
              {roles.map(role => (
                <TabsTrigger key={role} value={role} className="flex items-center gap-2">
                  <Badge className={ROLE_COLORS[role]} variant="outline">
                    {ROLE_NAMES[role]}
                  </Badge>
                  <span className="text-xs">({stats.roleStats[role]})</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {roles.map(role => (
              <TabsContent key={role} value={role}>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {editable && (
                      <div className="flex gap-2 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRolePermissions(role, true)}
                        >
                          全选
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRolePermissions(role, false)}
                        >
                          清除
                        </Button>
                      </div>
                    )}
                    
                    {filteredPermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2 p-2 border rounded">
                        <Checkbox
                          checked={matrix[role]?.[permission] || false}
                          onCheckedChange={() => togglePermission(role, permission)}
                          disabled={!editable}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {PERMISSION_NAMES[permission] || permission}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {permission}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {filteredPermissions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            没有找到匹配的权限
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PermissionMatrix;