import { NextResponse } from 'next/server';
import { getToken, encode } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { auditLog } from '@/lib/tenant-guard';

const secret = process.env.NEXTAUTH_SECRET!;

/**
 * 安全的租户切换：直接修改 JWT token cookie 中的 activeTenantId
 * 不修改数据库中的 user.tenantId
 */
export async function POST(request: Request) {
  const token = await getToken({ req: request, secret });

  if (!token || token.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 });
  }

  const body = await request.json();
  const { tenantId } = body;

  if (!tenantId) {
    return NextResponse.json({ error: '缺少租户ID' }, { status: 400 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
    return NextResponse.json({ error: '租户不存在' }, { status: 404 });
  }
  if (!tenant.isActive) {
    return NextResponse.json({ error: '该租户已被禁用' }, { status: 400 });
  }
  if (tenant.expiresAt && tenant.expiresAt < new Date()) {
    return NextResponse.json({ error: '该租户已过期' }, { status: 400 });
  }

  // 审计日志
  await auditLog(
    String(token.homeTenantId),
    String(token.id),
    'SWITCH_TENANT',
    tenantId,
    { fromTenantId: String(token.activeTenantId), toTenantId: tenantId, toTenantName: tenant.name }
  );

  // 直接修改 token 中的 activeTenantId
  const newToken = {
    ...token,
    activeTenantId: tenantId,
    tenantName: tenant.name,
  };

  const encoded = await encode({ token: newToken, secret });

  const response = NextResponse.json({
    success: true,
    message: `已切换到租户: ${tenant.name}`,
    tenantId,
    tenantName: tenant.name,
  });

  // 设置新的 session token cookie
  response.cookies.set('next-auth.session-token', encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}

/**
 * 回到原始租户
 */
export async function DELETE(request: Request) {
  const token = await getToken({ req: request, secret });

  if (!token || token.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 });
  }

  const homeTenantId = String(token.homeTenantId);
  const homeTenant = await prisma.tenant.findUnique({ where: { id: homeTenantId } });

  if (!homeTenant) {
    return NextResponse.json({ error: '原始租户不存在' }, { status: 404 });
  }

  const newToken = {
    ...token,
    activeTenantId: homeTenantId,
    tenantName: homeTenant.name,
  };

  const encoded = await encode({ token: newToken, secret });

  const response = NextResponse.json({
    success: true,
    message: `已切回原始租户: ${homeTenant.name}`,
    tenantId: homeTenantId,
    tenantName: homeTenant.name,
  });

  response.cookies.set('next-auth.session-token', encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
