import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { UserRole } from '@/lib/types'

// 用户创建验证模式
const createUserSchema = z.object({
  name: z.string().min(2, { message: '姓名至少需要2个字符' }),
  email: z.string().email({ message: '请输入有效的电子邮箱地址' }),
  password: z.string().min(6, { message: '密码至少需要6个字符' }),
  role: z.enum(['USER', 'ORGANIZER', 'JUDGE', 'ADMIN']),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
})

// 用户更新验证模式
const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ORGANIZER', 'JUDGE', 'ADMIN']).optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

// 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 只有管理员可以查看用户列表
    if (token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') as UserRole | null
    const tenantId = token.tenantId as string

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (role) {
      where.role = role
    }

    // 获取用户列表和总数
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          permissions: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    )
  }
}

// 创建新用户
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 只有管理员可以创建用户
    if (token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足，只有管理员可以创建用户' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const result = createUserSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: '无效的请求数据', details: result.error.format() },
        { status: 400 }
      )
    }

    const { name, email, password, role, permissions, isActive } = result.data
    const tenantId = token.tenantId as string

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: { 
        email,
        tenantId,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 根据角色设置默认权限
    const defaultPermissions = getDefaultPermissions(role)
    const userPermissions = permissions || defaultPermissions

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        permissions: userPermissions,
        isActive,
        tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        isActive: true,
        createdAt: true,
      },
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: token.sub as string,
        action: 'CREATE_USER',
        targetId: user.id,
        details: {
          targetUser: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
        tenantId,
      },
    })

    return NextResponse.json(
      { user, message: '用户创建成功' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    )
  }
}

// 批量更新用户
export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 只有管理员可以批量更新用户
    if (token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userIds, updates } = body

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: '请提供要更新的用户ID列表' },
        { status: 400 }
      )
    }

    const result = updateUserSchema.safeParse(updates)
    if (!result.success) {
      return NextResponse.json(
        { error: '无效的更新数据', details: result.error.format() },
        { status: 400 }
      )
    }

    const tenantId = token.tenantId as string

    // 批量更新用户
    const updatedUsers = await prisma.user.updateMany({
      where: {
        id: { in: userIds },
        tenantId,
      },
      data: result.data,
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: token.sub as string,
        action: 'BATCH_UPDATE_USERS',
        details: {
          userIds,
          updates: result.data,
          affectedCount: updatedUsers.count,
        },
        tenantId,
      },
    })

    return NextResponse.json({
      message: `成功更新 ${updatedUsers.count} 个用户`,
      count: updatedUsers.count,
    })
  } catch (error) {
    console.error('Error batch updating users:', error)
    return NextResponse.json(
      { error: '批量更新用户失败' },
      { status: 500 }
    )
  }
}

// 根据角色获取默认权限
function getDefaultPermissions(role: UserRole): string[] {
  switch (role) {
    case 'ADMIN':
      return [
        'user:create', 'user:read', 'user:update', 'user:delete',
        'competition:create', 'competition:read', 'competition:update', 'competition:delete',
        'program:create', 'program:read', 'program:update', 'program:delete',
        'participant:create', 'participant:read', 'participant:update', 'participant:delete',
        'score:create', 'score:read', 'score:update', 'score:delete',
        'judge:assign', 'judge:remove',
        'system:settings', 'data:export', 'audit:read',
      ]
    
    case 'ORGANIZER':
      return [
        'competition:create', 'competition:read', 'competition:update', 'competition:manage',
        'program:create', 'program:read', 'program:update', 'program:delete',
        'participant:create', 'participant:read', 'participant:update', 'participant:delete',
        'judge:assign', 'judge:remove',
        'score:read', 'data:export',
      ]
    
    case 'JUDGE':
      return [
        'competition:read', 'program:read', 'participant:read',
        'score:create', 'score:read', 'score:update',
      ]
    
    case 'USER':
      return [
        'competition:read', 'program:read', 'participant:read', 'score:read',
      ]
    
    default:
      return []
  }
}