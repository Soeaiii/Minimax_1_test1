"use client"

import { useState, useEffect } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { UserRole } from '@/lib/types'
import { CreateUserForm } from './CreateUserForm'

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: string[]
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

interface UserListResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  error?: string
}

const ROLE_OPTIONS = [
  { value: 'all', label: '全部角色' },
  { value: 'USER', label: '普通用户' },
  { value: 'ORGANIZER', label: '组织者' },
  { value: 'JUDGE', label: '评委' },
  { value: 'ADMIN', label: '管理员' },
  { value: 'SUPER_ADMIN', label: '超级管理员' },
]

const ROLE_LABELS: Record<UserRole, string> = {
  USER: '普通用户',
  ORGANIZER: '组织者',
  JUDGE: '评委',
  ADMIN: '管理员',
  SUPER_ADMIN: '超级管理员',
}

const ROLE_COLORS: Record<UserRole, string> = {
  USER: 'default',
  ORGANIZER: 'blue',
  JUDGE: 'green',
  ADMIN: 'red',
  SUPER_ADMIN: 'purple',
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(search && { search }),
        ...(roleFilter && roleFilter !== 'all' && { role: roleFilter }),
      })

      const response = await fetch(`/api/permissions/users?${params}`)
      const data: UserListResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '获取用户列表失败')
      }

      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error(error instanceof Error ? error.message : '获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, search, roleFilter])

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value)
    setCurrentPage(1)
  }

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/permissions/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: [userId],
          updates: { isActive: !isActive },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '更新用户状态失败')
      }

      toast.success(isActive ? '用户已禁用' : '用户已激活')
      fetchUsers()
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error(error instanceof Error ? error.message : '更新用户状态失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return '从未登录'
    return formatDate(lastLogin)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>用户管理</CardTitle>
            <CardDescription>
              管理系统用户，包括创建组织者、评委等角色
            </CardDescription>
          </div>
          <CreateUserForm onUserCreated={fetchUsers} />
        </div>
      </CardHeader>
      <CardContent>
        {/* 搜索和筛选 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-sm">
            <Label htmlFor="search" className="sr-only">搜索用户</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="搜索用户姓名或邮箱..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-48">
            <Label htmlFor="role-filter" className="sr-only">角色筛选</Label>
            <Select value={roleFilter} onValueChange={handleRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="筛选角色" />
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

        {/* 用户列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户信息</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>最后登录</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        暂无用户数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ROLE_COLORS[user.role] as any}>
                            {ROLE_LABELS[user.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? '激活' : '禁用'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatLastLogin(user.lastLogin)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">打开菜单</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(user.id, user.isActive)}
                              >
                                {user.isActive ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    禁用用户
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    激活用户
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                编辑用户
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除用户
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 分页 */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  显示 {(pagination.page - 1) * pagination.limit + 1} 到{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} 条，
                  共 {pagination.total} 条记录
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    上一页
                  </Button>
                  <div className="text-sm">
                    第 {pagination.page} 页，共 {pagination.pages} 页
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                    disabled={currentPage === pagination.pages}
                  >
                    下一页
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}