import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'JUDGE') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const competition = await prisma.competition.findUnique({
      where: {
        id: params.id,
      },
      include: {
        scoringCriteria: {
          select: {
            id: true,
            name: true,
            weight: true,
            maxScore: true,
          },
        },
        programs: {
          include: {
            participants: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(competition);
  } catch (error) {
    console.error('Error fetching competition:', error);
    return NextResponse.json(
      { error: '获取比赛信息失败' },
      { status: 500 }
    );
  }
} 