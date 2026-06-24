import { NextRequest, NextResponse } from 'next/server'
import { withTenantContext, getTenantContext } from '@/lib/tenant-context'
import { getPermissionSettings, updatePermissionSettings } from '@/lib/permissions-config'

export const PUT = withTenantContext(async (
  request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) => {
  const ctx = getTenantContext()!

  if (ctx.role !== 'ADMIN' && ctx.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const { policyId } = await params
  const body = await request.json()
  const { policies } = await getPermissionSettings(ctx.tenantId)

  const nextPolicies = policies.map((policy) =>
    policy.id === policyId
      ? {
          ...policy,
          enabled: typeof body.enabled === 'boolean' ? body.enabled : policy.enabled,
          updatedAt: new Date().toISOString(),
        }
      : policy
  )

  await updatePermissionSettings(ctx.tenantId, { permissionPolicies: nextPolicies })

  return NextResponse.json({ success: true })
})
