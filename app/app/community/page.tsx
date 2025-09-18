
import { Navigation } from '@/components/navigation'
import { CommunityOverview } from '@/components/community/community-overview'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function CommunityPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />
      <main>
        <CommunityOverview />
      </main>
    </div>
  )
}
