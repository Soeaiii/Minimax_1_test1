// Sample data generator for testing

// Sample participants data
const sampleParticipants = [
  { id: 1, name: '张三', grade: '大一', class: '计科1班', school: '计算机学院' },
  { id: 2, name: '李四', grade: '大二', class: '软工2班', school: '软件学院' },
  { id: 3, name: '王五', grade: '大三', class: '网络3班', school: '网络学院' },
];

// Sample competitions data
const sampleCompetitions = [
  { id: 1, name: '算法设计大赛', category: '算法', date: '2024-03-15' },
  { id: 2, name: '前端开发挑战', category: '前端', date: '2024-04-20' },
];

// Sample judges data
const sampleJudges = [
  { id: 1, name: '教授A', expertise: '算法' },
  { id: 2, name: '教授B', expertise: '前端' },
];

module.exports = {
  participants: sampleParticipants,
  competitions: sampleCompetitions,
  judges: sampleJudges,
};
