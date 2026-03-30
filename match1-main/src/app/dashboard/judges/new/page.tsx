'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  password: z.string().min(6, { message: '密码至少需要6个字符' }),
  confirmPassword: z.string(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
});

type JudgeValues = z.infer<typeof judgeSchema>;

export default function NewJudgePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<JudgeValues>({
    resolver: zodResolver(judgeSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      bio: '',
      avatar: '',
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 验证文件大小 (50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('头像文件大小不能超过50MB');
        return;
      }

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }

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
      let avatarUrl = '';
      
      // 如果有头像文件，先上传头像
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        
        const uploadResponse = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          avatarUrl = uploadResult.file.id; // 存储文件ID而不是路径
        }
      }

      // 创建裁判用户
      const response = await fetch('/api/judges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          bio: data.bio,
          avatar: avatarUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '创建裁判失败');
      }

      router.push('/dashboard/judges');
    } catch (error) {
      setError(error instanceof Error ? error.message : '创建裁判时发生错误');
      console.error('Create judge error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/judges"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回裁判列表
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <CardTitle>创建新裁判</CardTitle>
          </div>
          <CardDescription>
            创建新的裁判用户，设置登录信息和个人资料
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
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage 
                      src={avatarPreview || ''} 
                      alt="头像预览"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {form.watch('name')?.slice(0, 2) || '头像'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors">
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
                      支持 JPG, PNG 格式，最大 50MB
                    </p>
                    {avatarPreview && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ 头像已选择，提交时将自动上传
                      </p>
                    )}
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
                        <Input placeholder="输入裁判姓名" {...field} />
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

              {/* 密码 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码 *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>确认密码 *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
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
                        placeholder="输入裁判的个人简介、专业背景等..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            {isLoading ? '创建中...' : '创建裁判'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 