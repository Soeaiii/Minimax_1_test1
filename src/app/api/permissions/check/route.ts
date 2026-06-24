import { NextRequest, NextResponse } from 'next/server'
import { withTenantContext, getTenantContext } from '@/lib/tenant-context'
import { PermissionChecker, UserContext } from '@/middleware/permission'
import { hasPermission } from '@/lib/permissions'

export const GET = withTenantContext(async (request: NextRequest) => {
  try {
    const ctx = getTenantContext()!

    const { searchParams } = new URL(request.url)
    const resource = searchParams.get('resource')
    const action = searchParams.get('action')
    
    if (!resource || !action) {
      return NextResponse.json(
        { error: '缺少必要参数: resource 和 action' },
        { status: 400 }
      )
    }

    const user: UserContext = {
      id: ctx.userId,
      role: ctx.role as UserContext['role'],
      tenantId: ctx.tenantId,
      permissions: []
    }

    const permission = { resource, action }
    const allowed = PermissionChecker.checkPermission(user, permission)
    const permissionKey = `${resource}:${action}`
    const hasDirectPermission = hasPermission(user, permissionKey)

    return NextResponse.json({
      allowed,
      reason: allowed ? null : '权限不足',
      user: {
        id: user.id,
        role: user.role,
        tenantId: user.tenantId
      },
      permission: {
        resource,
        action,
        key: permissionKey
      },
      hasDirectPermission
    })
  } catch (error) {
    console.error('权限检查失败:', error)
    return NextResponse.json(
      { error: '权限检查失败' },
      { status: 500 }
    )
  }
})

export const POST = withTenantContext(async (request: NextRequest) => {
  try {
    const ctx = getTenantContext()!

    const body = await request.json()
    const { permissions } = body
    
    if (!permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: '缺少必要参数: permissions (数组)' },
        { status: 400 }
      )
    }

    const user: UserContext = {
      id: ctx.userId,
      role: ctx.role as UserContext['role'],
      tenantId: ctx.tenantId,
      permissions: []
    }

    const results = permissions.map((perm: { resource: string; action: string }) => {
      const permission = { resource: perm.resource, action: perm.action }
      const allowed = PermissionChecker.checkPermission(user, permission)
      const permissionKey = `${perm.resource}:${perm.action}`
      
      return {
        resource: perm.resource,
        action: perm.action,
        key: permissionKey,
        allowed,
        reason: allowed ? null : '权限不足'
      }
    })

    const allAllowed = results.every(result => result.allowed)

    return NextResponse.json({
      allAllowed,
      results,
      user: {
        id: user.id,
        role: user.role,
        tenantId: user.tenantId
      }
    })
  } catch (error) {
    console.error('批量权限检查失败:', error)
    return NextResponse.json(
      { error: '批量权限检查失败' },
      { status: 500 }
    )
  }
})
