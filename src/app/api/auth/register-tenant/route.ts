import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  // 公开注册已禁用 — 只有 SUPER_ADMIN 可以通过 /dashboard/tenants/new 创建租户
  return NextResponse.json(
    { error: '公开注册已关闭，请联系平台管理员创建租户' },
    { status: 403 }
  )

  try {
    const body = await request.json()
    const { companyName, adminEmail, adminPassword, domain } = body

    // Validate
    if (!companyName || !adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: '公司名称、管理员邮箱和密码为必填项' },
        { status: 400 }
      )
    }

    if (adminPassword.length < 6) {
      return NextResponse.json(
        { error: '密码至少需要6个字符' },
        { status: 400 }
      )
    }

    // Check domain uniqueness
    if (domain) {
      const existingDomain = await prisma.tenant.findUnique({ where: { domain } })
      if (existingDomain) {
        return NextResponse.json({ error: '该域名已被使用' }, { status: 400 })
      }
    }

    // Check email uniqueness across all tenants
    const existingUser = await prisma.user.findFirst({
      where: { email: adminEmail }
    })
    if (existingUser) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 })
    }

    // Create tenant + admin user in transaction
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: companyName,
          domain: domain || null,
          settings: {
            allowRegistration: true,
            maxUsers: 100,
            features: ['competitions', 'scoring', 'display'],
          },
          isActive: true,
        },
      })

      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      const admin = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: companyName + '管理员',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true,
        },
      })

      return { tenant, admin }
    })

    return NextResponse.json(
      {
        message: '租户注册成功',
        tenant: {
          id: result.tenant.id,
          name: result.tenant.name,
          domain: result.tenant.domain,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Tenant registration error:', error)
    return NextResponse.json(
      { error: '注册失败: ' + (error?.message || '未知错误') },
      { status: 500 }
    )
  }
}
