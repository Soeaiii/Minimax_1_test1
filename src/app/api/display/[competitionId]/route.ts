import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 获取大屏幕显示设置
export async function GET(
  request: Request,
  context: { params: Promise<{ competitionId: string }> }
) {
  try {
    const params = await context.params;
    
    const displaySettings = await prisma.displaySettings.findUnique({
      where: {
        competitionId: params.competitionId,
      },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
          },
        },
        backgroundImage: {
          select: {
            id: true,
            filename: true,
            path: true,
          },
        },
      },
    });

    if (!displaySettings) {
      // 如果没有设置，创建默认设置
      const newSettings = await prisma.displaySettings.create({
        data: {
          competitionId: params.competitionId,
          showJudgeScores: true,
          showParticipants: true,
          showProgramInfo: true,
          autoRefresh: true,
          refreshInterval: 5,
          theme: 'MODERN',
          titleColor: '#ffffff',
          subtitleColor: '#ffffff',
          judgeNameColor: '#1f2937',
          judgeScoreColor: '#1f2937',
          averageScoreColor: '#ffffff',
          programInfoColor: '#ffffff',
          // 评委卡片大小默认值
          judgeCardWidth: 288,
          judgeCardPadding: 32,
          judgeCardGap: 40,
          judgeAvatarSize: 176,
          judgeNameFontSize: 20,
          judgeScoreFontSize: 36,
          participantLabelFontSize: 56,
          participantValueFontSize: 56,
          participantCardPadding: 48,
          participantCardGap: 16,
          participantCardRowGap: 32,
          averageScoreFontSize: 192,
          selectedParticipantFieldNames: [],
        },
        include: {
          competition: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true,
            },
          },
          backgroundImage: {
            select: {
              id: true,
              filename: true,
              path: true,
            },
          },
        },
      });
      
      return NextResponse.json(newSettings);
    }

    return NextResponse.json(displaySettings);
  } catch (error) {
    console.error('Error fetching display settings:', error);
    return NextResponse.json(
      { error: '获取大屏幕设置失败' },
      { status: 500 }
    );
  }
}

// 更新大屏幕显示设置
export async function PUT(
  request: Request,
  context: { params: Promise<{ competitionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER')) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const body = await request.json();

    // 处理currentProgramId，如果是'none'则设为null
    const currentProgramId = body.currentProgramId === 'none' || body.currentProgramId === '' ? null : body.currentProgramId;
    // 处理backgroundImageId，如果是空字符串则设为null
    const backgroundImageId = body.backgroundImageId === '' ? null : body.backgroundImageId;

    const updatedSettings = await prisma.displaySettings.upsert({
      where: {
        competitionId: params.competitionId,
      },
      update: {
        currentProgramId: currentProgramId,
        backgroundImageId: backgroundImageId,
        showJudgeScores: body.showJudgeScores,
        showParticipants: body.showParticipants,
        showProgramInfo: body.showProgramInfo,
        title: body.title,
        subtitle: body.subtitle,
        autoRefresh: body.autoRefresh,
        refreshInterval: body.refreshInterval,
        theme: body.theme,
        titleColor: body.titleColor,
        subtitleColor: body.subtitleColor,
        judgeNameColor: body.judgeNameColor,
        judgeScoreColor: body.judgeScoreColor,
        averageScoreColor: body.averageScoreColor,
        programInfoColor: body.programInfoColor,
        // 评委卡片大小设置
        judgeCardWidth: body.judgeCardWidth,
        judgeCardPadding: body.judgeCardPadding,
        judgeCardGap: body.judgeCardGap,
        judgeAvatarSize: body.judgeAvatarSize,
        judgeNameFontSize: body.judgeNameFontSize,
        judgeScoreFontSize: body.judgeScoreFontSize,
        participantLabelFontSize: body.participantLabelFontSize,
        participantValueFontSize: body.participantValueFontSize,
        // 遮罩控制设置
        showBackgroundOverlay: body.showBackgroundOverlay,
        overlayColor: body.overlayColor,
        overlayOpacity: body.overlayOpacity,
        // 评委选择
        selectedJudgeIds: body.selectedJudgeIds,
        selectedParticipantFieldNames: body.selectedParticipantFieldNames,
        participantCardPadding: body.participantCardPadding,
        participantCardGap: body.participantCardGap,
        participantCardRowGap: body.participantCardRowGap,
        averageScoreFontSize: body.averageScoreFontSize,
      },
      create: {
        competitionId: params.competitionId,
        currentProgramId: currentProgramId,
        backgroundImageId: backgroundImageId,
        showJudgeScores: body.showJudgeScores ?? true,
        showParticipants: body.showParticipants ?? true,
        showProgramInfo: body.showProgramInfo ?? true,
        title: body.title,
        subtitle: body.subtitle,
        autoRefresh: body.autoRefresh ?? true,
        refreshInterval: body.refreshInterval ?? 5,
        theme: body.theme ?? 'MODERN',
        titleColor: body.titleColor ?? '#ffffff',
        subtitleColor: body.subtitleColor ?? '#ffffff',
        judgeNameColor: body.judgeNameColor ?? '#1f2937',
        judgeScoreColor: body.judgeScoreColor ?? '#1f2937',
        averageScoreColor: body.averageScoreColor ?? '#ffffff',
        programInfoColor: body.programInfoColor ?? '#ffffff',
        // 评委卡片大小设置
        judgeCardWidth: body.judgeCardWidth ?? 288,
        judgeCardPadding: body.judgeCardPadding ?? 32,
        judgeCardGap: body.judgeCardGap ?? 40,
        judgeAvatarSize: body.judgeAvatarSize ?? 176,
        judgeNameFontSize: body.judgeNameFontSize ?? 20,
        judgeScoreFontSize: body.judgeScoreFontSize ?? 36,
        participantLabelFontSize: body.participantLabelFontSize ?? 56,
        participantValueFontSize: body.participantValueFontSize ?? 56,
        // 遮罩控制设置
        showBackgroundOverlay: body.showBackgroundOverlay ?? false,
        overlayColor: body.overlayColor ?? '#000000',
        overlayOpacity: body.overlayOpacity ?? 0.5,
        // 评委选择
        selectedJudgeIds: body.selectedJudgeIds ?? [],
        selectedParticipantFieldNames: body.selectedParticipantFieldNames ?? [],
        participantCardPadding: body.participantCardPadding ?? 48,
        participantCardGap: body.participantCardGap ?? 16,
        participantCardRowGap: body.participantCardRowGap ?? 32,
        averageScoreFontSize: body.averageScoreFontSize ?? 192,
      },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
          },
        },
        backgroundImage: {
          select: {
            id: true,
            filename: true,
            path: true,
          },
        },
      },
    });

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_DISPLAY_SETTINGS',
        targetId: params.competitionId,
        details: {
          competitionId: params.competitionId,
          changes: body,
        },
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating display settings:', error);
    return NextResponse.json(
      { error: '更新大屏幕设置失败' },
      { status: 500 }
    );
  }
} 