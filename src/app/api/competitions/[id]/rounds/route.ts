import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

export const GET = withTenantContext(async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const rounds = await prisma.competitionRound.findMany({
    where: { competitionId: id },
    orderBy: { roundOrder: 'asc' },
    include: { _count: { select: { programs: true } } },
  });
  return NextResponse.json({ success: true, data: rounds });
});

export const POST = withTenantContext(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const ctx = getTenantContext()!;
  const { id } = await params;
  const body = await request.json();
  const { name, roundOrder } = body;
  if (!name?.trim()) return NextResponse.json({ error: '轮次名称不能为空' }, { status: 400 });
  const round = await prisma.competitionRound.create({
    data: { tenantId: ctx.tenantId, competitionId: id, name: name.trim(), roundOrder: roundOrder || 1 },
  });
  return NextResponse.json({ success: true, data: round }, { status: 201 });
});
