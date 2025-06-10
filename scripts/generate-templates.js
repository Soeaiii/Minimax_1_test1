const XLSX = require('xlsx');
const path = require('path');

// 选手信息模板数据
const participantsData = [
  ['姓名', '简介', '团队', '联系方式'],
  ['张三', '计算机专业学生', '计算机系', '138****1001'],
  ['李四', '音乐学院声乐专业', '音乐学院', '138****1002'],
  ['王五', '舞蹈专业学生', '艺术学院', '138****1003'],
  ['赵六', '器乐演奏专业', '', '138****1004'],
  ['钱七', '话剧社成员', '戏剧社', '138****1005']
];

// 节目信息模板数据
const programsData = [
  ['节目名称', '描述', '顺序', '选手姓名'],
  ['《春江花月夜》', '古典舞表演', '1', '张三'],
  ['《我爱你中国》', '独唱表演', '2', '李四'],
  ['《青春舞曲》', '民族舞蹈', '3', '王五'],
  ['《梁祝》', '小提琴独奏', '4', '赵六'],
  ['《雷雨》', '话剧片段', '5', '钱七'],
  ['《茉莉花》', '合唱表演', '6', '张三,李四,王五'],
  ['《民族风》', '团体舞蹈', '7', '王五,其他舞者']
];

// 创建选手信息模板文件
function createParticipantsTemplate() {
  const ws = XLSX.utils.aoa_to_sheet(participantsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '选手信息');
  
  // 设置列宽
  ws['!cols'] = [
    { wch: 12 }, // 姓名
    { wch: 20 }, // 简介
    { wch: 15 }, // 团队
    { wch: 15 }  // 联系方式
  ];
  
  const filePath = path.join(__dirname, '../public/templates/participants-template.xlsx');
  XLSX.writeFile(wb, filePath);
  console.log('已创建选手信息模板:', filePath);
}

// 创建节目信息模板文件
function createProgramsTemplate() {
  const ws = XLSX.utils.aoa_to_sheet(programsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '节目信息');
  
  // 设置列宽
  ws['!cols'] = [
    { wch: 18 }, // 节目名称
    { wch: 20 }, // 描述
    { wch: 8 },  // 顺序
    { wch: 25 }  // 选手姓名
  ];
  
  const filePath = path.join(__dirname, '../public/templates/programs-template.xlsx');
  XLSX.writeFile(wb, filePath);
  console.log('已创建节目信息模板:', filePath);
}

// 执行创建模板文件
try {
  createParticipantsTemplate();
  createProgramsTemplate();
  console.log('✅ 所有模板文件创建成功！');
} catch (error) {
  console.error('❌ 创建模板文件失败:', error);
} 