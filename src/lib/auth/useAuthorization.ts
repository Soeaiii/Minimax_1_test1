import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/types';

export function useAuthorization(allowedRoles: UserRole[]) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // 如果会话已加载完成且用户未认证，重定向到登录页面
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }
    
    // 如果会话已加载完成且用户已认证，但角色不在允许的列表中，重定向到未授权页面
    if (status === 'authenticated' && session?.user?.role) {
      if (!allowedRoles.includes(session.user.role as UserRole)) {
        router.push('/unauthorized');
      }
    }
  }, [status, session, router, allowedRoles]);
  
  return {
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
    hasPermission: 
      status === 'authenticated' && 
      session?.user?.role && 
      allowedRoles.includes(session.user.role as UserRole),
  };
}