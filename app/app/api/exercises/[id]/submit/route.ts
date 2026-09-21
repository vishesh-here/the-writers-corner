
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  isDemoFailureMode,
  DEMO_WRITE_DISABLED_BODY,
  DEMO_WRITE_DISABLED_STATUS,
} from '@/lib/demo-mode'
import '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // DEMO_FAILURE_MODE: writes are disabled in demo mode. Return a controlled
    // 503 instead of mutating the database. Fully reversible — unset the flag.
    if (isDemoFailureMode()) {
      return NextResponse.json(DEMO_WRITE_DISABLED_BODY, {
        status: DEMO_WRITE_DISABLED_STATUS,
      })
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content, isPublic = false } = await req.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Check if exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: params.id }
    })

    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      )
    }

    // Upsert submission
    const submission = await prisma.exerciseSubmission.upsert({
      where: {
        userId_exerciseId: {
          userId: session.user.id,
          exerciseId: params.id
        }
      },
      update: {
        content: content.trim(),
        isPublic
      },
      create: {
        content: content.trim(),
        userId: session.user.id,
        exerciseId: params.id,
        isPublic
      }
    })

    return NextResponse.json({ 
      message: 'Submission saved successfully',
      submissionId: submission.id 
    })
  } catch (error) {
    console.error('Error saving submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
