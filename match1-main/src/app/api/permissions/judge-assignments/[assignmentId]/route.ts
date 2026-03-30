import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { UserContext } from '@/middleware/permission'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'

// 获取评委分配详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params
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

    const assignment = await prisma.judgeAssignment.findFirst({
      where: {
        id: assignmentId,
        tenantId: currentUser.tenantId
      },
      include: {
        judge: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true
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

    if (!assignment) {
      return NextResponse.json(
        { error: '评委分配不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      assignment
    })
  } catch (error) {
    console.error('获取评委分配详情失败:', error)
    return NextResponse.json(
      { error: '获取评委分配详情失败' },
      { status: 500 }
    )
  }
}

// 更新评委分配
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params
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
    const { authorizedPrograms, isActive } = body

    const existingAssignment = await prisma.judgeAssignment.findFirst({
      where: {
        id: assignmentId,
        tenantId: currentUser.tenantId
      }
    })

    if (!existingAssignment) {
      return NextResponse.json(
        { error: '评委分配不存在' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    
    if (authorizedPrograms !== undefined) {
      updateData.authorizedPrograms = authorizedPrograms
    }
    
    if (isActive !== undefined) {
      updateData.isActive = isActive
    }

    const updatedAssignment = await prisma.judgeAssignment.update({
      where: {
        id: assignmentId
      },
      data: updateData,
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
        action: 'UPDATE_JUDGE_ASSIGNMENT',
        targetId: assignmentId,
        details: {
          resourceType: 'JudgeAssignment',
          oldAuthorizedPrograms: existingAssignment.authorizedPrograms,
          newAuthorizedPrograms: authorizedPrograms,
          oldIsActive: existingAssignment.isActive,
          newIsActive: isActive
        }
      }
    })

    return NextResponse.json({
      message: '评委分配更新成功',
      assignment: updatedAssignment
    })
  } catch (error) {
    console.error('更新评委分配失败:', error)
    return NextResponse.json(
      { error: '更新评委分配失败' },
      { status: 500 }
    )
  }
}

// 删除评委分配
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params
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

    const existingAssignment = await prisma.judgeAssignment.findFirst({
      where: {
        id: assignmentId,
        tenantId: currentUser.tenantId
      },
      include: {
        judge: {
          select: {
            id: true,
            name: true
          }
        },
        competition: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!existingAssignment) {
      return NextResponse.json(
        { error: '评委分配不存在' },
        { status: 404 }
      )
    }

    // 检查是否有相关的评分记录
    const relatedScores = await prisma.score.findFirst({
      where: {
        judgeId: existingAssignment.judgeId,
        program: {
          competitionId: existingAssignment.competitionId
        }
      }
    })

    if (relatedScores) {
      return NextResponse.json(
        { error: '该评委已有评分记录，无法删除分配' },
        { status: 409 }
      )
    }

    await prisma.judgeAssignment.delete({
      where: {
        id: assignmentId
      }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: currentUser.tenantId,
        userId: currentUser.id,
        action: 'DELETE_JUDGE_ASSIGNMENT',
        targetId: assignmentId,
        details: {
          resourceType: 'JudgeAssignment',
          judgeId: existingAssignment.judgeId,
          judgeName: existingAssignment.judge.name,
          competitionId: existingAssignment.competitionId,
          competitionName: existingAssignment.competition.name
        }
      }
    })

    return NextResponse.json({
      message: '评委分配删除成功'
    })
  } catch (error) {
    console.error('删除评委分配失败:', error)
    return NextResponse.json(
      { error: '删除评委分配失败' },
      { status: 500 }
    )
  }
}