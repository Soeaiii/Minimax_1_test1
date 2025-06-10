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
import { LogOut, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function UserNav() {
  const { data: session } = useSession();
  const router = useRouter();

  // 处理登出
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  // 获取用户名首字母
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || '用';
  };

  // 获取用户角色中文名称
  const getRoleName = (role: string) => {
    switch (role) {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt={session.user.name || '用户'} />
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
  );
} 