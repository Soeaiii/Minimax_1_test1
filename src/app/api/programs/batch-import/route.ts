import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface ImportRow {
  name: string;
  description?: string;
  order?: number;
  participantNames?: string;
  _rowIndex: number;
}

interface Participant {
  id: string;
  name: string;
  team?: string | null;
}

interface ProcessedRow {
  name: string;
  description?: string;
  order: number;
  participantNames: string[];
  _rowIndex: number;
}

interface ParticipantToCreate {
  name: string;
  bio: string;
  programName: string;
  importRow: number;
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
    const { 
      data, 
      competitionId, 
      participants 
    }: { 
      data: ImportRow[], 
      competitionId: string,
      participants: Participant[]
    } = body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: '没有有效数据可导入' },
        { status: 400 }
      );
    }

    if (!competitionId) {
      return NextResponse.json(
        { error: '请选择比赛' },
        { status: 400 }
      );
    }

    // 验证比赛是否存在
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId }
    });

    if (!competition) {
      return NextResponse.json(
        { error: '比赛不存在' },
        { status: 400 }
      );
    }

    const imported: any[] = [];
    const failed: any[] = [];

    // 获取当前比赛的最大顺序号
    const lastProgram = await prisma.program.findFirst({
      where: { competitionId },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    let nextOrder = (lastProgram?.order || 0) + 1;

    // 批量导入节目 - 优化版本
    await prisma.$transaction(async (tx) => {
      // 1. 预处理数据，验证必需字段并解析选手姓名
      const validRows: ProcessedRow[] = [];
      for (const row of data) {
        if (!row.name || row.name.toString().trim() === '') {
          failed.push({
            row: row._rowIndex,
            data: row,
            error: '节目名称不能为空'
          });
          continue;
        }

        // 处理顺序
        let programOrder = nextOrder;
        if (row.order && !isNaN(Number(row.order))) {
          programOrder = Number(row.order);
        } else {
          nextOrder++;
        }

        // 解析选手姓名
        const participantNames = row.participantNames
          ? row.participantNames
              .toString()
              .split(/[,，、]/) // 支持多种分隔符
              .map(name => name.trim())
              .filter(name => name.length > 0)
          : [];

        validRows.push({
          name: row.name.toString().trim(),
          description: row.description?.toString().trim() || undefined,
          order: programOrder,
          participantNames,
          _rowIndex: row._rowIndex,
        });
      }

      if (validRows.length === 0) {
        return; // 没有有效数据，直接返回
      }

      // 2. 批量检查重复节目
      const existingPrograms = await tx.program.findMany({
        where: {
          competitionId,
          name: {
            in: validRows.map(row => row.name)
          }
        },
        select: { name: true }
      });

      const existingProgramNames = new Set(existingPrograms.map(p => p.name));

      // 3. 过滤出可以导入的节目数据
      const programsToImport: ProcessedRow[] = [];
      for (const row of validRows) {
        if (existingProgramNames.has(row.name)) {
          failed.push({
            row: row._rowIndex,
            data: row,
            error: '节目已存在'
          });
          continue;
        }
        programsToImport.push(row);
      }

      if (programsToImport.length === 0) {
        return; // 没有可导入的节目，直接返回
      }

      // 4. 收集所有需要的选手姓名
      const allParticipantNames = new Set<string>();
      programsToImport.forEach(row => {
        row.participantNames.forEach(name => allParticipantNames.add(name));
      });

      // 5. 批量查找现有选手（包括传入的和数据库中的）
      const participantMap = new Map<string, Participant>();
      
      // 添加传入的选手
      participants.forEach(p => {
        participantMap.set(p.name, p);
      });

      // 批量查询数据库中的选手
      if (allParticipantNames.size > 0) {
        const dbParticipants = await tx.participant.findMany({
          where: {
            name: {
              in: Array.from(allParticipantNames)
            }
          },
          select: { id: true, name: true, team: true }
        });

        dbParticipants.forEach(p => {
          if (!participantMap.has(p.name)) {
            participantMap.set(p.name, p);
          }
        });
      }

      // 6. 收集需要创建的新选手
      const participantsToCreate: ParticipantToCreate[] = [];
      const newParticipantNames = new Set<string>();

      programsToImport.forEach(row => {
        row.participantNames.forEach(participantName => {
          if (!participantMap.has(participantName) && !newParticipantNames.has(participantName)) {
            participantsToCreate.push({
              name: participantName,
              bio: `通过节目导入自动创建 - ${row.name}`,
              programName: row.name,
              importRow: row._rowIndex
            });
            newParticipantNames.add(participantName);
          }
        });
      });

      // 7. 批量创建新选手
      if (participantsToCreate.length > 0) {
        await tx.participant.createMany({
          data: participantsToCreate.map(p => ({
            name: p.name,
            bio: p.bio,
          }))
        });

        // 获取新创建的选手
        const newParticipants = await tx.participant.findMany({
          where: {
            name: {
              in: participantsToCreate.map(p => p.name)
            }
          },
          select: { id: true, name: true, team: true }
        });

        // 添加到选手映射中
        newParticipants.forEach(p => {
          participantMap.set(p.name, p);
        });

        // 批量创建新选手的审计日志
        await tx.auditLog.createMany({
          data: newParticipants.map((participant, index) => ({
            // @ts-ignore
            userId: session.user.id,
            action: 'AUTO_CREATE_PARTICIPANT',
            targetId: participant.id,
            details: {
              type: 'Participant',
              name: participant.name,
              createdBy: 'program_import',
              programName: participantsToCreate[index]?.programName || '',
              importRow: participantsToCreate[index]?.importRow || 0
            },
          }))
        });
      }

      // 8. 准备节目数据并批量创建
      const programsData = programsToImport.map(row => {
        const participantIds = row.participantNames
          .map(name => participantMap.get(name)?.id)
          .filter(Boolean) as string[];

        return {
          name: row.name,
          description: row.description,
          order: row.order,
          currentStatus: 'WAITING' as const,
          competitionId,
          participantIds,
        };
      });

      // 批量创建节目
      await tx.program.createMany({
        data: programsData
      });

      // 9. 获取创建的节目详情
      const createdPrograms = await tx.program.findMany({
        where: {
          competitionId,
          name: {
            in: programsToImport.map(row => row.name)
          }
        },
        include: {
          participants: true,
          competition: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: programsToImport.length
      });

      imported.push(...createdPrograms);

      // 10. 批量更新选手的节目关联（避免重复ID）
      const participantUpdates = new Map<string, Set<string>>();
      
      // 收集需要更新的选手和节目关联
      createdPrograms.forEach(program => {
        program.participantIds.forEach(participantId => {
          if (!participantUpdates.has(participantId)) {
            participantUpdates.set(participantId, new Set());
          }
          participantUpdates.get(participantId)!.add(program.id);
        });
      });

      // 批量获取当前选手的节目关联
      const participantsToUpdate = Array.from(participantUpdates.keys());
      const currentParticipants = await tx.participant.findMany({
        where: {
          id: { in: participantsToUpdate }
        },
        select: { id: true, programIds: true }
      });

      // 分批更新选手关联（避免重复ID）
      const BATCH_SIZE = 50;
      for (let i = 0; i < participantsToUpdate.length; i += BATCH_SIZE) {
        const batch = participantsToUpdate.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (participantId) => {
            const currentParticipant = currentParticipants.find(p => p.id === participantId);
            const currentProgramIds = new Set(currentParticipant?.programIds || []);
            const newProgramIds = participantUpdates.get(participantId) || new Set();
            
            // 合并现有和新的节目ID，避免重复
            const allProgramIds = Array.from(new Set([...currentProgramIds, ...newProgramIds]));
            
            return tx.participant.update({
              where: { id: participantId },
              data: {
                programIds: allProgramIds
              }
            });
          })
        );
      }

      // 11. 批量创建节目审计日志
      await tx.auditLog.createMany({
        data: createdPrograms.map((program, index) => ({
          // @ts-ignore
          userId: session.user.id,
          action: 'BATCH_IMPORT_PROGRAM',
          targetId: program.id,
          details: {
            type: 'Program',
            name: program.name,
            competitionId,
            participantCount: program.participantIds.length,
            importRow: programsToImport[index]?._rowIndex || index + 1,
            batchSize: data.length
          },
        }))
      });

    }, {
      maxWait: 15000, // 最大等待时间 15秒
      timeout: 60000, // 事务超时时间 60秒（节目导入更复杂，需要更长时间）
    });

    // 记录批量导入操作
    await prisma.auditLog.create({
      data: {
        // @ts-ignore
        userId: session.user.id,
        action: 'BATCH_IMPORT_COMPLETE',
        targetId: 'programs',
        details: {
          type: 'Programs',
          competitionId,
          competitionName: competition.name,
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
        failed: failed.length,
        competition: competition.name
      }
    });

  } catch (error) {
    console.error('批量导入节目失败:', error);
    return NextResponse.json(
      { error: '批量导入失败' },
      { status: 500 }
    );
  }
} 