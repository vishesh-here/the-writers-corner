import { Navigation } from '@/components/navigation'
import { MyWorksContent } from '@/components/works/my-works-content'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function MyWorksPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />
      <main>
        <MyWorksContent />
      </main>
    </div>
  )
}
