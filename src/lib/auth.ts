import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { ROLE_PERMISSIONS } from "@/lib/auth/permissions";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "凭证登录",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            isActive: true,
            isDeleted: false
          },
          include: {
            tenant: true
          }
        });

        if (!user || !user.password) {
          return null;
        }

        // 检查租户状态（如果租户存在且有租户ID才检查）
        if (user.tenantId && user.tenant && !user.tenant.isActive) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        // 更新最后登录时间
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        });

        // 获取角色权限
        const rolePermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
        const rolePermissionStrings = rolePermissions.map(p => `${p.resource}:${p.action}`);
        // user.permissions 已经是 Prisma JSON 字段解析后的对象，无需再 JSON.parse
        // 过滤掉非字符串值，确保类型安全
        const userPermissions = Array.isArray(user.permissions)
          ? user.permissions.filter((p): p is string => typeof p === 'string')
          : [];
        const allPermissions = [...new Set([...rolePermissionStrings, ...userPermissions])];

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: user.tenant.name,
          permissions: allPermissions,
          avatar: user.avatar || undefined,
          isActive: user.isActive
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.tenantName = user.tenantName;
        token.permissions = user.permissions;
        token.avatar = user.avatar;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.tenantId = token.tenantId;
        session.user.tenantName = token.tenantName;
        session.user.permissions = token.permissions;
        session.user.avatar = token.avatar;
        session.user.isActive = token.isActive;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};