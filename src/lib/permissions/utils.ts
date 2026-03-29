import { UserRole } from '@/lib/types';
import { PERMISSIONS, ROLE_PERMISSIONS } from '@/lib/auth/permissions';

// 权限检查结果接口
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  requiredRole?: UserRole;
  requiredPermissions?: string[];
}

// 数据范围类型
export type DataScope = 'all' | 'organization' | 'department' | 'own';

// 权限上下文接口
export interface PermissionContext {
  userId: string;
  userRole: UserRole;
  organizationId?: string;
  departmentId?: string;
  resourceOwnerId?: string;
  resourceType?: string;
  action?: string;
}

// 角色层级定义
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 4,
  ORGANIZER: 3,
  JUDGE: 2,
  USER: 1,
};

// 数据范围配置
export const DATA_SCOPE_CONFIG: Record<UserRole, DataScope> = {
  ADMIN: 'all',
  ORGANIZER: 'organization',
  JUDGE: 'department',
  USER: 'own',
};

// 资源类型权限映射
export const RESOURCE_PERMISSIONS: Record<string, string[]> = {
  user: ['users.create', 'users.read', 'users.update', 'users.delete'],
  competition: ['competitions.create', 'competitions.read', 'competitions.update', 'competitions.delete'],
  program: ['programs.create', 'programs.read', 'programs.update', 'programs.delete'],
  judge: ['judges.create', 'judges.read', 'judges.update', 'judges.delete'],
  score: ['scores.create', 'scores.read', 'scores.update', 'scores.delete'],
  report: ['reports.create', 'reports.read', 'reports.update', 'reports.delete'],
};

/**
 * 检查用户是否具有指定权限
 */
export function hasPermission(
  userRole: UserRole,
  permission: string
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.some(p => `${p.resource}:${p.action}` === permission);
}

/**
 * 检查用户是否具有任一权限
 */
export function hasAnyPermission(
  userRole: UserRole,
  permissions: string[]
): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * 检查用户是否具有所有权限
 */
export function hasAllPermissions(
  userRole: UserRole,
  permissions: string[]
): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * 检查角色层级
 */
export function hasRoleLevel(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * 获取用户数据访问范围
 */
export function getUserDataScope(userRole: UserRole): DataScope {
  return DATA_SCOPE_CONFIG[userRole];
}

/**
 * 检查数据访问权限
 */
export function checkDataAccess(
  context: PermissionContext,
  targetResourceOwnerId?: string
): PermissionCheckResult {
  const { userId, userRole, organizationId, departmentId, resourceOwnerId } = context;
  const dataScope = getUserDataScope(userRole);
  const targetOwnerId = targetResourceOwnerId || resourceOwnerId;

  switch (dataScope) {
    case 'all':
      return { allowed: true };
    
    case 'organization':
      if (!organizationId) {
        return {
          allowed: false,
          reason: '缺少组织信息',
        };
      }
      // 这里应该检查目标资源是否属于同一组织
      return { allowed: true };
    
    case 'department':
      if (!departmentId) {
        return {
          allowed: false,
          reason: '缺少部门信息',
        };
      }
      // 这里应该检查目标资源是否属于同一部门
      return { allowed: true };
    
    case 'own':
      if (!targetOwnerId) {
        return {
          allowed: false,
          reason: '缺少资源所有者信息',
        };
      }
      return {
        allowed: userId === targetOwnerId,
        reason: userId !== targetOwnerId ? '只能访问自己的资源' : undefined,
      };
    
    default:
      return {
        allowed: false,
        reason: '未知的数据访问范围',
      };
  }
}

/**
 * 综合权限检查
 */
export function checkPermission(
  context: PermissionContext,
  requiredPermissions: string[] = [],
  requiredRole?: UserRole,
  shouldCheckDataAccess: boolean = true
): PermissionCheckResult {
  const { userRole } = context;

  // 检查角色层级
  if (requiredRole && !hasRoleLevel(userRole, requiredRole)) {
    return {
      allowed: false,
      reason: `需要 ${requiredRole} 或更高级别的角色`,
      requiredRole,
    };
  }

  // 检查具体权限
  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(
      permission => !hasPermission(userRole, permission)
    );
    
    if (missingPermissions.length > 0) {
      return {
        allowed: false,
        reason: `缺少权限: ${missingPermissions.join(', ')}`,
        requiredPermissions: missingPermissions,
      };
    }
  }

  // 检查数据访问权限
  if (shouldCheckDataAccess) {
    const dataAccessResult = checkDataAccess(context);
    if (!dataAccessResult.allowed) {
      return dataAccessResult;
    }
  }

  return { allowed: true };
}

/**
 * 获取资源的CRUD权限
 */
export function getResourcePermissions(resourceType: string): string[] {
  return RESOURCE_PERMISSIONS[resourceType] || [];
}

/**
 * 检查资源操作权限
 */
export function checkResourcePermission(
  context: PermissionContext,
  resourceType: string,
  action: 'create' | 'read' | 'update' | 'delete'
): PermissionCheckResult {
  const permission = `${resourceType}.${action}`;
  return checkPermission(context, [permission]);
}

/**
 * 过滤用户可访问的资源列表
 */
export function filterAccessibleResources<T extends { id: string; ownerId?: string }>(
  resources: T[],
  context: PermissionContext
): T[] {
  const dataScope = getUserDataScope(context.userRole);
  
  switch (dataScope) {
    case 'all':
      return resources;
    
    case 'own':
      return resources.filter(resource => 
        resource.ownerId === context.userId
      );
    
    // 对于 organization 和 department，需要根据实际业务逻辑实现
    case 'organization':
    case 'department':
      // 这里应该根据实际的组织架构进行过滤
      return resources;
    
    default:
      return [];
  }
}

