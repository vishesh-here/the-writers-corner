'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Video, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface GenerateVideoButtonProps {
  postId: string
  postTitle: string
  disabled?: boolean
}

export function GenerateVideoButton({ postId, postTitle, disabled = false }: GenerateVideoButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle')
  const { toast } = useToast()

  const handleGenerateVideo = async () => {
    try {
      setIsGenerating(true)
      setGenerationStatus('generating')

      const response = await fetch(`/api/community/posts/${postId}/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video')
      }

      setGenerationStatus('success')
      toast({
        title: 'Video Generation Started! 🎬',
        description: `Your 30-second reel for "${postTitle}" is being created. Estimated time: ${data.estimatedTime}`,
        duration: 5000
      })

      // In production, you would:
      // 1. Poll the status endpoint
      // 2. Show progress updates
      // 3. Provide download link when ready
      // 4. Store video metadata in database

      // Reset status after a delay
      setTimeout(() => {
        setGenerationStatus('idle')
        setIsGenerating(false)
      }, 3000)

    } catch (error) {
      console.error('Error generating video:', error)
      setGenerationStatus('error')
      toast({
        title: 'Video Generation Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
        duration: 5000
      })

      setTimeout(() => {
        setGenerationStatus('idle')
        setIsGenerating(false)
      }, 3000)
    }
  }

  const getButtonContent = () => {
    switch (generationStatus) {
      case 'generating':
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Started!
          </>
        )
      case 'error':
        return (
          <>
            <AlertCircle className="mr-2 h-4 w-4" />
            Failed
          </>
        )
      default:
        return (
          <>
            <Video className="mr-2 h-4 w-4" />
            Generate Reel
          </>
        )
    }
  }

  return (
    <Button
      onClick={handleGenerateVideo}
      disabled={disabled || isGenerating}
      variant={generationStatus === 'success' ? 'default' : 'outline'}
      size="sm"
      className="gap-2"
    >
      {getButtonContent()}
    </Button>
  )
}
