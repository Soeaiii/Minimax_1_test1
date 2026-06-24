import { NextResponse } from 'next/server'
import { withTenantContext, getTenantContext } from '@/lib/tenant-context'
import { getPermissionSettings } from '@/lib/permissions-config'

export const GET = withTenantContext(async () => {
  const ctx = getTenantContext()!

  if (!['ADMIN', 'SUPER_ADMIN', 'ORGANIZER'].includes(ctx.role)) {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const { dataAccessRules } = await getPermissionSettings(ctx.tenantId)

  return NextResponse.json({ rules: dataAccessRules })
})
