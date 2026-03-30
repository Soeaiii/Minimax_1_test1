'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // 等待会话加载
    
    if (status === 'unauthenticated') {
      // 未登录，重定向到登录页
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role === 'ADMIN') {
      // 管理员重定向到仪表盘
      router.push('/dashboard');
    } else if (session?.user?.role === 'JUDGE') {
      // 裁判重定向到裁判仪表盘
      router.push('/judge/dashboard');
    } else {
      // 其他角色重定向到登录页
      router.push('/auth/login');
    }
  }, [status, session, router]);

  // 显示加载状态
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">正在跳转...</p>
      </div>
    </div>
  );
}
