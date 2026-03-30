import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建简化示例数据...')

  try {
    // 测试数据库连接
    await prisma.$connect()
    console.log('✓ 数据库连接成功')

    // 创建默认租户
    const defaultTenant = await prisma.tenant.create({
      data: {
        name: '默认租户',
        domain: 'default.example.com',
        settings: {
          allowRegistration: true,
          maxUsers: 1000,
          features: ['competitions', 'scoring', 'reports']
        },
        isActive: true,
      },
    })
    
    console.log('✓ 已创建默认租户:', defaultTenant.name)

    // 创建一个测试用户
    const hashedPassword = await bcrypt.hash('123456', 12)
    
    const admin = await prisma.user.create({
      data: {
        name: '系统管理员',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: defaultTenant.id,
        permissions: [
          'user:create', 'user:read', 'user:update', 'user:delete',
          'competition:create', 'competition:read', 'competition:update', 'competition:delete',
          'program:create', 'program:read', 'program:update', 'program:delete',
          'participant:create', 'participant:read', 'participant:update', 'participant:delete',
          'score:create', 'score:read', 'score:update', 'score:delete',
          'judge:assign', 'judge:remove',
          'system:settings', 'data:export', 'audit:read'
        ],
        isActive: true,
      },
    })
    
    console.log('✓ 已创建管理员用户:', admin.name)

    // 创建一个参与者
    const participant = await prisma.participant.create({
      data: {
        name: '张小明',
        bio: '专业舞蹈演员，擅长现代舞和民族舞',
        team: '星光舞团',
        contact: '13800138001',
      },
    })
    
    console.log('✓ 已创建参与者:', participant.name)

    console.log('简化示例数据创建完成！')
    console.log(`
创建的数据包括：
- 1 个管理员用户
- 1 个参与者

登录信息：
- 管理员: admin@example.com / 123456
    `)

  } catch (error) {
    console.error('详细错误信息:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('创建示例数据时出错:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })