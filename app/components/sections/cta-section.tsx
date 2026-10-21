
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PenTool } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function CTASection() {
  const { data: session } = useSession()

  return (
    <section className="py-20 px-4 bg-sepia/50 paper-texture">
      <div className="max-w-content mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="mx-auto w-20 h-20 bg-ink text-parchment rounded-sm flex items-center justify-center mb-8"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <PenTool className="w-10 h-10" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-typewriter font-bold text-ink mb-6">
            Your Novel Awaits
          </h2>
          <p className="text-xl font-serif text-forest max-w-2xl mx-auto mb-8 leading-relaxed">
            Stop dreaming about writing that novel and start creating it. 
            Join thousands of writers who have transformed their ideas into finished manuscripts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session ? (
              <>
                <Link href="/topics">
                  <Button size="lg" className="btn-vintage text-xl px-8 py-4">
                    Continue Learning
                  </Button>
                </Link>
                <Link href="/roadmap">
                  <Button size="lg" variant="outline" className="bg-rust text-parchment hover:bg-rust/80 font-typewriter text-xl px-8 py-4">
                    View Roadmap
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-rust text-parchment hover:bg-rust/80 font-typewriter text-xl px-8 py-4">
                    Start Writing Today
                  </Button>
                </Link>
                <p className="text-sm font-serif text-forest">
                  Free to join • No credit card required
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
