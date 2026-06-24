import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

// 获取所有比赛
export const GET = withTenantContext(async (request: Request) => {
  try {
    const ctx = getTenantContext()!;
    
    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const where: Record<string, unknown> = {};
    const status = searchParams.get('status');
    if (status) {
      where.status = status.toUpperCase();
    }
    
    if (ctx.role !== 'ADMIN') {
      where.OR = [
        { organizerId: ctx.userId },
        { status: 'ACTIVE' },
        { status: 'FINISHED' },
      ];
    }
    
    const competitions = await prisma.competition.findMany({
      where,
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
            participantPrograms: {
              include: {
                participant: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ competitions });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return NextResponse.json(
      { error: '获取比赛列表失败' },
      { status: 500 }
    );
  }
});

// 创建新比赛
export const POST = withTenantContext(async (request: Request) => {
  try {
    const ctx = getTenantContext()!;
    
    // 检查用户是否是管理员或组织者
    if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN' && ctx.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: '未授权操作，只有管理员或组织者可以创建比赛' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // 验证必要字段
    if (!body.name || !body.startTime || !body.endTime || !body.status || !body.rankingUpdateMode) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }
    
    // 创建比赛
    const competition = await prisma.competition.create({
      data: {
        tenantId: ctx.tenantId,
        name: body.name,
        description: body.description,
        organizerId: ctx.userId,
        creatorId: ctx.userId,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        status: body.status,
        rankingUpdateMode: body.rankingUpdateMode,
        // 如果有评分标准，创建关联
        scoringCriteria: body.scoringCriteria && body.scoringCriteria.length > 0
          ? {
              create: body.scoringCriteria.map((criteria: any) => ({
                tenantId: ctx.tenantId,
                name: criteria.name,
                weight: criteria.weight,
                maxScore: criteria.maxScore,
              })),
            }
          : undefined,
      },
    });
    
    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: ctx.tenantId,
        userId: ctx.userId,
        action: 'CREATE_COMPETITION',
        targetId: competition.id,
        details: { competitionData: body },
      },
    });
    
    return NextResponse.json(competition, { status: 201 });
  } catch (error: any) {
    console.error('Error creating competition:', error);
    return NextResponse.json(
      { 
        error: '创建比赛失败',
        details: error?.message || String(error),
        code: error?.code
      },
      { status: 500 }
    );
  }
});