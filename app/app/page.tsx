
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/sections/hero-section'
import { TopicsSection } from '@/components/sections/topics-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { CTASection } from '@/components/sections/cta-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navigation />
      <main>
        <HeroSection />
        <TopicsSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  )
}
