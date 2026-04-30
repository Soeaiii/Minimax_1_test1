import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 获取所有节目
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
    const competitionId = searchParams.get('competitionId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // 构建查询条件
    const where: any = {
      tenantId: session.user.tenantId
    };
    if (competitionId) {
      where.competitionId = competitionId;
    }
    if (status) {
      where.currentStatus = status.toUpperCase();
    }
    
    // 添加搜索功能
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    // 如果不是管理员，只显示自己有权限的比赛中的节目
    if (session.user.role !== 'ADMIN') {
      where.competition = {
        OR: [
          { organizerId: session.user.id },
          { status: 'ACTIVE' },
          { status: 'FINISHED' },
        ],
      };
    }
    
    // 优化查询 - 分步获取数据避免重复查询
    // 解析分页参数
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
    const skip = (page - 1) * pageSize;

    // 获取总数
    const total = await prisma.program.count({ where });

    const programs = await prisma.program.findMany({
      where,
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            organizerId: true,
          },
        },
        participantPrograms: {
          include: {
            participant: true,
          },
        },
      },
      orderBy: [
        { competitionId: 'asc' },
        { order: 'asc' },
      ],
      skip,
      take: pageSize,
    });

    // 组装最终数据，直接从 participantPrograms 关系中获取参与者
    const programsWithParticipants = programs.map(program => ({
      ...program,
      participants: program.participantPrograms.map(pp => pp.participant)
    }));

    return NextResponse.json({
      data: programsWithParticipants,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: '获取节目列表失败' },
      { status: 500 }
    );
  }
}

// 创建新节目
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      competitionId,
      participantIds,
      order,
      currentStatus,
      customFields,
    } = body;

    // 验证比赛存在且属于同一租户
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId, tenantId: session.user.tenantId },
    });
    if (!competition) {
      return NextResponse.json({ error: "比赛不存在" }, { status: 404 });
    }

    // 验证参赛者存在
    if (participantIds && participantIds.length > 0) {
      const participants = await prisma.participant.findMany({
        where: { id: { in: participantIds } },
      });
      if (participants.length !== participantIds.length) {
        return NextResponse.json({ error: "一个或多个参赛者不存在" }, { status: 404 });
      }
    }

    // 使用事务创建节目和参与者关联
    const program = await prisma.$transaction(async (tx) => {
      // 1. 创建节目
      const newProgram = await tx.program.create({
        data: {
          tenantId: session.user.tenantId,
          name,
          description,
          competitionId,
          order: order || 0,
          currentStatus: currentStatus || "WAITING",
          customFields,
        },
      });

      // 2. 如果有参与者，创建关联记录
      if (participantIds && participantIds.length > 0) {
        await tx.participantProgram.createMany({
          data: participantIds.map(participantId => ({
            participantId,
            programId: newProgram.id,
          })),
        });
      }

      // 3. 返回完整的节目信息
      return tx.program.findUnique({
        where: { id: newProgram.id },
        include: {
          competition: true,
          participantPrograms: {
            include: {
              participant: true,
            },
          },
        },
      });
    });

    return NextResponse.json({ program });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { error: "创建节目失败" },
      { status: 500 }
    );
  }
} 