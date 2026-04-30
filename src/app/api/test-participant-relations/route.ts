import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 测试选手和节目的关联关系
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    // 获取所有节目和参与者数据
    const programs = await prisma.program.findMany({
      include: {
        participantPrograms: {
          include: {
            participant: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        competition: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    const participants = await prisma.participant.findMany({
      include: {
        participantPrograms: {
          include: {
            program: {
              select: {
                id: true,
                name: true,
                competition: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    // 检查关联一致性
    const issues = [];
    
    for (const program of programs) {
      const actualParticipantIds = program.participantPrograms.map(pp => pp.participant.id);
      
      issues.push({
        type: 'program',
        id: program.id,
        name: program.name,
        competition: program.competition?.name || 'N/A',
        participantCount: actualParticipantIds.length,
        participantIds: actualParticipantIds
      });
    }

    for (const participant of participants) {
      const actualProgramIds = participant.participantPrograms.map(pp => pp.program.id);

      issues.push({
        type: 'participant',
        id: participant.id,
        name: participant.name,
        programCount: actualProgramIds.length,
        programIds: actualProgramIds
      });
    }

    return NextResponse.json({
      totalPrograms: programs.length,
      totalParticipants: participants.length,
      associations: issues,
      summary: {
        programsWithParticipants: issues.filter(i => i.type === 'program' && i.participantCount > 0).length,
        participantsWithPrograms: issues.filter(i => i.type === 'participant' && i.programCount > 0).length,
      }
    });
  } catch (error) {
    console.error('Error testing participant relations:', error);
    return NextResponse.json(
      { error: '测试关联关系失败' },
      { status: 500 }
    );
  }
} 