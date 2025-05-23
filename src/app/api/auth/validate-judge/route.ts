import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // @ts-ignore 暂时忽略类型错误
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ isJudge: false }, { status: 401 });
    }

    const isJudge = session.user.role === 'JUDGE';
    
    return NextResponse.json({ 
      isJudge,
      user: isJudge ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
      } : null
    });
  } catch (error) {
    console.error('Error validating judge:', error);
    return NextResponse.json({ isJudge: false }, { status: 500 });
  }
} 