import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import '@/lib/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id: workId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if work exists
    const work = await prisma.publishedWork.findUnique({
      where: { id: workId }
    })

    if (!work) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      )
    }

    // Check if user already liked this work
    const existingLike = await prisma.workLike.findUnique({
      where: {
        userId_workId: {
          userId: session.user.id,
          workId
        }
      }
    })

    if (existingLike) {
      // Unlike: remove the like and decrement count
      await prisma.$transaction([
        prisma.workLike.delete({
          where: { id: existingLike.id }
        }),
        prisma.publishedWork.update({
          where: { id: workId },
          data: { likesCount: { decrement: 1 } }
        })
      ])

      return NextResponse.json({ liked: false, message: 'Work unliked' })
    } else {
      // Like: create the like and increment count
      await prisma.$transaction([
        prisma.workLike.create({
          data: {
            userId: session.user.id,
            workId
          }
        }),
        prisma.publishedWork.update({
          where: { id: workId },
          data: { likesCount: { increment: 1 } }
        })
      ])

      return NextResponse.json({ liked: true, message: 'Work liked' })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
