import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { requestId } = await req.json()

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    // Find the friend request
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: { select: { id: true, name: true, firstName: true, lastName: true } }
      }
    })

    if (!friendRequest) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 })
    }

    if (friendRequest.receiverId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to accept this request' }, { status: 403 })
    }

    if (friendRequest.status !== 'pending') {
      return NextResponse.json({ error: 'Request is no longer pending' }, { status: 400 })
    }

    // Create friendship and update request status in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update friend request status
      await tx.friendRequest.update({
        where: { id: requestId },
        data: { status: 'accepted' }
      })

      // Create friendship (ensure user1Id < user2Id for consistency)
      const [user1Id, user2Id] = [friendRequest.senderId, session.user.id].sort()
      
      const friendship = await tx.friendship.create({
        data: { user1Id, user2Id }
      })

      return friendship
    })

    return NextResponse.json({ 
      message: 'Friend request accepted',
      friendship: result,
      friend: friendRequest.sender
    })
  } catch (error) {
    console.error('Accept friend request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
