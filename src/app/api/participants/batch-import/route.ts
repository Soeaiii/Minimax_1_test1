import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ImportRow {
  name: string;
  bio?: string;
  team?: string;
  contact?: string;
  _rowIndex: number;
}

interface ProcessedRow {
  name: string;
  bio?: string;
  team?: string;
  contact?: string;
  _rowIndex: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { data }: { data: ImportRow[] } = body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: '没有有效数据可导入' },
        { status: 400 }
      );
    }

    const imported: any[] = [];
    const failed: any[] = [];

    // 批量导入选手 - 优化版本
    await prisma.$transaction(async (tx) => {
      // 1. 预处理数据，验证必需字段
      const validRows: ProcessedRow[] = [];
      for (const row of data) {
        if (!row.name || row.name.toString().trim() === '') {
          failed.push({
            row: row._rowIndex,
            data: row,
            error: '选手姓名不能为空'
          });
          continue;
        }
        validRows.push({
          ...row,
          name: row.name.toString().trim(),
          bio: row.bio?.toString().trim() || undefined,
          team: row.team?.toString().trim() || undefined,
          contact: row.contact?.toString().trim() || undefined,
        });
      }

      if (validRows.length === 0) {
        return; // 没有有效数据，直接返回
      }

      // 2. 批量检查重复数据
      const existingParticipants = await tx.participant.findMany({
        where: {
          OR: validRows.map(row => ({
            name: row.name,
            team: row.team || null
          }))
        },
        select: { name: true, team: true }
      });

      const existingSet = new Set(
        existingParticipants.map(p => `${p.name}|${p.team || ''}`)
      );

      // 3. 过滤出可以导入的数据
      const dataToImport: ProcessedRow[] = [];
      for (const row of validRows) {
        const key = `${row.name}|${row.team || ''}`;
        if (existingSet.has(key)) {
          failed.push({
            row: row._rowIndex,
            data: row,
            error: '选手已存在'
          });
          continue;
        }
        dataToImport.push(row);
      }

      if (dataToImport.length === 0) {
        return; // 没有可导入的数据，直接返回
      }

      // 4. 批量创建参与者
      try {
        const createManyResult = await tx.participant.createMany({
          data: dataToImport.map(row => ({
            name: row.name,
            bio: row.bio,
            team: row.team,
            contact: row.contact,
          }))
        });

        // 5. 获取创建的参与者详情（用于返回结果和创建审计日志）
        const createdParticipants = await tx.participant.findMany({
          where: {
            OR: dataToImport.map(row => ({
              name: row.name,
              team: row.team || null
            }))
          },
          orderBy: { createdAt: 'desc' },
          take: dataToImport.length
        });

        imported.push(...createdParticipants);

        // 6. 批量创建审计日志
        if (createdParticipants.length > 0) {
          await tx.auditLog.createMany({
            data: createdParticipants.map((participant, index) => ({
              userId: session.user.id,
              tenantId: session.user.tenantId,
              action: 'BATCH_IMPORT_PARTICIPANT',
              targetId: participant.id,
              details: {
                type: 'Participant',
                name: participant.name,
                importRow: dataToImport[index]?._rowIndex || index + 1,
                batchSize: data.length
              },
            }))
          });
        }

      } catch (error) {
        console.error('批量创建参与者失败:', error);
        // 如果批量创建失败，将所有待导入数据标记为失败
        for (const row of dataToImport) {
          failed.push({
            row: row._rowIndex,
            data: row,
            error: error instanceof Error ? error.message : '批量创建失败'
          });
        }
      }
    }, {
      maxWait: 10000, // 最大等待时间 10秒
      timeout: 20000, // 事务超时时间 20秒
    });

    // 记录批量导入操作
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        tenantId: session.user.tenantId,
        action: 'BATCH_IMPORT_COMPLETE',
        targetId: 'participants',
        details: {
          type: 'Participants',
          totalRows: data.length,
          imported: imported.length,
          failed: failed.length
        },
      },
    });

    return NextResponse.json({
      message: `批量导入完成，成功导入 ${imported.length} 条记录${failed.length > 0 ? `，失败 ${failed.length} 条` : ''}`,
      imported,
      failed,
      summary: {
        total: data.length,
        imported: imported.length,
        failed: failed.length
      }
    });

  } catch (error) {
    console.error('批量导入选手失败:', error);
    return NextResponse.json(
      { error: '批量导入失败' },
      { status: 500 }
    );
  }
}