'use client'

import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'
import { useDeleteProgram } from '@/hooks/use-delete-program'

interface DeleteProgramButtonProps {
  programId: string
  programName: string
  disabled?: boolean
  hasScores?: boolean
  competitionStatus?: string
  onSuccess?: () => void
}

export function DeleteProgramButton({
  programId,
  programName,
  disabled = false,
  hasScores = false,
  competitionStatus,
  onSuccess
}: DeleteProgramButtonProps) {
  const { deleteProgram, isDeleting } = useDeleteProgram({
    onSuccess
  })

  // 检查是否可以删除
  const canDelete = !hasScores && 
    competitionStatus !== 'FINISHED' && 
    competitionStatus !== 'ARCHIVED'

  const getDisabledReason = () => {
    if (hasScores) return '该节目已有评分记录，无法删除'
    if (competitionStatus === 'FINISHED') return '已完成的比赛不能删除节目'
    if (competitionStatus === 'ARCHIVED') return '已归档的比赛不能删除节目'
    return ''
  }

  const handleDelete = async () => {
    await deleteProgram(programId)
  }

  return (
    <DeleteConfirmDialog
      title="删除节目"
      description={
        `确定要删除节目"${programName}"吗？此操作无法撤销。` +
        (hasScores ? '\n\n注意：该节目已有评分记录，删除后相关评分数据也将被清除。' : '')
      }
      onConfirm={handleDelete}
      disabled={disabled || !canDelete || isDeleting}
      triggerText={isDeleting ? '删除中...' : '删除'}
    />
  )
} 