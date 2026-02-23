import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import '@/lib/types'

export const dynamic = 'force-dynamic'

// GET /api/saved-posts - Get all saved posts for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        submission: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                name: true
              }
            },
            exercise: {
              include: {
                topic: {
                  select: {
                    title: true,
                    slug: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        savedAt: 'desc'
      }
    })

    // Transform to match the expected format
    const posts = savedPosts.map(savedPost => ({
      id: savedPost.submission.id,
      savedPostId: savedPost.id,
      title: savedPost.submission.exercise.title,
      content: savedPost.submission.content,
      createdAt: savedPost.submission.createdAt.toISOString(),
      savedAt: savedPost.savedAt.toISOString(),
      user: savedPost.submission.user,
      exercise: savedPost.submission.exercise
    }))

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching saved posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/saved-posts - Save a post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { submissionId } = body

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    // Check if the submission exists and is public
    const submission = await prisma.exerciseSubmission.findUnique({
      where: { id: submissionId }
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    if (!submission.isPublic) {
      return NextResponse.json(
        { error: 'Cannot save a private submission' },
        { status: 403 }
      )
    }

    // Check if already saved
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        userId_submissionId: {
          userId: session.user.id,
          submissionId
        }
      }
    })

    if (existingSave) {
      return NextResponse.json(
        { error: 'Post already saved' },
        { status: 409 }
      )
    }

    // Create the saved post
    const savedPost = await prisma.savedPost.create({
      data: {
        userId: session.user.id,
        submissionId
      }
    })

    return NextResponse.json({ 
      success: true, 
      savedPost: {
        id: savedPost.id,
        submissionId: savedPost.submissionId,
        savedAt: savedPost.savedAt.toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error saving post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
