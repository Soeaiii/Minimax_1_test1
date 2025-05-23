import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 获取单个选手详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        programs: {
          include: {
            competition: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });
    
    if (!participant) {
      return NextResponse.json(
        { error: '选手不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(participant);
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json(
      { error: '获取选手详情失败' },
      { status: 500 }
    );
  }
}

// 更新选手
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id } = await params;
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
    
    // 检查选手是否存在
    const existingParticipant = await prisma.participant.findUnique({
      where: { id },
    });
    
    if (!existingParticipant) {
      return NextResponse.json(
        { error: '选手不存在' },
        { status: 404 }
      );
    }
    
    // 更新选手
    const updatedParticipant = await prisma.$transaction(async (tx) => {
      const updated = await tx.participant.update({
        where: { id },
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
                  status: true,
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
          action: 'UPDATE',
          targetId: id,
          details: {
            type: 'Participant',
            name: updated.name,
            changes: {
              name: { from: existingParticipant.name, to: updated.name },
              team: { from: existingParticipant.team, to: updated.team },
            },
          },
        },
      });
      
      return updated;
    });
    
    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json(
      { error: '更新选手失败' },
      { status: 500 }
    );
  }
}

// 删除选手
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // 检查选手是否存在
    const existingParticipant = await prisma.participant.findUnique({
      where: { id },
      include: {
        programs: true,
      },
    });
    
    if (!existingParticipant) {
      return NextResponse.json(
        { error: '选手不存在' },
        { status: 404 }
      );
    }
    
    // 如果选手有关联的节目，则不允许删除
    if (existingParticipant.programs.length > 0) {
      return NextResponse.json(
        { error: '无法删除已关联节目的选手，请先移除节目关联' },
        { status: 400 }
      );
    }
    
    // 删除选手
    await prisma.$transaction(async (tx) => {
      // 记录审计日志
      await tx.auditLog.create({
        data: {
          // @ts-ignore
          userId: session.user.id,
          action: 'DELETE',
          targetId: id,
          details: {
            type: 'Participant',
            name: existingParticipant.name,
            team: existingParticipant.team,
          },
        },
      });
      
      // 删除选手
      await tx.participant.delete({
        where: { id },
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json(
      { error: '删除选手失败' },
      { status: 500 }
    );
  }
} 