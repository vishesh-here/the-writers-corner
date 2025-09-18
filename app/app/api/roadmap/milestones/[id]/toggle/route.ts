
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { completed } = await req.json()

    // Check if milestone exists
    const milestone = await prisma.milestone.findUnique({
      where: { id: params.id }
    })

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      )
    }

    // Upsert user progress
    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_milestoneId: {
          userId: session.user.id,
          milestoneId: params.id
        }
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null
      },
      create: {
        userId: session.user.id,
        milestoneId: params.id,
        completed,
        completedAt: completed ? new Date() : null
      }
    })

    return NextResponse.json({ 
      message: 'Progress updated successfully',
      userProgress: {
        ...userProgress,
        completedAt: userProgress.completedAt?.toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating milestone progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
