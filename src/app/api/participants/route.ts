import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 获取所有选手
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const team = searchParams.get('team');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    const skip = (page - 1) * limit;
    
    let where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { team: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (team && team !== 'all') {
      if (team === 'individual') {
        where.team = { in: [null, ''] };
      } else {
        where.team = team;
      }
    }
    
    // 获取总数
    const total = await prisma.participant.count({ where });
    
    // 获取分页数据
    const participants = await prisma.participant.findMany({
      where,
      include: {
        programs: {
          include: {
            competition: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });
    
    return NextResponse.json({
      participants,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: '获取选手列表失败' },
      { status: 500 }
    );
  }
}

// 创建新选手
export async function POST(request: Request) {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const {
      name,
      bio,
      team,
      contact,
    } = body;
    
    // 验证必填字段
    if (!name?.trim()) {
      return NextResponse.json(
        { error: '选手姓名不能为空' },
        { status: 400 }
      );
    }
    
    // 创建选手
    const participant = await prisma.$transaction(async (tx) => {
      const newParticipant = await tx.participant.create({
        data: {
          name: name.trim(),
          bio: bio?.trim() || undefined,
          team: team?.trim() || undefined,
          contact: contact?.trim() || undefined,
        },
        include: {
          programs: {
            include: {
              competition: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      
      // 记录审计日志
      await tx.auditLog.create({
        data: {
          // @ts-ignore
          userId: session.user.id,
          action: 'CREATE',
          targetId: newParticipant.id,
          details: { 
            type: 'Participant',
            name: newParticipant.name,
            team: newParticipant.team 
          },
        },
      });
      
      return newParticipant;
    });
    
    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json(
      { error: '创建选手失败' },
      { status: 500 }
    );
  }
} 