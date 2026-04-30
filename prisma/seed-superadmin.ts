import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating SUPER_ADMIN user...')
  
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  // Find the default tenant
  const defaultTenant = await prisma.tenant.findFirst({
    where: { name: '默认租户' }
  })
  
  if (!defaultTenant) {
    console.error('Default tenant not found. Run seed first.')
    process.exit(1)
  }
  
  // Check if superadmin already exists
  const existing = await prisma.user.findFirst({
    where: { email: 'superadmin@example.com' }
  })
  
  if (existing) {
    console.log('SUPER_ADMIN already exists, updating...')
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: 'SUPER_ADMIN',
        password: hashedPassword,
        isActive: true,
        permissions: [
          'user:create', 'user:read', 'user:update', 'user:delete', 'user:manage', 'user:manage_all',
          'competition:create', 'competition:read', 'competition:update', 'competition:delete', 'competition:manage',
          'program:create', 'program:read', 'program:update', 'program:delete',
          'participant:create', 'participant:read', 'participant:update', 'participant:delete',
          'score:create', 'score:read', 'score:update', 'score:delete',
          'judge:assign', 'judge:remove', 'judge:manage',
          'tenant:create', 'tenant:read', 'tenant:update', 'tenant:delete', 'tenant:manage',
          'system:settings', 'system:admin',
          'data:export', 'data:import',
          'audit:read',
        ],
      }
    })
    console.log('SUPER_ADMIN updated:', existing.email)
  } else {
    await prisma.user.create({
      data: {
        tenantId: defaultTenant.id,
        name: '超级管理员',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        permissions: [
          'user:create', 'user:read', 'user:update', 'user:delete', 'user:manage', 'user:manage_all',
          'competition:create', 'competition:read', 'competition:update', 'competition:delete', 'competition:manage',
          'program:create', 'program:read', 'program:update', 'program:delete',
          'participant:create', 'participant:read', 'participant:update', 'participant:delete',
          'score:create', 'score:read', 'score:update', 'score:delete',
          'judge:assign', 'judge:remove', 'judge:manage',
          'tenant:create', 'tenant:read', 'tenant:update', 'tenant:delete', 'tenant:manage',
          'system:settings', 'system:admin',
          'data:export', 'data:import',
          'audit:read',
        ],
        isActive: true,
      }
    })
    console.log('SUPER_ADMIN created: superadmin@example.com / 123456')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
