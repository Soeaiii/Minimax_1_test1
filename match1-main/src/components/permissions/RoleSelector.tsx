'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserRole } from '@/lib/types';
import { Users, Shield, Gavel, User, Crown, CheckCircle } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
  showDescription?: boolean;
  allowedRoles?: UserRole[];
  size?: 'sm' | 'md' | 'lg';
}

// 角色配置
const ROLE_CONFIG: Record<UserRole, {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  permissions: string[];
  level: number;
}> = {
  ADMIN: {
    name: '系统管理员',
    description: '拥有系统的完全访问权限，可以管理所有用户、比赛和系统设置',
    icon: Crown,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    permissions: [
      '用户管理', '角色分配', '系统配置', '数据备份',
      '审计日志', '权限管理', '比赛管理', '评委管理'
    ],
    level: 4,
  },
  ORGANIZER: {
    name: '比赛组织者',
    description: '可以创建和管理比赛，分配评委，查看比赛数据和结果',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    permissions: [
      '比赛创建', '比赛管理', '评委分配', '参赛者管理',
      '成绩查看', '数据导出', '比赛设置'
    ],
    level: 3,
  },
  JUDGE: {
    name: '评委',
    description: '可以对分配的比赛进行评分，查看参赛节目和相关信息',
    icon: Gavel,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    permissions: [
      '节目评分', '评分查看', '参赛者信息查看',
      '比赛信息查看', '个人资料管理'
    ],
    level: 2,
  },
  USER: {
    name: '普通用户',
    description: '基础用户权限，可以查看公开信息和管理个人资料',
    icon: User,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 border-gray-200',
    permissions: [
      '个人资料管理', '公开信息查看', '密码修改'
    ],
    level: 1,
  },
};

// 角色层级关系
const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  ADMIN: ['ADMIN', 'ORGANIZER', 'JUDGE', 'USER'],
  ORGANIZER: ['ORGANIZER', 'JUDGE', 'USER'],
  JUDGE: ['JUDGE', 'USER'],
  USER: ['USER'],
};

export function RoleSelector({
  selectedRole,
  onRoleChange,
  disabled = false,
  showDescription = true,
  allowedRoles,
  size = 'md',
}: RoleSelectorProps) {
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  // 获取可选角色
  const getAvailableRoles = (): UserRole[] => {
    if (allowedRoles) {
      return allowedRoles;
    }
    return Object.keys(ROLE_CONFIG) as UserRole[];
  };

  // 检查角色是否可选
  const isRoleSelectable = (role: UserRole): boolean => {
    if (disabled) return false;
    const availableRoles = getAvailableRoles();
    return availableRoles.includes(role);
  };

  // 获取角色卡片样式
  const getRoleCardClass = (role: UserRole): string => {
    const config = ROLE_CONFIG[role];
    const isSelected = selectedRole === role;
    const isHovered = hoveredRole === role;
    const isSelectable = isRoleSelectable(role);
    
    let baseClass = `border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${config.bgColor}`;
    
    if (!isSelectable) {
      baseClass += ' opacity-50 cursor-not-allowed';
    } else if (isSelected) {
      baseClass += ' ring-2 ring-blue-500 border-blue-500';
    } else if (isHovered) {
      baseClass += ' border-blue-300 shadow-md';
    }
    
    return baseClass;
  };

  // 获取尺寸相关的类名
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          grid: 'grid-cols-2 gap-2',
          icon: 'h-4 w-4',
          title: 'text-sm font-medium',
          description: 'text-xs',
          padding: 'p-2',
        };
      case 'lg':
        return {
          grid: 'grid-cols-1 md:grid-cols-2 gap-6',
          icon: 'h-8 w-8',
          title: 'text-lg font-semibold',
          description: 'text-sm',
          padding: 'p-6',
        };
      default:
        return {
          grid: 'grid-cols-1 md:grid-cols-2 gap-4',
          icon: 'h-6 w-6',
          title: 'text-base font-medium',
          description: 'text-sm',
          padding: 'p-4',
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const availableRoles = getAvailableRoles();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          角色选择
        </CardTitle>
        {showDescription && (
          <CardDescription>
            选择用户角色，不同角色拥有不同的权限和访问范围
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 当前选择的角色信息 */}
        {selectedRole && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">当前选择</span>
            </div>
            <div className="flex items-center gap-2">
              {React.createElement(ROLE_CONFIG[selectedRole].icon, {
                className: `h-5 w-5 ${ROLE_CONFIG[selectedRole].color}`,
              })}
              <span className="font-medium">{ROLE_CONFIG[selectedRole].name}</span>
              <Badge className="bg-blue-100 text-blue-800">
                权限级别: {ROLE_CONFIG[selectedRole].level}
              </Badge>
            </div>
          </div>
        )}

        {/* 角色选择 */}
        <RadioGroup
          value={selectedRole}
          onValueChange={(value) => onRoleChange(value as UserRole)}
        >
          <div className={`grid ${sizeClasses.grid}`}>
            {availableRoles.map((role) => {
              const config = ROLE_CONFIG[role];
              const Icon = config.icon;
              const isSelectable = isRoleSelectable(role);
              
              return (
                <div
                  key={role}
                  className={getRoleCardClass(role)}
                  onMouseEnter={() => setHoveredRole(role)}
                  onMouseLeave={() => setHoveredRole(null)}
                  onClick={() => isSelectable && onRoleChange(role)}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem
                      value={role}
                      id={role}
                      disabled={!isSelectable}
                      className="mt-0.5"
                    />
                    <Icon className={`${sizeClasses.icon} ${config.color}`} />
                    <Label
                      htmlFor={role}
                      className={`${sizeClasses.title} cursor-pointer flex-1`}
                    >
                      {config.name}
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      L{config.level}
                    </Badge>
                  </div>
                  
                  {showDescription && size !== 'sm' && (
                    <>
                      <p className={`${sizeClasses.description} text-muted-foreground mb-3`}>
                        {config.description}
                      </p>
                      
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">
                          主要权限:
                        </Label>
                        <div className="flex flex-wrap gap-1">
                          {config.permissions.slice(0, size === 'lg' ? 8 : 4).map((permission) => (
                            <Badge
                              key={permission}
                              variant="secondary"
                              className="text-xs"
                            >
                              {permission}
                            </Badge>
                          ))}
                          {config.permissions.length > (size === 'lg' ? 8 : 4) && (
                            <Badge variant="outline" className="text-xs">
                              +{config.permissions.length - (size === 'lg' ? 8 : 4)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </RadioGroup>

        {/* 角色层级说明 */}
        {showDescription && size !== 'sm' && (
          <>
            <Separator />
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>权限层级说明:</strong></p>
              <p>• 管理员 (L4): 拥有所有权限，可以管理系统和所有用户</p>
              <p>• 组织者 (L3): 可以创建和管理比赛，分配评委</p>
              <p>• 评委 (L2): 可以对分配的比赛进行评分</p>
              <p>• 普通用户 (L1): 基础权限，查看公开信息</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// 简化版角色选择器
export function SimpleRoleSelector({
  selectedRole,
  onRoleChange,
  disabled = false,
  allowedRoles,
}: Omit<RoleSelectorProps, 'showDescription' | 'size'>) {
  return (
    <RoleSelector
      selectedRole={selectedRole}
      onRoleChange={onRoleChange}
      disabled={disabled}
      showDescription={false}
      allowedRoles={allowedRoles}
      size="sm"
    />
  );
}

export default RoleSelector;