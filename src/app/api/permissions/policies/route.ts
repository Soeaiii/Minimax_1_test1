import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getPermissionSettings } from '@/lib/permissions-config'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 })
  }

  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  const tenantId = session.user.tenantId as string
  const { policies } = await getPermissionSettings(tenantId)

  return NextResponse.json({ policies })
}
