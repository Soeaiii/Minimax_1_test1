import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 真正删除比赛（永久删除）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录且是管理员或组织者
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json(
        { error: '未授权操作' },
        { status: 403 }
      );
    }
    
    const { id } = await params;
    
    // 检查ID是否有效的UUID格式
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json(
        { error: '无效的比赛ID格式' },
        { status: 400 }
      );
    }
    
    // 获取当前比赛
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        participantPrograms: {
          include: {
            scores: true,
          },
        },
        scoringCriteria: true,
        rankings: true,
        displaySettings: true,
      },
    });
    
    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }
    
    // 检查是否是管理员或比赛创建者
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && competition.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: '您没有权限删除此比赛' },
        { status: 403 }
      );
    }
    
    // 使用事务删除所有相关数据
    await prisma.$transaction(async (tx) => {
      
      // 1. 删除所有评分记录
      const programIds = competition.programs.map(p => p.id);
      let deletedScores = { count: 0 };
      if (programIds.length > 0) {
        deletedScores = await tx.score.deleteMany({
          where: {
            programId: {
              in: programIds,
            },
          },
        });
      }
      
      // 2. 删除所有排名记录
      const deletedRankings = await tx.ranking.deleteMany({
        where: {
          competitionId: id,
        },
      });
      
      // 3. 删除所有节目（会级联删除参赛者关联）
      const deletedPrograms = await tx.program.deleteMany({
        where: {
          competitionId: id,
        },
      });
      
      // 4. 删除评分标准
      const deletedCriteria = await tx.scoringCriteria.deleteMany({
        where: {
          competitionId: id,
        },
      });
      
      // 5. 删除大屏幕设置
      const deletedDisplaySettings = await tx.displaySettings.deleteMany({
        where: {
          competitionId: id,
        },
      });
      
      // 6. 删除审计日志（可选，根据需要决定是否保留）
      const deletedAuditLogs = await tx.auditLog.deleteMany({
        where: {
          targetId: id,
        },
      });
      
      // 7. 最后删除比赛本身
      const deletedCompetition = await tx.competition.delete({
        where: { id },
      });
      
      // 8. 记录删除操作的审计日志
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          tenantId: session.user.tenantId,
          action: 'DELETE_COMPETITION',
          targetId: id,
          details: {
            competitionName: competition.name,
            deletedData: {
              scores: deletedScores.count,
              rankings: deletedRankings.count,
              programs: deletedPrograms.count,
              criteria: deletedCriteria.count,
              displaySettings: deletedDisplaySettings.count,
              auditLogs: deletedAuditLogs.count,
            },
          },
        },
      });
    });
    
    return NextResponse.json({
      success: true,
      message: `比赛 "${competition.name}" 已成功删除`,
      deletedCompetition: {
        id: competition.id,
        name: competition.name,
      },
    });
  } catch (error: any) {
    console.error('删除比赛失败:', error);
    
    // 检查是否是数据库约束错误
    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          error: '删除失败：存在外键约束',
          details: '该比赛可能还有其他相关数据，请联系管理员处理'
        },
        { status: 400 }
      );
    }
    
    // 检查是否是记录不存在错误
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: '比赛不存在或已被删除' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        error: '删除比赛失败', 
        details: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
      },
      { status: 500 }
    );
  }
}