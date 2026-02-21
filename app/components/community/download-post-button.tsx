'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2, Check } from 'lucide-react'
import { downloadPostAsImage, PostImageData } from '@/lib/generate-post-image'
import { toast } from 'sonner'

interface DownloadPostButtonProps {
  post: {
    id: string
    title: string
    content: string
    createdAt: string
    user: {
      firstName?: string
      lastName?: string
      name?: string
    }
    exercise?: {
      title: string
      topic: {
        title: string
        slug: string
      }
    }
  }
}

export function DownloadPostButton({ post }: DownloadPostButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    setDownloaded(false)

    try {
      const authorName = post.user?.firstName && post.user?.lastName
        ? `${post.user.firstName} ${post.user.lastName}`
        : post.user?.name || 'Anonymous Writer'

      const date = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

      const imageData: PostImageData = {
        title: post.title || 'Exercise Response',
        content: post.content,
        authorName,
        exerciseTitle: post.exercise?.title,
        topicTitle: post.exercise?.topic.title,
        date
      }

      // Generate filename from title
      const sanitizedTitle = (post.title || 'post')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 30)
      const filename = `writers-corner-${sanitizedTitle}-${post.id.slice(0, 8)}.png`

      await downloadPostAsImage(imageData, filename)
      
      setDownloaded(true)
      toast.success('Image downloaded successfully!', {
        description: 'Your post image is ready to share on social media.'
      })

      // Reset downloaded state after 2 seconds
      setTimeout(() => setDownloaded(false), 2000)
    } catch (error) {
      console.error('Error downloading post:', error)
      toast.error('Failed to download image', {
        description: 'Please try again later.'
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      disabled={isDownloading}
      className="text-forest hover:text-rust transition-colors"
      title="Download as image for social media"
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
      ) : downloaded ? (
        <Check className="w-4 h-4 mr-1 text-forest" />
      ) : (
        <Download className="w-4 h-4 mr-1" />
      )}
      {isDownloading ? 'Creating...' : downloaded ? 'Downloaded' : 'Share'}
    </Button>
  )
}
