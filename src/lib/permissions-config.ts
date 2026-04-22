import { prisma } from '@/lib/prisma'

export interface PermissionPolicy {
  id: string
  name: string
  description: string
  enabled: boolean
  config: Record<string, unknown>
  updatedAt: string
}

export interface SecurityConfig {
  sessionTimeout: number
  maxLoginAttempts: number
  lockoutDuration: number
  passwordMinLength: number
  passwordRequireSpecial: boolean
  passwordRequireNumbers: boolean
  passwordRequireUppercase: boolean
  twoFactorRequired: boolean
  ipWhitelistEnabled: boolean
  ipWhitelist: string[]
  auditLogRetention: number
  dataEncryptionEnabled: boolean
}

export interface AuditConfig {
  enabled: boolean
  logLevel: 'basic' | 'detailed' | 'verbose'
  retentionDays: number
  realTimeAlerts: boolean
  emailNotifications: boolean
  notificationEmail: string
  loggedActions: string[]
  excludedUsers: string[]
  autoArchive: boolean
  archiveThreshold: number
}

export interface DataAccessRule {
  id: string
  resource: string
  role: 'ADMIN' | 'ORGANIZER' | 'JUDGE' | 'USER'
  scope: 'all' | 'own' | 'assigned' | 'public'
  conditions?: Record<string, unknown>
  enabled: boolean
  createdAt: string
  updatedAt: string
}

const now = () => new Date().toISOString()

export const defaultPolicies = (): PermissionPolicy[] => [
  {
    id: 'tenant-isolation',
    name: '租户隔离',
    description: '限制用户只能访问所属租户的数据',
    enabled: true,
    config: { strict: true },
    updatedAt: now(),
  },
  {
    id: 'judge-assignment',
    name: '评委分配校验',
    description: '评委仅能访问被分配的比赛与节目',
    enabled: true,
    config: { requireAssignment: true },
    updatedAt: now(),
  },
  {
    id: 'audit-required',
    name: '敏感操作审计',
    description: '对权限与系统配置变更记录审计日志',
    enabled: true,
    config: { resources: ['system', 'permissions', 'users'] },
    updatedAt: now(),
  },
]

export const defaultSecurityConfig = (): SecurityConfig => ({
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  passwordMinLength: 6,
  passwordRequireSpecial: false,
  passwordRequireNumbers: true,
  passwordRequireUppercase: false,
  twoFactorRequired: false,
  ipWhitelistEnabled: false,
  ipWhitelist: [],
  auditLogRetention: 90,
  dataEncryptionEnabled: true,
})

export const defaultAuditConfig = (): AuditConfig => ({
  enabled: true,
  logLevel: 'detailed',
  retentionDays: 90,
  realTimeAlerts: false,
  emailNotifications: false,
  notificationEmail: '',
  loggedActions: ['login', 'logout', 'permission_change', 'data_access', 'system_config'],
  excludedUsers: [],
  autoArchive: true,
  archiveThreshold: 10000,
})

export const defaultDataAccessRules = (): DataAccessRule[] => [
  {
    id: 'admin-all',
    resource: 'system',
    role: 'ADMIN',
    scope: 'all',
    enabled: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'organizer-competition-own',
    resource: 'competition',
    role: 'ORGANIZER',
    scope: 'own',
    enabled: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'judge-program-assigned',
    resource: 'program',
    role: 'JUDGE',
    scope: 'assigned',
    enabled: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'user-public-read',
    resource: 'competition',
    role: 'USER',
    scope: 'public',
    enabled: true,
    createdAt: now(),
    updatedAt: now(),
  },
]

type TenantSettings = Record<string, unknown> & {
  permissionPolicies?: PermissionPolicy[]
  securityConfig?: SecurityConfig
  auditConfig?: AuditConfig
  dataAccessRules?: DataAccessRule[]
}

export async function getPermissionSettings(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { settings: true },
  })

  const settings = (tenant?.settings ?? {}) as TenantSettings

  return {
    settings,
    policies: settings.permissionPolicies ?? defaultPolicies(),
    securityConfig: settings.securityConfig ?? defaultSecurityConfig(),
    auditConfig: settings.auditConfig ?? defaultAuditConfig(),
    dataAccessRules: settings.dataAccessRules ?? defaultDataAccessRules(),
  }
}

export async function updatePermissionSettings(
  tenantId: string,
  partial: Partial<{
    permissionPolicies: PermissionPolicy[]
    securityConfig: SecurityConfig
    auditConfig: AuditConfig
    dataAccessRules: DataAccessRule[]
  }>
) {
  const current = await getPermissionSettings(tenantId)
  const nextSettings: TenantSettings = {
    ...current.settings,
    permissionPolicies: partial.permissionPolicies ?? current.policies,
    securityConfig: partial.securityConfig ?? current.securityConfig,
    auditConfig: partial.auditConfig ?? current.auditConfig,
    dataAccessRules: partial.dataAccessRules ?? current.dataAccessRules,
  }

  await prisma.tenant.update({
    where: { id: tenantId },
    data: { settings: nextSettings },
  })

  return nextSettings
}
