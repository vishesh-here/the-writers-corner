'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LikeButtonProps {
  submissionId: string
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({ submissionId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleLike = async () => {
    if (loading) return

    setLoading(true)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId }),
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setCount(prev => data.liked ? prev + 1 : prev - 1)
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to update like',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`text-forest hover:text-rust transition-colors ${liked ? 'text-rust' : ''}`}
      onClick={handleLike}
      disabled={loading}
    >
      <Heart 
        className={`w-4 h-4 mr-1 transition-all ${liked ? 'fill-current' : ''}`} 
      />
      {count > 0 ? count : 'Like'}
    </Button>
  )
}
