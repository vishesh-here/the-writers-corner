import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')
    const workType = searchParams.get('workType')
    const query = searchParams.get('q')

    const whereClause: any = {}
    
    if (genre) {
      whereClause.genre = genre
    }
    if (workType) {
      whereClause.workType = workType
    }
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    const works = await prisma.publishedWork.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true
          }
        },
        likes: {
          where: {
            userId: session.user.id
          },
          select: {
            id: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    // Transform to include hasLiked boolean
    const transformedWorks = works.map(work => ({
      ...work,
      hasLiked: work.likes.length > 0,
      likes: undefined
    }))

    return NextResponse.json({ works: transformedWorks })
  } catch (error) {
    console.error('Error searching works:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
