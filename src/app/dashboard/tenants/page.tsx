'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Building2, MoreHorizontal, Power, PowerOff } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { toast } from "sonner";

interface Tenant {
  id: string;
  name: string;
  domain: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  settings: Record<string, unknown>;
  userCount: number;
  competitionCount: number;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function TenantsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [toggling, setToggling] = useState(false);

  // 获取租户列表
  const fetchTenants = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', pagination.pageSize.toString());
      if (searchTerm) params.set('search', searchTerm);

      const statusFilter = searchParams.get('isActive');
      if (statusFilter) params.set('isActive', statusFilter);

      const response = await fetch(`/api/admin/tenants?${params.toString()}`);

      if (!response.ok) {
        throw new Error('获取租户列表失败');
      }

      const data = await response.json();
      setTenants(data.data || []);
      setPagination(data.pagination || {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
      });
      setError(null);
    } catch (error) {
      console.error('获取租户列表失败:', error);
      setError(error instanceof Error ? error.message : '获取租户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 检查用户权限
  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login?callbackUrl=/dashboard/tenants');
      return;
    }

    if (session.user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchTenants();
  }, [session, status, router, searchParams]);

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTenants(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 切换租户状态
  const handleToggleStatus = async () => {
    if (!selectedTenant) return;

    try {
      setToggling(true);
      const response = await fetch(`/api/admin/tenants/${selectedTenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !selectedTenant.isActive }),
      });

      if (!response.ok) {
        throw new Error('更新租户状态失败');
      }

      // 更新本地状态
      setTenants(prev =>
        prev.map(t =>
          t.id === selectedTenant.id ? { ...t, isActive: !t.isActive } : t
        )
      );

      toast.success(selectedTenant.isActive ? '租户已停用' : '租户已启用');
      setToggleDialogOpen(false);
      setSelectedTenant(null);
    } catch (error) {
      console.error('更新租户状态失败:', error);
      toast.error('更新租户状态失败，请稍后重试');
    } finally {
      setToggling(false);
    }
  };

  // 状态过滤
  const statusFilter = searchParams.get('isActive');

  // 获取租户状态标签
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">活跃</Badge>
    ) : (
      <Badge variant="secondary">已停用</Badge>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-destructive bg-destructive/10 p-6 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">加载失败</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchTenants()}>重新加载</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">租户管理</h1>
        <Button asChild>
          <Link href="/dashboard/tenants/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            创建租户
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索租户名称或域名..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/tenants"
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              !statusFilter ? "bg-muted font-medium" : "hover:bg-muted"
            }`}
          >
            全部
          </Link>
          <Link
            href="/dashboard/tenants?isActive=true"
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              statusFilter === "true" ? "bg-muted font-medium" : "hover:bg-muted"
            }`}
          >
            活跃
          </Link>
          <Link
            href="/dashboard/tenants?isActive=false"
            className={`px-3 py-2 text-sm rounded-md transition-colors ${
              statusFilter === "false" ? "bg-muted font-medium" : "hover:bg-muted"
            }`}
          >
            已停用
          </Link>
        </div>
      </div>

      {tenants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchTerm ? '没有找到匹配的租户' : '当前没有租户数据'}
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/dashboard/tenants/new">创建第一个租户</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>域名</TableHead>
                <TableHead>用户数</TableHead>
                <TableHead>比赛数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow
                  key={tenant.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/dashboard/tenants/${tenant.id}`)}
                >
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.domain || '-'}</TableCell>
                  <TableCell>{tenant.userCount}</TableCell>
                  <TableCell>{tenant.competitionCount}</TableCell>
                  <TableCell>{getStatusBadge(tenant.isActive)}</TableCell>
                  <TableCell>
                    {format(new Date(tenant.createdAt), 'yyyy-MM-dd HH:mm')}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/tenants/${tenant.id}`}>
                            查看详情
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setToggleDialogOpen(true);
                          }}
                        >
                          {tenant.isActive ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-2" />
                              停用租户
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              启用租户
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {pagination.total} 条记录，第 {pagination.page}/{pagination.totalPages} 页
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTenants(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchTenants(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* 状态切换确认对话框 */}
      <AlertDialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedTenant?.isActive ? '确认停用租户' : '确认启用租户'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedTenant?.isActive ? (
                <>
                  您确定要停用租户 "{selectedTenant?.name}" 吗？
                  <br />
                  <br />
                  停用后，该租户的用户将无法登录系统。
                </>
              ) : (
                <>
                  您确定要启用租户 "{selectedTenant?.name}" 吗？
                  <br />
                  <br />
                  启用后，该租户的用户将可以正常登录系统。
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              disabled={toggling}
            >
              {toggling ? '处理中...' : selectedTenant?.isActive ? '确认停用' : '确认启用'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}