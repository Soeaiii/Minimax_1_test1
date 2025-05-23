'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { UserPlus, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const judgeSchema = z.object({
  name: z.string().min(2, { message: '姓名至少需要2个字符' }),
  email: z.string().email({ message: '请输入有效的电子邮箱地址' }),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

type JudgeValues = z.infer<typeof judgeSchema>;

interface Judge {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export default function EditJudgePage() {
  const router = useRouter();
  const params = useParams();
  const judgeId = params.id as string;
  
  const [judge, setJudge] = useState<Judge | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<JudgeValues>({
    resolver: zodResolver(judgeSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      avatar: '',
    },
  });

  useEffect(() => {
    fetchJudge();
  }, [judgeId]);

  const fetchJudge = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch(`/api/judges/${judgeId}`);
      if (!response.ok) {
        throw new Error('获取评委信息失败');
      }
      const data = await response.json();
      setJudge(data);
      
      // 更新表单默认值
      form.reset({
        name: data.name,
        email: data.email,
        bio: data.bio || '',
        avatar: data.avatar || '',
      });
      
      // 设置头像预览
      if (data.avatar) {
        setAvatarPreview(data.avatar);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取评委信息失败');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: JudgeValues) {
    setIsLoading(true);
    setError(null);

    try {
      let avatarUrl = data.avatar;
      
      // 如果有新的头像文件，先上传头像
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        
        const uploadResponse = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          avatarUrl = uploadResult.url || uploadResult.path;
        }
      }

      // 更新评委信息
      const response = await fetch(`/api/judges/${judgeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          bio: data.bio,
          avatar: avatarUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新评委失败');
      }

      router.push('/dashboard/judges');
    } catch (error) {
      setError(error instanceof Error ? error.message : '更新评委时发生错误');
      console.error('Update judge error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    );
  }

  if (!judge) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <div className="text-center">
          <p className="text-red-500">评委不存在</p>
          <Link href="/dashboard/judges" className="mt-4 inline-block">
            <Button variant="outline">返回评委列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/judges"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回评委列表
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <CardTitle>编辑评委</CardTitle>
          </div>
          <CardDescription>
            修改评委的基本信息和个人资料
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* 头像上传 */}
              <div className="space-y-2">
                <Label>头像</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview || ''} />
                    <AvatarFallback>
                      {form.watch('name')?.slice(0, 2) || judge.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent">
                        <Upload className="h-4 w-4" />
                        {avatarPreview ? '更换头像' : '选择头像'}
                      </div>
                    </Label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      支持 JPG, PNG 格式，最大 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓名 *</FormLabel>
                      <FormControl>
                        <Input placeholder="输入评委姓名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱 *</FormLabel>
                      <FormControl>
                        <Input placeholder="judge@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 个人简介 */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>个人简介</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="输入评委的个人简介、专业背景等..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 只读信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">账户角色</Label>
                  <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm">
                    {judge.role === 'JUDGE' ? '评委' : judge.role}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">创建时间</Label>
                  <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm">
                    {new Date(judge.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? '保存中...' : '保存更改'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 