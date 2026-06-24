import { NextResponse } from 'next/server'
import { withTenantContext, getTenantContext } from '@/lib/tenant-context'
import { getPermissionSettings } from '@/lib/permissions-config'

export const GET = withTenantContext(async () => {
  const ctx = getTenantContext()!

  if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const { policies } = await getPermissionSettings(ctx.tenantId)

  return NextResponse.json({ policies })
})
