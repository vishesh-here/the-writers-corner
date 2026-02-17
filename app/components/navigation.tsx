
'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PenTool, BookOpen, Users, Map, Library, User, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

export function Navigation() {
  const { data: session } = useSession()

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-sepia/90 backdrop-blur-sm border-b-2 border-ink paper-texture"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-content mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="p-2 bg-ink text-parchment rounded-sm"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <PenTool className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-typewriter font-bold text-ink">
                The Writer's Corner
              </h1>
              <p className="text-sm text-forest font-serif">Master the Art of Novel Writing</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/topics" className="flex items-center space-x-2 text-ink hover:text-rust transition-colors font-typewriter">
                    <BookOpen className="w-4 h-4" />
                    <span>Topics</span>
                  </Link>
                  <Link href="/resources" className="flex items-center space-x-2 text-ink hover:text-rust transition-colors font-typewriter">
                    <Library className="w-4 h-4" />
                    <span>Resources</span>
                  </Link>
                  <Link href="/community" className="flex items-center space-x-2 text-ink hover:text-rust transition-colors font-typewriter">
                    <Users className="w-4 h-4" />
                    <span>Community</span>
                  </Link>
                  <Link href="/roadmap" className="flex items-center space-x-2 text-ink hover:text-rust transition-colors font-typewriter">
                    <Map className="w-4 h-4" />
                    <span>Roadmap</span>
                  </Link>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-ink font-typewriter hidden sm:block">
                    Welcome, {(session.user as any)?.firstName || session.user?.name?.split(' ')[0] || 'Writer'}!
                  </span>
                  <Button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    variant="outline"
                    size="sm"
                    className="bg-rust text-parchment border-ink hover:bg-rust/80 font-typewriter"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm" className="btn-vintage">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-rust text-parchment hover:bg-rust/80 font-typewriter">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
