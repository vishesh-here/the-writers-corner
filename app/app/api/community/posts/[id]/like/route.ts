import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Toggle like on a post
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

    // First, check if the post exists (could be CommunityPost or ExerciseSubmission)
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

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId_postType: {
          userId,
          postId,
          postType
        }
      }
    })

    if (existingLike) {
      // Unlike - remove the like
      await prisma.postLike.delete({
        where: {
          id: existingLike.id
        }
      })

      return NextResponse.json({ 
        liked: false,
        message: 'Post unliked successfully'
      })
    } else {
      // Like - create new like
      await prisma.postLike.create({
        data: {
          userId,
          postId,
          postType
        }
      })

      return NextResponse.json({ 
        liked: true,
        message: 'Post liked successfully'
      })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get like status and count for a post
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
    const userId = session.user.id

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

    // Get total like count
    const likeCount = await prisma.postLike.count({
      where: {
        postId,
        postType
      }
    })

    // Check if current user liked this post
    const userLike = await prisma.postLike.findUnique({
      where: {
        userId_postId_postType: {
          userId,
          postId,
          postType
        }
      }
    })

    return NextResponse.json({
      likeCount,
      isLikedByUser: !!userLike
    })
  } catch (error) {
    console.error('Error fetching like status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
