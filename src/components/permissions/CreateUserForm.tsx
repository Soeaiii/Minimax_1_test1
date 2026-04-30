"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { UserPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { UserRole } from '@/lib/types'

interface CreateUserFormProps {
  onUserCreated?: () => void
}

interface FormData {
  name: string
  email: string
  password: string
  role: UserRole
  permissions: string[]
  isActive: boolean
}

const ROLE_OPTIONS = [
  { value: 'USER', label: '普通用户' },
  { value: 'ORGANIZER', label: '组织者' },
  { value: 'JUDGE', label: '评委' },
  { value: 'ADMIN', label: '管理员' },
  { value: 'SUPER_ADMIN', label: '超级管理员' },
]

const PERMISSION_GROUPS = [
  {
    name: '用户管理',
    permissions: [
      { key: 'user:create', label: '创建用户' },
      { key: 'user:read', label: '查看用户' },
      { key: 'user:update', label: '更新用户' },
      { key: 'user:delete', label: '删除用户' },
    ],
  },
  {
    name: '比赛管理',
    permissions: [
      { key: 'competition:create', label: '创建比赛' },
      { key: 'competition:read', label: '查看比赛' },
      { key: 'competition:update', label: '更新比赛' },
      { key: 'competition:delete', label: '删除比赛' },
      { key: 'competition:manage', label: '管理比赛' },
    ],
  },
  {
    name: '节目管理',
    permissions: [
      { key: 'program:create', label: '创建节目' },
      { key: 'program:read', label: '查看节目' },
      { key: 'program:update', label: '更新节目' },
      { key: 'program:delete', label: '删除节目' },
    ],
  },
  {
    name: '参赛者管理',
    permissions: [
      { key: 'participant:create', label: '创建参赛者' },
      { key: 'participant:read', label: '查看参赛者' },
      { key: 'participant:update', label: '更新参赛者' },
      { key: 'participant:delete', label: '删除参赛者' },
    ],
  },
  {
    name: '评分管理',
    permissions: [
      { key: 'score:create', label: '创建评分' },
      { key: 'score:read', label: '查看评分' },
      { key: 'score:update', label: '更新评分' },
      { key: 'score:delete', label: '删除评分' },
    ],
  },
  {
    name: '评委管理',
    permissions: [
      { key: 'judge:assign', label: '分配评委' },
      { key: 'judge:remove', label: '移除评委' },
    ],
  },
  {
    name: '系统管理',
    permissions: [
      { key: 'system:settings', label: '系统设置' },
      { key: 'data:export', label: '数据导出' },
      { key: 'audit:read', label: '查看审计日志' },
    ],
  },
]

export function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    permissions: [],
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('请填写所有必填字段')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/permissions/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '创建用户失败')
      }

      toast.success('用户创建成功')
      setOpen(false)
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        permissions: [],
        isActive: true,
      })
      onUserCreated?.()
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error(error instanceof Error ? error.message : '创建用户失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: getDefaultPermissions(role),
    }))
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission),
    }))
  }

  const getDefaultPermissions = (role: UserRole): string[] => {
    switch (role) {
      case 'SUPER_ADMIN':
        return [
          ...PERMISSION_GROUPS.flatMap(group => group.permissions.map(p => p.key)),
          'system:tenants',
        ]
      case 'ADMIN':
        return PERMISSION_GROUPS.flatMap(group => group.permissions.map(p => p.key))
      case 'ORGANIZER':
        return [
          'competition:create', 'competition:read', 'competition:update', 'competition:manage',
          'program:create', 'program:read', 'program:update', 'program:delete',
          'participant:create', 'participant:read', 'participant:update', 'participant:delete',
          'judge:assign', 'judge:remove',
          'score:read', 'data:export',
        ]
      case 'JUDGE':
        return [
          'competition:read', 'program:read', 'participant:read',
          'score:create', 'score:read', 'score:update',
        ]
      case 'USER':
        return [
          'competition:read', 'program:read', 'participant:read', 'score:read',
        ]
      default:
        return []
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          创建用户
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建新用户</DialogTitle>
          <DialogDescription>
            创建新用户并分配相应的角色和权限
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入姓名"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">邮箱 *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="请输入邮箱地址"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">密码 *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="请输入密码（至少6位）"
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">角色 *</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isActive: checked as boolean }))
                }
              />
              <Label htmlFor="isActive">激活用户</Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>权限配置</Label>
            <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto border rounded-lg p-4">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.name} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">{group.name}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {group.permissions.map((permission) => (
                      <div key={permission.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.key}
                          checked={formData.permissions.includes(permission.key)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.key, checked as boolean)
                          }
                        />
                        <Label htmlFor={permission.key} className="text-sm">
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              创建用户
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}