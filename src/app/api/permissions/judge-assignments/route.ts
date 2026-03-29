import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { UserContext } from '@/middleware/permission'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'

// 获取评委分配列表
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

    // 检查权限
    if (!hasPermission(currentUser, PERMISSIONS.JUDGE.READ)) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const competitionId = searchParams.get('competitionId')
    const judgeId = searchParams.get('judgeId')

    const whereClause: any = {
      tenantId: currentUser.tenantId
    }

    if (competitionId) {
      whereClause.competitionId = competitionId
    }

    if (judgeId) {
      whereClause.judgeId = judgeId
    }

    const assignments = await prisma.judgeAssignment.findMany({
      where: whereClause,
      include: {
        judge: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        competition: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      assignments: assignments.map(assignment => ({
        id: assignment.id,
        judgeId: assignment.judgeId,
        competitionId: assignment.competitionId,
        authorizedPrograms: assignment.authorizedPrograms,
        isActive: assignment.isActive,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        judge: assignment.judge,
        competition: assignment.competition
      }))
    })
  } catch (error) {
    console.error('获取评委分配失败:', error)
    return NextResponse.json(
      { error: '获取评委分配失败' },
      { status: 500 }
    )
  }
}

// 创建评委分配
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

    // 检查权限
    if (!hasPermission(currentUser, PERMISSIONS.JUDGE.ASSIGN)) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { judgeId, competitionId, authorizedPrograms } = body

    if (!judgeId || !competitionId) {
      return NextResponse.json(
        { error: '缺少必要参数: judgeId 和 competitionId' },
        { status: 400 }
      )
    }

    // 验证评委是否存在且属于当前租户
    const judge = await prisma.user.findFirst({
      where: {
        id: judgeId,
        tenantId: currentUser.tenantId,
        role: 'JUDGE',
        isActive: true
      }
    })

    if (!judge) {
      return NextResponse.json(
        { error: '评委不存在或无效' },
        { status: 404 }
      )
    }

    // 验证比赛是否存在且属于当前租户
    const competition = await prisma.competition.findFirst({
      where: {
        id: competitionId,
        tenantId: currentUser.tenantId
      }
    })

    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      )
    }

    // 检查是否已存在分配
    const existingAssignment = await prisma.judgeAssignment.findFirst({
      where: {
        judgeId,
        competitionId,
        tenantId: currentUser.tenantId
      }
    })

    if (existingAssignment) {
      return NextResponse.json(
        { error: '该评委已分配到此比赛' },
        { status: 409 }
      )
    }

    const assignment = await prisma.judgeAssignment.create({
      data: {
        tenantId: currentUser.tenantId,
        judgeId,
        competitionId,
        authorizedPrograms: authorizedPrograms || [],
        isActive: true
      },
      include: {
        judge: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        competition: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: currentUser.tenantId,
        userId: currentUser.id,
        action: 'CREATE_JUDGE_ASSIGNMENT',
        targetId: assignment.id,
        details: {
          resourceType: 'JudgeAssignment',
          judgeId,
          competitionId,
          authorizedPrograms
        }
      }
    })

    return NextResponse.json({
      message: '评委分配创建成功',
      assignment
    })
  } catch (error) {
    console.error('创建评委分配失败:', error)
    return NextResponse.json(
      { error: '创建评委分配失败' },
      { status: 500 }
    )
  }
}