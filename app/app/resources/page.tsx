
import { Navigation } from '@/components/navigation'
import { ResourcesLibrary } from '@/components/resources/resources-library'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />
      <main>
        <ResourcesLibrary />
      </main>
    </div>
  )
}
