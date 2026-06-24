# 修复记录：DisplayManagement 组件错误

**日期**：2026-04-24  
**问题**：Console Error "获取显示数据失败"，随后 Runtime Error "Cannot read properties of undefined (reading 'length')"  
**影响页面**：`/dashboard/competitions/[id]` → DisplayManagement 组件

---

## 问题描述

### 错误 1：401 未授权
```
Error: 获取显示数据失败
src/components/dashboard/competitions/DisplayManagement.tsx (109:15)
```

### 错误 2：undefined length
```
Error: Cannot read properties of undefined (reading 'length')
src/components/dashboard/competitions/DisplayManagement.tsx (467:54)

{currentProgram.participants.length > 0 && (
```

---

## 根本原因分析

### 问题 1：401 未授权
- **原因**：`/api/display/[competitionId]/data` API 需要 `publicToken` 验证
- **触发条件**：数据库中 `DisplaySettings` 表已有记录并包含 `publicToken`，但前端 fetch 时没有传递 token 参数
- **场景**：管理员在已登录状态下访问管理后台，管理后台本身已有 session 认证

### 问题 2：undefined length
- **原因**：API 返回的 `currentProgram` 结构是 `{ ..., participantPrograms: [{ participant: {...} }] }`
- **前端期望**：`currentProgram.participants` 直接是数组 `[{ id, name, team }]`
- **实际**：嵌套在 `participantPrograms` 下，导致 `currentProgram.participants` 为 `undefined`

---

## 修复方案

### 修复 1：允许已登录用户跳过 token 验证

**文件**：`src/app/api/display/[competitionId]/data/route.ts`

```typescript
// 添加 session 验证
const session = await getServerSession(authOptions);
const isLoggedInUser = session?.user && session.user.tenantId === competition.tenantId;

if (displaySettings.publicToken && !isLoggedInUser) {
  if (!token || token !== displaySettings.publicToken) {
    return NextResponse.json({ error: '无效的访问Token' }, { status: 401 });
  }
}
```

**逻辑**：已登录用户（有正确的 tenantId）可以跳过 token 验证，直接访问 API

### 修复 2：数据转换（participantPrograms → participants）

**文件**：`src/app/api/display/[competitionId]/data/route.ts`

```typescript
// 转换数据：将 participantPrograms 展平为 participants
const transformProgram = (program: any) => {
  if (!program) return null;
  return {
    ...program,
    participants: program.participantPrograms?.map((pp: any) => pp.participant) || [],
  };
};

const displayData = {
  settings: displaySettings,
  competition,
  currentProgram: transformProgram(currentProgram),
  judgeScores,
  judges,
  programs: programs.map(transformProgram),
};
```

**逻辑**：Prisma 查询返回 `participantPrograms`（连接表），转换为前端期望的 `participants`（参赛者数组）

---

## 相关文件

| 文件路径 | 说明 |
|---------|------|
| `src/app/api/display/[competitionId]/data/route.ts` | Display Data API，修复了认证和数据转换 |
| `src/components/dashboard/competitions/DisplayManagement.tsx` | 出错组件，访问 `currentProgram.participants` |
| `prisma/schema.prisma` | 数据库模型参考（Program, Participant, ParticipantProgram, DisplaySettings） |

---

## 数据库信息

- **数据库**：PostgreSQL
- **连接**：`postgresql://postgres:***@localhost:5432/match7`
- **关键表**：
  - `Competition` - 比赛信息
  - `Program` - 节目（与 Participant 通过 ParticipantProgram 关联）
  - `ParticipantProgram` - 节目-参赛者连接表
  - `Participant` - 参赛者
  - `DisplaySettings` - 显示设置（含 publicToken）

---

## 验证方法

1. 访问 `http://localhost:3000/dashboard/competitions`
2. 点击任意比赛进入详情页
3. 切换到"显示管理"标签页
4. 检查 Console 无错误，页面正常显示节目列表和参赛者信息

---

## 数据模型关系

```
Competition (1) ─── (N) Program
                          │
                          │ N:M (ParticipantProgram)
                          │
                          ▼
                     Participant
```

Prisma Schema 中的关系：
```prisma
model Program {
  participantPrograms ParticipantProgram[]
}

model ParticipantProgram {
  program       Program     @relation(fields: [programId], references: [id])
  participant   Participant @relation(fields: [participantId], references: [id])
}

model Participant {
  participantPrograms ParticipantProgram[]
}
```

---

## 备注

- Lint 错误（node_modules 中的 next-auth 等包）是第三方库类型问题，不影响运行
- API 修改保持了多租户安全性：只有 tenantId 匹配的用户才能跳过 token 验证
- 后续如需添加公开展示页面，仍可使用 token 方式验证
