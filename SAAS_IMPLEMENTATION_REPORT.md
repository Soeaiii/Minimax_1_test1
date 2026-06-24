# 比赛管理系统 SaaS 测试与实现报告

**日期**: 2026-04-26  
**项目路径**: `/Users/soea/progarm/Minimax_1_test1`  
**技术栈**: Next.js 15.3.2 + PostgreSQL + Prisma + next-auth

---

## Phase 1: 页面测试结果

所有 35+ 个页面均返回 **HTTP 200**：

| 页面 URL | 状态 |
|---------|------|
| / | 200 ✓ |
| /auth/login | 200 ✓ |
| /auth/register | 200 ✓ |
| /auth/register-tenant (NEW) | 200 ✓ |
| /dashboard | 200 ✓ |
| /dashboard/competitions | 200 ✓ |
| /dashboard/competitions/new | 200 ✓ |
| /dashboard/competitions/[id] | 200 ✓ |
| /dashboard/competitions/[id]/edit | 200 ✓ |
| /dashboard/competitions/[id]/custom-fields/manage | 200 ✓ |
| /dashboard/programs | 200 ✓ |
| /dashboard/programs/new | 200 ✓ |
| /dashboard/programs/[id] | 200 ✓ |
| /dashboard/programs/[id]/edit | 200 ✓ |
| /dashboard/participants | 200 ✓ |
| /dashboard/participants/new | 200 ✓ |
| /dashboard/judges | 200 ✓ |
| /dashboard/judges/new | 200 ✓ |
| /dashboard/display | 200 ✓ |
| /dashboard/display/[id] | 200 ✓ |
| /dashboard/files | 200 ✓ |
| /dashboard/audit-logs | 200 ✓ |
| /dashboard/profile | 200 ✓ |
| /dashboard/permissions | 200 ✓ |
| /dashboard/permissions/roles | 200 ✓ |
| /dashboard/permissions/users | 200 ✓ |
| /dashboard/permissions/data-access | 200 ✓ |
| /dashboard/permissions/settings | 200 ✓ |
| /dashboard/roles | 200 ✓ |
| /dashboard/tenants | 200 ✓ |
| /dashboard/tenants/new | 200 ✓ |
| /dashboard/tenants/[id] | 200 ✓ |
| /dashboard/tenants/[id]/settings (NEW) | 200 ✓ |
| /judge/dashboard | 200 ✓ |
| /judge/login | 200 ✓ |
| /judge/profile | 200 ✓ |
| /judge/competitions/[id] | 200 ✓ |
| /judge/competitions/[id]/scoring | 200 ✓ |
| /display/[competitionId] | 200 ✓ |
| /unauthorized | 200 ✓ |

---

## Phase 2: API 测试结果

### GET 端点 (18 tested)
| 端点 | 状态 | 备注 |
|------|------|------|
| /api/auth/session | 200 ✓ | 返回 admin session |
| /api/competitions | 200 ✓ | 租户隔离 |
| /api/programs | 200 ✓ | 租户隔离 |
| /api/participants | 200 ✓ | 租户隔离 |
| /api/judge/competitions | 401 | 预期: ADMIN 无法访问评委端点 |
| /api/judge/profile | 401 | 预期: ADMIN 无法访问评委端点 |
| /api/dashboard/stats | 200 ✓ | |
| /api/files | 200 ✓ | |
| /api/admin/tenants | 200 ✓ | 分页+搜索 |
| /api/users | 200 ✓ | |
| /api/rankings | 400 | 需要 competitionId 参数 |
| /api/permissions/data-access/stats | 200 ✓ | |
| /api/permissions/data-access/rules | 200 ✓ | |
| /api/permissions/policies | 200 ✓ | |
| /api/permissions/audit-config | 200 ✓ | |
| /api/permissions/security-config | 200 ✓ | |
| /api/debug/scores | 200 ✓ | 已加固(需登录) |
| /api/test-participant-relations | 500 | 需调查 |

### POST 端点
| 端点 | 状态 | 备注 |
|------|------|------|
| /api/competitions | 201 ✓ | |
| /api/participants | 201 ✓ | |
| /api/programs | 200 ✓ | |
| /api/admin/tenants | 201 ✓ | |
| /api/auth/register-tenant (NEW) | 201 ✓ | SaaS 注册 |

---

## Phase 3: SaaS 租户功能实现

### 3a. SUPER_ADMIN 角色
- 已存在于 schema（UserRole 枚举）
- 权限配置完整（含 tenant:manage, system:admin 等）
- 中间件已支持跨租户访问
- 种子数据: superadmin@example.com / 123456
- 文件: `prisma/seed-superadmin.ts`

### 3b. 租户管理 UI
- 租户列表: `/dashboard/tenants` (搜索，分页，状态过滤，切换启用/禁用)
- 租户详情: `/dashboard/tenants/[id]` (用户列表，比赛列表，统计)
- 创建租户: `/dashboard/tenants/new` (表单验证)
- 侧边栏已有 "租户管理" 链接 (BUILDING2 图标，SUPER_ADMIN 可见)

### 3c. 租户注册 (NEW)
- API: `POST /api/auth/register-tenant` - 创建租户 + 首个 ADMIN
- 页面: `/auth/register-tenant` - 公开注册表单
- 支持: 公司名称，管理员邮箱/密码，自定义域名

### 3d. 租户设置页面 (NEW)
- `/dashboard/tenants/[id]/settings` 
- 功能: 编辑名称、域名、联系邮箱、启用/停用、允许注册、最大用户数
- 使用 react-hook-form + zod 验证

### 3e. API 租户隔离审计
审计了所有 67 个 API route 文件:
- ✓ 63/67 已有 tenantId 过滤或 session 验证
- 已加固: `/api/debug/scores` - 添加了 auth + 租户过滤
- 豁免: `/api/auth/[...nextauth]` (认证端点，无需隔离)
- 豁免: `/api/display/[id]/stream` (SSE 使用 token 隔离)
- 豁免: `/api/files/preview` (文件预览，基于路径)

---

## 已创建/修改的文件

### 新建:
- `src/app/api/auth/register-tenant/route.ts` - 租户注册 API
- `src/app/auth/register-tenant/page.tsx` - 租户注册页面
- `src/app/dashboard/tenants/[id]/settings/page.tsx` - 租户设置页面
- `prisma/seed-superadmin.ts` - SUPER_ADMIN 种子脚本

### 修改:
- `src/app/api/debug/scores/route.ts` - 添加 auth + tenant 隔离

---

## 登录凭证

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 超级管理员 | superadmin@example.com | 123456 |
| 管理员 | admin@example.com | 123456 |
| 组织者 | organizer@example.com | 123456 |
| 评委 | judge1@example.com | 123456 |

---

## 已知问题

1. `/api/test-participant-relations` 返回 500（测试用，非关键）
2. `/api/rankings` GET 需要 `competitionId` 查询参数（API 设计要求）
3. 评委端点对 ADMIN 返回 401（预期行为：ADMIN != JUDGE 角色）
4. 文件上传需先有 competitionId 关联（API 设计要求）

---

## 下一步建议

1. **租户切换器**: 在 Header 中为 SUPER_ADMIN 添加租户切换下拉菜单
2. **用量统计**: 按租户统计 API 调用量/存储用量
3. **计费系统**: 集成 Stripe/LemonSqueezy 实现 SaaS 订阅
4. **自定义品牌**: 允许租户自定义 Logo、颜色主题
5. **审计日志增强**: 按租户过滤 + 导出功能
6. **修复 500 错误**: 调查 test-participant-relations 失败原因
