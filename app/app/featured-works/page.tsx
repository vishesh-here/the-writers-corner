import { Navigation } from '@/components/navigation'
import { FeaturedWorksContent } from '@/components/works/featured-works-content'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function FeaturedWorksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <FeaturedWorksContent />
      </main>
    </div>
  )
}
