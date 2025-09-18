
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PenTool, BookOpen, Target, Users } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function HeroSection() {
  const { data: session } = useSession()

  return (
    <section className="relative py-20 px-4 paper-texture overflow-hidden">
      <div className="max-w-content mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-typewriter font-bold text-ink mb-6 leading-tight">
            Master the Art of{' '}
            <span className="text-rust typewriter inline-block">Novel Writing</span>
          </h1>
          <p className="text-xl md:text-2xl font-serif text-forest max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into compelling novels with our comprehensive guides, 
            interactive exercises, and supportive writer community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          {session ? (
            <Link href="/topics">
              <Button size="lg" className="btn-vintage text-xl px-8 py-4">
                Continue Learning
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-rust text-parchment hover:bg-rust/80 font-typewriter text-xl px-8 py-4">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline" className="btn-vintage text-xl px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          <div className="text-center">
            <motion.div 
              className="text-4xl font-typewriter font-bold text-rust mb-2 counter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              4
            </motion.div>
            <p className="font-serif text-forest">Core Topics</p>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-4xl font-typewriter font-bold text-rust mb-2 counter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              32
            </motion.div>
            <p className="font-serif text-forest">Exercises</p>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-4xl font-typewriter font-bold text-rust mb-2 counter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              12
            </motion.div>
            <p className="font-serif text-forest">Weeks</p>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-4xl font-typewriter font-bold text-rust mb-2 counter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              1
            </motion.div>
            <p className="font-serif text-forest">Novel</p>
          </div>
        </motion.div>

        {/* Visual Element */}
        <motion.div 
          className="absolute top-10 right-10 opacity-10 hidden lg:block"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.95, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <PenTool className="w-32 h-32 text-ink" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-10 opacity-10 hidden lg:block"
          animate={{ 
            rotate: [0, -3, 3, 0],
            scale: [1, 0.95, 1.05, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <BookOpen className="w-28 h-28 text-ink" />
        </motion.div>
      </div>
    </section>
  )
}
