import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CustomFieldsManagerWrapper } from "@/components/dashboard/competitions/CustomFieldsManagerWrapper";

export const metadata: Metadata = {
  title: "自定义字段管理",
};

interface CustomFieldsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomFieldsPage({ params }: CustomFieldsPageProps) {
  const { id } = await params;
  const competition = await prisma.competition.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      customFieldDefinitions: true,
    },
  });

  if (!competition) {
    return (
      <div className="container py-10">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" asChild className="self-start">
            <Link href={`/dashboard/competitions/${id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回比赛详情
            </Link>
          </Button>
          <div className="rounded-md border border-destructive bg-destructive/10 p-6 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">比赛不存在</h1>
            <p>无法找到指定的比赛。</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/competitions">返回比赛列表</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href={`/dashboard/competitions/${id}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回比赛详情
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">自定义字段管理</h1>
          <p className="text-muted-foreground">
            比赛: {competition.name}
          </p>
        </div>
      </div>

      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <CustomFieldsManagerWrapper 
          competitionId={competition.id}
          initialFields={
            competition.customFieldDefinitions 
              ? JSON.parse(competition.customFieldDefinitions as string) 
              : []
          }
        />
      </div>
    </div>
  );
} 