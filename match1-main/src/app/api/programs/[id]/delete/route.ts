import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, CompetitionStatus } from '@prisma/client'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const programId = resolvedParams.id

    // 检查节目是否存在
    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        competition: true,
        scores: true
      }
    })

    if (!program) {
      return NextResponse.json(
        { error: '节目不存在' },
        { status: 404 }
      )
    }

    // 权限检查：只有管理员和比赛组织者可以删除节目
    if (
      session.user.role !== UserRole.ADMIN &&
      program.competition.organizerId !== session.user.id
    ) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    // 检查比赛状态，已完成或已归档的比赛不能删除节目
    if (program.competition.status === CompetitionStatus.FINISHED || program.competition.status === CompetitionStatus.ARCHIVED) {
      return NextResponse.json(
        { error: '已完成或已归档的比赛不能删除节目' },
        { status: 400 }
      )
    }

    // 检查是否有评分记录
    if (program.scores.length > 0) {
      return NextResponse.json(
        { error: '该节目已有评分记录，无法删除' },
        { status: 400 }
      )
    }

    // 删除节目
    await prisma.program.delete({
      where: { id: programId }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: session.user.tenantId,
        action: 'DELETE_PROGRAM',
        userId: session.user.id,
        targetId: programId,
        details: {
          programName: program.name,
          competitionId: program.competitionId
        }
      }
    })

    return NextResponse.json(
      { message: '节目删除成功' },
      { status: 200 }
    )

  } catch (error) {
    console.error('删除节目失败:', error)
    return NextResponse.json(
      { error: '删除节目失败' },
      { status: 500 }
    )
  }
}