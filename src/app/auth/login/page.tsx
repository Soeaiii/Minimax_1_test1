'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: '请输入有效的电子邮箱地址' }),
  password: z.string().min(6, { message: '密码至少需要6个字符' }),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 根据URL参数设置初始错误信息
  const getInitialError = () => {
    switch (errorParam) {
      case 'access_denied':
        return '您没有权限访问该页面，请使用管理员账号登录';
      case 'CredentialsSignin':
        return '邮箱或密码不正确';
      default:
        return null;
    }
  };

  // 设置初始错误状态
  useState(() => {
    const initialError = getInitialError();
    if (initialError) {
      setError(initialError);
    }
  });

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 快速填充管理员账号（仅开发环境）
  const fillAdminCredentials = () => {
    form.setValue('email', 'admin@example.com');
    form.setValue('password', '123456');
  };

  async function onSubmit(data: LoginValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError('邮箱或密码不正确');
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError('登录时发生错误，请稍后重试');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <Trophy className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">登录</CardTitle>
        <CardDescription>
          输入您的邮箱和密码登录比赛管理系统
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>
            
            {process.env.NODE_ENV !== 'production' && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2" 
                onClick={fillAdminCredentials}
              >
                填充管理员账号
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <span>还没有账号？</span>{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            注册新账号
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function LoginFallback() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <Trophy className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">登录</CardTitle>
        <CardDescription>
          加载中...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 bg-muted animate-pulse rounded-md"></div>
          <div className="h-10 bg-muted animate-pulse rounded-md"></div>
          <div className="h-10 bg-muted animate-pulse rounded-md"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}