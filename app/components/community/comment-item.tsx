'use client'

import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface CommentItemProps {
  comment: {
    id: string
    content: string
    createdAt: string
    updatedAt: string
    user: {
      id: string
      firstName?: string
      lastName?: string
      name?: string
    }
    isOwner: boolean
  }
  className?: string
}

export function CommentItem({ comment, className }: CommentItemProps) {
  const getUserDisplayName = () => {
    if (comment.user.firstName && comment.user.lastName) {
      return `${comment.user.firstName} ${comment.user.lastName}`
    }
    return comment.user.name || 'Anonymous Writer'
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }

  return (
    <div className={`border-l-2 border-sepia pl-4 py-3 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <Badge className="bg-rust/20 text-rust font-typewriter text-xs">
          {getUserDisplayName()}
        </Badge>
        {comment.isOwner && (
          <Badge className="bg-gold/20 text-ink font-typewriter text-xs">
            You
          </Badge>
        )}
        <span className="text-xs font-serif text-forest">
          {formatDate(comment.createdAt)}
        </span>
      </div>
      
      <p className="font-serif text-forest leading-relaxed whitespace-pre-wrap">
        {comment.content}
      </p>
    </div>
  )
}
