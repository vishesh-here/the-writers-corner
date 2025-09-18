
import { Navigation } from '@/components/navigation'
import { TopicDetail } from '@/components/topics/topic-detail'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

interface TopicPageProps {
  params: {
    slug: string
  }
}

export const dynamic = "force-dynamic"

export default async function TopicPage({ params }: TopicPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const topic = await prisma.writingTopic.findUnique({
    where: { slug: params.slug },
    include: {
      exercises: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!topic) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />
      <main>
        <TopicDetail topic={topic} />
      </main>
    </div>
  )
}
