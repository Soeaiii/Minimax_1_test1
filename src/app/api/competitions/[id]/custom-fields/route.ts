import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 获取比赛的自定义字段定义
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;
    // 获取比赛
    const competition = await prisma.competition.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        customFieldDefinitions: true,
      },
    });

    if (!competition) {
      return NextResponse.json({ error: "比赛不存在" }, { status: 404 });
    }

    return NextResponse.json({
      competition: {
        id: competition.id,
        name: competition.name,
        customFieldDefinitions: competition.customFieldDefinitions,
      },
    });
  } catch (error) {
    console.error("Error fetching competition custom fields:", error);
    return NextResponse.json(
      { error: "获取自定义字段定义失败" },
      { status: 500 }
    );
  }
}

// 更新比赛的自定义字段定义
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;
    // 验证比赛存在
    const existingCompetition = await prisma.competition.findUnique({
      where: { id },
    });

    if (!existingCompetition) {
      return NextResponse.json({ error: "比赛不存在" }, { status: 404 });
    }

    // 验证当前用户是否有权限编辑该比赛
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN" &&
      existingCompetition.organizerId !== session.user.id
    ) {
      return NextResponse.json({ error: "无权限编辑此比赛" }, { status: 403 });
    }

    // 获取请求体
    const body = await req.json();
    const { customFieldDefinitions } = body;

    // 更新自定义字段定义
    const competition = await prisma.competition.update({
      where: { id },
      data: {
        customFieldDefinitions,
      },
      select: {
        id: true,
        name: true,
        customFieldDefinitions: true,
      },
    });

    return NextResponse.json({
      message: "自定义字段定义已更新",
      competition,
    });
  } catch (error) {
    console.error("Error updating competition custom fields:", error);
    return NextResponse.json(
      { error: "更新自定义字段定义失败" },
      { status: 500 }
    );
  }
} 