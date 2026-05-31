/**
 * 租户守卫工具库
 * 提供 API 级别的租户隔离、配额校验、权限检查
 */
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

// ── 获取认证 session（带类型） ──
export async function getAuthSession(): Promise<AuthSession | null> {
  // @ts-ignore
  return getServerSession(authOptions) as Promise<AuthSession | null>;
}

// ── 获取当前活跃的 tenantId ──
export async function getActiveTenantId(): Promise<{ tenantId: string; session: AuthSession } | { error: NextResponse }> {
  const session = await getAuthSession();
  if (!session?.user) {
    return { error: NextResponse.json({ error: '未授权访问' }, { status: 401 }) };
  }
  return { tenantId: session.user.tenantId, session };
}

// ── 租户守卫：校验租户存在且活跃 ──
export async function requireActiveTenant(tenantId?: string) {
  const tid = tenantId || (await getActiveTenantId());
  if ('error' in tid) return tid;

  const actualTenantId = 'tenantId' in tid ? tid.tenantId : tenantId!;
  const tenant = await prisma.tenant.findUnique({ where: { id: actualTenantId } });

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

// ── 权限守卫 ──
export function requireRole(session: AuthSession, ...roles: string[]) {
  if (!roles.includes(session.user.role)) {
    return { error: NextResponse.json({ error: '权限不足' }, { status: 403 }) };
  }
  return {};
}

// ── 配额校验 ──
export async function checkQuota(tenantId: string, resource: 'users' | 'competitions') {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { maxUsers: true, maxCompetitions: true, _count: { select: { users: true, competitions: true } } },
  });
  if (!tenant) return { error: NextResponse.json({ error: '租户不存在' }, { status: 404 }) };

  if (resource === 'users' && tenant._count.users >= tenant.maxUsers) {
    return { error: NextResponse.json({ error: `用户数量已达上限 (${tenant.maxUsers})，请升级套餐` }, { status: 403 }) };
  }
  if (resource === 'competitions' && tenant._count.competitions >= tenant.maxCompetitions) {
    return { error: NextResponse.json({ error: `比赛数量已达上限 (${tenant.maxCompetitions})，请升级套餐` }, { status: 403 }) };
  }

  return { ok: true, tenant };
}

// ── 审计日志快捷方法 ──
export async function auditLog(
  tenantId: string,
  userId: string,
  action: string,
  targetId?: string,
  details?: Record<string, any>
) {
  return prisma.auditLog.create({
    data: { tenantId, userId, action, targetId, details },
  });
}

// ── 套餐配额默认值 ──
export const PLAN_QUOTAS = {
  FREE:       { maxUsers: 10,   maxCompetitions: 3 },
  BASIC:      { maxUsers: 100,  maxCompetitions: 10 },
  PRO:        { maxUsers: 500,  maxCompetitions: 50 },
  ENTERPRISE: { maxUsers: 5000, maxCompetitions: 999 },
} as const;
