import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
    include: { tenant: true }
  })

  for (const user of users) {
    console.log(`用户: ${user.email}`)
    console.log(`  角色: ${user.role}`)
    console.log(`  租户: ${user.tenant ? user.tenant.name : '无'}`)
    console.log(`  租户状态: ${user.tenant?.isActive ? '活跃' : '非活跃'}`)
    console.log('')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
