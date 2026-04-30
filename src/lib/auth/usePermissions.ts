'use client';

import { useSession } from 'next-auth/react';
import { useMemo, useCallback } from 'react';
import { UserRole } from '@/lib/types';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  Permission,
  PermissionCheckResult,
} from './permissions';

export interface UsePermissionsReturn {
  // 基础信息
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  userRole: UserRole | null;
  
  // 权限检查函数
  checkPermission: (resource: string, action: string) => PermissionCheckResult;
  checkAnyPermission: (permissions: Permission[]) => PermissionCheckResult;
  checkAllPermissions: (permissions: Permission[]) => PermissionCheckResult;
  
  // 便捷的权限检查
  canCreate: (resource: string) => boolean;
  canRead: (resource: string) => boolean;
  canUpdate: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  
  // 角色检查
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isAnyAdmin: boolean;
  isOrganizer: boolean;
  isJudge: boolean;
  isUser: boolean;
  
  // 权限列表
  permissions: Permission[];
}

export function usePermissions(): UsePermissionsReturn {
  const { data: session, status } = useSession();
  
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const userRole = user?.role as UserRole | null;
  
  // 获取用户权限列表
  const permissions = useMemo(() => {
    if (!userRole) return [];
    return getRolePermissions(userRole);
  }, [userRole]);
  
  // 权限检查函数
  const checkPermission = useCallback(
    (resource: string, action: string): PermissionCheckResult => {
      if (!userRole) {
        return {
          hasPermission: false,
          reason: '用户未登录',
        };
      }
      return hasPermission(userRole, resource, action);
    },
    [userRole]
  );
  
  const checkAnyPermission = useCallback(
    (permissions: Permission[]): PermissionCheckResult => {
      if (!userRole) {
        return {
          hasPermission: false,
          reason: '用户未登录',
        };
      }
      return hasAnyPermission(userRole, permissions);
    },
    [userRole]
  );
  
  const checkAllPermissions = useCallback(
    (permissions: Permission[]): PermissionCheckResult => {
      if (!userRole) {
        return {
          hasPermission: false,
          reason: '用户未登录',
        };
      }
      return hasAllPermissions(userRole, permissions);
    },
    [userRole]
  );
  
  // 便捷的权限检查函数
  const canCreate = useCallback(
    (resource: string): boolean => {
      return checkPermission(resource, 'create').hasPermission;
    },
    [checkPermission]
  );
  
  const canRead = useCallback(
    (resource: string): boolean => {
      return checkPermission(resource, 'read').hasPermission;
    },
    [checkPermission]
  );
  
  const canUpdate = useCallback(
    (resource: string): boolean => {
      return checkPermission(resource, 'update').hasPermission;
    },
    [checkPermission]
  );
  
  const canDelete = useCallback(
    (resource: string): boolean => {
      return checkPermission(resource, 'delete').hasPermission;
    },
    [checkPermission]
  );
  
  // 角色检查
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isAdmin = userRole === 'ADMIN';
  const isAnyAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
  const isOrganizer = userRole === 'ORGANIZER';
  const isJudge = userRole === 'JUDGE';
  const isUser = userRole === 'USER';
  
  return {
    isLoading,
    isAuthenticated,
    user,
    userRole,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    isSuperAdmin,
    isAdmin,
    isAnyAdmin,
    isOrganizer,
    isJudge,
    isUser,
    permissions,
  };
}

// 权限检查Hook - 用于组件级别的权限控制
export function usePermissionCheck(
  resource: string,
  action: string
): {
  hasPermission: boolean;
  isLoading: boolean;
  reason?: string;
} {
  const { checkPermission, isLoading } = usePermissions();
  
  const result = useMemo(() => {
    if (isLoading) {
      return { hasPermission: false, isLoading: true };
    }
    
    const permissionResult = checkPermission(resource, action);
    return {
      hasPermission: permissionResult.hasPermission,
      isLoading: false,
      reason: permissionResult.reason,
    };
  }, [checkPermission, resource, action, isLoading]);
  
  return result;
}

// 角色检查Hook
export function useRoleCheck(allowedRoles: UserRole[]): {
  hasRole: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
} {
  const { userRole, isLoading } = usePermissions();
  
  const hasRole = useMemo(() => {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  }, [userRole, allowedRoles]);
  
  return {
    hasRole,
    isLoading,
    userRole,
  };
}