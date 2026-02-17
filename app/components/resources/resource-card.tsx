
'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Youtube, Globe, MessageSquare, BookOpen, Video, FileText, MessageCircle, GraduationCap, Wrench } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface WritingResource {
  id: string
  title: string
  description: string
  url: string
  platform: string
  category: string
  difficultyLevel: string
  resourceType: string
}

interface ResourceCardProps {
  resource: WritingResource
  index: number
}

export function ResourceCard({ resource, index }: ResourceCardProps) {
  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />
      case 'reddit':
        return <MessageSquare className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'article':
        return <FileText className="w-4 h-4" />
      case 'thread':
        return <MessageCircle className="w-4 h-4" />
      case 'course':
        return <GraduationCap className="w-4 h-4" />
      case 'tool':
        return <Wrench className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-forest/20 text-forest border-forest'
      case 'intermediate':
        return 'bg-gold/20 text-ink border-gold'
      case 'advanced':
        return 'bg-rust/20 text-rust border-rust'
      default:
        return 'bg-sepia text-ink border-ink'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="h-full bg-sepia/30 border-2 border-ink hover:shadow-lg transition-shadow duration-300 paper-texture flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <CardTitle className="text-lg font-typewriter text-ink mb-2 line-clamp-2">
                {resource.title}
              </CardTitle>
            </div>
          </div>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-parchment border-ink text-ink font-typewriter text-xs"
            >
              {getPlatformIcon(resource.platform)}
              <span className="ml-1">{resource.platform}</span>
            </Badge>
            <Badge
              variant="outline"
              className="bg-parchment border-ink text-ink font-typewriter text-xs"
            >
              {getTypeIcon(resource.resourceType)}
              <span className="ml-1">{resource.resourceType}</span>
            </Badge>
            <Badge
              variant="outline"
              className={`font-typewriter text-xs ${getDifficultyColor(resource.difficultyLevel)}`}
            >
              {resource.difficultyLevel}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <CardDescription className="text-forest font-serif mb-4 line-clamp-3 flex-1">
            {resource.description}
          </CardDescription>
          
          {/* Category */}
          <div className="mb-4">
            <p className="text-xs text-ink font-typewriter opacity-70">
              Category: <span className="font-bold">{resource.category}</span>
            </p>
          </div>
          
          {/* Action Button */}
          <Button
            asChild
            className="w-full bg-rust text-parchment hover:bg-rust/80 font-typewriter"
          >
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              View Resource
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
