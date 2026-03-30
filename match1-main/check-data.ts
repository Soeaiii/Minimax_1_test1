import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 先检查租户
  const tenants = await prisma.tenant.findMany()
  console.log("租户数量:", tenants.length)
  for (const t of tenants) {
    console.log(`  租户: ${t.name}, ID: ${t.id}, isActive: ${t.isActive}`)
  }

  // 查找用户
  const users = await prisma.user.findMany()
  console.log("\n用户数量:", users.length)
  for (const user of users) {
    console.log(`  用户: ${user.email}, tenantId: ${user.tenantId}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
