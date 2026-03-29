const { PrismaClient } = require('@prisma/client');
const { MongoClient } = require('mongodb');

const prisma = new PrismaClient();

async function checkNullTenantIds() {
  console.log('检查数据库中tenantId为null的记录...');
  
  let mongoClient;
  try {
    // 直接连接MongoDB来检查null值
    const mongoUrl = process.env.DATABASE_URL;
    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    
    const db = mongoClient.db();
    
    // 检查Competition表
    const competitionsWithNullTenant = await db.collection('Competition').countDocuments({
      tenantId: null
    });
    console.log('Competition表中tenantId为null的记录数:', competitionsWithNullTenant);
    
    // 检查User表
    const usersWithNullTenant = await db.collection('User').countDocuments({
      tenantId: null
    });
    console.log('User表中tenantId为null的记录数:', usersWithNullTenant);
    
    // 检查AuditLog表
    const auditLogsWithNullTenant = await db.collection('AuditLog').countDocuments({
      tenantId: null
    });
    console.log('AuditLog表中tenantId为null的记录数:', auditLogsWithNullTenant);
    
    // 检查JudgeAssignment表
    const judgeAssignmentsWithNullTenant = await db.collection('JudgeAssignment').countDocuments({
      tenantId: null
    });
    console.log('JudgeAssignment表中tenantId为null的记录数:', judgeAssignmentsWithNullTenant);
    
    // 获取具体的Competition记录详情
    const nullCompetitions = await db.collection('Competition').find({
      tenantId: null
    }).limit(10).toArray();
    console.log('\n前10个tenantId为null的Competition记录:');
    nullCompetitions.forEach(comp => {
      console.log(`- ID: ${comp._id}, Name: ${comp.name}, OrganizerID: ${comp.organizerId}, Created: ${comp.createdAt}`);
    });
    
    // 获取具体的User记录详情
    const nullUsers = await db.collection('User').find({
      tenantId: null
    }).limit(10).toArray();
    console.log('\n前10个tenantId为null的User记录:');
    nullUsers.forEach(user => {
      console.log(`- ID: ${user._id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Created: ${user.createdAt}`);
    });
    
    // 检查是否有Tenant记录
    const tenantCount = await db.collection('Tenant').countDocuments();
    console.log('\nTenant表中的记录数:', tenantCount);
    
    if (tenantCount > 0) {
      const tenants = await db.collection('Tenant').find({}).limit(5).toArray();
      console.log('\n现有的Tenant记录:');
      tenants.forEach(tenant => {
        console.log(`- ID: ${tenant._id}, Name: ${tenant.name}, Domain: ${tenant.domain}, Active: ${tenant.isActive}`);
      });
    }
    
  } catch (error) {
    console.error('检查过程中出错:', error);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
    await prisma.$disconnect();
  }
}

checkNullTenantIds();