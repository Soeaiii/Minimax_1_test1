import { prisma } from '@/lib/prisma';

// 审计日志最大保留数量
const MAX_AUDIT_LOGS = 200;

/**
 * 清理过多的审计日志
 * 保留最新的200条记录，删除更早的记录
 */
export async function cleanupAuditLogs(): Promise<void> {
  try {
    // 获取当前审计日志总数
    const totalCount = await prisma.auditLog.count();
    
    if (totalCount <= MAX_AUDIT_LOGS) {
      // 如果记录数量未超过限制，无需清理
      return;
    }
    
    // 计算需要删除的记录数量
    const deleteCount = totalCount - MAX_AUDIT_LOGS;
    
    // 获取最旧的记录ID列表
    const oldestLogs = await prisma.auditLog.findMany({
      select: { id: true },
      orderBy: { timestamp: 'asc' },
      take: deleteCount,
    });
    
    if (oldestLogs.length > 0) {
      const idsToDelete = oldestLogs.map(log => log.id);
      
      // 批量删除最旧的记录
      const deletedCount = await prisma.auditLog.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });
    }
  } catch (error) {
    // 静默处理清理错误，避免影响主要业务逻辑
  }
}

/**
 * 创建审计日志并自动清理
 */
export async function createAuditLogWithCleanup(data: {
  tenantId: string;
  userId: string;
  action: string;
  targetId?: string;
  details?: any;
}): Promise<void> {
  try {
    // 创建新的审计日志
    await prisma.auditLog.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId,
        action: data.action,
        targetId: data.targetId,
        details: data.details,
        timestamp: new Date(),
      },
    });
    
    // 异步清理旧记录（不等待完成，避免影响响应时间）
    setImmediate(() => {
      cleanupAuditLogs().catch(() => {
        // 静默处理清理错误
      });
    });
  } catch (error) {
    throw error;
  }
}