// 随机数据生成工具

const { createParticipant, createCompetition, createScoreData, sampleData } = require('./test-data');

function generateParticipants(count = 10) {
  const participants = [];
  const names = ['张三', '李四', '王五', '赵六', '吴七', 
                  '孙八', '周九', '本十', '杨十', '赵十'];
  const grades = ['大一', '大二', '大三'];
  const classes = ['计科1班', '计科2班', '软工1班'];
  const schools = ['计算机学院', '软件学院', '网络学院'];

  for (let i = 0; i < count; i++) {
    participants.push(createParticipant({
      id: i + 1,
      name: names[i % names.length] + (i > 0 ? i : ''),
      grade: grades[Math.floor(Math.random() * grades.length)],
      class: classes[Math.floor(Math.random() * classes.length)],
      school: schools[Math.floor(Math.random() * schools.length)]
    }));
  }
  return participants;
}

function generateCompetitions(count = 5) {
  const competitions = [];
  const categories = ['算法', '前端', '数据', '网络'];
  const names = ['算法设计大赛', '前端开发挑战', '数据分析大赛', '网络安全挑战'];

  for (let i = 0; i < count; i++) {
    competitions.push(createCompetition({
      id: i + 1,
      name: names[i % names.length],
      category: categories[Math.floor(Math.random() * categories.length)],
      date: new Date(Date.now() + i * 86400000 * 7).toISOString().split('T')[0]
    }));
  }
  return competitions;
}

function generateScores(competitions, participants) {
  const scores = [];
  for (let comp of competitions) {
    for (let p of participants) {
      scores.push(createScoreData({
        competitionId: comp.id,
        participantId: p.id,
        scores: {
          algorithm: Math.floor(Math.random() * 20) + 80,
          design: Math.floor(Math.random() * 20) + 80,
          presentation: Math.floor(Math.random() * 20) + 80
        },
        total: 0
      }));
    }
  }
  
  // Calculate totals first
  scores.forEach(s => {
    s.total = s.scores.algorithm + s.scores.design + s.scores.presentation;
  });
  
  // Sort by total descending to assign proper ranks
  scores.sort((a, b) => b.total - a.total);
  
  // Assign ranks (handle ties)
  let currentRank = 1;
  for (let i = 0; i < scores.length; i++) {
    if (i > 0 && scores[i].total < scores[i-1].total) {
      currentRank = i + 1;
    }
    scores[i].rank = currentRank;
  }
  
  return scores;
}

module.exports = {
  generateParticipants,
  generateCompetitions,
  generateScores,
  sampleData
};
