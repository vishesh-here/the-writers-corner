
import { Navigation } from '@/components/navigation'
import { TopicsOverview } from '@/components/topics/topics-overview'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function TopicsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />
      <main>
        <TopicsOverview />
      </main>
    </div>
  )
}
