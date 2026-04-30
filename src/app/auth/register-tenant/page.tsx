'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Building2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const registerTenantSchema = z.object({
  companyName: z.string().min(2, { message: '公司名称至少2个字符' }),
  adminEmail: z.string().email({ message: '请输入有效的邮箱' }),
  adminPassword: z.string().min(6, { message: '密码至少6个字符' }),
  confirmPassword: z.string().min(6),
  domain: z.string().optional(),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: '两次密码不匹配',
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof registerTenantSchema>

export default function RegisterTenantPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(registerTenantSchema),
    defaultValues: {
      companyName: '',
      adminEmail: '',
      adminPassword: '',
      confirmPassword: '',
      domain: '',
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/register-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: data.companyName,
          adminEmail: data.adminEmail,
          adminPassword: data.adminPassword,
          domain: data.domain || undefined,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || '注册失败')
        return
      }

      toast.success('租户注册成功！请使用管理员账号登录')
      router.push('/auth/login?registered=true')
    } catch {
      setError('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Building2 className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-center">注册组织</CardTitle>
          <CardDescription className="text-center">
            公开注册已关闭，请联系平台管理员创建租户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">如需创建新的租户账号，请联系平台管理员。</p>
            <Button variant="outline" asChild>
              <Link href="/auth/login">返回登录</Link>
            </Button>
          </div>
        </CardContent>
        <CardContent style={{ display: 'none' }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>公司/组织名称 *</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：星光艺术学院" {...field} />
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
                    <FormLabel>管理员邮箱 *</FormLabel>
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
                    <FormLabel>管理员密码 *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="至少6个字符" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>确认密码 *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="再次输入密码" {...field} />
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
                    <FormLabel>子域名（可选）</FormLabel>
                    <FormControl>
                      <Input placeholder="your-company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '注册中...' : '注册组织'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-gray-500">
            已有账号？{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              登录
            </Link>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            返回首页
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
