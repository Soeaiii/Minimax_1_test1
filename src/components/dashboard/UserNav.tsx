'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Building2 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Tenant {
  id: string;
  name: string;
  isActive: boolean;
}

export function UserNav() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(false);

  const avatarSrc =
    typeof session?.user?.avatar === 'string' && session.user.avatar.trim().length > 0
      ? session.user.avatar
      : undefined;

  // 判断是否为 SUPER_ADMIN
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

  // 获取租户列表
  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchTenants = async () => {
      setLoadingTenants(true);
      try {
        const res = await fetch('/api/admin/tenants?pageSize=100&isActive=true');
        const data = await res.json();
        if (data.data) {
          setTenants(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
      } finally {
        setLoadingTenants(false);
      }
    };

    fetchTenants();
  }, [isSuperAdmin]);

  // 处理登出
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  // 处理租户切换
  const handleTenantSwitch = async (tenantId: string) => {
    try {
      const res = await fetch('/api/admin/switch-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
      });

      if (res.ok) {
        const data = await res.json();
        // 切换后需要重新登录以刷新 JWT token
        await signOut({ redirect: false });
        router.push(`/auth/login?switched=${encodeURIComponent(data.tenantName)}`);
      } else {
        const data = await res.json();
        alert(data.error || '切换租户失败');
      }
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      alert('切换租户失败');
    }
  };

  // 获取用户名首字母
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || '用';
  };

  // 获取用户角色中文名称
  const getRoleName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return '超级管理员';
      case 'ADMIN':
        return '管理员';
      case 'ORGANIZER':
        return '组织者';
      case 'JUDGE':
        return '评委';
      default:
        return '用户';
    }
  };

  if (!session?.user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/login">登录</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* 租户切换器 - 仅 SUPER_ADMIN 显示 */}
      {isSuperAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="max-w-[120px] truncate">
                {session.user.tenantName || '选择租户'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">切换租户</p>
                <p className="text-xs text-muted-foreground">
                  当前: {session.user.tenantName || '无'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {loadingTenants ? (
              <DropdownMenuItem disabled>加载中...</DropdownMenuItem>
            ) : tenants.length > 0 ? (
              tenants.map((tenant) => (
                <DropdownMenuItem
                  key={tenant.id}
                  onClick={() => handleTenantSwitch(tenant.id)}
                  className={
                    tenant.id === session.user.tenantId
                      ? 'bg-accent cursor-default'
                      : 'cursor-pointer'
                  }
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span className="flex-1 truncate">{tenant.name}</span>
                  {tenant.id === session.user.tenantId && (
                    <span className="text-xs text-muted-foreground ml-2">当前</span>
                  )}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>暂无活跃租户</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarSrc} alt={session.user.name || '用户'} />
              <AvatarFallback>{getInitials(session.user.name || '')}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                {getRoleName(session.user.role)}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              <span>个人信息</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}