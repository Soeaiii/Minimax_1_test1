const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  // 获取默认租户
  const tenant = await prisma.tenant.findFirst({ where: { domain: 'default.example.com' }});
  console.log('默认租户 ID:', tenant?._id);

  // 查找并修复用户
  const users = await prisma.user.findMany();
  for (const user of users) {
    console.log('用户:', user.email, '| tenantId:', user.tenantId);

    const tid = String(user.tenantId);
    if (tid === '0' || tid.length !== 24) {
      await prisma.user.update({
        where: { _id: user._id },
        data: { tenantId: tenant._id }
      });
      console.log('  -> 已修复!');
    }
  }

  // 验证
  const user = await prisma.user.findFirst({
    where: { email: 'admin@example.com' },
    include: { tenant: true }
  });
  console.log('修复后:', user.email, '| 租户:', user?.tenant?.name);
}

main().catch(console.error);
