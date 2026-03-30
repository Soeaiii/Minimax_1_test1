import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // 配置全局事务选项
    transactionOptions: {
      maxWait: 10000, // 最大等待时间 10秒
      timeout: 30000, // 事务超时时间 30秒
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 使用示例：安全查询用户（排除敏感字段）
// try {
//   const user = await prisma.user.findUnique({
//     where: { email },
//     select: { id: true, name: true, email: true, role: true }
//   });
// } catch (error) {
//   if (error instanceof Prisma.PrismaClientKnownRequestError) {
//     // 处理已知错误
//   }
// }

// 批量删除示例：
// await prisma.user.deleteMany({
//   where: { id: { in: userIds } }
// });

// 事务示例：
// await prisma.$transaction([
//   prisma.competition.update({ ... }),
//   prisma.program.create({ ... }),
// ]); 