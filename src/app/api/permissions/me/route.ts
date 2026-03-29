import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { ROLE_PERMISSIONS, hasPermission } from '@/lib/permissions'

// 获取当前用户权限信息
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        id: token.sub as string,
        tenantId: token.tenantId as string
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        isActive: true,
        lastLogin: true,
        tenant: {
          select: {
            id: true,
            name: true,
            domain: true,
            isActive: true
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

    if (!user.isActive) {
      return NextResponse.json(
        { error: '用户已被禁用' },
        { status: 403 }
      )
    }

    if (!user.tenant?.isActive) {
      return NextResponse.json(
        { error: '租户已被禁用' },
        { status: 403 }
      )
    }

    // 获取角色权限
    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    const rolePermissionStrings = rolePermissions.map(p => `${p.resource}:${p.action}`)
    
    // 合并角色权限和用户自定义权限
    const userPermissions = Array.isArray(user.permissions) ? user.permissions as string[] : []
    const allPermissions = [...new Set([...rolePermissionStrings, ...userPermissions])]

    // 获取用户的评委分配（如果是评委）
    let judgeAssignments: any[] = []
    if (user.role === 'JUDGE') {
      judgeAssignments = await prisma.judgeAssignment.findMany({
        where: {
          judgeId: user.id,
          tenantId: user.tenant.id,
          isActive: true
        },
        include: {
          competition: {
            select: {
              id: true,
              name: true,
              status: true
            }
          }
        }
      })
    }

    // 获取用户创建的比赛（如果是组织者）
    let createdCompetitions: any[] = []
    if (user.role === 'ORGANIZER' || user.role === 'ADMIN') {
      createdCompetitions = await prisma.competition.findMany({
        where: {
          creatorId: user.id,
          tenantId: user.tenant.id
        },
        select: {
          id: true,
          name: true,
          status: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        tenant: user.tenant
      },
      permissions: {
        role: user.role,
        rolePermissions: rolePermissionStrings,
        customPermissions: user.permissions,
        allPermissions,
        hasSystemAccess: allPermissions.length > 0
      },
      resources: {
        judgeAssignments: judgeAssignments.map(assignment => ({
          id: assignment.id,
          competitionId: assignment.competitionId,
          authorizedPrograms: assignment.authorizedPrograms,
          competition: assignment.competition
        })),
        createdCompetitions
      },
      capabilities: {
        canCreateCompetition: hasPermission({ 
          id: user.id, 
          role: user.role as any, 
          tenantId: user.tenant.id, 
          permissions: allPermissions 
        }, 'competition:create'),
        canManageUsers: hasPermission({ 
          id: user.id, 
          role: user.role as any, 
          tenantId: user.tenant.id, 
          permissions: allPermissions 
        }, 'user:manage'),
        canAssignJudges: hasPermission({ 
          id: user.id, 
          role: user.role as any, 
          tenantId: user.tenant.id, 
          permissions: allPermissions 
        }, 'judge:assign'),
        canViewReports: hasPermission({ 
          id: user.id, 
          role: user.role as any, 
          tenantId: user.tenant.id, 
          permissions: allPermissions 
        }, 'data:export')
      }
    })
  } catch (error) {
    console.error('获取用户权限信息失败:', error)
    return NextResponse.json(
      { error: '获取用户权限信息失败' },
      { status: 500 }
    )
  }
}