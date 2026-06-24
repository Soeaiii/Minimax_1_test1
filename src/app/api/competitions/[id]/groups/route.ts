import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

export const GET = withTenantContext(async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const groups = await prisma.competitionGroup.findMany({
    where: { competitionId: id },
    include: { _count: { select: { programs: true } } },
  });
  return NextResponse.json({ success: true, data: groups });
});

export const POST = withTenantContext(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const ctx = getTenantContext()!;
  const { id } = await params;
  const body = await request.json();
  const { name, description } = body;
  if (!name?.trim()) return NextResponse.json({ error: '组别名称不能为空' }, { status: 400 });
  const group = await prisma.competitionGroup.create({
    data: { tenantId: ctx.tenantId, competitionId: id, name: name.trim(), description },
  });
  return NextResponse.json({ success: true, data: group }, { status: 201 });
});
