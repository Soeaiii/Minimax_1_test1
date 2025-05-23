# 比赛管理系统 (Match7)

基于Next.js 15和Prisma的比赛管理系统，用于管理各类比赛的节目、选手、评分和排名。

## 技术栈

- **前端**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **UI组件**: shadcn/ui
- **状态管理**: React Hooks
- **表单处理**: React Hook Form, Zod
- **数据库**: MongoDB
- **ORM**: Prisma
- **包管理**: pnpm

## 主要功能

- **比赛管理**: 创建、编辑、归档比赛
- **节目管理**: 创建、编辑、删除节目，管理节目状态
- **选手管理**: 创建、编辑、删除选手，将选手关联到节目
- **评分系统**: 设置评分标准，评委打分
- **排名管理**: 自动计算排名，支持手动调整
- **审计日志**: 记录所有关键操作

## 角色

- **管理员**: 全部功能访问权限
- **组织者**: 管理自己创建的比赛
- **评委**: 为指定比赛的节目评分
- **用户**: 查看公开比赛信息

## 项目结构

```
match7/
  ├── prisma/           # 数据库模型和迁移
  ├── public/           # 静态资源
  ├── src/
  │   ├── app/          # 页面和API路由
  │   │   ├── api/      # API路由
  │   │   └── dashboard/ # 仪表盘页面
  │   ├── components/   # React组件
  │   │   ├── dashboard/ # 仪表盘组件
  │   │   └── ui/       # UI组件
  │   ├── lib/          # 工具函数和类型定义
  │   └── generated/    # 生成的Prisma客户端
  └── package.json
```

## 安装和运行

1. 安装依赖
```bash
pnpm install
```

2. 配置环境变量，创建`.env`文件:
```
DATABASE_URL="mongodb://username:password@localhost:27017/match7"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

3. 生成Prisma客户端
```bash
pnpm prisma generate
```

4. 运行开发服务器
```bash
pnpm dev
```

## 已完成功能

- [x] 数据库模型设计
- [x] 基础页面布局
- [x] 比赛管理页面
- [x] 比赛创建表单
- [x] 比赛详情页面
- [x] 节目管理页面
- [x] 选手管理页面
- [x] API路由实现
- [x] 数据获取逻辑

## 待实现功能

- [ ] 用户认证 (NextAuth.js)
- [ ] 文件上传功能
- [ ] 实时排名更新
- [ ] 权限管理
- [ ] 评委评分界面
- [ ] 移动端适配优化
- [ ] 通知系统
- [ ] 多语言支持

## 贡献

欢迎贡献代码或提出建议，请提交Pull Request或Issue。
