import { NextRequest, NextResponse } from 'next/server'
import { withTenantContext, getTenantContext } from '@/lib/tenant-context'
import { getPermissionSettings, updatePermissionSettings } from '@/lib/permissions-config'

export const PUT = withTenantContext(async (
  request: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> }
) => {
  const ctx = getTenantContext()!

  if (!['ADMIN', 'SUPER_ADMIN', 'ORGANIZER'].includes(ctx.role)) {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const body = await request.json()
  const { ruleId } = await params
  const { dataAccessRules } = await getPermissionSettings(ctx.tenantId)

  const nextRules = dataAccessRules.map((rule) =>
    rule.id === ruleId
      ? {
          ...rule,
          enabled: typeof body.enabled === 'boolean' ? body.enabled : rule.enabled,
          updatedAt: new Date().toISOString(),
        }
      : rule
  )

  await updatePermissionSettings(ctx.tenantId, { dataAccessRules: nextRules })

  return NextResponse.json({ success: true })
})
