const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('开始清理和重建数据...');

  try {
    await prisma.$connect();
    console.log('✓ 数据库连接成功');

    // 删除现有数据（按依赖顺序）
    console.log('清理现有数据...');
    await prisma.auditLog.deleteMany({});
    await prisma.score.deleteMany({});
    await prisma.ranking.deleteMany({});
    await prisma.judgeAssignment.deleteMany({});
    await prisma.displaySettings.deleteMany({});
    await prisma.program.deleteMany({});
    await prisma.competition.deleteMany({});
    await prisma.participant.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.tenant.deleteMany({});
    await prisma.file.deleteMany({});
    console.log('✓ 清理完成');

    // 创建默认租户
    console.log('创建租户...');
    const tenant = await prisma.tenant.create({
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
    });
    console.log('✓ 租户 ID:', tenant.id);

    // 创建管理员
    console.log('创建管理员...');
    const hashedPassword = await bcrypt.hash('123456', 12);
    const admin = await prisma.user.create({
      data: {
        name: '系统管理员',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: tenant.id,
        permissions: ['all'],
        isActive: true,
      },
    });
    console.log('✓ 管理员 ID:', admin.id);
    console.log('✓ 管理员邮箱:', admin.email);

    // 验证
    const verifyUser = await prisma.user.findFirst({
      where: { email: 'admin@example.com' },
      include: { tenant: true }
    });
    console.log('\n验证结果:');
    console.log('- 用户 ID:', verifyUser?.id);
    console.log('- 租户名称:', verifyUser?.tenant?.name);
    console.log('- 租户 ID:', verifyUser?.tenant?.id);

    console.log('\n登录信息:');
    console.log('- 邮箱: admin@example.com');
    console.log('- 密码: 123456');

  } catch (error) {
    console.error('错误:', error.message);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
