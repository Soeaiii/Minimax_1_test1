'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, ArrowLeftRight, Home } from 'lucide-react';
import { toast } from 'sonner';

interface Tenant {
  id: string;
  name: string;
  domain: string | null;
  isActive: boolean;
}

export function TenantSwitcher() {
  const { data: session } = useSession();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [switching, setSwitching] = useState(false);

  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';
  const isViewingOtherTenant = session?.user?.homeTenantId !== session?.user?.tenantId;

  useEffect(() => {
    if (!isSuperAdmin) return;
    fetch('/api/admin/tenants?pageSize=100')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setTenants(d.data || []))
      .catch(() => {});
  }, [isSuperAdmin]);

  const switchTenant = async (tenantId: string, tenantName: string) => {
    if (tenantId === session?.user?.tenantId) return;
    setSwitching(true);
    try {
      const res = await fetch('/api/admin/switch-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || '切换失败');
        return;
      }

      toast.success(`已切换到: ${tenantName}`);

      // 重新触发登录以刷新 JWT token（最可靠的方式）
      // 使用 cookie 中的 session 重新获取 token
      const refreshRes = await fetch('/api/auth/session', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });
      
      // 强制全页刷新以加载新 session
      window.location.reload();
    } catch {
      toast.error('切换失败');
    } finally {
      setSwitching(false);
    }
  };

  const goHome = async () => {
    setSwitching(true);
    try {
      const res = await fetch('/api/admin/switch-tenant', { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || '已切回原始租户');
        window.location.reload();
      }
    } catch {
      toast.error('切回失败');
    } finally {
      setSwitching(false);
    }
  };

  if (!isSuperAdmin) return null;

  return (
    <div className="flex items-center gap-2">
      {isViewingOtherTenant && (
        <Button variant="ghost" size="sm" onClick={goHome} disabled={switching} className="text-xs gap-1">
          <Home className="h-3 w-3" />
          回到原始租户
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2" disabled={switching}>
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span className="max-w-[120px] truncate">{session?.user?.tenantName || '切换租户'}</span>
            {isViewingOtherTenant && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">代理</Badge>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            切换租户上下文
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-72 overflow-y-auto">
            {tenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onClick={() => switchTenant(tenant.id, tenant.name)}
                disabled={!tenant.isActive || switching}
                className={`flex items-center justify-between ${tenant.id === session?.user?.tenantId ? 'bg-accent' : ''}`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{tenant.name}</span>
                  <span className="text-xs text-muted-foreground">{tenant.domain || '无域名'}</span>
                </div>
                <div className="flex items-center gap-1">
                  {!tenant.isActive && <Badge variant="destructive" className="text-[10px]">已停用</Badge>}
                  {tenant.id === session?.user?.tenantId && <Badge variant="default" className="text-[10px]">当前</Badge>}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
