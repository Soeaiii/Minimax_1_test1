const { PrismaClient } = require('@prisma/client');
const { MongoClient } = require('mongodb');

const prisma = new PrismaClient();

async function fixNullTenantIds() {
  console.log('开始修复数据库中tenantId为null的记录...');
  
  let mongoClient;
  try {
    // 直接连接MongoDB
    const mongoUrl = process.env.DATABASE_URL;
    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    
    const db = mongoClient.db();
    
    // 1. 首先创建默认的Tenant记录
    console.log('\n1. 创建默认Tenant记录...');
    const defaultTenant = {
      _id: new mongoClient.topology.s.id.constructor(),
      name: '默认租户',
      domain: 'default.local',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // 检查是否已存在默认租户
    const existingTenant = await db.collection('Tenant').findOne({ domain: 'default.local' });
    let tenantId;
    
    if (existingTenant) {
      console.log('默认租户已存在:', existingTenant._id.toString());
      tenantId = existingTenant._id.toString();
    } else {
      const result = await db.collection('Tenant').insertOne(defaultTenant);
      tenantId = result.insertedId.toString();
      console.log('默认租户创建成功，ID:', tenantId);
    }
    
    // 2. 修复Competition表中的null值
    console.log('\n2. 修复Competition表中的tenantId和creatorId...');
    
    // 首先获取一个有效的用户ID作为默认creatorId
    const defaultUser = await db.collection('User').findOne({ role: 'ADMIN' });
    const defaultCreatorId = defaultUser ? defaultUser._id.toString() : tenantId;
    
    // 修复tenantId为null的记录
    const competitionTenantUpdateResult = await db.collection('Competition').updateMany(
      { tenantId: null },
      { 
        $set: { 
          tenantId: tenantId,
          updatedAt: new Date()
        } 
      }
    );
    console.log(`Competition表tenantId更新了 ${competitionTenantUpdateResult.modifiedCount} 条记录`);
    
    // 修复creatorId为null的记录
    const competitionCreatorUpdateResult = await db.collection('Competition').updateMany(
      { creatorId: null },
      { 
        $set: { 
          creatorId: defaultCreatorId,
          updatedAt: new Date()
        } 
      }
    );
    console.log(`Competition表creatorId更新了 ${competitionCreatorUpdateResult.modifiedCount} 条记录`);
    
    // 3. 修复User表中的null值
    console.log('\n3. 修复User表中的tenantId...');
    const userUpdateResult = await db.collection('User').updateMany(
      { tenantId: null },
      { 
        $set: { 
          tenantId: tenantId,
          updatedAt: new Date()
        } 
      }
    );
    console.log(`User表更新了 ${userUpdateResult.modifiedCount} 条记录`);
    
    // 4. 修复AuditLog表中的null值
    console.log('\n4. 修复AuditLog表中的tenantId...');
    const auditLogUpdateResult = await db.collection('AuditLog').updateMany(
      { tenantId: null },
      { 
        $set: { 
          tenantId: tenantId,
          updatedAt: new Date()
        } 
      }
    );
    console.log(`AuditLog表更新了 ${auditLogUpdateResult.modifiedCount} 条记录`);
    
    // 5. 验证修复结果
    console.log('\n5. 验证修复结果...');
    const remainingNullTenantCompetitions = await db.collection('Competition').countDocuments({ tenantId: null });
    const remainingNullCreatorCompetitions = await db.collection('Competition').countDocuments({ creatorId: null });
    const remainingNullUsers = await db.collection('User').countDocuments({ tenantId: null });
    const remainingNullAuditLogs = await db.collection('AuditLog').countDocuments({ tenantId: null });
    
    console.log('修复后剩余的null记录:');
    console.log(`- Competition tenantId: ${remainingNullTenantCompetitions}`);
    console.log(`- Competition creatorId: ${remainingNullCreatorCompetitions}`);
    console.log(`- User tenantId: ${remainingNullUsers}`);
    console.log(`- AuditLog tenantId: ${remainingNullAuditLogs}`);
    
    if (remainingNullTenantCompetitions === 0 && remainingNullCreatorCompetitions === 0 && remainingNullUsers === 0 && remainingNullAuditLogs === 0) {
      console.log('\n✅ 所有null字段已成功修复！');
    } else {
      console.log('\n⚠️ 仍有部分记录未修复，请检查。');
    }
    
  } catch (error) {
    console.error('修复过程中出错:', error);
    throw error;
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
    await prisma.$disconnect();
  }
}

// 运行修复脚本
fixNullTenantIds()
  .then(() => {
    console.log('\n修复脚本执行完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('修复脚本执行失败:', error);
    process.exit(1);
  });