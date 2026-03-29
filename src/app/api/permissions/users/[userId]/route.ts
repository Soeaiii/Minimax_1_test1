import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { withPermission, UserContext } from '@/middleware/permission'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'

// 获取用户权限
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const currentUser: UserContext = {
      id: token.sub as string,
      role: token.role as any,
      tenantId: token.tenantId as string,
      permissions: token.permissions as string[] || []
    }

    // 检查是否有查看用户权限的权限
    if (!hasPermission(currentUser, PERMISSIONS.USER.READ) && currentUser.id !== userId) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: currentUser.tenantId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        isActive: true,
        tenant: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
        tenant: user.tenant
      }
    })
  } catch (error) {
    console.error('获取用户权限失败:', error)
    return NextResponse.json(
      { error: '获取用户权限失败' },
      { status: 500 }
    )
  }
}

// 更新用户权限
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const currentUser: UserContext = {
      id: token.sub as string,
      role: token.role as any,
      tenantId: token.tenantId as string,
      permissions: token.permissions as string[] || []
    }

    // 检查是否有管理用户权限的权限
    if (!hasPermission(currentUser, PERMISSIONS.USER.MANAGE)) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { permissions, isActive } = body

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { error: '权限列表格式错误' },
        { status: 400 }
      )
    }

    // 验证权限是否有效
    const validPermissions = Object.values(PERMISSIONS).flatMap(category => 
      Object.values(category)
    ) as string[]
    const invalidPermissions = permissions.filter(
      (perm: string) => !validPermissions.includes(perm)
    )

    if (invalidPermissions.length > 0) {
      return NextResponse.json(
        { error: `无效的权限: ${invalidPermissions.join(', ')}` },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: currentUser.tenantId
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        permissions,
        isActive: isActive !== undefined ? isActive : user.isActive
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        isActive: true
      }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: currentUser.tenantId,
        userId: currentUser.id,
        action: 'UPDATE_USER_PERMISSIONS',
        targetId: userId,
        details: {
          oldPermissions: user.permissions,
          newPermissions: permissions,
          oldIsActive: user.isActive,
          newIsActive: isActive !== undefined ? isActive : user.isActive
        }
      }
    })

    return NextResponse.json({
      message: '用户权限更新成功',
      user: updatedUser
    })
  } catch (error) {
    console.error('更新用户权限失败:', error)
    return NextResponse.json(
      { error: '更新用户权限失败' },
      { status: 500 }
    )
  }
}