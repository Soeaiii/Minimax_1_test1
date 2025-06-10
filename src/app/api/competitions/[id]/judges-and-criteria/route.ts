import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 获取比赛的评委和评分标准
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id: competitionId } = await params;

    // 检查比赛是否存在
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      select: {
        id: true,
        organizerId: true,
      }
    });

    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 404 }
      );
    }

    // 获取评委列表（角色为JUDGE的用户）
    const judges = await prisma.user.findMany({
      where: {
        role: 'JUDGE',
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    // 获取该比赛的评分标准
    const criteria = await prisma.scoringCriteria.findMany({
      where: {
        competitionId: competitionId,
      },
      select: {
        id: true,
        name: true,
        weight: true,
        maxScore: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      judges,
      criteria
    });
  } catch (error) {
    console.error('Error fetching judges and criteria:', error);
    return NextResponse.json(
      { error: '获取数据失败' },
      { status: 500 }
    );
  }
} 