import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取单个排名
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const ranking = await prisma.ranking.findUnique({
      where: { id },
      include: {
        program: true,
        competition: true,
      },
    });
    
    if (!ranking) {
      return NextResponse.json(
        { error: '排名不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(ranking);
  } catch (error) {
    console.error('Error fetching ranking:', error);
    return NextResponse.json(
      { error: '获取排名详情失败' },
      { status: 500 }
    );
  }
}

// 手动调整单个排名
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const {
      rank,
      totalScore,
      userId, // 记录操作人ID
    } = body;
    
    // 检查排名是否存在
    const existingRanking = await prisma.ranking.findUnique({
      where: { id },
    });
    
    if (!existingRanking) {
      return NextResponse.json(
        { error: '排名不存在' },
        { status: 404 }
      );
    }
    
    // 手动调整排名
    const updatedRanking = await prisma.$transaction(async (tx) => {
      const updated = await tx.ranking.update({
        where: { id },
        data: {
          rank,
          totalScore,
          updateType: 'MANUAL',
        },
      });
      
      // 记录审计日志
      await tx.auditLog.create({
        data: {
          userId,
          action: 'MANUAL_UPDATE_RANKING',
          targetId: id,
          details: {
            previous: existingRanking,
            updated: updated,
          },
        },
      });
      
      return updated;
    });
    
    return NextResponse.json(updatedRanking);
  } catch (error) {
    console.error('Error updating ranking:', error);
    return NextResponse.json(
      { error: '更新排名失败' },
      { status: 500 }
    );
  }
} 