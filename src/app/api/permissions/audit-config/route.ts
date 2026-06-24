import { NextRequest, NextResponse } from 'next/server'
import { withTenantContext, getTenantContext } from '@/lib/tenant-context'
import { getPermissionSettings, updatePermissionSettings } from '@/lib/permissions-config'

export const GET = withTenantContext(async () => {
  const ctx = getTenantContext()!

  if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const { auditConfig } = await getPermissionSettings(ctx.tenantId)

  return NextResponse.json({ config: auditConfig })
})

export const PUT = withTenantContext(async (request: NextRequest) => {
  const ctx = getTenantContext()!

  if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const body = await request.json()

  await updatePermissionSettings(ctx.tenantId, { auditConfig: body.config })

  return NextResponse.json({ success: true })
})
