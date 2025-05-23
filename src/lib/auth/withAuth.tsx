'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';

export function withAuth(
  Component: React.ComponentType<any>,
  allowedRoles?: UserRole[]
) {
  return function ProtectedRoute(props: any) {
    const { data: session, status } = useSession();
    
    if (status === 'loading') {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      );
    }
    
    if (status === 'unauthenticated') {
      redirect('/auth/login?callbackUrl=' + encodeURIComponent(window.location.href));
      return null;
    }
    
    // 如果指定了角色限制，则验证用户角色
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = session?.user?.role;
      
      if (!userRole || !allowedRoles.includes(userRole)) {
        // 如果用户没有权限，重定向到无权限页面
        redirect('/unauthorized');
        return null;
      }
    }
    
    return <Component {...props} />;
  };
} 