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

    const { requestId } = await req.json()

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    // Find the friend request
    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    })

    if (!friendRequest) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 })
    }

    if (friendRequest.receiverId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to reject this request' }, { status: 403 })
    }

    if (friendRequest.status !== 'pending') {
      return NextResponse.json({ error: 'Request is no longer pending' }, { status: 400 })
    }

    // Update friend request status to rejected
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' }
    })

    return NextResponse.json({ message: 'Friend request rejected' })
  } catch (error) {
    console.error('Reject friend request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
