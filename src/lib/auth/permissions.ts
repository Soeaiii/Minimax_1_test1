import { UserRole } from '@/lib/types';

// 权限定义
export interface Permission {
  resource: string;
  action: string;
}

// 权限检查结果
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
}

// 角色权限映射
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    { resource: 'user', action: 'create' },
    { resource: 'user', action: 'read' },
    { resource: 'user', action: 'update' },
    { resource: 'user', action: 'delete' },
    { resource: 'user', action: 'manage' },
    { resource: 'competition', action: 'create' },
    { resource: 'competition', action: 'read' },
    { resource: 'competition', action: 'update' },
    { resource: 'competition', action: 'delete' },
    { resource: 'competition', action: 'manage' },
    { resource: 'program', action: 'create' },
    { resource: 'program', action: 'read' },
    { resource: 'program', action: 'update' },
    { resource: 'program', action: 'delete' },
    { resource: 'participant', action: 'create' },
    { resource: 'participant', action: 'read' },
    { resource: 'participant', action: 'update' },
    { resource: 'participant', action: 'delete' },
    { resource: 'score', action: 'create' },
    { resource: 'score', action: 'read' },
    { resource: 'score', action: 'update' },
    { resource: 'score', action: 'delete' },
    { resource: 'judge', action: 'assign' },
    { resource: 'judge', action: 'remove' },
    { resource: 'judge', action: 'manage' },
    { resource: 'tenant', action: 'create' },
    { resource: 'tenant', action: 'read' },
    { resource: 'tenant', action: 'update' },
    { resource: 'tenant', action: 'delete' },
    { resource: 'tenant', action: 'manage' },
    { resource: 'system', action: 'settings' },
    { resource: 'system', action: 'admin' },
    { resource: 'user', action: 'manage_all' },
    { resource: 'data', action: 'export' },
    { resource: 'data', action: 'import' },
    { resource: 'audit', action: 'read' },
  ],
  ADMIN: [
    { resource: 'user', action: 'create' },
    { resource: 'user', action: 'read' },
    { resource: 'user', action: 'update' },
    { resource: 'user', action: 'delete' },
    { resource: 'competition', action: 'create' },
    { resource: 'competition', action: 'read' },
    { resource: 'competition', action: 'update' },
    { resource: 'competition', action: 'delete' },
    { resource: 'program', action: 'create' },
    { resource: 'program', action: 'read' },
    { resource: 'program', action: 'update' },
    { resource: 'program', action: 'delete' },
    { resource: 'participant', action: 'create' },
    { resource: 'participant', action: 'read' },
    { resource: 'participant', action: 'update' },
    { resource: 'participant', action: 'delete' },
    { resource: 'score', action: 'create' },
    { resource: 'score', action: 'read' },
    { resource: 'score', action: 'update' },
    { resource: 'score', action: 'delete' },
    { resource: 'judge', action: 'assign' },
    { resource: 'judge', action: 'remove' },
    { resource: 'system', action: 'settings' },
    { resource: 'data', action: 'export' },
    { resource: 'audit', action: 'read' },
  ],
  ORGANIZER: [
    { resource: 'competition', action: 'create' },
    { resource: 'competition', action: 'read' },
    { resource: 'competition', action: 'update' },
    { resource: 'competition', action: 'manage' },
    { resource: 'program', action: 'create' },
    { resource: 'program', action: 'read' },
    { resource: 'program', action: 'update' },
    { resource: 'program', action: 'delete' },
    { resource: 'participant', action: 'create' },
    { resource: 'participant', action: 'read' },
    { resource: 'participant', action: 'update' },
    { resource: 'participant', action: 'delete' },
    { resource: 'judge', action: 'assign' },
    { resource: 'judge', action: 'remove' },
    { resource: 'score', action: 'read' },
    { resource: 'data', action: 'export' },
  ],
  JUDGE: [
    { resource: 'competition', action: 'read' },
    { resource: 'program', action: 'read' },
    { resource: 'participant', action: 'read' },
    { resource: 'score', action: 'create' },
    { resource: 'score', action: 'read' },
    { resource: 'score', action: 'update' },
  ],
  USER: [
    { resource: 'competition', action: 'read' },
    { resource: 'program', action: 'read' },
    { resource: 'participant', action: 'read' },
    { resource: 'score', action: 'read' },
  ],
};

