import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import '@/lib/types'

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
    const { title, description, externalLink, workType, genre } = body

    // Validate required fields
    if (!title || !description || !externalLink || !workType || !genre) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate workType
    if (!['STORY_NOVEL', 'POEM', 'ARTICLE_ESSAY'].includes(workType)) {
      return NextResponse.json(
        { error: 'Invalid work type' },
        { status: 400 }
      )
    }

    const work = await prisma.publishedWork.create({
      data: {
        title,
        description,
        externalLink,
        workType,
        genre,
        userId: session.user.id
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

    return NextResponse.json({ work }, { status: 201 })
  } catch (error) {
    console.error('Error creating work:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
