'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { CommentsList } from './comments-list'
import { NewCommentForm } from './new-comment-form'

interface CommentButtonProps {
  submissionId: string
  initialCount: number
}

export function CommentButton({ submissionId, initialCount }: CommentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [refreshComments, setRefreshComments] = useState(0)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleCommentAdded = () => {
    setCount(prev => prev + 1)
    setRefreshComments(prev => prev + 1)
  }

  return (
    <div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-forest hover:text-rust transition-colors"
        onClick={handleToggle}
      >
        <MessageCircle className="w-4 h-4 mr-1" />
        {count > 0 ? `${count} Comment${count !== 1 ? 's' : ''}` : 'Comment'}
      </Button>
      
      {isOpen && (
        <div className="mt-4">
          <NewCommentForm 
            submissionId={submissionId}
            isOpen={isOpen}
            onCommentAdded={handleCommentAdded}
          />
          <CommentsList 
            key={refreshComments} // Force refresh when new comment added
            submissionId={submissionId}
            isOpen={isOpen}
          />
        </div>
      )}
    </div>
  )
}
