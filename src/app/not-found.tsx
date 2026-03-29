import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-muted-foreground mb-4">
            404
          </CardTitle>
          <CardTitle className="text-2xl font-bold">
            页面未找到
          </CardTitle>
          <CardDescription>
            抱歉，您访问的页面不存在或已被移动。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild variant="default">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                返回首页
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="javascript:history.back()" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回上页
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            如果您认为这是一个错误，请联系系统管理员。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}