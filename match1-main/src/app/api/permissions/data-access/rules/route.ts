import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/lib/types';

// 默认的数据访问规则
const defaultRules = [
  { id: 'rule-1', resource: 'competition', role: 'ADMIN' as UserRole, scope: 'all' as const, enabled: true },
  { id: 'rule-2', resource: 'competition', role: 'ORGANIZER' as UserRole, scope: 'own' as const, enabled: true },
  { id: 'rule-3', resource: 'competition', role: 'JUDGE' as UserRole, scope: 'assigned' as const, enabled: true },
  { id: 'rule-4', resource: 'competition', role: 'USER' as UserRole, scope: 'public' as const, enabled: true },
  { id: 'rule-5', resource: 'program', role: 'ADMIN' as UserRole, scope: 'all' as const, enabled: true },
  { id: 'rule-6', resource: 'program', role: 'ORGANIZER' as UserRole, scope: 'own' as const, enabled: true },
  { id: 'rule-7', resource: 'program', role: 'JUDGE' as UserRole, scope: 'assigned' as const, enabled: true },
  { id: 'rule-8', resource: 'score', role: 'ADMIN' as UserRole, scope: 'all' as const, enabled: true },
  { id: 'rule-9', resource: 'score', role: 'ORGANIZER' as UserRole, scope: 'own' as const, enabled: true },
  { id: 'rule-10', resource: 'score', role: 'JUDGE' as UserRole, scope: 'assigned' as const, enabled: true },
  { id: 'rule-11', resource: 'user', role: 'ADMIN' as UserRole, scope: 'all' as const, enabled: true },
  { id: 'rule-12', resource: 'user', role: 'ORGANIZER' as UserRole, scope: 'own' as const, enabled: true },
];

// 获取数据访问规则
export async function GET(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 只有管理员和组织者可以查看数据访问规则
    if (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    // 返回默认规则（实际项目中可以从数据库读取）
    // 添加时间戳
    const rules = defaultRules.map(rule => ({
      ...rule,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Error fetching access rules:', error);
    return NextResponse.json(
      { error: '获取数据访问规则失败' },
      { status: 500 }
    );
  }
}

// 更新数据访问规则
export async function PUT(request: Request) {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 只有管理员可以更新数据访问规则
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { ruleId, enabled } = body;

    if (!ruleId) {
      return NextResponse.json(
        { error: '规则ID不能为空' },
        { status: 400 }
      );
    }

    // 在实际项目中，这里会更新数据库中的规则
    // 目前只是返回成功响应
    return NextResponse.json({
      success: true,
      ruleId,
      enabled,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating access rule:', error);
    return NextResponse.json(
      { error: '更新数据访问规则失败' },
      { status: 500 }
    );
  }
}