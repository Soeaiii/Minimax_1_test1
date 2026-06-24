# Repository Guidelines

Multi-tenant competition management SaaS (Next.js 15 App Router, PostgreSQL/Prisma, next-auth JWT).

## Architecture & Data Flow

```
Browser
  → Next.js App Router (pages + API routes)
    → withTenantContext (AsyncLocalStorage: tenantId, userId, role)
      → Route handler
        → prisma (auto-isolated) or prismaRaw (cross-tenant admin only)
          → PostgreSQL
```

**Tenant isolation** is enforced at the Prisma layer via `$extends` in `src/lib/prisma.ts`. 11 models auto-scope to tenant. Excluded: `Tenant` (the tenant itself), join tables (`CompetitionFile`, `ParticipantProgram`, `ProgramFile`).

**Auth**: Two patterns co-exist:
- `withTenantContext` (in `src/lib/tenant-context.ts`) — for regular API routes and pages. Extracts session and sets AsyncLocalStorage. Prisma extension reads from this.
- `getAuthSession()` (in `src/lib/tenant-guard.ts`) — for admin/SUPER_ADMIN routes. Uses `prismaRaw` for cross-tenant queries.

**Real-time display**: SSE via `src/app/api/display/[competitionId]/stream/route.ts`, consumed by `src/hooks/useScoreStream.ts`.

## Key Directories

| Directory | Purpose |
|---|---|
| `src/lib/` | Auth, prisma client, tenant isolation, permissions, types, utils |
| `src/lib/auth/` | Permission matrix, server/client auth helpers, HOCs |
| `src/middleware/` | Legacy middleware (permission, tenant) — migrating to `withTenantContext` |
| `src/app/api/` | REST API routes (70+ files across 14 resource groups) |
| `src/app/dashboard/` | Admin/organizer pages (competitions, programs, participants, judges, display, files, audit-logs, profile, permissions, tenants) |
| `src/app/auth/` | Login, register, register-tenant pages |
| `src/app/judge/` | Judge dashboard, scoring pages |
| `src/app/display/` | Public real-time display page |
| `src/components/ui/` | shadcn-style primitives (29 components: dialog, dropdown, table, form, card, tabs…) |
| `src/components/dashboard/` | Dashboard shell (Header, Sidebar, UserNav, TenantSwitcher) + feature components |
| `src/components/permissions/` | Permission management UI (Matrix, Policy, Selector, UserManagement, RoleSelector) |
| `src/components/judge/` | JudgeHeader component |
| `src/hooks/` | useScoreStream (SSE), use-delete-program, use-toast |
| `prisma/` | Schema, seed data, seed scripts |
| `tests/` | Playwright E2E tests, fixtures, helpers |

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm dbpush           # Push Prisma schema to DB
pnpm seed             # Seed: 2 tenants, 5 users, competition, programs, scores
npx prisma generate   # Regenerate Prisma client
npx prisma studio     # DB GUI
pnpm test             # Run all Playwright E2E tests
pnpm test:ui          # Interactive Playwright runner
node check-all.js     # Quick smoke test (22 pages + 20 APIs, needs dev server)
node check-remaining.js # Supplemental API smoke test
```

**Package manager**: pnpm (version specified in `packageManager` field). NEVER use npm/yarn.

## Code Conventions

### API Route Pattern

Every regular API route MUST be wrapped with `withTenantContext`. Do NOT manually add `tenantId` to Prisma queries — the extension handles it.

```typescript
import { withTenantContext, getTenantContext } from '@/lib/tenant-context';
import { prisma } from '@/lib/prisma';

