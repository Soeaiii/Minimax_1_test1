import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 注册请求验证模式
const registerSchema = z.object({
  name: z.string().min(2, { message: '姓名至少需要2个字符' }),
  email: z.string().email({ message: '请输入有效的电子邮箱地址' }),
  password: z.string().min(6, { message: '密码至少需要6个字符' }),
  role: z.enum(['USER', 'ORGANIZER']).optional().default('USER'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 验证请求数据
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: '无效的请求数据', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, password, role } = result.data;
    
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      );
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 获取默认租户
    const defaultTenantDomain = process.env.DEFAULT_TENANT_DOMAIN || 'default.example.com';
    const defaultTenant = await prisma.tenant.findFirst({
      where: { domain: defaultTenantDomain },
    });
    
    if (!defaultTenant) {
      return NextResponse.json(
        { error: '系统配置错误，请联系管理员' },
        { status: 500 }
      );
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        tenantId: defaultTenant.id,
        permissions: role === 'ORGANIZER' ? ['competitions:manage', 'participants:manage'] : ['competitions:view'],
        isActive: true,
      },
    });
    
    // 从响应中删除密码
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { user: userWithoutPassword, message: '注册成功' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '注册用户时发生错误' },
      { status: 500 }
    );
  }
}