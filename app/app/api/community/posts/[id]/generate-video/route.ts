import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import '@/lib/types'

export const dynamic = 'force-dynamic'

interface VideoGenerationParams {
  params: {
    id: string
  }
}

/**
 * POST /api/community/posts/[id]/generate-video
 * Generate a 30-second social media optimized video from a community post
 */
export async function POST(
  request: NextRequest,
  { params }: VideoGenerationParams
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const postId = params.id

    // Fetch the post
    const post = await prisma.exerciseSubmission.findUnique({
      where: {
        id: postId
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            name: true
          }
        },
        exercise: {
          include: {
            topic: {
              select: {
                title: true,
                slug: true
              }
            }
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user owns the post or is admin
    if (post.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only generate videos for your own posts' },
        { status: 403 }
      )
    }

    // Extract post content for video generation
    const authorName = post.user.firstName 
      ? `${post.user.firstName} ${post.user.lastName || ''}`.trim()
      : post.user.name || 'Anonymous Writer'

    const topicTitle = post.exercise?.topic?.title || 'Writing Exercise'
    const exerciseTitle = post.exercise?.title || 'Creative Writing'

    // Prepare video generation request
    const videoRequest = {
      postId: post.id,
      title: exerciseTitle,
      content: post.content,
      author: authorName,
      topic: topicTitle,
      duration: 30, // 30 seconds for social media
      format: 'vertical', // 9:16 for reels/shorts
      style: 'vintage-typewriter' // Match the app's aesthetic
    }

    // In a real implementation, this would call a video generation service
    // For now, we'll return a mock response indicating the video is being generated
    // You would integrate with services like:
    // - FFmpeg for video processing
    // - Text-to-speech APIs for narration
    // - Image generation APIs for visuals
    // - Cloud storage for hosting the final video

    // Simulate video generation job creation
    const jobId = `video_${postId}_${Date.now()}`

    return NextResponse.json({
      success: true,
      message: 'Video generation started',
      jobId,
      estimatedTime: '2-3 minutes',
      videoRequest,
      // In production, you'd return a webhook URL or polling endpoint
      statusUrl: `/api/community/posts/${postId}/video-status/${jobId}`
    })

  } catch (error) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/community/posts/[id]/generate-video
 * Get video generation capabilities and requirements
 */
export async function GET(
  request: NextRequest,
  { params }: VideoGenerationParams
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      available: true,
      formats: ['vertical', 'square', 'horizontal'],
      durations: [15, 30, 60],
      styles: ['vintage-typewriter', 'modern', 'minimalist'],
      maxContentLength: 1000,
      features: [
        'Text overlay with typewriter effect',
        'Background music',
        'Animated transitions',
        'Author attribution',
        'Topic branding'
      ]
    })

  } catch (error) {
    console.error('Error fetching video generation info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video generation info' },
      { status: 500 }
    )
  }
}
