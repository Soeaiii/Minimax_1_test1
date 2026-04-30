'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Trophy,
  ListMusic,
  Users,
  FileText,
  FileUp,
  Scale,
  Monitor,
  Shield,
  Settings,
  UserCheck,
  Database,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/lib/auth/usePermissions';
import { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  requiredRole?: UserRole;
  requiredPermissions?: string[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { href: '/dashboard/competitions', label: '比赛管理', icon: Trophy },
  { href: '/dashboard/programs', label: '节目管理', icon: ListMusic },
  { href: '/dashboard/participants', label: '选手管理', icon: Users },
  { href: '/dashboard/judges', label: '裁判管理', icon: Scale },
  { href: '/dashboard/display', label: '大屏幕管理', icon: Monitor },
  { href: '/dashboard/audit-logs', label: '审计日志', icon: FileText },
  { href: '/dashboard/files', label: '文件管理', icon: FileUp },
  {
    href: '/dashboard/tenants',
    label: '租户管理',
    icon: Building2,
    requiredRole: 'SUPER_ADMIN',
  },
  {
    href: '/dashboard/permissions',
    label: '权限管理',
    icon: Shield,
    requiredRole: 'ADMIN',
    children: [
      {
        href: '/dashboard/permissions/roles',
        label: '角色管理',
        icon: UserCheck,
        requiredRole: 'ADMIN',
      },
      {
        href: '/dashboard/permissions/users',
        label: '用户权限',
        icon: Users,
        requiredRole: 'ADMIN',
      },
      {
        href: '/dashboard/permissions/data-access',
        label: '数据访问',
        icon: Database,
        requiredRole: 'ADMIN',
      },
      {
        href: '/dashboard/permissions/settings',
        label: '系统设置',
        icon: Settings,
        requiredRole: 'ADMIN',
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { checkPermission, isAdmin, isAnyAdmin, isOrganizer } = usePermissions();

  // 检查菜单项是否可见
  const isMenuItemVisible = (item: NavItem): boolean => {
    // 如果有角色要求，检查用户角色
    if (item.requiredRole) {
      if (item.requiredRole === 'ADMIN' && !isAnyAdmin) return false;
      if (item.requiredRole === 'ORGANIZER' && !isOrganizer && !isAnyAdmin) return false;
      if (item.requiredRole === 'SUPER_ADMIN' && session?.user?.role !== 'SUPER_ADMIN') return false;
    }

    // 如果有权限要求，检查用户权限
    if (item.requiredPermissions) {
      return item.requiredPermissions.some(permission => {
        // 假设权限格式为 "resource:action"
        const [resource, action] = permission.split(':');
        return checkPermission(resource, action).hasPermission;
      });
    }

    return true;
  };

  // 检查路径是否匹配（包括子路径）
  const isPathActive = (href: string, children?: NavItem[]): boolean => {
    if (pathname === href) return true;
    if (children) {
      return children.some(child => pathname.startsWith(child.href));
    }
    return pathname.startsWith(href) && href !== '/dashboard';
  };

  return (
    <aside className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Trophy className="h-6 w-6" />
          <span>比赛管理系统</span>
        </Link>
      </div>
      <nav className="grid items-start px-4 text-sm font-medium">
        {navItems
          .filter(isMenuItemVisible)
          .map((item) => {
            const Icon = item.icon;
            const isActive = isPathActive(item.href, item.children);
            
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                    isActive
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
                
                {/* 子菜单 */}
                {item.children && isActive && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children
                      .filter(isMenuItemVisible)
                      .map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-1.5 text-xs transition-all hover:text-primary',
                              pathname === child.href
                                ? 'bg-muted text-primary font-medium'
                                : 'text-muted-foreground'
                            )}
                          >
                            <ChildIcon className="h-3 w-3" />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
      </nav>
    </aside>
  );
}