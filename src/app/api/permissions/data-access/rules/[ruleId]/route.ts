import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getPermissionSettings, updatePermissionSettings } from '@/lib/permissions-config'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 })
  }

  if (!['ADMIN', 'ORGANIZER'].includes(session.user.role)) {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const body = await request.json()
  const { ruleId } = await params
  const tenantId = session.user.tenantId as string
  const { dataAccessRules } = await getPermissionSettings(tenantId)

  const nextRules = dataAccessRules.map((rule) =>
    rule.id === ruleId
      ? {
          ...rule,
          enabled: typeof body.enabled === 'boolean' ? body.enabled : rule.enabled,
          updatedAt: new Date().toISOString(),
        }
      : rule
  )

  await updatePermissionSettings(tenantId, { dataAccessRules: nextRules })

  return NextResponse.json({ success: true })
}
