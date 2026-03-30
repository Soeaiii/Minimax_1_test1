import { PrismaClient } from '@prisma/client'
import { ObjectId } from 'mongodb'

const prisma = new PrismaClient()

async function main() {
  // 获取第一个租户
  try {
    const tenants = await prisma.tenant.findMany()
    console.log("租户:", tenants)
  } catch (e) {
    console.log("查询租户出错")
  }

  // 直接更新用户的 tenantId (不依赖租户)
  const result = await prisma.user.updateMany({
    data: { tenantId: undefined }
  })
  console.log(`更新了 ${result.count} 个用户的 tenantId 为 null`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
