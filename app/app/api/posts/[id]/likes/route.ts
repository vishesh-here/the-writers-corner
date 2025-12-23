
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/posts/:id/likes - Get like count and who liked (optionally)
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
    
    // Get the URL search params
    const { searchParams } = new URL(request.url)
    const includeUsers = searchParams.get('includeUsers') === 'true'

    // Count total likes
    const likeCount = await prisma.like.count({
      where: { postId }
    })

    // Check if current user liked this post
    const userLiked = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    // Optionally include users who liked
    let likedBy: any[] = []
    if (includeUsers) {
      const likes = await prisma.like.findMany({
        where: { postId },
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
        take: 50 // Limit to 50 users
      })

      likedBy = likes.map(like => ({
        userId: like.user.id,
        name: like.user.firstName && like.user.lastName
          ? `${like.user.firstName} ${like.user.lastName}`
          : like.user.name || 'Anonymous'
      }))
    }

    return NextResponse.json({
      likeCount,
      userLiked: !!userLiked,
      likedBy: includeUsers ? likedBy : undefined
    })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
