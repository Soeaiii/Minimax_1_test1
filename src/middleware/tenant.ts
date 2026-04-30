import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export interface TenantUser {
  id: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ORGANIZER' | 'JUDGE' | 'USER'
  tenantId: string
  permissions: string[]
}

/**
 * 验证用户请求的租户隔离
 * 确保用户只能访问自己租户的数据
 */
export async function withTenantIsolation(
  request: NextRequest,
  handler: (user: TenantUser) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = await getToken({ req: request })

    if (!token) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    if (!token.tenantId) {
      return NextResponse.json(
        { error: '租户信息缺失' },
        { status: 401 }
      )
    }

    const user: TenantUser = {
      id: token.sub as string,
      role: token.role as TenantUser['role'],
      tenantId: token.tenantId as string,
      permissions: (token.permissions as string[]) || []
    }

    return handler(user)
  } catch (error) {
    console.error('租户隔离验证失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

/**
 * 验证用户是否有权访问特定租户的数据
 */
export function validateTenantAccess(
  user: TenantUser,
  resourceTenantId: string
): boolean {
  // SUPER_ADMIN 可以访问所有租户（系统管理员）
  if (user.role === 'SUPER_ADMIN') {
    return true
  }
  // ADMIN 需要匹配租户才能访问
  if (user.role === 'ADMIN' && user.tenantId === resourceTenantId) {
    return true
  }
  // 普通用户只能访问自己租户
  return user.tenantId === resourceTenantId
}

/**
 * 验证用户是否有权访问特定租户的数据（严格模式 - 不允许 ADMIN 跨租户）
 */
export function validateStrictTenantAccess(
  user: TenantUser,
  resourceTenantId: string
): boolean {
  return user.tenantId === resourceTenantId
}
