import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建示例数据...')

  // 注意：在生产环境中，请谨慎使用数据清理操作
  // 这里我们跳过清理步骤，直接创建数据
  console.log('跳过数据清理步骤，直接创建示例数据...')

  // 创建用户
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  const admin = await prisma.user.create({
    data: {
      name: '系统管理员',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const organizer = await prisma.user.create({
    data: {
      name: '比赛组织者',
      email: 'organizer@example.com',
      password: hashedPassword,
      role: 'ORGANIZER',
    },
  })

  const judge1 = await prisma.user.create({
    data: {
      name: '评委张三',
      email: 'judge1@example.com',
      password: hashedPassword,
      role: 'JUDGE',
    },
  })

  const judge2 = await prisma.user.create({
    data: {
      name: '评委李四',
      email: 'judge2@example.com',
      password: hashedPassword,
      role: 'JUDGE',
    },
  })

  const judge3 = await prisma.user.create({
    data: {
      name: '评委王五',
      email: 'judge3@example.com',
      password: hashedPassword,
      role: 'JUDGE',
    },
  })

  console.log('✓ 已创建用户')

  // 创建参与者
  const participants = await Promise.all([
    prisma.participant.create({
      data: {
        name: '张小明',
        bio: '专业舞蹈演员，擅长现代舞和民族舞',
        team: '星光舞团',
        contact: '13800138001',
      },
    }),
    prisma.participant.create({
      data: {
        name: '李美丽',
        bio: '声乐专业毕业，美声唱法',
        team: '天籁合唱团',
        contact: '13800138002',
      },
    }),
    prisma.participant.create({
      data: {
        name: '王强',
        bio: '器乐演奏家，专长钢琴演奏',
        team: '音乐学院',
        contact: '13800138003',
      },
    }),
    prisma.participant.create({
      data: {
        name: '赵艺术',
        bio: '戏剧表演专业，话剧演员',
        team: '话剧社',
        contact: '13800138004',
      },
    }),
    prisma.participant.create({
      data: {
        name: '孙创意',
        bio: '创意表演，多媒体艺术',
        team: '创新工作室',
        contact: '13800138005',
      },
    }),
  ])

  console.log('✓ 已创建参与者')

  // 创建比赛
  const competition = await prisma.competition.create({
    data: {
      name: '2024年度艺术节才艺大赛',
      description: '展示各种艺术才能的综合性比赛，包括舞蹈、声乐、器乐、戏剧等多个类别',
      organizerId: organizer.id,
      startTime: new Date('2024-03-01T09:00:00Z'),
      endTime: new Date('2024-03-01T18:00:00Z'),
      status: 'ACTIVE',
      rankingUpdateMode: 'REALTIME',
    },
  })

  console.log('✓ 已创建比赛')

  // 创建评分标准
  const scoringCriteria = await Promise.all([
    prisma.scoringCriteria.create({
      data: {
        name: '技术难度',
        weight: 0.3,
        maxScore: 10,
        competitionId: competition.id,
      },
    }),
    prisma.scoringCriteria.create({
      data: {
        name: '艺术表现',
        weight: 0.35,
        maxScore: 10,
        competitionId: competition.id,
      },
    }),
    prisma.scoringCriteria.create({
      data: {
        name: '创新性',
        weight: 0.2,
        maxScore: 10,
        competitionId: competition.id,
      },
    }),
    prisma.scoringCriteria.create({
      data: {
        name: '完整性',
        weight: 0.15,
        maxScore: 10,
        competitionId: competition.id,
      },
    }),
  ])

  console.log('✓ 已创建评分标准')

  // 创建节目
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        name: '《春江花月夜》现代舞',
        description: '以古典诗词为背景的现代舞表演',
        order: 1,
        currentStatus: 'COMPLETED',
        competitionId: competition.id,
        participantIds: [participants[0].id],
      },
    }),
    prisma.program.create({
      data: {
        name: '《我爱你中国》独唱',
        description: '爱国主题歌曲独唱表演',
        order: 2,
        currentStatus: 'COMPLETED',
        competitionId: competition.id,
        participantIds: [participants[1].id],
      },
    }),
    prisma.program.create({
      data: {
        name: '《月光奏鸣曲》钢琴独奏',
        description: '贝多芬经典钢琴作品演奏',
        order: 3,
        currentStatus: 'COMPLETED',
        competitionId: competition.id,
        participantIds: [participants[2].id],
      },
    }),
    prisma.program.create({
      data: {
        name: '《雷雨》片段表演',
        description: '曹禺经典话剧片段',
        order: 4,
        currentStatus: 'PERFORMING',
        competitionId: competition.id,
        participantIds: [participants[3].id],
      },
    }),
    prisma.program.create({
      data: {
        name: '《未来之光》多媒体表演',
        description: '结合科技元素的创新表演',
        order: 5,
        currentStatus: 'WAITING',
        competitionId: competition.id,
        participantIds: [participants[4].id],
      },
    }),
  ])

  console.log('✓ 已创建节目')

  // 为已完成的节目创建评分
  const judges = [judge1, judge2, judge3]
  
  // 为前三个已完成的节目创建评分
  for (let i = 0; i < 3; i++) {
    const program = programs[i]
    
    for (const judge of judges) {
      for (const criteria of scoringCriteria) {
        // 生成8-10之间的随机分数
        const score = Math.random() * 2 + 8
        
        await prisma.score.create({
          data: {
            value: parseFloat(score.toFixed(1)),
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

  // 计算并创建排名
  for (let i = 0; i < 3; i++) {
    const program = programs[i]
    
    // 获取该节目的所有评分
    const scores = await prisma.score.findMany({
      where: { programId: program.id },
      include: { scoringCriteria: true },
    })

    // 计算加权总分
    let totalScore = 0
    const criteriaScores = new Map()

    // 按评分标准分组并计算平均分
    for (const score of scores) {
      const criteriaId = score.scoringCriteriaId
      if (!criteriaScores.has(criteriaId)) {
        criteriaScores.set(criteriaId, [])
      }
      criteriaScores.get(criteriaId).push(score.value)
    }

    // 计算每个标准的加权分数
    for (const criteria of scoringCriteria) {
      const scores = criteriaScores.get(criteria.id) || []
      if (scores.length > 0) {
        const avgScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
        totalScore += avgScore * criteria.weight
      }
    }

    await prisma.ranking.create({
      data: {
        rank: i + 1, // 临时排名，实际应该根据总分排序
        totalScore: parseFloat(totalScore.toFixed(2)),
        updateType: 'AUTO',
        competitionId: competition.id,
        programId: program.id,
      },
    })
  }

  console.log('✓ 已创建排名')

  // 创建审计日志
  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: '创建比赛',
        targetId: competition.id,
        details: { competitionName: competition.name },
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: organizer.id,
        action: '创建节目',
        targetId: programs[0].id,
        details: { programName: programs[0].name },
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: judge1.id,
        action: '提交评分',
        targetId: programs[0].id,
        details: { programName: programs[0].name },
      },
    }),
  ])

  console.log('✓ 已创建审计日志')

  // 创建示例文件记录
  const files = await Promise.all([
    prisma.file.create({
      data: {
        filename: 'competition-background.jpg',
        path: '/uploads/backgrounds/competition-background.jpg',
        mimetype: 'image/jpeg',
        size: 1024000,
        competitionIds: [competition.id],
      },
    }),
    prisma.file.create({
      data: {
        filename: 'program1-video.mp4',
        path: '/uploads/programs/program1-video.mp4',
        mimetype: 'video/mp4',
        size: 50000000,
        programIds: [programs[0].id],
      },
    }),
    prisma.file.create({
      data: {
        filename: 'program2-audio.mp3',
        path: '/uploads/programs/program2-audio.mp3',
        mimetype: 'audio/mpeg',
        size: 8000000,
        programIds: [programs[1].id],
      },
    }),
  ])

  console.log('✓ 已创建文件记录')

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

登录信息：
- 管理员: admin@example.com / 123456
- 组织者: organizer@example.com / 123456
- 评委: judge1@example.com / 123456
  `)
}

main()
  .catch((e) => {
    console.error('创建示例数据时出错:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 