'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { User, Mail, Calendar, Save } from 'lucide-react';
import { JudgeHeader } from '@/components/judge/JudgeHeader';

interface JudgeProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export default function JudgeProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<JudgeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/judge/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'JUDGE') {
      router.push('/judge/login');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, session, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/judge/profile');
      if (!response.ok) {
        throw new Error('获取个人信息失败');
      }
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        bio: data.bio || '',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取个人信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/judge/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('保存失败');
      }

      setSuccessMessage('个人信息保存成功！');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // 重新获取数据
      await fetchProfile();
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <JudgeHeader showBackButton title="个人信息" />
        <div className="container max-w-2xl mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <JudgeHeader showBackButton title="个人信息" />
        <div className="container max-w-2xl mx-auto p-6">
          <div className="text-center">
            <p className="text-red-500">获取个人信息失败</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <JudgeHeader showBackButton title="个人信息" />
      
      <div className="container max-w-2xl mx-auto p-6">
        {/* 成功/错误消息 */}
        {successMessage && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-800 mb-6">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 mb-6">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              个人信息
            </CardTitle>
            <CardDescription>
              查看和编辑您的个人资料信息
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 头像展示 */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage 
                  src={profile.avatar ? (
                    // 检查是否是UUID格式 (文件ID)
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(profile.avatar)
                      ? `/api/files/${profile.avatar}/preview`
                      : profile.avatar.startsWith('/uploads/')
                        ? `/api/files/preview?path=${encodeURIComponent(profile.avatar)}`
                        : profile.avatar
                  ) : ''} 
                  alt={profile.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                  {profile.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">评委</p>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="输入您的姓名"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  邮箱地址无法修改，如需更改请联系管理员
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="介绍一下您的专业背景和经验..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* 账户信息 */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">账户信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">账户角色</Label>
                  <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm">
                    评委
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">注册时间</Label>
                  <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(profile.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            </div>

            {/* 保存按钮 */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存更改'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
 