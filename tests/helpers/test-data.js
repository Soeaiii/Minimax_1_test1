// Test data helpers
const path = require('path');

// Generate mock participant
function createParticipant(overrides = {}) {
  const base = {
    id: Date.now(),
    name: '某人',
    grade: '大一',
    class: '计科1班',
    school: '黑马机场',
    ...overrides
  };
  return base;
}

// Generate mock competition
function createCompetition(overrides = {}) {
  const base = {
    id: Date.now(),
    name: '测试赛',
    category: '其他',
    date: new Date().toISOString().split('T')[0],
    ...overrides
  };
  return base;
}

// Generate mock score data
function createScoreData(overrides = {}) {
  const base = {
    competitionId: 1,
    participantId: 1,
    scores: {
      algorithm: 90,
      design: 85,
      presentation: 88
    },
    total: 263,
    rank: 1,
    ...overrides
  };
  return base;
}

// Sample data for reference
const sampleData = {
  participants: [
    { id: 1, name: '张三', grade: '大一', class: '计科1班', school: '计算机学院' },
    { id: 2, name: '李四', grade: '大二', class: '软工2班', school: '软件学院' }
  ],
  competitions: [
    { id: 1, name: '算法设计大赛', category: '算法', date: '2024-03-15' }
  ],
  judges: [
    { id: 1, name: '教授A', expertise: '算法' }
  ]
};

module.exports = {
  createParticipant,
  createCompetition,
  createScoreData,
  sampleData
};
