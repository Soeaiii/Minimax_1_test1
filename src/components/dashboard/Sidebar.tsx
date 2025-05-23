'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Trophy, 
  ListMusic, 
  Users, 
  FileText, 
  Settings,
  FileUp,
  Scale,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { href: '/dashboard/competitions', label: '比赛管理', icon: Trophy },
  { href: '/dashboard/programs', label: '节目管理', icon: ListMusic },
  { href: '/dashboard/participants', label: '选手管理', icon: Users },
  { href: '/dashboard/judges', label: '裁判管理', icon: Scale },
  { href: '/dashboard/display', label: '大屏幕管理', icon: Monitor },
  { href: '/dashboard/audit-logs', label: '审计日志', icon: FileText },
  { href: '/dashboard/files', label: '文件管理', icon: FileUp },
  { href: '/dashboard/settings', label: '设置', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Trophy className="h-6 w-6" />
          <span>比赛管理系统</span>
        </Link>
      </div>
      <nav className="grid items-start px-4 text-sm font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                pathname === item.href
                  ? 'bg-muted text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 