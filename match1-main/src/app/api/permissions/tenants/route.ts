import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { UserContext } from '@/middleware/permission'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'

// 获取租户列表（仅系统管理员）
export async function GET(request: NextRequest) {
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

    // 检查权限 - 只有系统管理员可以查看所有租户
    if (!hasPermission(currentUser, PERMISSIONS.TENANT.READ)) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const isActive = searchParams.get('isActive')

    const whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (isActive !== null) {
      whereClause.isActive = isActive === 'true'
    }

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          domain: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              users: true,
              competitions: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.tenant.count({ where: whereClause })
    ])

    return NextResponse.json({
      tenants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取租户列表失败:', error)
    return NextResponse.json(
      { error: '获取租户列表失败' },
      { status: 500 }
    )
  }
}

// 创建租户（仅系统管理员）
export async function POST(request: NextRequest) {
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

    // 检查权限 - 只有系统管理员可以创建租户
    if (!hasPermission(currentUser, PERMISSIONS.TENANT.CREATE)) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, domain, settings } = body

    if (!name || !domain) {
      return NextResponse.json(
        { error: '缺少必要参数: name 和 domain' },
        { status: 400 }
      )
    }

    // 检查域名是否已存在
    const existingTenant = await prisma.tenant.findUnique({
      where: { domain }
    })

    if (existingTenant) {
      return NextResponse.json(
        { error: '域名已存在' },
        { status: 409 }
      )
    }

    const tenant = await prisma.tenant.create({
      data: {
        name,
        domain,
        settings: settings || {},
        isActive: true
      }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: currentUser.tenantId,
        userId: currentUser.id,
        action: 'CREATE_TENANT',
        targetId: tenant.id,
        details: {
          name,
          domain,
          settings
        }
      }
    })

    return NextResponse.json({
      message: '租户创建成功',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        isActive: tenant.isActive,
        createdAt: tenant.createdAt
      }
    })
  } catch (error) {
    console.error('创建租户失败:', error)
    return NextResponse.json(
      { error: '创建租户失败' },
      { status: 500 }
    )
  }
}