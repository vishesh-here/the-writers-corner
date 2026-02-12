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

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const interests = searchParams.getAll('interests')
    const genres = searchParams.getAll('genres')

    // Build where clause
    const whereConditions: any[] = [
      { id: { not: session.user.id } } // Exclude current user
    ]

    if (query) {
      whereConditions.push({
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ]
      })
    }

    if (interests.length > 0) {
      whereConditions.push({
        interests: { hasSome: interests }
      })
    }

    if (genres.length > 0) {
      whereConditions.push({
        genres: { hasSome: genres }
      })
    }

    const users = await prisma.user.findMany({
      where: { AND: whereConditions },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        bio: true,
        interests: true,
        genres: true,
        image: true,
      },
      take: 50,
    })

    // Get friendship status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user: typeof users[0]) => {
        // Check if already friends
        const friendship = await prisma.friendship.findFirst({
          where: {
            OR: [
              { user1Id: session.user.id, user2Id: user.id },
              { user1Id: user.id, user2Id: session.user.id },
            ]
          }
        })

        // Check for pending friend request
        const sentRequest = await prisma.friendRequest.findFirst({
          where: {
            senderId: session.user.id,
            receiverId: user.id,
            status: 'pending'
          }
        })

        const receivedRequest = await prisma.friendRequest.findFirst({
          where: {
            senderId: user.id,
            receiverId: session.user.id,
            status: 'pending'
          }
        })

        let friendshipStatus = 'none'
        if (friendship) friendshipStatus = 'friends'
        else if (sentRequest) friendshipStatus = 'request_sent'
        else if (receivedRequest) friendshipStatus = 'request_received'

        return { ...user, friendshipStatus }
      })
    )

    return NextResponse.json({ users: usersWithStatus })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
