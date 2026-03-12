import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import '@/lib/types'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if the work belongs to the user
    const existingWork = await prisma.publishedWork.findUnique({
      where: { id }
    })

    if (!existingWork) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      )
    }

    if (existingWork.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, externalLink, workType, genre } = body

    const work = await prisma.publishedWork.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(externalLink && { externalLink }),
        ...(workType && { workType }),
        ...(genre && { genre })
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ work })
  } catch (error) {
    console.error('Error updating work:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if the work belongs to the user
    const existingWork = await prisma.publishedWork.findUnique({
      where: { id }
    })

    if (!existingWork) {
      return NextResponse.json(
        { error: 'Work not found' },
        { status: 404 }
      )
    }

    if (existingWork.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.publishedWork.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting work:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
