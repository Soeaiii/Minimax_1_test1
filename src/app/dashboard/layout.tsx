'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      // 未登录重定向到登录页
      router.push('/auth/login?callbackUrl=/dashboard');
      return;
    }
    
    if (session?.user?.role === 'JUDGE') {
      // 裁判用户重定向到裁判仪表盘
      router.push('/judge/dashboard');
      return;
    }

    // 检查用户是否有访问dashboard的权限
    const allowedRoles = ['ADMIN', 'ORGANIZER', 'SUPER_ADMIN'];
    if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
      // 无权限用户重定向到登录页
      router.push('/auth/login?error=access_denied');
      return;
    }
  }, [status, session, router]);
  
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
  
  // 未登录或无权限用户
  const allowedRoles = ['ADMIN', 'ORGANIZER', 'SUPER_ADMIN'];
  if (status === 'unauthenticated' || !session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">正在验证权限...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}