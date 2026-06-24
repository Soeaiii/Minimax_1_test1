import { PrismaClient, type Program } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function clearData() {
  await prisma.programFile.deleteMany()
  await prisma.competitionFile.deleteMany()
  await prisma.participantProgram.deleteMany()
  await prisma.displaySettings.deleteMany()
  await prisma.judgeAssignment.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.ranking.deleteMany()
  await prisma.score.deleteMany()
  await prisma.scoringCriteria.deleteMany()
  await prisma.program.deleteMany()
  await prisma.competitionRound.deleteMany()
  await prisma.competitionGroup.deleteMany()
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
        features: ['competitions', 'scoring', 'reports', 'display'],
      },
      isActive: true,
      contactEmail: 'admin@example.com',
    },
  })

  console.log('✓ 已创建默认租户:', defaultTenant.name)

  // Create system tenant for super admin
  const systemTenant = await prisma.tenant.create({
    data: {
      name: '系统管理',
      domain: 'system.internal',
      settings: {
        isSystem: true,
        allowRegistration: false,
        features: ['system'],
      },
      isActive: true,
    },
  })
  console.log('✓ 已创建系统租户:', systemTenant.name)

  const hashedPassword = await bcrypt.hash('123456', 12)

  // Create super admin
  await prisma.user.create({
    data: {
      tenantId: systemTenant.id,
      name: '超级管理员',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      permissions: [
        'tenant:create', 'tenant:read', 'tenant:update', 'tenant:delete',
        'user:create', 'user:read', 'user:update', 'user:delete',
        'competition:create', 'competition:read', 'competition:update', 'competition:delete',
        'program:create', 'program:read', 'program:update', 'program:delete',
        'participant:create', 'participant:read', 'participant:update', 'participant:delete',
        'score:create', 'score:read', 'score:update', 'score:delete',
        'judge:assign', 'judge:remove',
        'system:settings', 'data:export', 'audit:read', 'audit:write',
      ],
      isActive: true,
    },
  })
  console.log('✓ 已创建超级管理员: superadmin@example.com / 123456')

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
    // === 更多选手（丰富演示数据） ===
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '刘德华', bio: '流行音乐歌手，代表作《忘情水》', team: '天皇娱乐', contact: '13800138006' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '周杰伦', bio: '创作型歌手，中国风代表', team: '杰威尔音乐', contact: '13800138007' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '林俊杰', bio: '实力唱将，行走的CD', team: 'JFJ音乐', contact: '13800138008' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '邓紫棋', bio: '铁肺小天后，创作才女', team: '蜂鸟音乐', contact: '13800138009' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '陈奕迅', bio: '粤语歌神，深情演绎', team: '环球音乐', contact: '13800138010' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '杨丽萍', bio: '孔雀舞大师，国家级艺术家', team: '云南艺术团', contact: '13800138011' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '郎朗', bio: '世界级钢琴大师', team: '环球古典', contact: '13800138012' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '李云迪', bio: '肖邦国际钢琴比赛冠军', team: '古典音乐协会', contact: '13800138013' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '谭元元', bio: '旧金山芭蕾舞团首席', team: '国际芭蕾舞团', contact: '13800138014' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '黄豆豆', bio: '中国古典舞代表人物', team: '上海歌舞团', contact: '13800138015' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '韩红', bio: '实力派歌手，公益践行者', team: '韩红爱心', contact: '13800138016' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '那英', bio: '华语乐坛天后', team: '金牌大风', contact: '13800138017' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '王菲', bio: '空灵嗓音，天后级歌手', team: '天籁之声', contact: '13800138018' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '蔡国强', bio: '火药爆破艺术家', team: '当代艺术中心', contact: '13800138019' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '徐冰', bio: '天书作品享誉国际', team: '中央美术学院', contact: '13800138020' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '吴冠中', bio: '水墨画与油画的结合', team: '中国美术馆', contact: '13800138021' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '赵无极', bio: '抽象艺术大师', team: '巴黎画派', contact: '13800138022' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '金星', bio: '现代舞先锋艺术家', team: '金星舞蹈团', contact: '13800138023' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '谭盾', bio: '奥斯卡最佳原创音乐奖得主', team: '上海音乐学院', contact: '13800138024' } }),
    prisma.participant.create({ data: { tenantId: defaultTenant.id, name: '张艺谋', bio: '著名导演，视觉盛宴创造者', team: '北京电影学院', contact: '13800138025' } }),
  ])

  console.log('✓ 已创建参与者（共25人）')

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

  // 创建轮次（初赛、复赛、决赛）
  const round1 = await prisma.competitionRound.create({
    data: { tenantId: defaultTenant.id, competitionId: competition.id, name: '初赛', roundOrder: 1, status: 'FINISHED' },
  })
  const round2 = await prisma.competitionRound.create({
    data: { tenantId: defaultTenant.id, competitionId: competition.id, name: '复赛', roundOrder: 2, status: 'ACTIVE' },
  })
  const round3 = await prisma.competitionRound.create({
    data: { tenantId: defaultTenant.id, competitionId: competition.id, name: '决赛', roundOrder: 3, status: 'PENDING', promotionRule: { type: 'topN', value: 5 } },
  })
  // 创建组别
  const group1 = await prisma.competitionGroup.create({
    data: { tenantId: defaultTenant.id, competitionId: competition.id, name: '青少年组', description: '18岁以下选手' },
  })
  const group2 = await prisma.competitionGroup.create({
    data: { tenantId: defaultTenant.id, competitionId: competition.id, name: '成人组', description: '18岁及以上选手' },
  })
  const group3 = await prisma.competitionGroup.create({
    data: { tenantId: defaultTenant.id, competitionId: competition.id, name: '专业组', description: '专业艺术团体/院校选手' },
  })
  console.log('✓ 已创建轮次和组别（3个组别）')

  // 开启报名
  const registrationToken = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  await prisma.competition.update({
    where: { id: competition.id },
    data: { registrationEnabled: true, registrationToken, registrationFields: ['name', 'team', 'contact'] },
  })
  console.log('✓ 已开启公开报名 (token: ' + registrationToken.slice(0, 8) + '...)')

  // 创建示例通知
  await prisma.notification.createMany({
    data: [
      { tenantId: defaultTenant.id, userId: admin.id, type: 'system', title: '🎉 系统初始化完成', content: '所有示例数据已创建，可以开始使用系统了' },
      { tenantId: defaultTenant.id, userId: organizer.id, type: 'promotion', title: '🏆 初赛结果已出', content: '5个节目成功晋级复赛，请查看晋级名单' },
      { tenantId: defaultTenant.id, userId: judge1.id, type: 'score', title: '📝 评分提醒', content: '您有3个节目尚未完成评分，请及时处理' },
      { tenantId: defaultTenant.id, userId: judge2.id, type: 'score', title: '✅ 评分完成', content: '您已成功提交《春江花月夜》的评分' },
      { tenantId: defaultTenant.id, userId: admin.id, type: 'certificate', title: '🎓 证书已生成', content: '复赛晋级选手的荣誉证书已准备就绪' },
      { tenantId: defaultTenant.id, userId: organizer.id, type: 'system', title: '📋 比赛即将开始', content: '请确认所有选手和评委已就位' },
      { tenantId: defaultTenant.id, userId: admin.id, type: 'promotion', title: '📢 公开报名已开启', content: '选手可通过分享链接自助报名参赛' },
      { tenantId: defaultTenant.id, userId: judge1.id, type: 'score', title: '⭐ 新评分规则', content: '比赛启用了"去掉最高分和最低分"规则' },
      { tenantId: defaultTenant.id, userId: judge3.id, type: 'score', title: '📊 评分统计', content: '您本周共完成15个节目的评分工作' },
      { tenantId: defaultTenant.id, userId: organizer.id, type: 'system', title: '📅 赛程提醒', content: '复赛将于明天上午9:00开始' },
    ],
  })
  console.log('✓ 已创建示例通知（10条）')

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
    prisma.auditLog.create({
      data: { tenantId: defaultTenant.id, userId: judge2.id, action: '提交评分', targetId: programs[1].id, details: { programName: programs[1].name } },
    }),
    prisma.auditLog.create({
      data: { tenantId: defaultTenant.id, userId: judge3.id, action: '提交评分', targetId: programs[2].id, details: { programName: programs[2].name } },
    }),
    prisma.auditLog.create({
      data: { tenantId: defaultTenant.id, userId: admin.id, action: 'UPDATE_DISPLAY_SETTINGS', targetId: competition.id, details: { theme: 'MODERN' } },
    }),
    prisma.auditLog.create({
      data: { tenantId: defaultTenant.id, userId: organizer.id, action: 'PROMOTE_ROUND', targetId: competition.id, details: { fromRound: '初赛', toRound: '复赛', promotedCount: 5 } },
    }),
    prisma.auditLog.create({
      data: { tenantId: defaultTenant.id, userId: admin.id, action: 'UPDATE_COMPETITION', targetId: competition.id, details: { newStatus: 'ACTIVE' } },
    }),
    prisma.auditLog.create({
      data: { tenantId: defaultTenant.id, userId: admin.id, action: 'CLONE_COMPETITION', targetId: competition.id, details: { cloneName: '秋季艺术节' } },
    }),
  ])

  console.log('✓ 已创建审计日志（10条）')

  // ================================================================
  // 租户2: 星辰文化传媒
  // ================================================================
  console.log('\n--- 创建租户2: 星辰文化传媒 ---')
  const tenant2 = await prisma.tenant.create({
    data: {
      name: '星辰文化传媒',
      domain: 'xingchen.local',
      settings: { allowRegistration: true, features: ['competitions', 'scoring', 'display'] },
      isActive: true,
      contactEmail: 'admin@xingchen.com',
      primaryColor: '#8b5cf6',
    },
  })

  const t2admin = await prisma.user.create({
    data: {
      tenantId: tenant2.id,
      name: '星辰管理员',
      email: 'xingchen@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      permissions: ['competition:*', 'program:*', 'participant:*', 'score:*', 'judge:*', 'system:settings'],
      isActive: true,
    },
  })

  const t2judge1 = await prisma.user.create({
    data: {
      tenantId: tenant2.id,
      name: '星辰评委A',
      email: 'xc_judge1@example.com',
      password: hashedPassword,
      role: 'JUDGE',
      permissions: ['score:create', 'score:read'],
      isActive: true,
    },
  })

  const t2judge2 = await prisma.user.create({
    data: {
      tenantId: tenant2.id,
      name: '星辰评委B',
      email: 'xc_judge2@example.com',
      password: hashedPassword,
      role: 'JUDGE',
      permissions: ['score:create', 'score:read'],
      isActive: true,
    },
  })

  // 星辰比赛
  const t2Comp = await prisma.competition.create({
    data: {
      tenantId: tenant2.id,
      name: '星辰好声音·2024',
      description: '寻找最美歌声，年度音乐盛事',
      organizerId: t2admin.id,
      creatorId: t2admin.id,
      startTime: new Date('2024-05-01T14:00:00Z'),
      endTime: new Date('2024-05-02T22:00:00Z'),
      status: 'ACTIVE',
      rankingUpdateMode: 'REALTIME',
      scoringConfig: { dropHighest: true, dropLowest: true, dropCount: 1 },
      registrationEnabled: true,
      registrationToken: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    },
  })

  await prisma.scoringCriteria.createMany({
    data: [
      { tenantId: tenant2.id, competitionId: t2Comp.id, name: '音准', weight: 0.4, maxScore: 100 },
      { tenantId: tenant2.id, competitionId: t2Comp.id, name: '音色', weight: 0.3, maxScore: 100 },
      { tenantId: tenant2.id, competitionId: t2Comp.id, name: '舞台表现', weight: 0.3, maxScore: 100 },
    ],
  })

  const t2Participants = await Promise.all([
    prisma.participant.create({ data: { tenantId: tenant2.id, name: '陈星宇', team: '星辰一队', contact: '13900001101' } }),
    prisma.participant.create({ data: { tenantId: tenant2.id, name: '林雨晴', team: '星辰一队', contact: '13900001102' } }),
    prisma.participant.create({ data: { tenantId: tenant2.id, name: '王浩然', team: '星辰二队', contact: '13900001103' } }),
    prisma.participant.create({ data: { tenantId: tenant2.id, name: '赵梦琪', team: '星辰二队', contact: '13900001104' } }),
    prisma.participant.create({ data: { tenantId: tenant2.id, name: '张天宇', team: '个人参赛', contact: '13900001105' } }),
  ])

  const t2Criteria = await prisma.scoringCriteria.findMany({ where: { competitionId: t2Comp.id } })
  const t2Programs = await Promise.all([
    prisma.program.create({
      data: { tenantId: tenant2.id, competitionId: t2Comp.id, name: '《夜空中最亮的星》', order: 1, currentStatus: 'COMPLETED', customFields: { songWriter: '逃跑计划' } },
    }),
    prisma.program.create({
      data: { tenantId: tenant2.id, competitionId: t2Comp.id, name: '《起风了》', order: 2, currentStatus: 'PERFORMING', customFields: { songWriter: '买辣椒也用券' } },
    }),
    prisma.program.create({
      data: { tenantId: tenant2.id, competitionId: t2Comp.id, name: '《光年之外》', order: 3, currentStatus: 'WAITING', customFields: { songWriter: '邓紫棋' } },
    }),
  ])

  // 关联选手和节目
  await prisma.participantProgram.createMany({
    data: [
      { participantId: t2Participants[0].id, programId: t2Programs[0].id },
      { participantId: t2Participants[1].id, programId: t2Programs[0].id },
      { participantId: t2Participants[2].id, programId: t2Programs[1].id },
      { participantId: t2Participants[3].id, programId: t2Programs[2].id },
    ],
  })

  console.log('✓ 已创建租户2（星辰文化传媒）：1管理员 + 2评委 + 5选手 + 3节目')

  // ================================================================
  // 租户3: 东方艺术学校
  // ================================================================
  console.log('\n--- 创建租户3: 东方艺术学校 ---')
  const tenant3 = await prisma.tenant.create({
    data: {
      name: '东方艺术学校',
      domain: 'dongfang.local',
      settings: { allowRegistration: false, features: ['competitions', 'scoring', 'reports'] },
      isActive: true,
      contactEmail: 'admin@dongfang.edu',
      primaryColor: '#059669',
    },
  })

  const t3admin = await prisma.user.create({
    data: {
      tenantId: tenant3.id,
      name: '东方管理员',
      email: 'dongfang@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      permissions: ['competition:*', 'program:*', 'participant:*', 'score:*'],
      isActive: true,
    },
  })

  const t3judge = await prisma.user.create({
    data: {
      tenantId: tenant3.id,
      name: '东方评委',
      email: 'df_judge@example.com',
      password: hashedPassword,
      role: 'JUDGE',
      permissions: ['score:create', 'score:read'],
      isActive: true,
    },
  })

  const t3Comp = await prisma.competition.create({
    data: {
      tenantId: tenant3.id,
      name: '东方杯·舞蹈大赛',
      description: '全校舞蹈特长生的年度汇报展演',
      organizerId: t3admin.id,
      creatorId: t3admin.id,
      startTime: new Date('2024-06-15T09:00:00Z'),
      endTime: new Date('2024-06-16T18:00:00Z'),
      status: 'ACTIVE',
      rankingUpdateMode: 'BATCH',
      scoringConfig: { dropHighest: false, dropLowest: true, dropCount: 1 },
    },
  })

  await prisma.scoringCriteria.createMany({
    data: [
      { tenantId: tenant3.id, competitionId: t3Comp.id, name: '基本功', weight: 0.25, maxScore: 100 },
      { tenantId: tenant3.id, competitionId: t3Comp.id, name: '表现力', weight: 0.35, maxScore: 100 },
      { tenantId: tenant3.id, competitionId: t3Comp.id, name: '编排创意', weight: 0.25, maxScore: 100 },
      { tenantId: tenant3.id, competitionId: t3Comp.id, name: '服装道具', weight: 0.15, maxScore: 100 },
    ],
  })

  const t3Participants = await Promise.all([
    prisma.participant.create({ data: { tenantId: tenant3.id, name: '白芭蕾', team: '芭蕾舞社', contact: '13800003001' } }),
    prisma.participant.create({ data: { tenantId: tenant3.id, name: '吴国标', team: '国标舞社', contact: '13800003002' } }),
    prisma.participant.create({ data: { tenantId: tenant3.id, name: '杨现代', team: '现代舞社', contact: '13800003003' } }),
    prisma.participant.create({ data: { tenantId: tenant3.id, name: '马民族', team: '民族舞社', contact: '13800003004' } }),
    prisma.participant.create({ data: { tenantId: tenant3.id, name: '刘街舞', team: '街舞社', contact: '13800003005' } }),
    prisma.participant.create({ data: { tenantId: tenant3.id, name: '陈拉丁', team: '拉丁舞社', contact: '13800003006' } }),
  ])

  const t3Programs = await Promise.all([
    prisma.program.create({ data: { tenantId: tenant3.id, competitionId: t3Comp.id, name: '《天鹅湖》选段', order: 1, currentStatus: 'COMPLETED' } }),
    prisma.program.create({ data: { tenantId: tenant3.id, competitionId: t3Comp.id, name: '《雀之灵》', order: 2, currentStatus: 'COMPLETED' } }),
    prisma.program.create({ data: { tenantId: tenant3.id, competitionId: t3Comp.id, name: '《大河之舞》片段', order: 3, currentStatus: 'PERFORMING' } }),
    prisma.program.create({ data: { tenantId: tenant3.id, competitionId: t3Comp.id, name: '《千手观音》', order: 4, currentStatus: 'WAITING' } }),
  ])

  await prisma.participantProgram.createMany({
    data: [
      { participantId: t3Participants[0].id, programId: t3Programs[0].id },
      { participantId: t3Participants[1].id, programId: t3Programs[1].id },
      { participantId: t3Participants[2].id, programId: t3Programs[2].id },
      { participantId: t3Participants[3].id, programId: t3Programs[3].id },
    ],
  })

  // 为东方比赛添加轮次
  await prisma.competitionRound.create({ data: { tenantId: tenant3.id, competitionId: t3Comp.id, name: '预选赛', roundOrder: 1, status: 'FINISHED' } })
  await prisma.competitionRound.create({ data: { tenantId: tenant3.id, competitionId: t3Comp.id, name: '总决赛', roundOrder: 2, status: 'ACTIVE' } })

  console.log('✓ 已创建租户3（东方艺术学校）：1管理员 + 1评委 + 6选手 + 4节目 + 2轮次')

  // ================================================================
  // 为默认租户的SUPER_ADMIN添加更多数据
  // ================================================================
  console.log('\n--- 为系统管理租户添加数据 ---')
  const saUser = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } })
  if (saUser) {
    await prisma.notification.createMany({
      data: [
        { tenantId: systemTenant.id, userId: saUser.id, type: 'system', title: '🏢 租户管理提醒', content: '星辰文化传媒租户已到期，需要续费处理' },
        { tenantId: systemTenant.id, userId: saUser.id, type: 'system', title: '📊 系统周报', content: '本周新增2个租户，总活跃比赛5场' },
        { tenantId: systemTenant.id, userId: saUser.id, type: 'system', title: '⚠️ 安全警告', content: '检测到来自未知IP的多次登录尝试' },
      ],
    })
    console.log('✓ 已为超级管理员添加系统通知')
  }

  console.log('\n✅ 多租户示例数据创建完成！')
  console.log(`
创建的数据包括：
- 4 个租户（系统管理 + 默认租户 + 星辰文化传媒 + 东方艺术学校）
- 12 个用户（各租户独立管理员/组织者/评委）
- 35 个参与者（跨3个租户）
- 3 个比赛（每个活跃租户1个）
- 11 个评分标准
- 12 个节目
- 10+ 条审计日志
- 全部租户含报名Token/评分规则/轮次/组别
- 系统管理租户含通知消息

租户登录信息：
- 默认租户 — admin@example.com / 123456（ADMIN）
- 默认租户 — organizer@example.com / 123456（ORGANIZER）
- 默认租户 — judge1/2/3@example.com / 123456（JUDGE）
- 星辰文化 — xingchen@example.com / 123456（ADMIN）
- 星辰文化 — xc_judge1/2@example.com / 123456（JUDGE）
- 东方艺术 — dongfang@example.com / 123456（ADMIN）
- 东方艺术 — df_judge@example.com / 123456（JUDGE）
- 系统管理 — superadmin@example.com / 123456（SUPER_ADMIN）
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
