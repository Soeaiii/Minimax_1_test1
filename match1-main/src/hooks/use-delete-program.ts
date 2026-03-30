'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DeleteProgramOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useDeleteProgram(options: DeleteProgramOptions = {}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const deleteProgram = async (programId: string) => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/programs/${programId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '删除节目失败')
      }

      toast.success('节目删除成功')
      
      // 刷新页面数据
      router.refresh()
      
      // 调用成功回调
      options.onSuccess?.()
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除节目失败'
      toast.error(errorMessage)
      
      // 调用错误回调
      options.onError?.(errorMessage)
      
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteProgram,
    isDeleting
  }
} 