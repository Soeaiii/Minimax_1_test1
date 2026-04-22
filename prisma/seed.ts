import { PrismaClient, type Program } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function clearData() {
  await prisma.programFile.deleteMany()
  await prisma.competitionFile.deleteMany()
  await prisma.participantProgram.deleteMany()
  await prisma.displaySettings.deleteMany()
  await prisma.judgeAssignment.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.ranking.deleteMany()
  await prisma.score.deleteMany()
  await prisma.scoringCriteria.deleteMany()
  await prisma.program.deleteMany()
  await prisma.participant.deleteMany()
  await prisma.competition.deleteMany()
  await prisma.file.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tenant.deleteMany()
}

async function main() {
  console.log('开始创建示例数据...')
  await clearData()
  console.log('✓ 已清理旧数据')

  const defaultTenant = await prisma.tenant.create({
    data: {
      name: '默认租户',
      domain: 'default.example.com',
      settings: {
        allowRegistration: true,
        maxUsers: 1000,
        features: ['competitions', 'scoring', 'reports', 'display'],
      },
      isActive: true,
    },
  })

  console.log('✓ 已创建默认租户:', defaultTenant.name)

  const hashedPassword = await bcrypt.hash('123456', 12)

  const [admin, organizer, judge1, judge2, judge3] = await Promise.all([
    prisma.user.create({
      data: {
        tenantId: defaultTenant.id,
        name: '系统管理员',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        permissions: [
          'user:create', 'user:read', 'user:update', 'user:delete',
          'competition:create', 'competition:read', 'competition:update', 'competition:delete',
          'program:create', 'program:read', 'program:update', 'program:delete',
          'participant:create', 'participant:read', 'participant:update', 'participant:delete',
          'score:create', 'score:read', 'score:update', 'score:delete',
          'judge:assign', 'judge:remove',
          'system:settings', 'data:export', 'audit:read',
        ],
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        tenantId: defaultTenant.id,
        name: '比赛组织者',
        email: 'organizer@example.com',
        password: hashedPassword,
        role: 'ORGANIZER',
        permissions: [
          'competition:create', 'competition:read', 'competition:update', 'competition:manage',
          'program:create', 'program:read', 'program:update', 'program:delete',
          'participant:create', 'participant:read', 'participant:update', 'participant:delete',
          'judge:assign', 'judge:remove',
          'score:read', 'data:export',
        ],
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        tenantId: defaultTenant.id,
        name: '评委张三',
        email: 'judge1@example.com',
        password: hashedPassword,
        role: 'JUDGE',
        permissions: ['score:create', 'score:read', 'score:update'],
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        tenantId: defaultTenant.id,
        name: '评委李四',
        email: 'judge2@example.com',
        password: hashedPassword,
        role: 'JUDGE',
        permissions: ['score:create', 'score:read', 'score:update'],
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        tenantId: defaultTenant.id,
        name: '评委王五',
        email: 'judge3@example.com',
        password: hashedPassword,
        role: 'JUDGE',
        permissions: ['score:create', 'score:read', 'score:update'],
        isActive: true,
      },
    }),
  ])

  console.log('✓ 已创建用户')

  const participants = await Promise.all([
    prisma.participant.create({
      data: {
        tenantId: defaultTenant.id,
        name: '张小明',
        bio: '专业舞蹈演员，擅长现代舞和民族舞',
        team: '星光舞团',
        contact: '13800138001',
      },
    }),
    prisma.participant.create({
      data: {
        tenantId: defaultTenant.id,
        name: '李美丽',
        bio: '声乐专业毕业，美声唱法',
        team: '天籁合唱团',
        contact: '13800138002',
      },
    }),
    prisma.participant.create({
      data: {
        tenantId: defaultTenant.id,
        name: '王强',
        bio: '器乐演奏家，专长钢琴演奏',
        team: '音乐学院',
        contact: '13800138003',
      },
    }),
    prisma.participant.create({
      data: {
        tenantId: defaultTenant.id,
        name: '赵艺术',
        bio: '戏剧表演专业，话剧演员',
        team: '话剧社',
        contact: '13800138004',
      },
    }),
    prisma.participant.create({
      data: {
        tenantId: defaultTenant.id,
        name: '孙创意',
        bio: '创意表演，多媒体艺术',
        team: '创新工作室',
        contact: '13800138005',
      },
    }),
  ])

  console.log('✓ 已创建参与者')

  const competition = await prisma.competition.create({
    data: {
      tenantId: defaultTenant.id,
      name: '2024年度艺术节才艺大赛',
      description: '展示各种艺术才能的综合性比赛，包括舞蹈、声乐、器乐、戏剧等多个类别',
      organizerId: organizer.id,
      creatorId: organizer.id,
      startTime: new Date('2024-03-01T09:00:00Z'),
      endTime: new Date('2024-03-01T18:00:00Z'),
      status: 'ACTIVE',
      rankingUpdateMode: 'REALTIME',
    },
  })

  console.log('✓ 已创建比赛')

  const scoringCriteria = await Promise.all([
    prisma.scoringCriteria.create({
      data: {
        tenantId: defaultTenant.id,
        competitionId: competition.id,
        name: '技术难度',
        weight: 0.3,
        maxScore: 10,
      },
    }),
    prisma.scoringCriteria.create({
      data: {
        tenantId: defaultTenant.id,
        competitionId: competition.id,
        name: '艺术表现',
        weight: 0.35,
        maxScore: 10,
      },
    }),
    prisma.scoringCriteria.create({
      data: {
        tenantId: defaultTenant.id,
        competitionId: competition.id,
        name: '创新性',
        weight: 0.2,
        maxScore: 10,
      },
    }),
    prisma.scoringCriteria.create({
      data: {
        tenantId: defaultTenant.id,
        competitionId: competition.id,
        name: '完整性',
        weight: 0.15,
        maxScore: 10,
      },
    }),
  ])

  console.log('✓ 已创建评分标准')

  const programSeeds = [
    {
      name: '《春江花月夜》现代舞',
      description: '以古典诗词为背景的现代舞表演',
      order: 1,
      currentStatus: 'COMPLETED' as const,
      participant: participants[0],
    },
    {
      name: '《我爱你中国》独唱',
      description: '爱国主题歌曲独唱表演',
      order: 2,
      currentStatus: 'COMPLETED' as const,
      participant: participants[1],
    },
    {
      name: '《月光奏鸣曲》钢琴独奏',
      description: '贝多芬经典钢琴作品演奏',
      order: 3,
      currentStatus: 'COMPLETED' as const,
      participant: participants[2],
    },
    {
      name: '《雷雨》片段表演',
      description: '曹禺经典话剧片段',
      order: 4,
      currentStatus: 'PERFORMING' as const,
      participant: participants[3],
    },
    {
      name: '《未来之光》多媒体表演',
      description: '结合科技元素的创新表演',
      order: 5,
      currentStatus: 'WAITING' as const,
      participant: participants[4],
    },
  ]

  const programs: Program[] = []
  for (const item of programSeeds) {
    const program = await prisma.program.create({
      data: {
        tenantId: defaultTenant.id,
        competitionId: competition.id,
        name: item.name,
        description: item.description,
        order: item.order,
        currentStatus: item.currentStatus,
      },
    })

    await prisma.participantProgram.create({
      data: {
        participantId: item.participant.id,
        programId: program.id,
      },
    })

    programs.push(program)
  }

  console.log('✓ 已创建节目和选手关联')

  const judges = [judge1, judge2, judge3]

  await Promise.all(
    judges.map((judge) =>
      prisma.judgeAssignment.create({
        data: {
          tenantId: defaultTenant.id,
          judgeId: judge.id,
          competitionId: competition.id,
          authorizedPrograms: programs.map((program) => program.id),
          isActive: true,
        },
      })
    )
  )

  console.log('✓ 已创建评委分配')

  for (let i = 0; i < 3; i++) {
    const program = programs[i]

    for (const judge of judges) {
      for (const criteria of scoringCriteria) {
        const score = 8 + i * 0.3 + Math.random() * 1.2

        await prisma.score.create({
          data: {
            tenantId: defaultTenant.id,
            value: Number(score.toFixed(1)),
            comment: `评委对${program.name}在${criteria.name}方面的评价`,
            programId: program.id,
            scoringCriteriaId: criteria.id,
            judgeId: judge.id,
          },
        })
      }
    }
  }

  console.log('✓ 已创建评分')

  for (let i = 0; i < 3; i++) {
    const program = programs[i]
    const scores = await prisma.score.findMany({
      where: { programId: program.id },
      include: { scoringCriteria: true },
    })

    const grouped = new Map<string, number[]>()
    for (const score of scores) {
      const list = grouped.get(score.scoringCriteriaId) ?? []
      list.push(score.value)
      grouped.set(score.scoringCriteriaId, list)
    }

    let totalScore = 0
    for (const criteria of scoringCriteria) {
      const values = grouped.get(criteria.id) ?? []
      if (values.length === 0) continue
      const average = values.reduce((sum, value) => sum + value, 0) / values.length
      totalScore += average * criteria.weight
    }

    await prisma.ranking.create({
      data: {
        tenantId: defaultTenant.id,
        rank: i + 1,
        totalScore: Number(totalScore.toFixed(2)),
        updateType: 'AUTO',
        competitionId: competition.id,
        programId: program.id,
      },
    })
  }

  console.log('✓ 已创建排名')

  const [backgroundFile, programVideo, programAudio] = await Promise.all([
    prisma.file.create({
      data: {
        tenantId: defaultTenant.id,
        filename: 'competition-background.jpg',
        path: '/uploads/backgrounds/competition-background.jpg',
        mimetype: 'image/jpeg',
        size: 1_024_000,
      },
    }),
    prisma.file.create({
      data: {
        tenantId: defaultTenant.id,
        filename: 'program1-video.mp4',
        path: '/uploads/programs/program1-video.mp4',
        mimetype: 'video/mp4',
        size: 50_000_000,
      },
    }),
    prisma.file.create({
      data: {
        tenantId: defaultTenant.id,
        filename: 'program2-audio.mp3',
        path: '/uploads/programs/program2-audio.mp3',
        mimetype: 'audio/mpeg',
        size: 8_000_000,
      },
    }),
  ])

  await prisma.competitionFile.create({
    data: {
      competitionId: competition.id,
      fileId: backgroundFile.id,
    },
  })

  await Promise.all([
    prisma.programFile.create({
      data: {
        programId: programs[0].id,
        fileId: programVideo.id,
      },
    }),
    prisma.programFile.create({
      data: {
        programId: programs[1].id,
        fileId: programAudio.id,
      },
    }),
  ])

  await prisma.displaySettings.create({
    data: {
      tenantId: defaultTenant.id,
      competitionId: competition.id,
      currentProgramId: programs[3].id,
      backgroundImageId: backgroundFile.id,
      title: '2024年度艺术节才艺大赛',
      subtitle: '实时评分展示',
      selectedJudgeIds: judges.map((judge) => judge.id),
      selectedParticipantFieldNames: ['team', 'contact'],
      publicToken: 'public-demo-token',
    },
  })

  console.log('✓ 已创建文件和大屏设置')

  await Promise.all([
    prisma.auditLog.create({
      data: {
        tenantId: defaultTenant.id,
        userId: admin.id,
        action: '创建比赛',
        targetId: competition.id,
        details: { competitionName: competition.name },
      },
    }),
    prisma.auditLog.create({
      data: {
        tenantId: defaultTenant.id,
        userId: organizer.id,
        action: '创建节目',
        targetId: programs[0].id,
        details: { programName: programs[0].name },
      },
    }),
    prisma.auditLog.create({
      data: {
        tenantId: defaultTenant.id,
        userId: judge1.id,
        action: '提交评分',
        targetId: programs[0].id,
        details: { programName: programs[0].name },
      },
    }),
  ])

  console.log('✓ 已创建审计日志')
  console.log('示例数据创建完成！')
  console.log(`
创建的数据包括：
- 5 个用户（1个管理员，1个组织者，3个评委）
- 5 个参与者
- 1 个比赛
- 4 个评分标准
- 5 个节目（3个已完成，1个进行中，1个等待中）
- 36 个评分记录（3个节目 × 3个评委 × 4个标准）
- 3 个排名记录
- 3 个审计日志
- 3 个文件记录
- 1 个大屏配置

登录信息：
- 管理员: admin@example.com / 123456
- 组织者: organizer@example.com / 123456
- 评委: judge1@example.com / 123456
  `)
}

main()
  .catch((error) => {
    console.error('创建示例数据时出错:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
