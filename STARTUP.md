# 比赛管理系统启动指南

## 📋 项目信息
- **项目名称**: match7 (比赛管理系统)
- **技术栈**: Next.js 15.3.2 + MongoDB + Prisma + TypeScript
- **版本**: 0.1.0

## 🚀 快速启动

### 1. 环境要求
- Node.js 18.0 或更高版本
- MongoDB 数据库（本地或远程）
- npm 或 pnpm 包管理器

### 2. 安装依赖
```bash
# 进入项目目录
cd /Users/soea/progarm/Minimax_1_test1

# 安装依赖（使用 --legacy-peer-deps 解决依赖冲突）
npm install --legacy-peer-deps
```

### 3. 配置环境变量
项目根目录下的 `.env` 文件包含以下配置：

```env
# 数据库连接
DATABASE_URL=mongodb://192.168.1.103:27017/match7

# NextAuth 配置
NEXTAUTH_SECRET=match7_secret_key
NEXTAUTH_URL=http://localhost:3000
```

#### 数据库配置选项：

**选项1：使用本地数据库**
```env
DATABASE_URL=mongodb://localhost:27017/match7
```

**选项2：使用远程数据库**
```env
DATABASE_URL=mongodb://用户名:密码@服务器地址:端口/数据库名?authSource=admin
```

### 4. 启动 MongoDB 服务

#### 如果使用本地数据库：
```bash
# 安装 MongoDB（如果未安装）
brew tap mongodb/brew
brew install mongodb-community

# 启动 MongoDB 服务
brew services start mongodb/brew/mongodb-community

# 或者手动启动
mongod --config /opt/homebrew/etc/mongod.conf
```

#### 如果使用远程数据库：
确保远程 MongoDB 服务正在运行，并且可以从当前网络访问。

### 5. 初始化数据库
```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库 schema（如果数据库为空）
npx prisma db push

# 或者运行种子数据（可选）
npm run seed
```

### 6. 启动项目
```bash
# 启动开发服务器
npm run dev

# 或者使用 npx
npx next dev
```

### 7. 访问项目
打开浏览器访问：http://localhost:3000

## 📁 项目结构

```
match7/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── api/            # API 路由
│   │   ├── auth/           # 认证页面
│   │   ├── dashboard/      # 管理面板
│   │   ├── judge/          # 评委界面
│   │   └── display/        # 大屏幕显示
│   ├── components/         # React 组件
│   ├── lib/               # 工具库
│   └── generated/         # Prisma 生成的客户端
├── prisma/                # 数据库 schema 和种子数据
├── public/               # 静态资源
├── docs/                 # 文档
└── scripts/              # 脚本文件
```

## 🔧 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 数据库操作
npx prisma studio          # 打开数据库管理界面
npx prisma db push         # 推送 schema 更改
npx prisma generate        # 生成客户端
npm run seed               # 运行种子数据
```

## 🐛 常见问题

### 1. 数据库连接失败
**错误**: `ECONNREFUSED` 或 `MongoServerError`
**解决方案**:
- 检查 MongoDB 服务是否正在运行
- 验证 `.env` 文件中的数据库连接字符串
- 检查网络连接和防火墙设置

### 2. 端口 3000 被占用
**错误**: `Port 3000 is already in use`
**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000

# 终止进程
kill -9 <进程ID>

# 或者使用其他端口
PORT=3001 npm run dev
```

### 3. 依赖安装失败
**错误**: `ERESOLVE unable to resolve dependency tree`
**解决方案**:
```bash
# 使用 --legacy-peer-deps
npm install --legacy-peer-deps

# 或者清除缓存后重试
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 4. Prisma 客户端未生成
**错误**: `@prisma/client did not initialize yet`
**解决方案**:
```bash
npx prisma generate
```

### 5. SWC 编译错误
**错误**: `Failed to load SWC binary`
**解决方案**:
这通常不影响功能，只是影响编译速度。可以忽略或尝试：
```bash
rm -rf node_modules/.cache
npm run dev
```

## 🔐 默认账户

系统预设了以下测试账户：

### 管理员账户
- **邮箱**: admin@match7.com
- **密码**: admin123456

### 组织者账户
- **邮箱**: organizer@match7.com
- **密码**: organizer123

### 评委账户
- **邮箱**: judge1@match7.com
- **密码**: judge123456

## 📞 技术支持

如遇到问题，请检查：
1. 终端输出的错误信息
2. 浏览器控制台的错误
3. 项目日志文件

## 🔄 更新日志

### v0.1.0 (当前版本)
- 基础比赛管理功能
- 多租户支持
- 评委打分系统
- 大屏幕实时显示
- 文件管理
- 审计日志

---

**注意**: 首次启动可能需要一些时间来安装依赖和初始化数据库。
