'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'

interface CommentFormProps {
  postId: string
  onCommentAdded: (comment: any) => void
  className?: string
}

export function CommentForm({ postId, onCommentAdded, className }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('Please enter a comment')
      return
    }

    if (content.length > 2000) {
      setError('Comment is too long (max 2000 characters)')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        onCommentAdded(data.comment)
        setContent('')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to add comment')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      setError('Failed to add comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-3">
        <Textarea
          placeholder="Share your thoughts on this piece..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="font-serif border-2 border-ink focus:border-rust resize-none"
          rows={3}
          maxLength={2000}
        />
        
        {error && (
          <p className="text-sm text-red-600 font-serif">{error}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif text-forest">
            {content.length}/2000 characters
          </span>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
            className="btn-vintage"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
