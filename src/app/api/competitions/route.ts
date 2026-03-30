import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 获取所有比赛
export async function GET(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // 构建查询条件
    const where: any = {
      tenantId: session.user.tenantId
    };
    if (status) {
      where.status = status.toUpperCase();
    }
    
    // 如果不是管理员，仅显示自己组织的比赛或公开的比赛
    if (session.user.role !== 'ADMIN') {
      where.OR = [
        { organizerId: session.user.id },
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
        programs: true,
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
}

// 创建新比赛
export async function POST(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    // 检查用户是否已登录且是管理员或组织者
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
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
        name: body.name,
        description: body.description,
        organizerId: session.user.id,
        tenantId: session.user.tenantId,
        creatorId: session.user.id,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        status: body.status,
        rankingUpdateMode: body.rankingUpdateMode,
        // 如果有评分标准，创建关联
        scoringCriteria: body.scoringCriteria && body.scoringCriteria.length > 0
          ? {
              create: body.scoringCriteria.map((criteria: any) => ({
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
        userId: session.user.id,
        tenantId: session.user.tenantId,
        action: 'CREATE_COMPETITION',
        targetId: competition.id,
        details: { competitionData: body },
      },
    });
    
    return NextResponse.json(competition, { status: 201 });
  } catch (error) {
    console.error('Error creating competition:', error);
    return NextResponse.json(
      { error: '创建比赛失败' },
      { status: 500 }
    );
  }
}