export const GET = withTenantContext(async (request, { params }) => {
  const ctx = getTenantContext()!;  // tenantId, userId, role
  // Prisma queries auto-scope to ctx.tenantId
  const items = await prisma.competition.findMany();
  return NextResponse.json({ items });
});
```

For admin routes needing cross-tenant access, use `getAuthSession()` + `prismaRaw`:

```typescript
import { getAuthSession } from '@/lib/tenant-guard';
import { prismaRaw } from '@/lib/prisma';
```

### API Response Format

All API responses use a consistent envelope:
```typescript
{ success: boolean, data?: T, error?: string, meta?: { total, page, limit } }
```

### Auth & Role Checks

- Role union: `SUPER_ADMIN | ADMIN | ORGANIZER | JUDGE | USER` (from `src/lib/types.ts`)
- Check roles inside handlers: `ctx.role !== 'ADMIN' && ctx.role !== 'ORGANIZER'`
- Permission guards: `src/lib/auth/permissions.ts` has canonical matrix
- Client components: `PermissionGuard`, `RoleGuard`, `AdminGuard` etc. from `src/components/auth/PermissionGuard.tsx`

### Forms

react-hook-form + zod validation. Example:
```typescript
const form = useForm<FormData>({ resolver: zodResolver(schema) });
```

### State Management

No external state library. useState + useEffect + fetch. Same pattern used across all pages.

### DB Operations

- Write operations (create/update/delete) MUST use `prisma.$transaction` when spanning multiple models
- `prismaRaw` ONLY for admin cross-tenant queries (audit-logs SUPER_ADMIN view, admin/tenants routes)
- Soft delete: `isDeleted: true` for User, `isActive: false` for Tenant
- UUID primary keys on all models

## Database Schema

17 models, 6 enums on PostgreSQL. Key models:
- **Tenant**: id, name, isActive, expiresAt, settings (JSON with permission/security/audit configs)
- **User**: 5 roles, bcrypt password, soft-delete (isDeleted), permissions (JSON array), tenantId
- **Competition**: 4 statuses (PENDING/ACTIVE/FINISHED/ARCHIVED), customFieldDefinitions (JSON), rankingUpdateMode
- **Program**: 3 statuses (WAITING/PERFORMING/COMPLETED), order, competitionId
- **Score**: per-criterion scores + comments, linked to program + judge + scoringCriteria
- **AuditLog**: action, targetId, details (JSON), userId, tenantId

## Test Infrastructure

**Playwright** for E2E tests. Config: `playwright.config.js`.

| File | Purpose |
|---|---|
| `tests/fixtures/auth.js` | `authenticatedPage` fixture, `loginAsAdmin(admin@example.com/123456)` |
| `tests/helpers/api.js` | `smokeTestPage()`, `expectApiOk()`, `collectPageErrors()` |
| `tests/helpers/mock-db.js` | In-memory MockDB for unit tests |
| `tests/comprehensive.spec.js` | 41 tests: all pages + all APIs + dynamic routes |
| `tests/pages/` | Page smoke tests (auth, dashboard, judges-files, permissions, judge-dashboard) |
| `tests/api/` | API smoke tests (competitions, programs, participants, judge-scoring, display-rankings-files, audit-admin) |
| `tests/flows/` | User flow tests (CRUD operations, display flow) |
| `check-all.js` | Quick headless smoke test: 22 pages + 20 APIs. Run with `node check-all.js` |

Test credentials: `admin@example.com` / `123456`.

## Important Files

| File | Role |
|---|---|
| `src/lib/prisma.ts` | Tenant-isolating Prisma client (DO NOT bypass without reason) |
| `src/lib/tenant-context.ts` | AsyncLocalStorage context + withTenantContext middleware |
| `src/lib/auth.ts` | NextAuth configuration (credentials provider, JWT callbacks, bcrypt) |
| `src/lib/auth/permissions.ts` | Canonical RBAC permission matrix |
| `src/lib/types.ts` | Shared enum types (UserRole, CompetitionStatus, etc.) |
| `prisma/schema.prisma` | Database schema (17 models, 6 enums) |
| `prisma/seed.ts` | Seed data for development |
| `next.config.ts` | Next.js config (50MB body limit, allowed origins) |
| `playwright.config.js` | E2E test runner config (webServer auto-start, chromium) |

## Runtime/Tooling

- **Runtime**: Node.js (Next.js 15.3.2)
- **Package manager**: pnpm (required — use `pnpm`, NEVER npm/yarn)
- **Database**: PostgreSQL (Prisma ORM 6.8.2)
- **UI**: Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Auth**: next-auth 4.24.11 (JWT strategy, credentials provider)
- **Testing**: Playwright 1.59.1
- **Forms**: react-hook-form + zod
