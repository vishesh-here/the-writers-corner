'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Eye, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface WorkCardProps {
  work: {
    id: string
    title: string
    description: string
    externalLink: string
    workType: 'STORY_NOVEL' | 'POEM' | 'ARTICLE_ESSAY'
    genre: string
    likesCount: number
    viewsCount: number
    hasLiked?: boolean
    createdAt: string
    user: {
      id?: string
      firstName?: string
      lastName?: string
      name?: string
    }
  }
  showActions?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  index?: number
}

const workTypeLabels = {
  STORY_NOVEL: 'Story/Novel',
  POEM: 'Poem',
  ARTICLE_ESSAY: 'Article/Essay'
}

const workTypeColors = {
  STORY_NOVEL: 'bg-rust/20 text-rust',
  POEM: 'bg-forest/20 text-forest',
  ARTICLE_ESSAY: 'bg-gold/40 text-ink'
}

export function WorkCard({ work, showActions = false, onEdit, onDelete, index = 0 }: WorkCardProps) {
  const [liked, setLiked] = useState(work.hasLiked || false)
  const [likesCount, setLikesCount] = useState(work.likesCount)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    
    try {
      const response = await fetch(`/api/works/${work.id}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setLikesCount(prev => data.liked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleView = async () => {
    try {
      await fetch(`/api/works/${work.id}/view`)
    } catch (error) {
      console.error('Error tracking view:', error)
    }
    window.open(work.externalLink, '_blank', 'noopener,noreferrer')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const authorName = work.user?.firstName && work.user?.lastName
    ? `${work.user.firstName} ${work.user.lastName}`
    : work.user?.name || 'Anonymous Writer'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="card-vintage border-2 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="font-typewriter text-ink text-xl mb-2">
                {work.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={`font-typewriter ${workTypeColors[work.workType]}`}>
                  {workTypeLabels[work.workType]}
                </Badge>
                <Badge className="bg-sepia/50 text-ink font-typewriter">
                  {work.genre}
                </Badge>
                <span className="text-sm font-serif text-forest">
                  by {authorName}
                </span>
                <span className="text-sm font-serif text-forest">
                  • {formatDate(work.createdAt)}
                </span>
              </div>
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-forest hover:text-rust"
                  onClick={() => onEdit?.(work.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-forest hover:text-red-600"
                  onClick={() => onDelete?.(work.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-serif text-forest leading-relaxed mb-4">
            {getExcerpt(work.description)}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`${liked ? 'text-rust' : 'text-forest'} hover:text-rust`}
                onClick={handleLike}
                disabled={isLiking}
              >
                <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                {likesCount}
              </Button>
              <div className="flex items-center text-forest text-sm">
                <Eye className="w-4 h-4 mr-1" />
                {work.viewsCount}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="btn-vintage text-xs"
              onClick={handleView}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Read Work
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
