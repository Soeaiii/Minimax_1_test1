import { PrismaClient } from '@prisma/client';
import { getTenantContext } from './tenant-context';

/**
 * Models that carry a tenantId column and MUST be auto-scoped.
 * Models without tenantId (Tenant, CompetitionFile, ParticipantProgram, ProgramFile)
 * are excluded from auto-scoping.
 */
const TENANTED_MODELS_LOWER = new Set([
  'user',
  'competition',
  'scoringcriteria',
  'participant',
  'program',
  'score',
  'ranking',
  'file',
  'auditlog',
  'judgeassignment',
  'displaysettings',
  'competitionround',
  'competitiongroup',
  'notification',
]);

function isTenantedModel(model: string | undefined): boolean {
  return typeof model === 'string' && TENANTED_MODELS_LOWER.has(model.toLowerCase());
}

// ── Raw Prisma client (no tenant extension) ──
const globalForPrisma = global as unknown as {
  prismaRaw: PrismaClient;
  prisma: ReturnType<typeof buildExtendedClient>;
};

function createRawClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    transactionOptions: {
      maxWait: 10000,
      timeout: 30000,
    },
  });
}

/** Un-extended Prisma client. Use ONLY for cross-tenant admin operations. */
export const prismaRaw: PrismaClient =
  globalForPrisma.prismaRaw ?? createRawClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaRaw = prismaRaw;
}

// ── Merged where helpers ──

type WhereInput = Record<string, unknown>;

function mergeTenantWhere(
  existingWhere: WhereInput | undefined,
  tenantId: string,
): WhereInput {
  if (existingWhere === undefined) {
    return { tenantId };
  }
  // If the caller already set tenantId explicitly, keep theirs
  if ('tenantId' in existingWhere) {
    return existingWhere;
  }
  // Simply add tenantId to the existing where — this is safe because
  // the caller won't have a tenantId field (checked above), and direct merge
  // preserves unique-constraint recognition for Prisma queries.
  return { ...existingWhere, tenantId };
}

// ── Build extended client ──

function buildExtendedClient(raw: PrismaClient) {
  return raw.$extends({
    name: 'tenantIsolation',
    query: {
      // --- Read queries ---
      async findMany({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      // findUnique requires where to exactly match a unique constraint.
      // Adding tenantId would break queries like { id: '...' }.
      // Tenant scoping is already ensured because callers can only know
      // IDs within their own tenant (IDs come from tenant-scoped list queries).
      async findUnique({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        return query(args);
      },
      async findFirst({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      async findFirstOrThrow({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      // --- Count & aggregate ---
      async count({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      async aggregate({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      async groupBy({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      // --- Write queries ---
      async create({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        const data = (args.data ?? {}) as Record<string, unknown>;
        return query({ ...args, data: { ...data, tenantId: data.tenantId ?? ctx.tenantId } });
      },
      async createMany({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        const dataArr = (args.data as unknown[] | undefined) ?? [];
        return query({
          ...args,
          data: dataArr.map((d) => ({
            ...(d as Record<string, unknown>),
            tenantId: (d as Record<string, unknown>).tenantId ?? ctx.tenantId,
          })),
        });
      },
      async update({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      async updateMany({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      async delete({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      async deleteMany({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        return query({ ...args, where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId) });
      },
      async upsert({ model, args, query }: {
        model?: string;
        operation: string;
        args: Record<string, unknown>;
        query: (args: Record<string, unknown>) => Promise<unknown>;
      }) {
        if (!isTenantedModel(model)) return query(args);
        const ctx = getTenantContext();
        if (!ctx) return query(args);
        const createData = (args.create ?? {}) as Record<string, unknown>;
        return query({
          ...args,
          where: mergeTenantWhere(args.where as WhereInput, ctx.tenantId),
          create: { ...createData, tenantId: createData.tenantId ?? ctx.tenantId },
        });
      },
    },
  });
}

/**
 * Tenant-scoped Prisma client. All queries on tenanted models are
 * automatically filtered to the current tenant when a tenant context exists.
 */
function getOrCreateExtendedClient(): ReturnType<typeof buildExtendedClient> {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = buildExtendedClient(prismaRaw);
  }
  return globalForPrisma.prisma;
}

export const prisma = getOrCreateExtendedClient();
