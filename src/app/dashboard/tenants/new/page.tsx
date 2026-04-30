'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from 'react';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const tenantFormSchema = z.object({
  name: z.string().min(2, { message: '租户名称至少需要2个字符' }),
  domain: z.string().optional(),
  settings: z.string().optional(),
  adminEmail: z.string().email({ message: '请输入有效的邮箱' }).optional().or(z.literal('')),
  adminPassword: z.string().min(6, { message: '密码至少6个字符' }).optional().or(z.literal('')),
  adminName: z.string().optional(),
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;

export default function NewTenantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // SUPER_ADMIN only guard
  useEffect(() => {
    import('next-auth/react').then(({ getSession }) => {
      getSession().then((session) => {
        if (!session || session.user.role !== 'SUPER_ADMIN') {
          router.push('/dashboard')
        }
      })
    })
  }, [router]);

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: '',
      domain: '',
      settings: JSON.stringify({
        allowRegistration: true,
        maxUsers: 100,
        features: ['competitions', 'scoring', 'reports', 'display'],
      }, null, 2),
      adminEmail: '',
      adminPassword: '',
      adminName: '',
    },
  });

  // 提交表单
  const onSubmit = async (data: TenantFormValues) => {
    // 验证 settings JSON
    let parsedSettings = {};
    if (data.settings) {
      try {
        parsedSettings = JSON.parse(data.settings);
        setSettingsError(null);
      } catch (error) {
        setSettingsError('Settings 必须是有效的 JSON 格式');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          domain: data.domain || null,
          settings: parsedSettings,
          adminEmail: data.adminEmail || undefined,
          adminPassword: data.adminPassword || undefined,
          adminName: data.adminName || undefined,
        }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = { error: '服务器响应解析失败' };
      }

      if (!response.ok) {
        throw new Error(responseData.error || '创建租户失败');
      }

      toast.success('租户创建成功');
      router.push('/dashboard/tenants');
      router.refresh();
    } catch (error) {
      console.error('创建租户失败:', error);
      toast.error(error instanceof Error ? error.message : '创建租户失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/dashboard/tenants">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回租户列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">创建新租户</h1>
        </div>
      </div>

      <div className="border rounded-md p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>租户名称 *</FormLabel>
                  <FormControl>
                    <Input placeholder="输入租户名称" {...field} />
                  </FormControl>
                  <FormDescription>
                    租户名称将显示在系统各处
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>域名</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：company.example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    可选的域名绑定，用于多租户场景
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Settings (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{"allowRegistration": true, "maxUsers": 100}'
                      className="min-h-32 font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    租户配置，JSON 格式
                  </FormDescription>
                  {settingsError && (
                    <p className="text-sm text-destructive">{settingsError}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">管理员账号（可选）</h3>
              <p className="text-sm text-muted-foreground mb-4">
                创建租户时同时创建管理员账号，留空则稍后手动创建
              </p>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>管理员姓名</FormLabel>
                      <FormControl>
                        <Input placeholder="管理员姓名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>管理员邮箱</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>管理员密码</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="至少6个字符" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/dashboard/tenants">取消</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    创建租户
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}