/**
 * 生成权限检查的SQL WHERE条件
 */
export function generateDataScopeWhereClause(
  context: PermissionContext,
  tableAlias: string = ''
): string {
  const { userId, userRole, organizationId, departmentId } = context;
  const dataScope = getUserDataScope(userRole);
  const prefix = tableAlias ? `${tableAlias}.` : '';

  switch (dataScope) {
    case 'all':
      return '1=1'; // 无限制
    
    case 'organization':
      return organizationId 
        ? `${prefix}organization_id = '${organizationId}'`
        : '1=0'; // 无组织信息，拒绝访问
    
    case 'department':
      return departmentId 
        ? `${prefix}department_id = '${departmentId}'`
        : '1=0'; // 无部门信息，拒绝访问
    
    case 'own':
      return `${prefix}owner_id = '${userId}'`;
    
    default:
      return '1=0'; // 默认拒绝访问
  }
}

/**
 * 权限缓存工具
 */
class PermissionCache {
  private cache = new Map<string, { result: PermissionCheckResult; expiry: number }>();
  private ttl = 5 * 60 * 1000; // 5分钟缓存

  private generateKey(context: PermissionContext, permissions: string[], role?: UserRole): string {
    return JSON.stringify({
      userId: context.userId,
      userRole: context.userRole,
      permissions: permissions.sort(),
      role,
      resourceType: context.resourceType,
      action: context.action,
    });
  }

  get(
    context: PermissionContext,
    permissions: string[] = [],
    role?: UserRole
  ): PermissionCheckResult | null {
    const key = this.generateKey(context, permissions, role);
    const cached = this.cache.get(key);
    
    if (cached && cached.expiry > Date.now()) {
      return cached.result;
    }
    
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  set(
    context: PermissionContext,
    permissions: string[] = [],
    role: UserRole | undefined,
    result: PermissionCheckResult
  ): void {
    const key = this.generateKey(context, permissions, role);
    this.cache.set(key, {
      result,
      expiry: Date.now() + this.ttl,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  clearUser(userId: string): void {
    for (const [key, value] of this.cache.entries()) {
      if (key.includes(`"userId":"${userId}"`)) {
        this.cache.delete(key);
      }
    }
  }
}

// 全局权限缓存实例
export const permissionCache = new PermissionCache();

/**
 * 带缓存的权限检查
 */
export function checkPermissionWithCache(
  context: PermissionContext,
  requiredPermissions: string[] = [],
  requiredRole?: UserRole,
  useCache: boolean = true
): PermissionCheckResult {
  if (useCache) {
    const cached = permissionCache.get(context, requiredPermissions, requiredRole);
    if (cached) {
      return cached;
    }
  }

  const result = checkPermission(context, requiredPermissions, requiredRole);

  if (useCache) {
    permissionCache.set(context, requiredPermissions, requiredRole, result);
  }

  return result;
}

/**
 * 权限验证装饰器（用于类方法）
 */
export function RequirePermissions(permissions: string[], role?: UserRole) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // 假设第一个参数包含权限上下文
      const context = args[0] as PermissionContext;
      const result = checkPermission(context, permissions, role);
      
      if (!result.allowed) {
        throw new Error(`权限不足: ${result.reason}`);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * 批量权限检查
 */
export function checkMultiplePermissions(
  context: PermissionContext,
  permissionSets: Array<{
    permissions: string[];
    role?: UserRole;
    description?: string;
  }>
): Array<PermissionCheckResult & { description?: string }> {
  return permissionSets.map(({ permissions, role, description }) => ({
    ...checkPermission(context, permissions, role),
    description,
  }));
}

/**
 * 获取用户的所有权限
 */
export function getUserPermissions(userRole: UserRole): string[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.map(p => `${p.resource}:${p.action}`);
}

/**
 * 获取权限的显示名称
 */
export function getPermissionDisplayName(permission: string): string {
  const permissionNames: Record<string, string> = {
    'users.create': '创建用户',
    'users.read': '查看用户',
    'users.update': '编辑用户',
    'users.delete': '删除用户',
    'competitions.create': '创建比赛',
    'competitions.read': '查看比赛',
    'competitions.update': '编辑比赛',
    'competitions.delete': '删除比赛',
    'programs.create': '创建节目',
    'programs.read': '查看节目',
    'programs.update': '编辑节目',
    'programs.delete': '删除节目',
    'judges.create': '创建评委',
    'judges.read': '查看评委',
    'judges.update': '编辑评委',
    'judges.delete': '删除评委',
    'scores.create': '录入评分',
    'scores.read': '查看评分',
    'scores.update': '修改评分',
    'scores.delete': '删除评分',
    'reports.create': '生成报告',
    'reports.read': '查看报告',
    'reports.update': '编辑报告',
    'reports.delete': '删除报告',
    'system.admin': '系统管理',
    'audit.read': '查看审计日志',
  };

  return permissionNames[permission] || permission;
}

/**
 * 获取角色的显示名称
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    ADMIN: '系统管理员',
    ORGANIZER: '组织者',
    JUDGE: '评委',
    USER: '普通用户',
  };

  return roleNames[role];
}

/**
 * 权限验证中间件工厂
 */
export function createPermissionMiddleware(
  permissions: string[],
  role?: UserRole,
  options: {
    checkDataAccess?: boolean;
    useCache?: boolean;
  } = {}
) {
  return (context: PermissionContext) => {
    const { checkDataAccess = true, useCache = true } = options;
    
    if (useCache) {
      return checkPermissionWithCache(context, permissions, role);
    } else {
      return checkPermission(context, permissions, role, checkDataAccess);
    }
  };
}