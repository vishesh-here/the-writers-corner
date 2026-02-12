import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { friendId } = await req.json()

    if (!friendId) {
      return NextResponse.json({ error: 'Friend ID is required' }, { status: 400 })
    }

    // Find and delete the friendship
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: friendId },
          { user1Id: friendId, user2Id: session.user.id },
        ]
      }
    })

    if (!friendship) {
      return NextResponse.json({ error: 'Friendship not found' }, { status: 404 })
    }

    await prisma.friendship.delete({
      where: { id: friendship.id }
    })

    return NextResponse.json({ message: 'Friend removed successfully' })
  } catch (error) {
    console.error('Unfriend error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
