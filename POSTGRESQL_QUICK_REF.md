# PostgreSQL 迁移快速参考

## 🚀 一键安装 (macOS)

```bash
# 安装 PostgreSQL
brew install postgresql@15

# 启动服务
brew services start postgresql@15

# 创建数据库
psql postgres -c "CREATE DATABASE match7;"
```

## 📝 配置文件

### .env
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/match7
```

### prisma/schema.prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🔧 常用命令

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送 schema
npx prisma db push

# 创建迁移
npx prisma migrate dev --name init

# 打开数据库管理界面
npx prisma studio

# 启动项目
npm run dev
```

## 🐛 故障排除

```bash
# 检查 PostgreSQL 状态
brew services list | grep postgresql

# 启动 PostgreSQL
brew services start postgresql@15

# 连接数据库
psql postgres

# 查看数据库列表
psql -l
```

## 📊 默认连接信息

| 项目 | 值 |
|------|-----|
| 主机 | localhost |
| 端口 | 5432 |
| 用户 | postgres |
| 密码 | password |
| 数据库 | match7 |
| 连接字符串 | postgresql://postgres:password@localhost:5432/match7 |

---

**提示**: 首次安装后，建议修改默认密码。
