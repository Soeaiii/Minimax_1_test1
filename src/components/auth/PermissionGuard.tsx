'use client';

import React from 'react';
import { usePermissions, usePermissionCheck, useRoleCheck } from '@/lib/auth/usePermissions';
import { UserRole } from '@/lib/types';
import { Permission } from '@/lib/auth/permissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle } from 'lucide-react';

// 权限保护组件的属性
export interface PermissionGuardProps {
  children: React.ReactNode;
  // 权限检查方式（三选一）
  permission?: { resource: string; action: string };
  permissions?: Permission[];
  roles?: UserRole[];
  // 检查模式
  requireAll?: boolean; // 是否需要所有权限（默认false，即任一权限即可）
  // 无权限时的显示
  fallback?: React.ReactNode;
  showError?: boolean; // 是否显示错误信息
  // 加载状态
  showLoading?: boolean;
}

// 权限保护组件
export function PermissionGuard({
  children,
  permission,
  permissions,
  roles,
  requireAll = false,
  fallback = null,
  showError = false,
  showLoading = true,
}: PermissionGuardProps) {
  const {
    isLoading,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    userRole,
  } = usePermissions();
  
  // 加载状态
  if (isLoading && showLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner size="sm" />
      </div>
    );
  }
  
  let hasAccess = false;
  let errorMessage = '';
  
  // 角色检查
  if (roles && roles.length > 0) {
    hasAccess = userRole ? roles.includes(userRole) : false;
    if (!hasAccess) {
      errorMessage = `需要以下角色之一: ${roles.join(', ')}`;
    }
  }
  // 单个权限检查
  else if (permission) {
    const result = checkPermission(permission.resource, permission.action);
    hasAccess = result.hasPermission;
    errorMessage = result.reason || '';
  }
  // 多个权限检查
  else if (permissions && permissions.length > 0) {
    const result = requireAll
      ? checkAllPermissions(permissions)
      : checkAnyPermission(permissions);
    hasAccess = result.hasPermission;
    errorMessage = result.reason || '';
  }
  // 默认允许访问（如果没有指定任何权限要求）
  else {
    hasAccess = true;
  }
  
  // 有权限时显示内容
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // 无权限时的处理
  if (showError && errorMessage) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }
  
  // 返回fallback或null
  return <>{fallback}</>;
}

// 角色保护组件
export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  showError?: boolean;
  showLoading?: boolean;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  showError = false,
  showLoading = true,
}: RoleGuardProps) {
  const { hasRole, isLoading, userRole } = useRoleCheck(allowedRoles);
  
  if (isLoading && showLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner size="sm" />
      </div>
    );
  }
  
  if (hasRole) {
    return <>{children}</>;
  }
  
  if (showError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          需要以下角色之一: {allowedRoles.join(', ')}。当前角色: {userRole || '未登录'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return <>{fallback}</>;
}

// 管理员保护组件
export function AdminGuard({
  children,
  fallback = null,
  showError = false,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}) {
  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPER_ADMIN']}
      fallback={fallback}
      showError={showError}
    >
      {children}
    </RoleGuard>
  );
}

// 组织者保护组件
export function OrganizerGuard({
  children,
  fallback = null,
  showError = false,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}) {
  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPER_ADMIN', 'ORGANIZER']}
      fallback={fallback}
      showError={showError}
    >
      {children}
    </RoleGuard>
  );
}

// 评委保护组件
export function JudgeGuard({
  children,
  fallback = null,
  showError = false,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}) {
  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPER_ADMIN', 'ORGANIZER', 'JUDGE']}
      fallback={fallback}
      showError={showError}
    >
      {children}
    </RoleGuard>
  );
}

// 权限按钮组件
export interface PermissionButtonProps {
  children: React.ReactNode;
  permission?: { resource: string; action: string };
  roles?: UserRole[];
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function PermissionButton({
  children,
  permission,
  roles,
  onClick,
  disabled = false,
  className = '',
  variant = 'default',
}: PermissionButtonProps) {
  const { checkPermission, userRole } = usePermissions();
  
  let hasAccess = false;
  
  if (roles && roles.length > 0) {
    hasAccess = userRole ? roles.includes(userRole) : false;
  } else if (permission) {
    hasAccess = checkPermission(permission.resource, permission.action).hasPermission;
  } else {
    hasAccess = true;
  }
  
  if (!hasAccess) {
    return null;
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
    </button>
  );
}

// 权限链接组件
export interface PermissionLinkProps {
  children: React.ReactNode;
  href: string;
  permission?: { resource: string; action: string };
  roles?: UserRole[];
  className?: string;
}

export function PermissionLink({
  children,
  href,
  permission,
  roles,
  className = '',
}: PermissionLinkProps) {
  const { checkPermission, userRole } = usePermissions();
  
  let hasAccess = false;
  
  if (roles && roles.length > 0) {
    hasAccess = userRole ? roles.includes(userRole) : false;
  } else if (permission) {
    hasAccess = checkPermission(permission.resource, permission.action).hasPermission;
  } else {
    hasAccess = true;
  }
  
  if (!hasAccess) {
    return null;
  }
  
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}