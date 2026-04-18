'use client'

import { memo, useMemo } from 'react'
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
  participantPrograms: {
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

const statusMap = {
  PENDING: { label: '等待中', variant: 'secondary' as const },
  ACTIVE: { label: '进行中', variant: 'default' as const },
  COMPLETED: { label: '已完成', variant: 'outline' as const },
}

const getStatusBadge = (status: string) => {
  const statusInfo = statusMap[status as keyof typeof statusMap] || {
    label: status,
    variant: 'secondary' as const
  }
  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
}

const EmptyState = memo(function EmptyState({ canEdit, competitionId }: { canEdit?: boolean; competitionId?: string }) { return (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无节目</h3>
        <p className="text-gray-500 mb-4">还没有添加任何节目，点击下方按钮开始添加。</p>
        {canEdit && competitionId && (
          <Button asChild>
            <Link href={`/dashboard/programs/new?competitionId=${competitionId}`}>添加节目</Link>
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
)}) 

const ProgramCard = memo(function ProgramCard({ program, canEdit }: { program: Program; canEdit?: boolean }) { return (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
            {program.order}
          </div>
          <div>
            <CardTitle className="text-lg">{program.name}</CardTitle>
            {program.description && <p className="text-sm text-gray-600 mt-1">{program.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">{getStatusBadge(program.status)}</div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{program.participantPrograms.length} 位参赛者</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{program.scores.length} 个评分</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/programs/${program.id}`}>
              <Eye className="h-4 w-4 mr-1" />查看
            </Link>
          </Button>
          {canEdit && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/programs/${program.id}/edit`}>
                <Edit className="h-4 w-4 mr-1" />编辑
              </Link>
            </Button>
          )}
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
      {program.participantPrograms.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">参赛者：</h4>
          <div className="flex flex-wrap gap-2">
            {program.participantPrograms.map(pp => pp.participant)((participant) => (
              <Badge key={pp.participant.id} variant="outline">{pp.participant.name}</Badge>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
})

function ProgramList({ programs, competitionId, canEdit = false }: ProgramListProps) {
  const sortedPrograms = useMemo(
    () => [...programs].sort((a, b) => a.order - b.order),
    [programs]
  )

  if (programs.length === 0) {
    return <EmptyState canEdit={canEdit} competitionId={competitionId} />
  }

  return (
    <div className="space-y-4">
      {sortedPrograms.map((program) => (
        <ProgramCard key={program.id} program={program} canEdit={canEdit} />
      ))}
    </div>
  )
}

export default memo(ProgramList) 