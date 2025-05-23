'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function JudgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // 检查是否是登录页面
  const isLoginPage = pathname === '/judge/login';

  useEffect(() => {
    // 如果是登录页面，不进行权限检查
    if (isLoginPage) return;
    
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      // 未登录重定向到裁判登录页
      router.push('/judge/login');
      return;
    }
    
    if (session?.user?.role === 'ADMIN') {
      // 管理员重定向到管理员仪表盘
      router.push('/dashboard');
      return;
    }
    
    if (session?.user?.role !== 'JUDGE') {
      // 非裁判用户重定向到裁判登录页
      router.push('/judge/login?error=access_denied');
      return;
    }
  }, [status, session, router, isLoginPage]);

  // 如果是登录页面，直接渲染子组件
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 加载中状态
  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">正在加载...</p>
        </div>
      </div>
    );
  }

  // 未登录或非裁判用户
  if (status === 'unauthenticated' || session?.user?.role !== 'JUDGE') {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">正在验证权限...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 