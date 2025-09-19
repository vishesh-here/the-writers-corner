'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { CommentForm } from './comment-form'
import { CommentItem } from './comment-item'
import { cn } from '@/lib/utils'

interface Comment {
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

interface CommentsSectionProps {
  postId: string
  initialCommentCount: number
  className?: string
}

export function CommentsSection({ 
  postId, 
  initialCommentCount, 
  className 
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const fetchComments = async (pageNum: number = 1, append: boolean = false) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(
        `/api/community/posts/${postId}/comments?page=${pageNum}&limit=10`
      )
      
      if (response.ok) {
        const data = await response.json()
        
        if (append) {
          setComments(prev => [...prev, ...data.comments])
        } else {
          setComments(data.comments)
        }
        
        setHasMore(data.pagination.hasMore)
        setCommentCount(data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleComments = () => {
    if (!isExpanded && comments.length === 0) {
      fetchComments()
    }
    setIsExpanded(!isExpanded)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchComments(nextPage, true)
  }

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev])
    setCommentCount(prev => prev + 1)
  }

  return (
    <div className={className}>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleToggleComments}
        className="text-forest hover:text-rust font-typewriter"
      >
        <MessageCircle className="w-4 h-4 mr-1" />
        {commentCount > 0 ? `${commentCount} Comment${commentCount !== 1 ? 's' : ''}` : 'Comment'}
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </Button>

      {isExpanded && (
        <Card className="mt-4 card-vintage border-2">
          <CardHeader>
            <CardTitle className="font-typewriter text-ink text-lg">
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Comment Form */}
            <CommentForm 
              postId={postId} 
              onCommentAdded={handleCommentAdded}
            />

            {/* Comments List */}
            {isLoading && comments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-rust border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="font-serif text-forest">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-forest mx-auto mb-3 opacity-50" />
                <p className="font-serif text-forest">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment}
                  />
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="btn-vintage"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Comments'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
