'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const settingsSchema = z.object({
  name: z.string().min(1, '租户名称不能为空'),
  domain: z.string().optional(),
  isActive: z.boolean(),
  allowRegistration: z.boolean(),
  maxUsers: z.coerce.number().min(1).max(10000),
  contactEmail: z.string().email().optional().or(z.literal('')),
})

type SettingsValues = z.infer<typeof settingsSchema>

export default function TenantSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // SUPER_ADMIN only guard
  useEffect(() => {
    import('next-auth/react').then(({ getSession }) => {
      getSession().then((session) => {
        if (!session || session.user.role !== 'SUPER_ADMIN') {
          router.push('/dashboard')
        }
      })
    })
  }, [router])

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      domain: '',
      isActive: true,
      allowRegistration: true,
      maxUsers: 100,
      contactEmail: '',
    },
  })

  useEffect(() => {
    async function loadTenant() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/admin/tenants/${params.id}`)
        if (!res.ok) {
          toast.error('加载租户信息失败')
          return
        }
        const data = await res.json()
        const settings = data.settings || {}
        form.reset({
          name: data.name || '',
          domain: data.domain || '',
          isActive: data.isActive ?? true,
          allowRegistration: settings?.allowRegistration ?? true,
          maxUsers: settings?.maxUsers ?? 100,
          contactEmail: settings?.contactEmail || '',
        })
      } catch {
        toast.error('加载失败')
      } finally {
        setIsLoading(false)
      }
    }
    loadTenant()
  }, [params.id, form])

  async function onSubmit(data: SettingsValues) {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/tenants/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          domain: data.domain || null,
          isActive: data.isActive,
          settings: {
            allowRegistration: data.allowRegistration,
            maxUsers: data.maxUsers,
            contactEmail: data.contactEmail || null,
          },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || '保存失败')
        return
      }

      toast.success('设置已保存')
      router.refresh()
    } catch {
      toast.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/tenants/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">租户设置</h1>
          <p className="text-gray-500">管理租户配置和品牌设置</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>租户的基本信息和域名配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>租户名称</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      <Input placeholder="your-company.example.com" {...field} />
                    </FormControl>
                    <FormDescription>可选，用于多域名访问</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系邮箱</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>功能设置</CardTitle>
              <CardDescription>控制租户可用的功能和限制</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel>租户状态</FormLabel>
                      <FormDescription>
                        {field.value ? '租户处于活跃状态' : '租户已被停用'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator />
              <FormField
                control={form.control}
                name="allowRegistration"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel>允许注册</FormLabel>
                      <FormDescription>
                        允许新用户自行注册到该租户
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator />
              <FormField
                control={form.control}
                name="maxUsers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最大用户数</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10000} {...field} />
                    </FormControl>
                    <FormDescription>租户允许的最大用户数量</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href={`/dashboard/tenants/${params.id}`}>
              <Button variant="outline">取消</Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              保存设置
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
