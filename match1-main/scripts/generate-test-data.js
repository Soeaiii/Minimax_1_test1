const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// 生成测试数据的主函数
async function generateTestData() {
  try {
    console.log('🚀 开始生成测试数据...');

    // 清理现有数据（可选）
    console.log('🧹 清理现有数据...');
    await cleanupData();

    // 1. 创建基础用户（如果不存在）
    console.log('👥 创建基础用户...');
    const users = await createUsers();

    // 2. 创建比赛
    console.log('🏆 创建比赛...');
    const competitions = await createCompetitions(users);

    // 3. 创建参赛者
    console.log('🎭 创建参赛者...');
    const participants = await createParticipants();

    // 4. 创建节目
    console.log('🎪 创建节目...');
    const programs = await createPrograms(competitions, participants);

    // 5. 创建评分标准
    console.log('📋 创建评分标准...');
    const scoringCriteria = await createScoringCriteria(competitions);

    // 6. 创建评分记录
    console.log('💯 创建评分记录...');
    await createScores(programs, scoringCriteria, users);

    // 7. 创建排名
    console.log('🥇 创建排名...');
    await createRankings(competitions, programs);

    // 8. 创建显示设置
    console.log('🖥️ 创建显示设置...');
    await createDisplaySettings(competitions, users);

    console.log('✅ 测试数据生成完成！');
    
  } catch (error) {
    console.error('❌ 生成测试数据失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 清理现有数据（测试环境用）
async function cleanupData() {
  await prisma.score.deleteMany({});
  await prisma.ranking.deleteMany({});
  await prisma.displaySettings.deleteMany({});
  await prisma.scoringCriteria.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.participant.deleteMany({});
  await prisma.competition.deleteMany({});
  await prisma.auditLog.deleteMany({});
  // 不删除用户，因为需要保留现有用户
}

// 创建基础用户
async function createUsers() {
  const password = await bcrypt.hash('123456', 10);
  
  // 查找现有用户
  const existingUsers = await prisma.user.findMany();
  console.log(`发现 ${existingUsers.length} 个现有用户`);
  
  // 如果没有评委，创建一些评委
  const judges = existingUsers.filter(u => u.role === 'JUDGE');
  if (judges.length < 5) {
    console.log('创建评委用户...');
    const newJudges = await Promise.all([
      prisma.user.upsert({
        where: { email: 'judge1@example.com' },
        update: {},
        create: {
          name: '张教授',
          email: 'judge1@example.com',
          password,
          role: 'JUDGE',
          bio: '音乐学院教授，专业声乐指导，有20年教学经验'
        }
      }),
      prisma.user.upsert({
        where: { email: 'judge2@example.com' },
        update: {},
        create: {
          name: '李老师',
          email: 'judge2@example.com',
          password,
          role: 'JUDGE',
          bio: '舞蹈艺术家，国家一级编导，曾获多项国际大奖'
        }
      }),
      prisma.user.upsert({
        where: { email: 'judge3@example.com' },
        update: {},
        create: {
          name: '王主任',
          email: 'judge3@example.com',
          password,
          role: 'JUDGE',
          bio: '表演艺术系主任，戏剧表演专家'
        }
      }),
      prisma.user.upsert({
        where: { email: 'judge4@example.com' },
        update: {},
        create: {
          name: '陈导演',
          email: 'judge4@example.com',
          password,
          role: 'JUDGE',
          bio: '知名导演，影视作品屡获殊荣'
        }
      }),
      prisma.user.upsert({
        where: { email: 'judge5@example.com' },
        update: {},
        create: {
          name: '赵大师',
          email: 'judge5@example.com',
          password,
          role: 'JUDGE',
          bio: '民族音乐大师，非物质文化遗产传承人'
        }
      })
    ]);
    judges.push(...newJudges);
  }

  // 确保有组织者
  let organizer = existingUsers.find(u => u.role === 'ORGANIZER');
  if (!organizer) {
    organizer = await prisma.user.upsert({
      where: { email: 'organizer@example.com' },
      update: {},
      create: {
        name: '活动组织者',
        email: 'organizer@example.com',
        password,
        role: 'ORGANIZER',
        bio: '专业活动策划，有丰富的大型比赛组织经验'
      }
    });
  }

  return {
    judges: await prisma.user.findMany({ where: { role: 'JUDGE' } }),
    organizer
  };
}

// 创建比赛
async function createCompetitions(users) {
  const competitions = [
    {
      name: '第十届校园歌手大赛',
      description: '展现青春风采，唱响美好未来。本届比赛将评选出最具潜力的校园歌手，为他们提供更大的舞台。',
      startTime: new Date('2024-03-15T09:00:00Z'),
      endTime: new Date('2024-03-15T18:00:00Z'),
      status: 'ACTIVE',
      rankingUpdateMode: 'REALTIME'
    },
    {
      name: '春季舞蹈艺术节',
      description: '舞动青春，艺术绽放。汇聚各类舞蹈表演，展示舞蹈艺术的魅力与活力。',
      startTime: new Date('2024-03-20T14:00:00Z'),
      endTime: new Date('2024-03-20T20:00:00Z'),
      status: 'PENDING',
      rankingUpdateMode: 'BATCH'
    },
    {
      name: '器乐演奏比赛',
      description: '音乐无界，才华飞扬。各类乐器演奏者的专业比拼，传承和发扬音乐艺术。',
      startTime: new Date('2024-03-25T10:00:00Z'),
      endTime: new Date('2024-03-25T17:00:00Z'),
      status: 'FINISHED',
      rankingUpdateMode: 'REALTIME'
    }
  ];

  const createdCompetitions = [];
  for (const comp of competitions) {
    const competition = await prisma.competition.create({
      data: {
        ...comp,
        organizerId: users.organizer.id
      }
    });
    createdCompetitions.push(competition);
  }

  return createdCompetitions;
}

// 创建参赛者
async function createParticipants() {
  const participantsData = [
    // 歌手大赛参赛者
    { name: '李小美', bio: '音乐学院大三学生，擅长民族唱法', team: '音乐学院', contact: '138****1001' },
    { name: '张阳光', bio: '计算机系学生，热爱流行音乐', team: '计算机系', contact: '138****1002' },
    { name: '王诗雨', bio: '中文系才女，古风歌曲专长', team: '中文系', contact: '138****1003' },
    { name: '陈浩然', bio: '体育系学生，喜欢摇滚风格', team: '体育系', contact: '138****1004' },
    { name: '刘雅琴', bio: '艺术系声乐专业，美声唱法', team: '艺术系', contact: '138****1005' },
    { name: '赵明轩', bio: '经管学院学生，多才多艺', team: '经管学院', contact: '138****1006' },
    
    // 舞蹈艺术节参赛者
    { name: '林舞婷', bio: '舞蹈系芭蕾舞专业', team: '舞蹈系', contact: '138****2001' },
    { name: '徐飞扬', bio: '现代舞爱好者，自学成才', team: '自由舞者', contact: '138****2002' },
    { name: '孙梦瑶', bio: '民族舞传承人，功底深厚', team: '民族舞团', contact: '138****2003' },
    { name: '马俊杰', bio: '街舞高手，多次获奖', team: 'B-boy团队', contact: '138****2004' },
    { name: '周雅萱', bio: '国标舞选手，技艺精湛', team: '舞蹈学院', contact: '138****2005' },
    { name: '吴小凤', bio: '古典舞专业，动作优美', team: '艺术团', contact: '138****2006' },
    
    // 器乐演奏参赛者
    { name: '钢琴王子-李华', bio: '钢琴十级，多次参加国际比赛', team: '音乐学院', contact: '138****3001' },
    { name: '小提琴手-张悦', bio: '自幼学习小提琴，基本功扎实', team: '交响乐团', contact: '138****3002' },
    { name: '古筝仙子-刘雅', bio: '古筝专业，传统文化爱好者', team: '民乐团', contact: '138****3003' },
    { name: '吉他达人-陈鸣', bio: '吉他演奏家，风格多样', team: '流行乐队', contact: '138****3004' },
    { name: '二胡大师-王明', bio: '二胡演奏，师从名家', team: '戏曲学院', contact: '138****3005' },
    { name: '萨克斯风-赵亮', bio: '爵士萨克斯，节奏感强', team: '爵士乐团', contact: '138****3006' }
  ];

  const participants = [];
  for (const data of participantsData) {
    const participant = await prisma.participant.create({
      data
    });
    participants.push(participant);
  }

  return participants;
}

// 创建节目
async function createPrograms(competitions, participants) {
  const programs = [];
  
  // 歌手大赛节目
  const singingCompetition = competitions[0];
  const singingParticipants = participants.slice(0, 6);
  
  for (let i = 0; i < singingParticipants.length; i++) {
    const program = await prisma.program.create({
      data: {
        name: [
          '《我的中国心》',
          '《青春》',
          '《江南》',
          '《山丘》',
          '《我和我的祖国》',
          '《稻香》'
        ][i],
        description: [
          '经典爱国歌曲，展现家国情怀',
          '青春励志歌曲，充满正能量',
          '江南风情歌曲，韵味悠长',
          '深情演唱，触动人心',
          '爱国主义歌曲，激发共鸣',
          '田园风光歌曲，回归自然'
        ][i],
        order: i + 1,
        currentStatus: i < 2 ? 'COMPLETED' : i === 2 ? 'PERFORMING' : 'WAITING',
        competitionId: singingCompetition.id,
        participantIds: [singingParticipants[i].id]
      }
    });
    programs.push(program);
  }

  // 舞蹈艺术节节目
  const danceCompetition = competitions[1];
  const danceParticipants = participants.slice(6, 12);
  
  for (let i = 0; i < danceParticipants.length; i++) {
    const program = await prisma.program.create({
      data: {
        name: [
          '《天鹅湖》选段',
          '《流动》现代舞',
          '《茉莉花》民族舞',
          '《Battle》街舞',
          '《华尔兹》国标舞',
          '《采薇》古典舞'
        ][i],
        description: [
          '经典芭蕾舞，优雅动人',
          '现代舞作品，表达情感',
          '传统民族舞，文化底蕴深厚',
          '街舞对决，动感十足',
          '国标舞表演，技艺精湛',
          '古典舞韵，意境深远'
        ][i],
        order: i + 1,
        currentStatus: 'WAITING',
        competitionId: danceCompetition.id,
        participantIds: [danceParticipants[i].id]
      }
    });
    programs.push(program);
  }

  // 器乐演奏节目
  const musicCompetition = competitions[2];
  const musicParticipants = participants.slice(12, 18);
  
  for (let i = 0; i < musicParticipants.length; i++) {
    const program = await prisma.program.create({
      data: {
        name: [
          '《月光奏鸣曲》钢琴',
          '《梁祝》小提琴',
          '《高山流水》古筝',
          '《Hotel California》吉他',
          '《二泉映月》二胡',
          '《Going Home》萨克斯'
        ][i],
        description: [
          '贝多芬经典钢琴曲',
          '中国经典小提琴协奏曲',
          '古筝名曲，意境悠远',
          '经典摇滚吉他曲',
          '二胡名曲，情深意长',
          '萨克斯经典曲目'
        ][i],
        order: i + 1,
        currentStatus: 'COMPLETED',
        competitionId: musicCompetition.id,
        participantIds: [musicParticipants[i].id]
      }
    });
    programs.push(program);
  }

  return programs;
}

// 创建评分标准
async function createScoringCriteria(competitions) {
  const criteriaByType = {
    singing: [
      { name: '音准音质', weight: 0.3, maxScore: 10 },
      { name: '演唱技巧', weight: 0.25, maxScore: 10 },
      { name: '情感表达', weight: 0.25, maxScore: 10 },
      { name: '舞台表现', weight: 0.2, maxScore: 10 }
    ],
    dance: [
      { name: '技术技巧', weight: 0.35, maxScore: 10 },
      { name: '艺术表现', weight: 0.3, maxScore: 10 },
      { name: '创意编排', weight: 0.2, maxScore: 10 },
      { name: '整体效果', weight: 0.15, maxScore: 10 }
    ],
    music: [
      { name: '演奏技巧', weight: 0.4, maxScore: 10 },
      { name: '音乐表现', weight: 0.3, maxScore: 10 },
      { name: '曲目难度', weight: 0.2, maxScore: 10 },
      { name: '台风形象', weight: 0.1, maxScore: 10 }
    ]
  };

  const allCriteria = [];
  
  // 为每个比赛创建评分标准
  for (let i = 0; i < competitions.length; i++) {
    const criteriaType = i === 0 ? 'singing' : i === 1 ? 'dance' : 'music';
    const criteria = criteriaByType[criteriaType];
    
    for (const criterion of criteria) {
      const scoringCriteria = await prisma.scoringCriteria.create({
        data: {
          ...criterion,
          competitionId: competitions[i].id
        }
      });
      allCriteria.push(scoringCriteria);
    }
  }

  return allCriteria;
}

// 创建评分记录
async function createScores(programs, scoringCriteria, users) {
  const judges = users.judges;
  
  // 为每个节目创建评分记录
  for (const program of programs) {
    // 获取该节目所属比赛的评分标准
    const programCriteria = scoringCriteria.filter(sc => 
      programs.find(p => p.id === program.id && p.competitionId === sc.competitionId)
    );
    
    // 为每个评委创建评分
    for (const judge of judges) {
      for (const criteria of programCriteria) {
        // 根据节目状态决定是否有评分
        if (program.currentStatus === 'COMPLETED') {
          // 生成评分（7-10分之间，带小数）
          const baseScore = 7 + Math.random() * 3;
          const score = Math.round(baseScore * 10) / 10;
          
          await prisma.score.create({
            data: {
              value: score,
              comment: generateScoreComment(score, criteria.name),
              programId: program.id,
              scoringCriteriaId: criteria.id,
              judgeId: judge.id
            }
          });
        }
      }
    }
  }
}

// 生成评分评语
function generateScoreComment(score, criteriaName) {
  const comments = {
    excellent: [
      '表现出色，技艺精湛',
      '完美的演绎，令人印象深刻',
      '专业水准，值得称赞',
      '杰出的表现，极具感染力'
    ],
    good: [
      '表现良好，有进步空间',
      '整体不错，细节可以再优化',
      '技术娴熟，情感表达到位',
      '稳定发挥，值得肯定'
    ],
    average: [
      '中规中矩，需要更多练习',
      '基本功扎实，需要提升表现力',
      '表现平稳，可以更加大胆',
      '有潜力，继续努力'
    ]
  };
  
  let level = 'average';
  if (score >= 9) level = 'excellent';
  else if (score >= 8) level = 'good';
  
  const levelComments = comments[level];
  return levelComments[Math.floor(Math.random() * levelComments.length)];
}

// 创建排名
async function createRankings(competitions, programs) {
  for (const competition of competitions) {
    const competitionPrograms = programs.filter(p => p.competitionId === competition.id);
    
    // 只为已完成的比赛创建排名
    if (competition.status === 'FINISHED' || competition.status === 'ACTIVE') {
      // 计算每个节目的总分
      const programScores = [];
      
      for (const program of competitionPrograms) {
        if (program.currentStatus === 'COMPLETED') {
          // 获取该节目的所有评分
          const scores = await prisma.score.findMany({
            where: { programId: program.id },
            include: { scoringCriteria: true }
          });
          
          if (scores.length > 0) {
            // 计算加权平均分
            let totalScore = 0;
            const criteriaGroups = {};
            
            // 按评分标准分组
            scores.forEach(score => {
              const criteriaId = score.scoringCriteriaId;
              if (!criteriaGroups[criteriaId]) {
                criteriaGroups[criteriaId] = {
                  scores: [],
                  weight: score.scoringCriteria.weight
                };
              }
              criteriaGroups[criteriaId].scores.push(score.value);
            });
            
            // 计算总分
            Object.values(criteriaGroups).forEach(group => {
              const avgScore = group.scores.reduce((a, b) => a + b, 0) / group.scores.length;
              totalScore += avgScore * group.weight;
            });
            
            programScores.push({
              program,
              totalScore: Math.round(totalScore * 100) / 100
            });
          }
        }
      }
      
      // 按总分排序
      programScores.sort((a, b) => b.totalScore - a.totalScore);
      
      // 创建排名记录
      for (let i = 0; i < programScores.length; i++) {
        await prisma.ranking.create({
          data: {
            rank: i + 1,
            totalScore: programScores[i].totalScore,
            updateType: competition.rankingUpdateMode === 'REALTIME' ? 'AUTO' : 'MANUAL',
            competitionId: competition.id,
            programId: programScores[i].program.id
          }
        });
      }
    }
  }
}

// 创建显示设置
async function createDisplaySettings(competitions, users) {
  const judges = users.judges;
  
  for (const competition of competitions) {
    await prisma.displaySettings.create({
      data: {
        competitionId: competition.id,
        showJudgeScores: true,
        showParticipants: true,
        showProgramInfo: true,
        title: competition.name,
        subtitle: '实时评分展示',
        autoRefresh: true,
        refreshInterval: 5,
        theme: 'MODERN',
        titleColor: '#ffffff',
        subtitleColor: '#e5e7eb',
        judgeNameColor: '#1f2937',
        judgeScoreColor: '#1f2937',
        averageScoreColor: '#ffffff',
        programInfoColor: '#ffffff',
        judgeCardWidth: 288,
        judgeCardPadding: 32,
        judgeCardGap: 40,
        judgeAvatarSize: 176,
        judgeNameFontSize: 20,
        judgeScoreFontSize: 36,
        showBackgroundOverlay: true,
        overlayColor: '#000000',
        overlayOpacity: 0.4,
        selectedJudgeIds: judges.map(j => j.id)
      }
    });
  }
}

// 如果直接运行此文件，则执行数据生成
if (require.main === module) {
  generateTestData();
}

module.exports = { generateTestData }; 