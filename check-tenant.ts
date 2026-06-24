import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  // 检查所有 user 的 tenantId 是否都有对应的 Tenant
  const users = await prisma.user.findMany({ select: { id: true, name: true, tenantId: true } });
  const tenantIds = await prisma.tenant.findMany({ select: { id: true } });
  const validTenantIds = new Set(tenantIds.map((t: { id: string }) => t.id));
  
  for (const u of users) {
    if (!validTenantIds.has(u.tenantId)) {
      console.log(`User ${u.name} (${u.id}) has invalid tenantId: ${u.tenantId}`);
    }
  }
  
  // 检查 User.tenant relation 是否正确
  const user = await prisma.user.findFirst({ include: { tenant: true } });
  console.log('Sample user:', user?.id, user?.name, 'tenantId:', user?.tenantId, 'tenant:', user?.tenant?.name);
  
  await prisma.$disconnect();
}

check().catch(console.error);