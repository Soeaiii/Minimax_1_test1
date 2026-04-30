import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TenantDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  if (!session?.user) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'SUPER_ADMIN') {
    redirect('/unauthorized')
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      competitions: {
        select: {
          id: true,
          name: true,
          status: true,
          startTime: true,
          _count: {
            select: { programs: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          users: true,
          competitions: true,
          programs: true,
        },
      },
    },
  })

  if (!tenant) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/dashboard/tenants" className="text-muted-foreground hover:underline">
            ← 返回租户列表
          </Link>
          <h1 className="text-2xl font-bold mt-2">{tenant.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/tenants/${tenant.id}/settings`}
            className="px-4 py-2 border rounded-md hover:bg-muted"
          >
            设置
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold">{tenant._count.users}</div>
          <div className="text-muted-foreground">用户数</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold">{tenant._count.competitions}</div>
          <div className="text-muted-foreground">比赛数</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold">{tenant._count.programs}</div>
          <div className="text-muted-foreground">节目数</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold">{tenant.isActive ? '活跃' : '禁用'}</div>
          <div className="text-muted-foreground">状态</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">用户列表</h2>
          <div className="space-y-2">
            {tenant.users.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-2 bg-muted rounded">
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{user.role}</div>
                  <div className={`text-xs ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {user.isActive ? '活跃' : '禁用'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">比赛列表</h2>
          <div className="space-y-2">
            {tenant.competitions.map((comp) => (
              <div key={comp.id} className="flex justify-between items-center p-2 bg-muted rounded">
                <div>
                  <div className="font-medium">{comp.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(comp.startTime).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{comp._count.programs} 节目</div>
                  <div className="text-xs text-muted-foreground">{comp.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}