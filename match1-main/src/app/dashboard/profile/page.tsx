'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Save,
  Edit,
  Shield,
  Mail,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Eye,
  EyeOff,
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const profileForm = useForm<UserProfile>({
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      role: '',
      avatar: '',
    },
  });

  const passwordForm = useForm<PasswordChange>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 加载用户资料
  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (session?.user) {
        profileForm.reset({
          name: session.user.name || '',
          email: session.user.email || '',
          bio: (session.user as any).bio || '',
          role: session.user.role || '',
          avatar: (session.user as any).avatar || '',
        });
      }
    } catch (error) {
      console.error('加载用户资料失败:', error);
      setError('加载用户资料失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, session]);

  // 保存用户资料
  const onSaveProfile = async (data: UserProfile) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          bio: data.bio,
        }),
      });

      if (!response.ok) {
        throw new Error('保存用户资料失败');
      }

      const updatedUser = await response.json();
      
      // 更新session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: updatedUser.name,
          bio: updatedUser.bio,
        },
      });

      setSuccessMessage('用户资料保存成功！');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 修改密码
  const onChangePassword = async (data: PasswordChange) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        setError('新密码和确认密码不匹配');
        return;
      }

      if (data.newPassword.length < 8) {
        setError('新密码长度至少8位');
        return;
      }

      setSaving(true);
      setError(null);

      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '修改密码失败');
      }

      setSuccessMessage('密码修改成功！');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // 重置密码表单
      passwordForm.reset();
      setShowPasswordFields(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : '修改密码失败');
    } finally {
      setSaving(false);
    }
  };

  // 获取角色名称
  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '系统管理员';
      case 'ORGANIZER':
        return '组织者';
      case 'JUDGE':
        return '评委';
      case 'USER':
        return '普通用户';
      default:
        return '未知角色';
    }
  };

  // 获取角色颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'ORGANIZER':
        return 'default';
      case 'JUDGE':
        return 'secondary';
      case 'USER':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex h-32 items-center justify-center">
          <div className="text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">加载用户资料中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <p className="text-muted-foreground">请先登录</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <User className="h-8 w-8 mr-3" />
            个人资料
          </h1>
          <p className="text-muted-foreground">管理您的个人信息和账户设置</p>
        </div>
      </div>

      {/* 成功/错误消息 */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 用户信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              用户信息
            </CardTitle>
            <CardDescription>您的基本信息概览</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{session?.user?.name}</h3>
                <p className="text-muted-foreground text-sm">{session?.user?.email}</p>
                <Badge variant={getRoleColor(session?.user?.role || 'USER') as any} className="mt-1">
                  {getRoleName(session?.user?.role || 'USER')}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">账户状态</span>
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  正常
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">注册时间</span>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date((session?.user as any)?.createdAt || Date.now()).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">邮箱状态</span>
                <Badge variant="secondary">
                  <Mail className="h-3 w-3 mr-1" />
                  已验证
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 编辑资料 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              编辑资料
            </CardTitle>
            <CardDescription>更新您的个人信息</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    {...profileForm.register('name')}
                    placeholder="请输入您的姓名"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register('email')}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">邮箱地址不可修改</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  {...profileForm.register('bio')}
                  placeholder="介绍一下您自己..."
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存资料'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 安全设置 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              安全设置
            </CardTitle>
            <CardDescription>管理您的账户安全</CardDescription>
          </CardHeader>
          <CardContent>
            {!showPasswordFields ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">密码</h3>
                    <p className="text-sm text-muted-foreground">定期更改密码以保护账户安全</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordFields(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    修改密码
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">当前密码</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...passwordForm.register('currentPassword')}
                      placeholder="请输入当前密码"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">新密码</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      {...passwordForm.register('newPassword')}
                      placeholder="请输入新密码（至少8位）"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认新密码</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    placeholder="请再次输入新密码"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? '修改中...' : '修改密码'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPasswordFields(false);
                      passwordForm.reset();
                      setError(null);
                    }}
                  >
                    取消
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 