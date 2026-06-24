import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';

export const GET = withTenantContext(async (_request: Request) => {
  const ctx = getTenantContext()!;
  const notifications = await prisma.notification.findMany({
    where: { userId: ctx.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const unreadCount = await prisma.notification.count({
    where: { userId: ctx.userId, isRead: false },
  });
  return NextResponse.json({ success: true, data: notifications, meta: { unreadCount } });
});

export const PUT = withTenantContext(async (request: Request) => {
  const ctx = getTenantContext()!;
  const body = await request.json();
  const { ids, markAll } = body;

  if (markAll) {
    await prisma.notification.updateMany({
      where: { userId: ctx.userId, isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  }

  if (ids?.length) {
    await prisma.notification.updateMany({
      where: { id: { in: ids }, userId: ctx.userId },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: '请提供 ids 或 markAll' }, { status: 400 });
});
