'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  submissionId: string
  initialLiked: boolean
  initialCount: number
  className?: string
}

export function LikeButton({ submissionId, initialLiked, initialCount, className }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleLike = async () => {
    if (loading) return

    // Optimistic update
    const newLiked = !liked
    const newCount = newLiked ? count + 1 : count - 1
    setLiked(newLiked)
    setCount(newCount)

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
        // Sync with server response
        setLiked(data.liked)
        setCount(data.liked ? count + 1 : count - 1)
      } else {
        // Revert optimistic update
        setLiked(!newLiked)
        setCount(count)
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to update like',
          variant: 'destructive',
        })
      }
    } catch (error) {
      // Revert optimistic update
      setLiked(!newLiked)
      setCount(count)
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
      onClick={handleLike}
      disabled={loading}
      className={cn(
        "transition-all duration-200 font-typewriter",
        liked
          ? "text-rust hover:text-rust/80"
          : "text-forest hover:text-rust",
        className
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4 mr-1 transition-all duration-200",
          liked ? "fill-current" : ""
        )}
      />
      {count > 0 ? count : 'Like'}
    </Button>
  )
}
