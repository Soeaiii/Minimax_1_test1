import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// 公开报名 API —— 不包 withTenantContext，通过 registrationToken 鉴权
export async function POST(
  request: Request,
  context: { params: Promise<{ competitionId: string }> }
) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const body = await request.json();
    const { name, team, contact, bio } = body;

    // 1. 通过 token 查找比赛
    const competition = await prisma.competition.findUnique({
      where: { id: params.competitionId },
      select: { 
        id: true, name: true, tenantId: true,
        registrationToken: true, registrationEnabled: true,
        status: true,
      },
    });

    if (!competition) {
      return NextResponse.json({ error: '比赛不存在' }, { status: 404 });
    }

    // 2. 验证 token
    if (!competition.registrationToken || token !== competition.registrationToken) {
      return NextResponse.json({ error: '无效的报名链接' }, { status: 401 });
    }

    // 3. 检查报名是否开启
    if (!competition.registrationEnabled) {
      return NextResponse.json({ error: '该比赛暂未开启报名' }, { status: 403 });
    }

    // 4. 检查比赛状态
    if (competition.status === 'FINISHED' || competition.status === 'ARCHIVED') {
      return NextResponse.json({ error: '该比赛已结束，不再接受报名' }, { status: 403 });
    }

    // 5. 验证必填字段
    if (!name?.trim()) {
      return NextResponse.json({ error: '姓名不能为空' }, { status: 400 });
    }

    // 6. 检查是否重复报名（同租户下 name+team 组合去重）
    const existing = await prisma.participant.findFirst({
      where: {
        name: name.trim(),
        tenantId: competition.tenantId,
        ...(team?.trim() ? { team: team.trim() } : { team: null }),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: '您已报名成功，请勿重复报名', participantId: existing.id },
        { status: 409 }
      );
    }

    // 7. 创建选手（显式带 tenantId，因为匿名请求没有 tenant context）
    const participant = await prisma.participant.create({
      data: {
        tenantId: competition.tenantId,
        name: name.trim(),
        team: team?.trim() || null,
        contact: contact?.trim() || null,
        bio: bio?.trim() || null,
      },
    });

    // 8. 记录审计日志（用于通知功能）
    await prisma.auditLog.create({
      data: {
        tenant: { connect: { id: competition.tenantId } },
        action: 'PUBLIC_REGISTRATION',
        targetId: participant.id,
        details: {
          competitionId: competition.id,
          competitionName: competition.name,
          name: participant.name,
          team: participant.team,
          contact: participant.contact,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: participant.id, name: participant.name },
      message: '报名成功！',
    }, { status: 201 });
  } catch (error) {
    console.error('公开报名失败:', error);
    return NextResponse.json({ error: '报名失败，请稍后重试' }, { status: 500 });
  }
}

// GET: 获取比赛报名信息（用于报名页面展示比赛名和报名状态）
export async function GET(
  request: Request,
  context: { params: Promise<{ competitionId: string }> }
) {
  try {
    const params = await context.params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    const competition = await prisma.competition.findUnique({
      where: { id: params.competitionId },
      select: {
        id: true, name: true, description: true, status: true,
        registrationToken: true, registrationEnabled: true,
        registrationFields: true,
      },
    });

    if (!competition) {
      return NextResponse.json({ error: '比赛不存在' }, { status: 404 });
    }

    if (!competition.registrationToken || token !== competition.registrationToken) {
      return NextResponse.json({ error: '无效的报名链接' }, { status: 401 });
    }

    // 单独统计已报名的参与者数量
    const participantCount = await prisma.participant.count({
      where: {
        participantPrograms: {
          some: {
            program: { competitionId: params.competitionId },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        name: competition.name,
        description: competition.description,
        status: competition.status,
        registrationEnabled: competition.registrationEnabled,
        registrationFields: competition.registrationFields,
        registeredCount: participantCount,
      },
    });
  } catch (error) {
    console.error('获取报名信息失败:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}
