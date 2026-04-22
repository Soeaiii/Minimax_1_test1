import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getPermissionSettings, updatePermissionSettings } from '@/lib/permissions-config'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 })
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const tenantId = session.user.tenantId as string
  const { auditConfig } = await getPermissionSettings(tenantId)

  return NextResponse.json({ config: auditConfig })
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 })
  }

  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const body = await request.json()
  const tenantId = session.user.tenantId as string

  await updatePermissionSettings(tenantId, { auditConfig: body.config })

  return NextResponse.json({ success: true })
}
