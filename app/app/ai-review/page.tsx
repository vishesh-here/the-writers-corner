import { Navigation } from '@/components/navigation'
import { AIReviewForm } from '@/components/ai-review/ai-review-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sparkles, Shield, Zap, BookOpenCheck } from 'lucide-react'

export const metadata = {
  title: 'AI Writing Review | The Writer\'s Corner',
  description: 'Get comprehensive AI-powered feedback on your writing including grammar, style, structure, and content suggestions.',
}

export default async function AIReviewPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-rust/10 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-rust" />
          </div>
          <h1 className="text-4xl font-typewriter font-bold text-ink mb-4">
            AI Writing Review
          </h1>
          <p className="text-lg font-serif text-ink/70 max-w-2xl mx-auto">
            Get instant, comprehensive feedback on your writing powered by advanced AI.
            Improve your craft with detailed analysis of grammar, style, structure, and more.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-start gap-3 p-4 bg-sepia/30 rounded-lg border border-ink/10">
            <div className="p-2 bg-rust/10 rounded-md">
              <BookOpenCheck className="w-5 h-5 text-rust" />
            </div>
            <div>
              <h3 className="font-typewriter text-ink font-semibold">Comprehensive Analysis</h3>
              <p className="text-sm font-serif text-ink/60">
                Grammar, spelling, style, tone, structure, and content suggestions.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-sepia/30 rounded-lg border border-ink/10">
            <div className="p-2 bg-rust/10 rounded-md">
              <Shield className="w-5 h-5 text-rust" />
            </div>
            <div>
              <h3 className="font-typewriter text-ink font-semibold">Secure & Private</h3>
              <p className="text-sm font-serif text-ink/60">
                Your API key is never stored. Used only for the current request.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-sepia/30 rounded-lg border border-ink/10">
            <div className="p-2 bg-rust/10 rounded-md">
              <Zap className="w-5 h-5 text-rust" />
            </div>
            <div>
              <h3 className="font-typewriter text-ink font-semibold">Instant Feedback</h3>
              <p className="text-sm font-serif text-ink/60">
                Get detailed review results in seconds with actionable suggestions.
              </p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <AIReviewForm />

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm font-serif text-ink/50">
            This feature uses OpenAI's GPT-4o model. You are responsible for any API usage charges.
            <br />
            For best results, submit text between 50 and 50,000 characters.
          </p>
        </div>
      </main>
    </div>
  )
}
