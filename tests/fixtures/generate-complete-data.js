// 完整的测试数据生成器
const { generateParticipants, generateCompetitions, generateScores } = require('./test-data');
const { MockDB } = require('./mock-db');

async function generateCompleteTestData() {
  const db = new MockDB();
  
  // 生成测试数据
  const participants = generateParticipants(10);
  const competitions = generateCompetitions(3);
  const scores = generateScores(competitions, participants);
  
  // 初始化数据库
  await db.init({
    participants,
    competitions,
    scores
  });
  
  return { db, participants, competitions, scores };
}

// 对外接口
generateCompleteTestData().then(({ db, participants, competitions, scores }) => {
  console.log('Generated test data:');
  console.log(`- Participants: ${participants.length}`);
  console.log(`- Competitions: ${competitions.length}`);
  console.log(`- Scores: ${scores.length}`);
});

module.exports = { generateCompleteTestData };
