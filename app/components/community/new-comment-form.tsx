'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NewCommentFormProps {
  submissionId: string
  isOpen: boolean
  onCommentAdded: () => void
}

export function NewCommentForm({ submissionId, isOpen, onCommentAdded }: NewCommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a comment',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          submissionId, 
          content: content.trim() 
        }),
      })

      if (response.ok) {
        setContent('')
        onCommentAdded()
        toast({
          title: 'Success',
          description: 'Comment added successfully',
        })
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to add comment',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Card className="mt-4 bg-sepia/20 border border-ink/20">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Share your thoughts on this writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-serif border-2 border-ink/30 focus:border-rust resize-none"
            rows={3}
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif text-forest">
              {content.length}/1000 characters
            </span>
            <Button 
              type="submit" 
              size="sm" 
              className="btn-vintage"
              disabled={loading || !content.trim()}
            >
              <Send className="w-4 h-4 mr-1" />
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
