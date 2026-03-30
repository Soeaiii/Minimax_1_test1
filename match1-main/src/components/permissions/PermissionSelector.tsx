'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Shield, Users, Database, Settings, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Permission, PERMISSIONS } from '@/lib/auth/permissions';

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onPermissionsChange: (permissions: string[]) => void;
  disabled?: boolean;
  showCategories?: boolean;
  allowCustomPermissions?: boolean;
}

// 权限分类
const PERMISSION_CATEGORIES = {
  user: {
    name: '用户管理',
    icon: Users,
    permissions: ['user.create', 'user.read', 'user.update', 'user.delete', 'user.manage_roles'],
  },
  competition: {
    name: '比赛管理',
    icon: Shield,
    permissions: ['competition.create', 'competition.read', 'competition.update', 'competition.delete', 'competition.manage'],
  },
  program: {
    name: '节目管理',
    icon: Eye,
    permissions: ['program.create', 'program.read', 'program.update', 'program.delete', 'program.score'],
  },
  judge: {
    name: '评委管理',
    icon: Users,
    permissions: ['judge.create', 'judge.read', 'judge.update', 'judge.delete', 'judge.assign'],
  },
  system: {
    name: '系统管理',
    icon: Settings,
    permissions: ['system.config', 'system.audit', 'system.backup', 'system.monitor'],
  },
  data: {
    name: '数据管理',
    icon: Database,
    permissions: ['data.export', 'data.import', 'data.backup', 'data.restore'],
  },
};

// 权限名称映射
const PERMISSION_NAMES: Record<string, string> = {
  'user.create': '创建用户',
  'user.read': '查看用户',
  'user.update': '编辑用户',
  'user.delete': '删除用户',
  'user.manage_roles': '管理用户角色',
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

export function PermissionSelector({
  selectedPermissions,
  onPermissionsChange,
  disabled = false,
  showCategories = true,
  allowCustomPermissions = false,
}: PermissionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customPermission, setCustomPermission] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    Object.keys(PERMISSION_CATEGORIES)
  );

  // 获取所有可用权限
  const getAllPermissions = () => {
    const categoryPermissions = Object.values(PERMISSION_CATEGORIES)
      .flatMap(category => category.permissions);
    const builtInPermissions = Object.keys(PERMISSIONS);
    return [...new Set([...categoryPermissions, ...builtInPermissions])];
  };

  // 过滤权限
  const getFilteredPermissions = (permissions: string[]) => {
    if (!searchTerm) return permissions;
    return permissions.filter(permission => {
      const name = PERMISSION_NAMES[permission] || permission;
      return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             permission.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // 切换权限选择
  const togglePermission = (permission: string) => {
    if (disabled) return;
    
    const newPermissions = selectedPermissions.includes(permission)
      ? selectedPermissions.filter(p => p !== permission)
      : [...selectedPermissions, permission];
    
    onPermissionsChange(newPermissions);
  };

  // 切换分类展开状态
  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey)
        ? prev.filter(key => key !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  // 选择分类下所有权限
  const selectCategoryPermissions = (categoryKey: string, select: boolean) => {
    if (disabled) return;
    
    const category = PERMISSION_CATEGORIES[categoryKey as keyof typeof PERMISSION_CATEGORIES];
    if (!category) return;

    const newPermissions = select
      ? [...new Set([...selectedPermissions, ...category.permissions])]
      : selectedPermissions.filter(p => !category.permissions.includes(p));
    
    onPermissionsChange(newPermissions);
  };

  // 添加自定义权限
  const addCustomPermission = () => {
    if (!customPermission.trim() || selectedPermissions.includes(customPermission)) return;
    
    onPermissionsChange([...selectedPermissions, customPermission.trim()]);
    setCustomPermission('');
  };

  // 移除权限
  const removePermission = (permission: string) => {
    if (disabled) return;
    onPermissionsChange(selectedPermissions.filter(p => p !== permission));
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (disabled) return;
    
    const allPermissions = getAllPermissions();
    const isAllSelected = allPermissions.every(p => selectedPermissions.includes(p));
    
    onPermissionsChange(isAllSelected ? [] : allPermissions);
  };

  const allPermissions = getAllPermissions();
  const isAllSelected = allPermissions.every(p => selectedPermissions.includes(p));
  const isPartiallySelected = selectedPermissions.length > 0 && !isAllSelected;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          权限选择器
        </CardTitle>
        <CardDescription>
          选择要分配的权限，支持按分类浏览和搜索
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 搜索和操作 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="搜索权限..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={disabled}
            />
          </div>
          <Button
            variant="outline"
            onClick={toggleSelectAll}
            disabled={disabled}
          >
            {isAllSelected ? '取消全选' : '全选'}
          </Button>
        </div>

        {/* 已选权限概览 */}
        {selectedPermissions.length > 0 && (
          <div>
            <Label className="text-sm font-medium">已选权限 ({selectedPermissions.length})</Label>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedPermissions.map((permission) => (
                <Badge
                  key={permission}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {PERMISSION_NAMES[permission] || permission}
                  {!disabled && (
                    <button
                      onClick={() => removePermission(permission)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* 权限列表 */}
        <ScrollArea className="h-96">
          {showCategories ? (
            // 按分类显示
            <div className="space-y-4">
              {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => {
                const filteredPermissions = getFilteredPermissions(category.permissions);
                if (filteredPermissions.length === 0 && searchTerm) return null;

                const categorySelectedCount = category.permissions.filter(p => 
                  selectedPermissions.includes(p)
                ).length;
                const isCategoryExpanded = expandedCategories.includes(categoryKey);
                const Icon = category.icon;

                return (
                  <div key={categoryKey} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => toggleCategory(categoryKey)}
                        className="flex items-center gap-2 text-sm font-medium hover:text-blue-600"
                        disabled={disabled}
                      >
                        <Icon className="h-4 w-4" />
                        {category.name}
                        <Badge variant="outline">
                          {categorySelectedCount}/{category.permissions.length}
                        </Badge>
                      </button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => selectCategoryPermissions(categoryKey, true)}
                          disabled={disabled || categorySelectedCount === category.permissions.length}
                        >
                          全选
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => selectCategoryPermissions(categoryKey, false)}
                          disabled={disabled || categorySelectedCount === 0}
                        >
                          清除
                        </Button>
                      </div>
                    </div>
                    
                    {isCategoryExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {filteredPermissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission}
                              checked={selectedPermissions.includes(permission)}
                              onCheckedChange={() => togglePermission(permission)}
                              disabled={disabled}
                            />
                            <Label
                              htmlFor={permission}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {PERMISSION_NAMES[permission] || permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // 平铺显示
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getFilteredPermissions(allPermissions).map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={selectedPermissions.includes(permission)}
                    onCheckedChange={() => togglePermission(permission)}
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={permission}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {PERMISSION_NAMES[permission] || permission}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* 自定义权限 */}
        {allowCustomPermissions && (
          <div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">添加自定义权限</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="输入权限标识符，如: custom.action"
                  value={customPermission}
                  onChange={(e) => setCustomPermission(e.target.value)}
                  disabled={disabled}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addCustomPermission();
                    }
                  }}
                />
                <Button
                  onClick={addCustomPermission}
                  disabled={disabled || !customPermission.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PermissionSelector;