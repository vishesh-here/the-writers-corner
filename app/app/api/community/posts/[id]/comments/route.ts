import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Check if the post exists
    const communityPost = await prisma.communityPost.findUnique({
      where: { id: postId }
    })

    const exerciseSubmission = await prisma.exerciseSubmission.findUnique({
      where: { id: postId }
    })

    if (!communityPost && !exerciseSubmission) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const postType = communityPost ? 'COMMUNITY_POST' : 'EXERCISE_SUBMISSION'

    // Get comments with pagination
    const comments = await prisma.postComment.findMany({
      where: {
        postId,
        postType
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total comment count
    const totalComments = await prisma.postComment.count({
      where: {
        postId,
        postType
      }
    })

    const hasMore = skip + comments.length < totalComments

    return NextResponse.json({
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        user: comment.user,
        isOwner: comment.userId === session.user.id
      })),
      pagination: {
        page,
        limit,
        total: totalComments,
        hasMore
      }
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Add a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const userId = session.user.id
    const { content } = await request.json()

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment content is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    // Check if the post exists
    const communityPost = await prisma.communityPost.findUnique({
      where: { id: postId }
    })

    const exerciseSubmission = await prisma.exerciseSubmission.findUnique({
      where: { id: postId }
    })

    if (!communityPost && !exerciseSubmission) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const postType = communityPost ? 'COMMUNITY_POST' : 'EXERCISE_SUBMISSION'

    // Create the comment
    const comment = await prisma.postComment.create({
      data: {
        content: content.trim(),
        userId,
        postId,
        postType
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
        user: comment.user,
        isOwner: true
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
