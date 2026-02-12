import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all friendships where current user is either user1 or user2
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: session.user.id },
          { user2Id: session.user.id },
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            bio: true,
            interests: true,
            genres: true,
            image: true,
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            bio: true,
            interests: true,
            genres: true,
            image: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Extract friend info (the other user in each friendship)
    const friends = friendships.map((friendship: typeof friendships[0]) => {
      const friend = friendship.user1Id === session.user.id 
        ? friendship.user2 
        : friendship.user1
      return {
        ...friend,
        friendshipId: friendship.id,
        friendsSince: friendship.createdAt
      }
    })

    return NextResponse.json({ friends })
  } catch (error) {
    console.error('Get friends list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
