/**
 * 租户守卫工具库 - 用于 ADMIN/SUPER_ADMIN 路由的认证和权限检查。
 * 常规 API 路由应使用 withTenantContext (src/lib/tenant-context.ts) 进行租户隔离。
 */
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prismaRaw } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// ── 类型 ──
export interface AuthSession {
  user: {
    id: string;
    role: string;
    tenantId: string;       // activeTenantId（当前查看的租户）
    homeTenantId: string;   // 原始租户（永不改变）
    tenantName: string;
    permissions: string[];
  };
}

// ── 获取认证 session（带类型）─
export async function getAuthSession(): Promise<AuthSession | null> {
  return getServerSession(authOptions) as Promise<AuthSession | null>;
}

// ── 获取当前活跃的 tenantId ─
export async function getActiveTenantId(): Promise<{ tenantId: string; session: AuthSession } | { error: NextResponse }> {
  const session = await getAuthSession();
  if (!session?.user) {
    return { error: NextResponse.json({ error: '未授权访问' }, { status: 401 }) };
  }
  return { tenantId: session.user.tenantId, session };
}

// ── 租户守卫：校验租户存在且活跃 ─
export async function requireActiveTenant(tenantId?: string) {
  const tid = tenantId || (await getActiveTenantId());
  if ('error' in tid) return tid;

  const actualTenantId = 'tenantId' in tid ? tid.tenantId : tenantId!;
  const tenant = await prismaRaw.tenant.findUnique({ where: { id: actualTenantId } });

  if (!tenant) {
    return { error: NextResponse.json({ error: '租户不存在' }, { status: 404 }) };
  }
  if (!tenant.isActive) {
    return { error: NextResponse.json({ error: '该租户已被停用' }, { status: 403 }) };
  }
  if (tenant.expiresAt && tenant.expiresAt < new Date()) {
    return { error: NextResponse.json({ error: '该租户已过期，请联系管理员续费' }, { status: 403 }) };
  }

  return { tenant, session: 'session' in tid ? tid.session : undefined };
}

// ── 权限守卫 ─
export function requireRole(session: AuthSession, ...roles: string[]) {
  if (!roles.includes(session.user.role)) {
    return { error: NextResponse.json({ error: '权限不足' }, { status: 403 }) };
  }
  return {};
}

// ── 审计日志快捷方法 ─
export async function auditLog(
  tenantId: string,
  userId: string,
  action: string,
  targetId?: string,
  details?: Record<string, unknown>,
) {
  return prismaRaw.auditLog.create({
    data: { tenantId, userId, action, targetId, details },
  });
}
