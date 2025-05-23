import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Prisma } from '@prisma/client';

// 获取单个比赛
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 修复：在 Next.js 15 中 params 需要被 await
    const { id } = await params;
    console.log('开始处理获取比赛详情请求 - ID:', id);
    
    // 修复：优化会话获取
    // @ts-ignore 忽略NextAuth类型兼容性问题
    const session = await getServerSession(authOptions);
    console.log('获取比赛详情 - 会话状态:', session ? '已登录' : '未登录');
    
    // 检查ID是否有效的ObjectId格式
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('获取比赛详情 - 无效的ID格式:', id);
      return NextResponse.json(
        { error: '无效的比赛ID格式' },
        { status: 400 }
      );
    }
    
    try {
      // 修复：优化数据库查询
      const competition = await prisma.competition.findUnique({
        where: { id },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          programs: {
            include: {
              participants: {
                select: {
                  id: true,
                  name: true,
                  team: true,
                  bio: true,
                }
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
          scoringCriteria: {
            select: {
              id: true,
              name: true,
              weight: true,
              maxScore: true,
            },
          },
          rankings: {
            include: {
              program: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              rank: 'asc',
            },
          },
        },
      });
      
      console.log('获取比赛详情 - 查询结果:', competition ? '成功' : '失败，未找到比赛');
      
      if (!competition) {
        return NextResponse.json(
          { error: '比赛不存在' },
          { status: 404 }
        );
      }
      
      // 修复：优化权限检查逻辑
      if (!session) {
        // 对于公开比赛，允许未登录用户查看
        if (competition.status === 'ACTIVE' || competition.status === 'FINISHED') {
          console.log('允许未登录用户查看公开比赛');
          return NextResponse.json(competition);
        } else {
          return NextResponse.json(
            { error: '请先登录后再查看比赛详情' },
            { status: 401 }
          );
        }
      }
      
      // 检查用户权限
      const hasPermission = 
        session.user.role === 'ADMIN' || 
        competition.organizerId === session.user.id ||
        session.user.role === 'JUDGE' ||
        ['ACTIVE', 'FINISHED'].includes(competition.status);
      
      if (!hasPermission) {
        console.log('获取比赛详情 - 权限不足:', {
          userRole: session.user.role,
          userId: session.user.id,
          organizerId: competition.organizerId,
          competitionStatus: competition.status
        });
        return NextResponse.json(
          { error: '您没有权限查看此比赛' },
          { status: 403 }
        );
      }
      
      return NextResponse.json(competition);
    } catch (dbError: any) {
      console.error('数据库查询失败:', dbError);
      
      // 修复：提供更详细的数据库错误信息
      if (dbError.code === 'P2025') {
        return NextResponse.json(
          { error: '比赛不存在' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { 
          error: '数据库查询失败', 
          details: process.env.NODE_ENV === 'development' ? dbError.message : '内部服务器错误'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('获取比赛详情失败:', error);
    return NextResponse.json(
      { 
        error: '获取比赛详情失败', 
        details: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

// 更新比赛
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录且是管理员或组织者
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json(
        { error: '未授权操作' },
        { status: 403 }
      );
    }
    
    const { id } = await params; // 修复：await params
    const body = await request.json();
    
    console.log('接收到的更新比赛请求:', { 
      id, 
      body: { ...body, scoringCriteria: body.scoringCriteria?.length || 0 } 
    });
    
    // 获取当前比赛
    const currentCompetition = await prisma.competition.findUnique({
      where: { id },
      include: {
        scoringCriteria: true,
      },
    });
    
    if (!currentCompetition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }
    
    // 检查是否是管理员或比赛创建者
    if (session.user.role !== 'ADMIN' && currentCompetition.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: '您没有权限更新此比赛' },
        { status: 403 }
      );
    }
    
    try {
      console.log('更新比赛基本信息:', {
        id,
        name: body.name,
        status: body.status,
        rankingUpdateMode: body.rankingUpdateMode
      });
      
      // 1. 更新比赛基本信息
      const updated = await prisma.competition.update({
        where: { id },
        data: {
          name: body.name,
          description: body.description,
          startTime: new Date(body.startTime),
          endTime: new Date(body.endTime),
          status: body.status,
          rankingUpdateMode: body.rankingUpdateMode,
          organizerId: body.organizerId || undefined,
        },
      });
      
      // 2. 如果提供了评分标准，更新评分标准
      if (body.scoringCriteria && Array.isArray(body.scoringCriteria)) {
        console.log('更新评分标准:', { count: body.scoringCriteria.length });
        
        try {
          // 删除现有评分标准
          await prisma.scoringCriteria.deleteMany({
            where: { competitionId: id },
          });
          
          // 创建新的评分标准
          if (body.scoringCriteria.length > 0) {
            for (const criteria of body.scoringCriteria) {
              await prisma.scoringCriteria.create({
                data: {
                  name: criteria.name,
                  weight: criteria.weight,
                  maxScore: criteria.maxScore,
                  competitionId: id,
                },
              });
            }
          }
        } catch (criteriaError: any) {
          console.error('更新评分标准失败:', criteriaError);
          // 即使评分标准更新失败，也不回滚比赛基本信息的更新
          // 只记录错误并继续
        }
      }
      
      // 3. 记录审计日志（非关键操作，失败不影响主流程）
      try {
        await prisma.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'UPDATE_COMPETITION',
            targetId: id,
            details: {
              previousData: {
                name: currentCompetition.name,
                description: currentCompetition.description,
                status: currentCompetition.status,
                rankingUpdateMode: currentCompetition.rankingUpdateMode,
              },
              newData: {
                name: body.name,
                description: body.description,
                status: body.status,
                rankingUpdateMode: body.rankingUpdateMode,
              },
            },
          },
        });
      } catch (logError: any) {
        console.error('记录审计日志失败:', logError);
        // 审计日志失败不影响主流程
      }
      
      // 4. 获取更新后的比赛信息
      const updatedCompetition = await prisma.competition.findUnique({
        where: { id },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          scoringCriteria: true,
        },
      });
      
      console.log('比赛更新成功:', { id, name: updatedCompetition?.name });
      
      return NextResponse.json(updatedCompetition);
    } catch (dbError: any) {
      console.error('数据库更新失败:', dbError);
      
      // 确保返回有效的错误信息
      const errorMessage = dbError?.message || '数据库更新失败';
      const errorDetails = dbError?.code === 'P2031' 
        ? '数据库配置问题，请联系管理员' 
        : (dbError?.details || '未知错误');
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails,
          code: dbError?.code || 'UNKNOWN_ERROR'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('更新比赛失败:', error);
    return NextResponse.json(
      { error: '更新比赛失败', details: error.message },
      { status: 500 }
    );
  }
}

// 删除比赛（归档）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录且是管理员或组织者
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json(
        { error: '未授权操作' },
        { status: 403 }
      );
    }
    
    const { id } = await params; // 修复：await params
    
    // 获取当前比赛
    const competition = await prisma.competition.findUnique({
      where: { id },
    });
    
    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }
    
    // 检查是否是管理员或比赛创建者
    if (session.user.role !== 'ADMIN' && competition.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: '您没有权限归档此比赛' },
        { status: 403 }
      );
    }
    
    // 执行归档操作（将状态设为ARCHIVED）
    const archivedCompetition = await prisma.competition.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
      },
    });
    
    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'ARCHIVE_COMPETITION',
        targetId: id,
        details: { competition },
      },
    });
    
    return NextResponse.json(archivedCompetition);
  } catch (error) {
    console.error('Error archiving competition:', error);
    return NextResponse.json(
      { error: '归档比赛失败' },
      { status: 500 }
    );
  }
} 