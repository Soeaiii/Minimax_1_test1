import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 测试选手和节目的关联关系
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    // 获取所有节目和参与者数据
    const programs = await prisma.program.findMany({
      include: {
        participants: {
          select: {
            id: true,
            name: true,
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
        programs: {
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
    });

    // 检查关联一致性
    const issues = [];
    
    for (const program of programs) {
      // 检查节目的participantIds是否与实际关联的participants一致
      const actualParticipantIds = program.participants.map(p => p.id);
      const declaredParticipantIds = program.participantIds || [];
      
      const missingInActual = declaredParticipantIds.filter(id => !actualParticipantIds.includes(id));
      const missingInDeclared = actualParticipantIds.filter(id => !declaredParticipantIds.includes(id));
      
      if (missingInActual.length > 0 || missingInDeclared.length > 0) {
        issues.push({
          type: 'program',
          id: program.id,
          name: program.name,
          competition: program.competition.name,
          missingInActual,
          missingInDeclared,
          declaredParticipantIds,
          actualParticipantIds
        });
      }
    }

    for (const participant of participants) {
      // 检查参与者的programIds是否与实际关联的programs一致
      const actualProgramIds = participant.programs.map(p => p.id);
      const declaredProgramIds = participant.programIds || [];
      
      const missingInActual = declaredProgramIds.filter(id => !actualProgramIds.includes(id));
      const missingInDeclared = actualProgramIds.filter(id => !declaredProgramIds.includes(id));
      
      if (missingInActual.length > 0 || missingInDeclared.length > 0) {
        issues.push({
          type: 'participant',
          id: participant.id,
          name: participant.name,
          missingInActual,
          missingInDeclared,
          declaredProgramIds,
          actualProgramIds
        });
      }
    }

    return NextResponse.json({
      totalPrograms: programs.length,
      totalParticipants: participants.length,
      issues: issues,
      hasIssues: issues.length > 0,
      summary: {
        programsWithIssues: issues.filter(i => i.type === 'program').length,
        participantsWithIssues: issues.filter(i => i.type === 'participant').length,
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