import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      tenantId: string
      tenantName: string
      permissions: string[]
      avatar?: string
      isActive: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    tenantId: string
    tenantName: string
    permissions: string[]
    avatar?: string
    isActive: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    tenantId: string
    tenantName: string
    permissions: string[]
    avatar?: string
    isActive: boolean
  }
}