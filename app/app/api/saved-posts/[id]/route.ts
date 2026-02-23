import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import '@/lib/types'

export const dynamic = 'force-dynamic'

// DELETE /api/saved-posts/[id] - Unsave a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Find the saved post and verify ownership
    const savedPost = await prisma.savedPost.findUnique({
      where: { id }
    })

    if (!savedPost) {
      return NextResponse.json(
        { error: 'Saved post not found' },
        { status: 404 }
      )
    }

    if (savedPost.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - you can only unsave your own saved posts' },
        { status: 403 }
      )
    }

    // Delete the saved post
    await prisma.savedPost.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unsaving post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
