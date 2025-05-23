import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 text-center">
      <ShieldAlert className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-2 text-3xl font-bold">访问被拒绝</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        您没有权限访问请求的页面。如需获取访问权限，请联系系统管理员。
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/dashboard">返回仪表盘</Link>
        </Button>
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </div>
  );
} 