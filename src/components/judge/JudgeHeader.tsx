'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scale, User, LogOut, Home } from 'lucide-react';
import Link from 'next/link';

interface JudgeHeaderProps {
  showBackButton?: boolean;
  title?: string;
}

export function JudgeHeader({ 
  showBackButton = false, 
  title = "评委打分系统" 
}: JudgeHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // 处理退出登录
  const handleSignOut = async () => {
    await signOut({ 
      redirect: false,
      callbackUrl: '/judge/login'
    });
    router.push('/judge/login');
  };

  const displayName = session?.user?.name || '评委';
  const displayAvatar = session?.user?.image || undefined;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          
          {showBackButton && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/judge/dashboard">
                <Home className="h-4 w-4 mr-2" />
                返回主页
              </Link>
            </Button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage 
                  src={displayAvatar} 
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {displayName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  评委
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/judge/dashboard">
                <Home className="mr-2 h-4 w-4" />
                <span>返回主页</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/judge/profile">
                <User className="mr-2 h-4 w-4" />
                <span>个人信息</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>退出登录</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 