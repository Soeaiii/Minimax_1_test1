import { AsyncLocalStorage } from 'async_hooks';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: string;
}

const tenantContextStore = new AsyncLocalStorage<TenantContext>();

/**
 * Returns the current tenant context, or null if no context is set.
 * The Prisma extension checks this; when null it skips tenant isolation
 * (used in auth flows where no session exists yet).
 */
export function getTenantContext(): TenantContext | null {
  return tenantContextStore.getStore() ?? null;
}

/**
 * Wraps a Next.js route handler with tenant context extracted from the session.
 * All Prisma queries within the handler are automatically scoped to the tenant.
 */
export function withTenantContext(
  handler: (req: Request, context: { params: unknown }) => Promise<NextResponse>,
) {
  return async (req: Request, context: { params: unknown }): Promise<NextResponse> => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    return tenantContextStore.run(
      {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        role: session.user.role,
      },
      () => handler(req, context),
    );
  };
}
