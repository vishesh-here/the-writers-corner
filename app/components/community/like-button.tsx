'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  postId: string
  initialLikeCount: number
  initialIsLiked: boolean
  className?: string
}

export function LikeButton({ 
  postId, 
  initialLikeCount, 
  initialIsLiked, 
  className 
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    
    // Optimistic update
    const newIsLiked = !isLiked
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1
    
    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Revert optimistic update on error
        setIsLiked(!newIsLiked)
        setLikeCount(newIsLiked ? likeCount - 1 : likeCount + 1)
        console.error('Failed to toggle like')
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!newIsLiked)
      setLikeCount(newIsLiked ? likeCount - 1 : likeCount + 1)
      console.error('Error toggling like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200 font-typewriter",
        isLiked 
          ? "text-rust hover:text-rust/80" 
          : "text-forest hover:text-rust",
        className
      )}
    >
      <Heart 
        className={cn(
          "w-4 h-4 mr-1 transition-all duration-200",
          isLiked ? "fill-current" : ""
        )} 
      />
      {likeCount > 0 ? likeCount : 'Like'}
    </Button>
  )
}
