'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    firstName?: string
    lastName?: string
    name?: string
  }
}

interface CommentsListProps {
  submissionId: string
  isOpen: boolean
}

export function CommentsList({ submissionId, isOpen }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && !loaded) {
      fetchComments()
    }
  }, [isOpen, loaded])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/comments?submissionId=${submissionId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
        setLoaded(true)
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to load comments',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserDisplayName = (user: Comment['user']) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user.name || 'Anonymous Writer'
  }

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-sepia/30 rounded border">
        <div className="animate-pulse">
          <div className="h-4 bg-sepia rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-sepia rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-3">
      {comments.length === 0 ? (
        <div className="text-center py-6 text-forest font-serif">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        comments.map((comment) => (
          <Card key={comment.id} className="bg-sepia/30 border border-ink/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge className="bg-rust/20 text-rust font-typewriter text-xs">
                  {getUserDisplayName(comment.user)}
                </Badge>
                <span className="text-xs font-serif text-forest">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="font-serif text-forest leading-relaxed">
                {comment.content}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
