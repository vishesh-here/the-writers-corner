
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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
    const category = searchParams.get('category')
    const platform = searchParams.get('platform')
    const difficultyLevel = searchParams.get('difficultyLevel')
    const resourceType = searchParams.get('resourceType')
    const search = searchParams.get('search')

    // Build where clause based on filters
    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (platform && platform !== 'all') {
      where.platform = platform
    }

    if (difficultyLevel && difficultyLevel !== 'all') {
      where.difficultyLevel = difficultyLevel
    }

    if (resourceType && resourceType !== 'all') {
      where.resourceType = resourceType
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const resources = await prisma.writingResource.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
