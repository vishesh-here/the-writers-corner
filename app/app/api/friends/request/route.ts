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

    const { receiverId } = await req.json()

    if (!receiverId) {
      return NextResponse.json({ error: 'Receiver ID is required' }, { status: 400 })
    }

    if (receiverId === session.user.id) {
      return NextResponse.json({ error: 'Cannot send friend request to yourself' }, { status: 400 })
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } })
    if (!receiver) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if already friends
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, user2Id: receiverId },
          { user1Id: receiverId, user2Id: session.user.id },
        ]
      }
    })

    if (existingFriendship) {
      return NextResponse.json({ error: 'Already friends with this user' }, { status: 400 })
    }

    // Check for existing pending request (either direction)
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId, status: 'pending' },
          { senderId: receiverId, receiverId: session.user.id, status: 'pending' },
        ]
      }
    })

    if (existingRequest) {
      return NextResponse.json({ error: 'Friend request already exists' }, { status: 400 })
    }

    // Create friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: session.user.id,
        receiverId,
        status: 'pending',
      },
      include: {
        receiver: {
          select: { id: true, name: true, firstName: true, lastName: true }
        }
      }
    })

    return NextResponse.json({ friendRequest, message: 'Friend request sent' }, { status: 201 })
  } catch (error) {
    console.error('Friend request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
