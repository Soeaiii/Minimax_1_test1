# Next.js 15 类型修复说明

## 问题概述

在 Next.js 15 中，以下参数类型发生了变化：
- `params` - 从 `{ id: string }` 变为 `Promise<{ id: string }>`
- `searchParams` - 从 `{ [key: string]: string | string[] | undefined }` 变为 `Promise<{ [key: string]: string | string[] | undefined }>`

这些变化主要影响页面组件(page.tsx)和API路由(route.ts)。

## 修复步骤

### 1. 服务端组件修复

#### 页面组件 (page.tsx)

**修复前：**
```typescript
export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { status?: string };
}) {
  const { id } = params;
  const statusFilter = searchParams.status;
  // ...
}
```

**修复后：**
```typescript
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const searchParamsResult = await searchParams;
  const statusFilter = searchParamsResult.status;
  // ...
}
```

#### API路由 (route.ts)

**修复前：**
```typescript
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // ...
}
```

**修复后：**
```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

### 2. 客户端组件处理

⚠️ **重要**：客户端组件（使用 `'use client'` 指令）中的 `params` 和 `searchParams` **不是** Promise，保持原有类型：

```typescript
'use client';

export default function ClientPage({
  params,
}: {
  params: { id: string }; // 不是 Promise
}) {
  const { id } = params; // 直接使用，不需要 await
  // ...
}
```

## 批量修复命令

我们使用了以下命令进行批量修复：

### 修复服务端组件
```bash
# 修复页面组件类型
find src/app/dashboard -name "page.tsx" | xargs grep -L "'use client'" | xargs sed -i 's|params: { id: string }|params: Promise<{ id: string }>|g'

# 修复searchParams类型
find src/app/dashboard -name "page.tsx" | xargs grep -L "'use client'" | xargs sed -i 's|searchParams: { [^}]*}|searchParams: Promise<{ status?: string }>|g'

# 修复参数使用
find src/app/dashboard -name "page.tsx" | xargs grep -L "'use client'" | xargs sed -i 's|const { id } = params;|const { id } = await params;|g'
find src/app/dashboard -name "page.tsx" | xargs grep -L "'use client'" | xargs sed -i 's|searchParams\.|params\.|g'
```

### 修复API路由
```bash
# 修复API路由类型
find src/app/api -name "route.ts" | xargs sed -i 's|params: { [^}]*}|params: Promise<{ id: string }>|g'

# 修复解构赋值
find src/app/api -name "route.ts" | xargs sed -i 's|const { \([^}]*\) } = params;|const { \1 } = await params;|g'
```

### 恢复客户端组件
```bash
# 恢复客户端组件的类型
find src/app/dashboard -name "page.tsx" | xargs grep -l "'use client'" | xargs sed -i 's|params: Promise<{ id: string }>|params: { id: string }|g'

# 移除客户端组件中的await
find src/app/dashboard -name "page.tsx" | xargs grep -l "'use client'" | xargs sed -i 's|const { id } = await params;|const { id } = params;|g'
```

## 注意事项

1. **区分服务端和客户端组件**：客户端组件的params不是Promise
2. **使用await**：在服务端组件中必须使用await获取params和searchParams
3. **类型安全**：确保TypeScript类型定义正确
4. **测试**：修复后进行完整的构建测试

## 验证修复

构建成功后，运行以下命令验证：

```bash
npm run build
npm run dev
```

如果构建成功且无类型错误，说明修复完成。

## 相关资源

- [Next.js 15 升级指南](https://nextjs.org/docs/messages/next-version-15)
- [App Router 参数文档](https://nextjs.org/docs/app/api-reference/file-conventions/page) 