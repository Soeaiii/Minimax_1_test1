'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DeleteProgramButton } from './delete-program-button'
import { Edit, Eye, Users, Clock } from 'lucide-react'

interface Program {
  id: string
  name: string
  description?: string
  order: number
  status: string
  participants: {
    id: string
    name: string
  }[]
  scores: {
    id: string
  }[]
  competition: {
    id: string
    name: string
    status: string
  }
}

interface ProgramListProps {
  programs: Program[]
  competitionId?: string
  canEdit?: boolean
}

export function ProgramList({ programs, competitionId, canEdit = false }: ProgramListProps) {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { label: '等待中', variant: 'secondary' as const },
      ACTIVE: { label: '进行中', variant: 'default' as const },
      COMPLETED: { label: '已完成', variant: 'outline' as const },
    }
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      variant: 'secondary' as const 
    }
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    )
  }

  if (programs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              暂无节目
            </h3>
            <p className="text-gray-500 mb-4">
              还没有添加任何节目，点击下方按钮开始添加。
            </p>
            {canEdit && competitionId && (
              <Button asChild>
                <Link href={`/dashboard/programs/new?competitionId=${competitionId}`}>
                  添加节目
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <Card key={program.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  {program.order}
                </div>
                <div>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                  {program.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {program.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(program.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{program.participants.length} 位参赛者</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{program.scores.length} 个评分</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* 查看按钮 */}
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/programs/${program.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    查看
                  </Link>
                </Button>
                
                {/* 编辑按钮 */}
                {canEdit && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/programs/${program.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      编辑
                    </Link>
                  </Button>
                )}
                
                {/* 删除按钮 */}
                {canEdit && (
                  <DeleteProgramButton
                    programId={program.id}
                    programName={program.name}
                    hasScores={program.scores.length > 0}
                    competitionStatus={program.competition.status}
                  />
                )}
              </div>
            </div>
            
            {/* 参赛者列表 */}
            {program.participants.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">参赛者：</h4>
                <div className="flex flex-wrap gap-2">
                  {program.participants.map((participant) => (
                    <Badge key={participant.id} variant="outline">
                      {participant.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 