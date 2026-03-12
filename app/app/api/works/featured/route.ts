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
    const sortBy = searchParams.get('sortBy') || 'likes' // 'likes' or 'views'
    const genre = searchParams.get('genre')
    const workType = searchParams.get('workType')

    const whereClause: any = {}
    if (genre) {
      whereClause.genre = genre
    }
    if (workType) {
      whereClause.workType = workType
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
      orderBy: sortBy === 'views' 
        ? { viewsCount: 'desc' } 
        : { likesCount: 'desc' },
      take: 50
    })

    // Transform to include hasLiked boolean
    const transformedWorks = works.map(work => ({
      ...work,
      hasLiked: work.likes.length > 0,
      likes: undefined // Remove the likes array from response
    }))

    return NextResponse.json({ works: transformedWorks })
  } catch (error) {
    console.error('Error fetching featured works:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
