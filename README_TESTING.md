# Playwright 测试说明

## 项目测试配置

### 配置文件
- `playwright.config.js` - Playwright 测试配置文件
  - 测试目录: `./tests`
  - 启动命令: `npm run dev`
  - 目标URL: `http://localhost:3000`

### 测试运行
```bash
# 运行所有测试
npx playwright test

# 运行指定测试文件
npx playwright tests/homepage.spec.js

# 带界面运行（便于调试）
npx playwright test --headed

# 列出所有测试
npx playwright test --list
```

### 测试文件结构
- `tests/homepage.spec.js` - 首页加载测试
- `tests/dashboard.spec.js` - 仪表盘页面测试
- `tests/auth.spec.js` - 认证页面测试
- `tests/participants.spec.js` - 参与者页面测试

## 已知问题/修复

### 1. 标题匹配问题
- **问题**: 页面标题是中文 "比赛管理系统"，而非正则 `/Match7/`
- **修复**: 更新测试断言为正则表达式 `/比赛管理系统|Match7/`

### 2. 登录页标题问题  
- **问题**: 登录页标题也是中文，需要匹配中文或英文
- **修复**: 更新测试断言为正则 `/登录|注册|Login|Register/`

### 3. 默认测试
- 为防止未配置 WebServer 时报错，设置了 `webServer` 配置自动启动开发服务器
- 添加了基础的页面可见性测试确保应用可以访问

## 测试覆盖建议

建议增加以下测试:
- 表单验证测试
- API 交互测试
- 权限控制测试（未登录访问受限页面）
- 响应式布局测试
