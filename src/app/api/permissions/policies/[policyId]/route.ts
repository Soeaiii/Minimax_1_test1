import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getPermissionSettings, updatePermissionSettings } from '@/lib/permissions-config'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ policyId: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 })
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const { policyId } = await params
  const body = await request.json()
  const tenantId = session.user.tenantId as string
  const { policies } = await getPermissionSettings(tenantId)

  const nextPolicies = policies.map((policy) =>
    policy.id === policyId
      ? {
          ...policy,
          enabled: typeof body.enabled === 'boolean' ? body.enabled : policy.enabled,
          updatedAt: new Date().toISOString(),
        }
      : policy
  )

  await updatePermissionSettings(tenantId, { permissionPolicies: nextPolicies })

  return NextResponse.json({ success: true })
}
