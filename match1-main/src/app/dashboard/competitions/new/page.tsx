import { Metadata } from "next";
import { CompetitionForm } from "@/components/dashboard/competitions/CompetitionForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "创建比赛 | 比赛管理系统",
  description: "创建新的比赛",
};

export default function NewCompetitionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/dashboard/competitions">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回比赛列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">创建新比赛</h1>
        </div>
      </div>
      
      <div className="border rounded-md p-6">
        <CompetitionForm />
      </div>
    </div>
  );
} 