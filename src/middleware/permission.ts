import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export interface Permission {
  resource: string
  action: string
  conditions?: Record<string, any>
}

export interface UserContext {
  id: string
  role: 'ADMIN' | 'ORGANIZER' | 'JUDGE' | 'USER'
  tenantId: string
  permissions: string[]
}

export class PermissionChecker {
  static checkPermission(user: UserContext, permission: Permission): boolean {
    // Admin拥有所有权限
    if (user.role === 'ADMIN') {
      return true
    }

    // 检查具体权限
    const permissionKey = `${permission.resource}:${permission.action}`
    
    if (user.role === 'ORGANIZER') {
      return this.checkOrganizerPermission(user, permission)
    }
    
    if (user.role === 'JUDGE') {
      return this.checkJudgePermission(user, permission)
    }
    
    return false
  }

  private static checkOrganizerPermission(user: UserContext, permission: Permission): boolean {
    const allowedPermissions = [
      'competition:create',
      'competition:read',
      'competition:update',
      'competition:delete',
      'participant:create',
      'participant:read',
      'participant:update',
      'participant:delete',
      'program:create',
      'program:read',
      'program:update',
      'program:delete',
      'judge:assign',
      'competition:control',
      'data:export',
      'scoring-criteria:create',
      'scoring-criteria:read',
      'scoring-criteria:update',
      'scoring-criteria:delete'
    ]
    
    const permissionKey = `${permission.resource}:${permission.action}`
    return allowedPermissions.includes(permissionKey)
  }

  private static checkJudgePermission(user: UserContext, permission: Permission): boolean {
    const allowedPermissions = [
      'competition:read',
      'program:read',
      'score:create',
      'score:read',
      'score:update',
      'participant:read',
      'scoring-criteria:read'
    ]
    
    const permissionKey = `${permission.resource}:${permission.action}`
    return allowedPermissions.includes(permissionKey)
  }

  static getResourcePermissions(user: UserContext, resource: string): string[] {
    if (user.role === 'ADMIN') {
      return ['create', 'read', 'update', 'delete', 'manage']
    }

    const permissions: string[] = []
    
    if (user.role === 'ORGANIZER') {
      switch (resource) {
        case 'competition':
        case 'participant':
        case 'program':
        case 'scoring-criteria':
          permissions.push('create', 'read', 'update', 'delete')
          break
        case 'judge':
          permissions.push('assign', 'read')
          break
        case 'data':
          permissions.push('export')
          break
      }
    }
    
    if (user.role === 'JUDGE') {
      switch (resource) {
        case 'competition':
        case 'program':
        case 'participant':
        case 'scoring-criteria':
          permissions.push('read')
          break
        case 'score':
          permissions.push('create', 'read', 'update')
          break
      }
    }
    
    return permissions
  }
}

export async function withPermission(
  request: NextRequest,
  permission: Permission,
  handler: (user: UserContext) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = await getToken({ req: request })
    
    if (!token) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const user: UserContext = {
      id: token.sub as string,
      role: token.role as any,
      tenantId: token.tenantId as string,
      permissions: token.permissions as string[] || []
    }

    if (!PermissionChecker.checkPermission(user, permission)) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    return await handler(user)
  } catch (error) {
    console.error('权限验证失败:', error)
    return NextResponse.json({ error: '权限验证失败' }, { status: 500 })
  }
}

export async function getUserContext(request: NextRequest): Promise<UserContext | null> {
  try {
    const token = await getToken({ req: request })
    
    if (!token) {
      return null
    }

    return {
      id: token.sub as string,
      role: token.role as any,
      tenantId: token.tenantId as string,
      permissions: token.permissions as string[] || []
    }
  } catch (error) {
    console.error('获取用户上下文失败:', error)
    return null
  }
}

// 租户隔离数据过滤器
export function createTenantFilter(tenantId: string, additionalFilters?: Record<string, any>) {
  return {
    tenantId,
    ...additionalFilters
  }
}

// 角色数据过滤器
export function createRoleFilter(
  user: UserContext,
  resource: string,
  additionalFilters?: Record<string, any>
) {
  let roleFilter = {}
  
  // Organizer只能访问自己创建的资源
  if (user.role === 'ORGANIZER') {
    switch (resource) {
      case 'competition':
        roleFilter = { creatorId: user.id }
        break
      case 'program':
      case 'participant':
      case 'scoring-criteria':
        // 这些资源需要通过competition关系过滤
        roleFilter = {
          competition: {
            creatorId: user.id
          }
        }
        break
    }
  }
  
  // Judge只能访问被分配的资源
  if (user.role === 'JUDGE') {
    switch (resource) {
      case 'competition':
        roleFilter = {
          judgeAssignments: {
            some: {
              judgeId: user.id,
              isActive: true
            }
          }
        }
        break
      case 'score':
        roleFilter = { judgeId: user.id }
        break
    }
  }
  
  return {
    tenantId: user.tenantId,
    ...roleFilter,
    ...additionalFilters
  }
}