// 检查用户是否有指定权限
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: string
): PermissionCheckResult {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  
  const hasAccess = rolePermissions.some(
    (permission) => permission.resource === resource && permission.action === action
  );
  
  return {
    hasPermission: hasAccess,
    reason: hasAccess ? undefined : `角色 ${userRole} 没有 ${resource}:${action} 权限`,
  };
}

// 检查用户是否有任一权限
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Permission[]
): PermissionCheckResult {
  for (const permission of permissions) {
    const result = hasPermission(userRole, permission.resource, permission.action);
    if (result.hasPermission) {
      return { hasPermission: true };
    }
  }
  
  return {
    hasPermission: false,
    reason: `角色 ${userRole} 没有所需的任何权限`,
  };
}

// 检查用户是否有所有权限
export function hasAllPermissions(
  userRole: UserRole,
  permissions: Permission[]
): PermissionCheckResult {
  for (const permission of permissions) {
    const result = hasPermission(userRole, permission.resource, permission.action);
    if (!result.hasPermission) {
      return result;
    }
  }
  
  return { hasPermission: true };
}

// 获取角色的所有权限
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// 获取所有可用的权限
export function getAllPermissions(): Permission[] {
  const allPermissions = new Set<string>();
  
  Object.values(ROLE_PERMISSIONS).forEach((permissions) => {
    permissions.forEach((permission) => {
      allPermissions.add(`${permission.resource}:${permission.action}`);
    });
  });
  
  return Array.from(allPermissions).map((permissionString) => {
    const [resource, action] = permissionString.split(':');
    return { resource, action };
  });
}

// 权限常量
export const PERMISSIONS = {
  USER: {
    CREATE: { resource: 'user', action: 'create' },
    READ: { resource: 'user', action: 'read' },
    UPDATE: { resource: 'user', action: 'update' },
    DELETE: { resource: 'user', action: 'delete' },
    MANAGE: { resource: 'user', action: 'manage' },
  },
  COMPETITION: {
    CREATE: { resource: 'competition', action: 'create' },
    READ: { resource: 'competition', action: 'read' },
    UPDATE: { resource: 'competition', action: 'update' },
    DELETE: { resource: 'competition', action: 'delete' },
    MANAGE: { resource: 'competition', action: 'manage' },
  },
  PROGRAM: {
    CREATE: { resource: 'program', action: 'create' },
    READ: { resource: 'program', action: 'read' },
    UPDATE: { resource: 'program', action: 'update' },
    DELETE: { resource: 'program', action: 'delete' },
  },
  PARTICIPANT: {
    CREATE: { resource: 'participant', action: 'create' },
    READ: { resource: 'participant', action: 'read' },
    UPDATE: { resource: 'participant', action: 'update' },
    DELETE: { resource: 'participant', action: 'delete' },
  },
  SCORE: {
    CREATE: { resource: 'score', action: 'create' },
    READ: { resource: 'score', action: 'read' },
    UPDATE: { resource: 'score', action: 'update' },
    DELETE: { resource: 'score', action: 'delete' },
  },
  SCORING_CRITERIA: {
    CREATE: { resource: 'scoring-criteria', action: 'create' },
    READ: { resource: 'scoring-criteria', action: 'read' },
    UPDATE: { resource: 'scoring-criteria', action: 'update' },
    DELETE: { resource: 'scoring-criteria', action: 'delete' },
  },
  JUDGE: {
    ASSIGN: { resource: 'judge', action: 'assign' },
    REMOVE: { resource: 'judge', action: 'remove' },
    READ: { resource: 'judge', action: 'read' },
    MANAGE: { resource: 'judge', action: 'manage' },
  },
  TENANT: {
    CREATE: { resource: 'tenant', action: 'create' },
    READ: { resource: 'tenant', action: 'read' },
    UPDATE: { resource: 'tenant', action: 'update' },
    DELETE: { resource: 'tenant', action: 'delete' },
    MANAGE: { resource: 'tenant', action: 'manage' },
  },
  SYSTEM: {
    SETTINGS: { resource: 'system', action: 'settings' },
  },
  DATA: {
    EXPORT: { resource: 'data', action: 'export' },
  },
  AUDIT: {
    READ: { resource: 'audit', action: 'read' },
  },
} as const;