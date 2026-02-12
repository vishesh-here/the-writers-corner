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

    // Get received pending requests
    const received = await prisma.friendRequest.findMany({
      where: {
        receiverId: session.user.id,
        status: 'pending'
      },
      include: {
        sender: {
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

    // Get sent pending requests
    const sent = await prisma.friendRequest.findMany({
      where: {
        senderId: session.user.id,
        status: 'pending'
      },
      include: {
        receiver: {
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

    return NextResponse.json({
      received: received.map((r: typeof received[0]) => ({
        requestId: r.id,
        user: r.sender,
        createdAt: r.createdAt
      })),
      sent: sent.map((s: typeof sent[0]) => ({
        requestId: s.id,
        user: s.receiver,
        createdAt: s.createdAt
      })),
      totalPending: received.length
    })
  } catch (error) {
    console.error('Get pending requests error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
