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

// 节目信息模板数据 - 添加自定义字段示例
const programsData = [
  ['节目名称', '描述', '顺序', '选手姓名', '表演时长', '道具需求', '特殊要求'],
  ['《春江花月夜》', '古典舞表演', '1', '张三', '5分钟', '无', '需要暗场灯光'],
  ['《我爱你中国》', '独唱表演', '2', '李四', '4分钟', '话筒一个', '需要背景音乐'],
  ['《青春舞曲》', '民族舞蹈', '3', '王五', '6分钟', '民族道具', '需要彩色灯光'],
  ['《梁祝》', '小提琴独奏', '4', '赵六', '8分钟', '小提琴', '需要钢琴伴奏'],
  ['《雷雨》', '话剧片段', '5', '钱七', '10分钟', '舞台道具', '需要背景音效'],
  ['《茉莉花》', '合唱表演', '6', '张三,李四,王五', '7分钟', '话筒三个', '需要合唱台'],
  ['《民族风》', '团体舞蹈', '7', '王五,其他舞者', '9分钟', '民族服装', '需要大型舞台']
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
    { wch: 25 }, // 选手姓名
    { wch: 10 }, // 表演时长
    { wch: 15 }, // 道具需求
    { wch: 20 }  // 特殊要求
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