import { NextResponse } from 'next/server';

/**
 * 公开租户注册 — 已禁用
 * 只有 SUPER_ADMIN 可以通过 /dashboard/tenants/new 创建租户
 */
export async function POST() {
  return NextResponse.json(
    { error: '公开注册已关闭，请联系平台管理员创建租户' },
    { status: 403 }
  );
}
