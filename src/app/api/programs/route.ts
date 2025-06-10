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
    const where: any = {};
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
      },
      orderBy: [
        { competitionId: 'asc' },
        { order: 'asc' },
      ],
    });

    // 批量获取所有参与者信息
    const allParticipantIds = [...new Set(programs.flatMap(p => p.participantIds || []))];
    const participants = allParticipantIds.length > 0 
      ? await prisma.participant.findMany({
          where: {
            id: { in: allParticipantIds }
          },
          select: {
            id: true,
            name: true,
            bio: true,
            team: true,
            contact: true,
            createdAt: true,
            updatedAt: true,
            programIds: true,
          }
        })
      : [];

    // 创建参与者映射
    const participantMap = new Map(participants.map(p => [p.id, p]));

    // 组装最终数据
    const programsWithParticipants = programs.map(program => ({
      ...program,
      participants: (program.participantIds || [])
        .map(id => participantMap.get(id))
        .filter(Boolean)
    }));
    
    return NextResponse.json(programsWithParticipants);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: '获取节目列表失败' },
      { status: 500 }
    );
  }
}

// 创建新节目
export async function POST(request: Request) {
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
    
    const body = await request.json();
    
    // 验证必要字段
    if (!body.name || !body.competitionId || !body.order || !body.currentStatus) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      );
    }
    
    // 检查用户是否有权限修改该比赛
    const competition = await prisma.competition.findUnique({
      where: { id: body.competitionId },
    });
    
    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }
    
    // 只有管理员或者比赛的组织者可以添加节目
    if (session.user.role !== 'ADMIN' && competition.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: '您没有权限为此比赛添加节目' },
        { status: 403 }
      );
    }
    
    // 创建节目并建立参与者关联
    const program = await prisma.$transaction(async (tx) => {
      // 先创建节目
      const newProgram = await tx.program.create({
        data: {
          name: body.name,
          description: body.description,
          order: body.order,
          currentStatus: body.currentStatus,
          competitionId: body.competitionId,
          participantIds: body.participantIds || [],
        },
      });
      
      // 如果有参与者，建立关联
      if (body.participantIds && body.participantIds.length > 0) {
        // 更新参与者的programIds数组
        for (const participantId of body.participantIds) {
          await tx.participant.update({
            where: { id: participantId },
            data: {
              programIds: {
                push: newProgram.id
              }
            }
          });
        }
      }
      
      return newProgram;
    });
    
    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_PROGRAM',
        targetId: program.id,
        details: { programData: body },
      },
    });
    
    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: '创建节目失败' },
      { status: 500 }
    );
  }
} 