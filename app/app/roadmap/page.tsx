
import { Navigation } from '@/components/navigation'
import { RoadmapOverview } from '@/components/roadmap/roadmap-overview'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function RoadmapPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />
      <main>
        <RoadmapOverview />
      </main>
    </div>
  )
}
