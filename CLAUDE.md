# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Competition Management System (比赛管理系统)

A Next.js-based competition management platform for managing contests, participants, programs, and judge scoring with real-time display updates.

## Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Database**: MongoDB with Prisma ORM 6.8.2
- **Authentication**: next-auth 4.24.11 (JWT session, credentials provider)
- **UI**: Tailwind CSS, shadcn/ui components, Radix UI
- **Forms**: react-hook-form with zod validation
- **Excel**: xlsx library for import/export
- **Password**: bcryptjs for hashing

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── competitions/  # Competition CRUD
│   │   ├── display/        # Public display with SSE
│   │   ├── judge/         # Judge-specific endpoints
│   │   ├── participants/  # Participant management
│   │   ├── programs/      # Program management
│   │   └── files/         # File upload/download
│   ├── auth/              # Login/register pages
│   ├── dashboard/         # Admin/Organizer dashboard
│   │   ├── competitions/  # Competition management
│   │   ├── participants/  # Participant management
│   │   ├── programs/      # Program management
│   │   ├── judges/        # Judge management
│   │   ├── display/       # Display management
│   │   ├── audit-logs/    # Audit log viewer
│   │   ├── files/         # File management
│   │   └── permissions/   # RBAC management
│   ├── judge/             # Judge dashboard & scoring
│   │   ├── competitions/[id]/scoring/
│   │   └── profile/
│   └── display/[competitionId]/  # Public real-time display
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── competitions/  # Competition cards, forms, lists
│   │   ├── programs/      # Program cards, scoring forms
│   │   └── files/        # File upload/grid
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
│   └── useScoreStream.ts # SSE for real-time scores
└── lib/                  # Core utilities
    ├── auth.ts           # NextAuth configuration
    ├── permissions.ts    # RBAC permission system
    ├── prisma.ts        # Prisma client singleton
    ├── types.ts          # TypeScript types
    └── utils.ts          # Utility functions
```

## Database Schema (Prisma)

### Core Models

- **Tenant**: Multi-tenant support with isActive flag
- **User**: Authentication with role (ADMIN, ORGANIZER, JUDGE, USER), tenant association
- **Competition**: Events with status (PENDING, ACTIVE, FINISHED, ARCHIVED)
- **ScoringCriteria**: Judge scoring criteria per competition
- **Participant**: Competition participants
- **Program**: Performances/programs linked to participants
- **Score**: Judge scores with criterion breakdown
- **Ranking**: Computed rankings
- **File**: Uploaded files storage
- **AuditLog**: Action logging
- **JudgeAssignment**: Judge-to-competition assignments
- **DisplaySettings**: Display preferences per competition

### Enums

```prisma
UserRole: ADMIN, ORGANIZER, JUDGE, USER
CompetitionStatus: PENDING, ACTIVE, FINISHED, ARCHIVED
ProgramStatus: WAITING, PERFORMING, COMPLETED
DisplayTheme: MODERN, CLASSIC, MINIMAL, ELEGANT
```

## Authentication System

### NextAuth Configuration (src/lib/auth.ts)

- **Provider**: Credentials (email/password)
- **Session Strategy**: JWT (30-day expiry)
- **Callbacks**: Custom jwt/session callbacks inject role, tenantId, permissions
- **Password**: bcrypt comparison

### RBAC Permission System (src/lib/permissions.ts)

Permission format: `resource:action` (e.g., `programs:create`, `competitions:read`)

Role permissions:
- **ADMIN**: Full access
- **ORGANIZER**: Manage competitions, programs, participants
- **JUDGE**: Score programs in assigned competitions
- **USER**: Limited read access

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handler

### Competitions
- `GET/POST /api/competitions` - List/Create competitions
- `GET/PUT/DELETE /api/competitions/[id]` - CRUD operations
- `GET /api/competitions/[id]/stats` - Competition statistics
- `GET /api/competitions/[id]/judges-and-criteria` - Judges and scoring criteria

### Programs
- `GET/POST /api/programs` - List/Create programs
- `GET/PUT/DELETE /api/programs/[id]` - CRUD operations
- `GET /api/programs/[id]/scores` - Program scores
- `POST /api/programs/batch-import` - Excel batch import

### Display (Real-time)
- `GET /api/display/[competitionId]/data` - Display data with auto-created settings
- `GET /api/display/[competitionId]/stream` - SSE endpoint for real-time updates

### Judge
- `GET /api/judge/competitions` - Judge's assigned competitions
- `POST /api/judge/programs/[id]/scores` - Submit scores

## Key Features

### Real-time Display (SSE)
- Public display page at `/display/[competitionId]`
- Server-Sent Events for live score updates
- Theme support (MODERN, CLASSIC, MINIMAL, ELEGANT)
- Judge cards with individual scores
- Average score computation

### Judge Scoring Interface
- Form-based scoring with react-hook-form + zod
- Per-criterion scores with optional comments
- Progress tracking and program navigation
- LocalStorage persistence for scoring position

### Excel Import/Export
- Batch import participants and programs via xlsx
- Export competition/program data

## Configuration

### next.config.ts
- Server actions body limit: 50mb
- Image optimization: webp, avif
- Allowed dev origins for local network access

### Environment Variables
```
NEXTAUTH_SECRET - Auth secret
DATABASE_URL - MongoDB connection string
```

## Navigation

Dashboard sidebar items (role-based visibility):
- /dashboard - Dashboard (仪表盘)
- /dashboard/competitions - Competition Management
- /dashboard/programs - Program Management
- /dashboard/participants - Participant Management
- /dashboard/judges - Judge Management
- /dashboard/display - Display Management
- /dashboard/audit-logs - Audit Logs
- /dashboard/files - File Management
- /dashboard/permissions - Admin only (roles, users, data-access, settings)
