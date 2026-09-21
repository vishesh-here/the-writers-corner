
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch public exercise submissions with saved status, likes and comments
    const submissions = await prisma.exerciseSubmission.findMany({
      where: {
        isPublic: true
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
        },
        savedBy: {
          where: {
            userId: session.user.id
          },
          select: {
            id: true
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        comments: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    // Get like and comment counts for each submission
    const submissionIds = submissions.map(s => s.id)
    
    const likeCounts = await prisma.postLike.groupBy({
      by: ['postId'],
      where: {
        postId: { in: submissionIds },
        postType: 'EXERCISE_SUBMISSION'
      },
      _count: {
        id: true
      }
    })

    const commentCounts = await prisma.postComment.groupBy({
      by: ['postId'],
      where: {
        postId: { in: submissionIds },
        postType: 'EXERCISE_SUBMISSION'
      },
      _count: {
        id: true
      }
    })

    const submissionLikeCountMap = new Map(likeCounts.map(lc => [lc.postId, lc._count.id]))
    const submissionCommentCountMap = new Map(commentCounts.map(cc => [cc.postId, cc._count.id]))

    // Convert submissions to community post format
    const submissionPosts = submissions.map((submission: typeof submissions[0]) => ({
      id: submission.id,
      title: submission.exercise.title,
      content: submission.content,
      createdAt: submission.createdAt.toISOString(),
      user: submission.user,
      exercise: submission.exercise,
      isSaved: submission.savedBy.length > 0,
      savedPostId: submission.savedBy[0]?.id || null,
      likesCount: submissionLikeCountMap.get(submission.id) ?? submission.likes.length,
      commentsCount: submissionCommentCountMap.get(submission.id) ?? submission.comments.length,
      isLikedByUser: submission.likes.some(like => like.userId === session.user!.id)
    }))

    // Fetch direct community posts (written straight into the community feed)
    const communityPosts = await prisma.communityPost.findMany({
      where: {
        isPublic: true
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    const communityPostIds = communityPosts.map(p => p.id)

    // Aggregate likes/comments for direct community posts using the shared
    // PostLike/PostComment tables (postType 'COMMUNITY_POST').
    const communityLikeCounts = communityPostIds.length
      ? await prisma.postLike.groupBy({
          by: ['postId'],
          where: {
            postId: { in: communityPostIds },
            postType: 'COMMUNITY_POST'
          },
          _count: { id: true }
        })
      : []

    const communityCommentCounts = communityPostIds.length
      ? await prisma.postComment.groupBy({
          by: ['postId'],
          where: {
            postId: { in: communityPostIds },
            postType: 'COMMUNITY_POST'
          },
          _count: { id: true }
        })
      : []

    const communityUserLikes = communityPostIds.length
      ? await prisma.postLike.findMany({
          where: {
            userId: session.user.id,
            postId: { in: communityPostIds },
            postType: 'COMMUNITY_POST'
          },
          select: { postId: true }
        })
      : []

    const communityUserLikedPosts = new Set(communityUserLikes.map(like => like.postId))
    const communityLikeCountMap = new Map(communityLikeCounts.map(lc => [lc.postId, lc._count.id]))
    const communityCommentCountMap = new Map(communityCommentCounts.map(cc => [cc.postId, cc._count.id]))

    const directPosts = communityPosts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      user: post.user,
      // Direct community posts are not tied to an exercise; the frontend treats
      // `exercise` as optional.
      exercise: undefined,
      // SavedPost is keyed to exercise submissions only, so direct posts are
      // simply not savable.
      isSaved: false,
      savedPostId: null,
      likesCount: communityLikeCountMap.get(post.id) ?? 0,
      commentsCount: communityCommentCountMap.get(post.id) ?? 0,
      isLikedByUser: communityUserLikedPosts.has(post.id)
    }))

    // Merge both sources, re-sort by createdAt desc, and cap at 50.
    const posts = [...submissionPosts, ...directPosts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching community posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, content } = await req.json()

    const trimmedTitle = typeof title === 'string' ? title.trim() : ''
    const trimmedContent = typeof content === 'string' ? content.trim() : ''

    if (!trimmedTitle || !trimmedContent) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const post = await prisma.communityPost.create({
      data: {
        title: trimmedTitle,
        content: trimmedContent,
        userId: session.user.id,
        isPublic: true,
        exerciseId: null
      }
    })

    return NextResponse.json(
      { message: 'Post created successfully', postId: post.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating community post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
