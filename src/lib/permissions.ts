// Re-export from auth/permissions (except hasPermission functions which have different signatures)
export {
  ROLE_PERMISSIONS,
  PERMISSIONS,
  getRolePermissions,
  getAllPermissions,
  type Permission,
  type PermissionCheckResult
} from '@/lib/auth/permissions'

import { UserContext, PermissionChecker } from '@/middleware/permission'
import { ROLE_PERMISSIONS } from '@/lib/auth/permissions'

// 权限检查工具函数（用于API路由）
// 这个版本接受 UserContext 和字符串或对象格式的权限
type PermissionInput = string | { resource: string; action: string }

export function hasPermission(user: UserContext, permission: PermissionInput): boolean {
  if (user.role === 'ADMIN') {
    return true
  }

  const permissionKey = typeof permission === 'string'
    ? permission
    : `${permission.resource}:${permission.action}`

  const rolePermissions = ROLE_PERMISSIONS[user.role] || []
  return rolePermissions.some((p: { resource: string; action: string }) => `${p.resource}:${p.action}` === permissionKey)
}

export function hasAnyPermission(user: UserContext, permissions: PermissionInput[]): boolean {
  return permissions.some(permission => hasPermission(user, permission))
}

export function hasAllPermissions(user: UserContext, permissions: PermissionInput[]): boolean {
  return permissions.every(permission => hasPermission(user, permission))
}

// 资源权限检查
export function canAccessResource(
  user: UserContext,
  resource: string,
  action: string,
  resourceData?: any
): boolean {
  const permission = { resource, action }

  if (!PermissionChecker.checkPermission(user, permission)) {
    return false
  }

  // 额外的资源级别检查
  if (resourceData) {
    // Organizer只能访问自己创建的资源
    if (user.role === 'ORGANIZER') {
      if (resource === 'competition' && resourceData.creatorId !== user.id) {
        return false
      }
      if (['program', 'participant', 'scoring-criteria'].includes(resource)) {
        if (resourceData.competition?.creatorId !== user.id) {
          return false
        }
      }
    }

    // Judge只能访问被分配的资源
    if (user.role === 'JUDGE') {
      if (resource === 'competition') {
        const hasAssignment = resourceData.judgeAssignments?.some(
          (assignment: any) => assignment.judgeId === user.id && assignment.isActive
        )
        if (!hasAssignment) {
          return false
        }
      }
      if (resource === 'score' && resourceData.judgeId !== user.id) {
        return false
      }
    }
  }

  return true
}

// 获取用户可访问的资源ID列表
export async function getAccessibleResourceIds(
  user: UserContext,
  resource: string,
  prisma: any
): Promise<string[]> {
  if (user.role === 'ADMIN') {
    // Admin可以访问租户内的所有资源
    const resources = await prisma[resource].findMany({
      where: { tenantId: user.tenantId },
      select: { id: true }
    })
    return resources.map((r: any) => r.id)
  }

  if (user.role === 'ORGANIZER') {
    if (resource === 'competition') {
      const competitions = await prisma.competition.findMany({
        where: {
          tenantId: user.tenantId,
          creatorId: user.id
        },
        select: { id: true }
      })
      return competitions.map((c: any) => c.id)
    }
  }

  if (user.role === 'JUDGE') {
    if (resource === 'competition') {
      const assignments = await prisma.judgeAssignment.findMany({
        where: {
          tenantId: user.tenantId,
          judgeId: user.id,
          isActive: true
        },
        select: { competitionId: true }
      })
      return assignments.map((a: any) => a.competitionId)
    }
  }

  return []
}

// 权限错误类
export class PermissionError extends Error {
  constructor(
    message: string,
    public code: string = 'PERMISSION_DENIED',
    public statusCode: number = 403
  ) {
    super(message)
    this.name = 'PermissionError'
  }
}

// 权限验证装饰器
export function requirePermission(permission: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      // 假设第一个参数包含用户上下文
      const user = args[0] as UserContext

      if (!user) {
        throw new PermissionError('用户未认证', 'UNAUTHENTICATED', 401)
      }

      if (!hasPermission(user, permission)) {
        throw new PermissionError(
          `权限不足，需要权限: ${permission}`,
          'INSUFFICIENT_PERMISSIONS'
        )
      }

      return originalMethod.apply(this, args)
    }
  }
}
