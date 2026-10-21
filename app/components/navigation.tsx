'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PenTool, BookOpen, Users, Map, User, LogOut, Sparkles, Bookmark, Search, UserPlus, Star, FileText, Library, Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'

export function Navigation() {
  const { data: session } = useSession()
  const [pendingCount, setPendingCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (session) {
      // Fetch pending friend requests count
      fetch('/api/friends/pending')
        .then(res => res.json())
        .then(data => setPendingCount(data.totalPending || 0))
        .catch(() => setPendingCount(0))
    }
  }, [session])

  const navLinks = [
    { href: '/topics', label: 'Topics', icon: BookOpen },
    { href: '/featured-works', label: 'Featured Works', icon: Star },
    { href: '/my-works', label: 'My Works', icon: FileText },
    { href: '/resources', label: 'Resources', icon: Library },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/roadmap', label: 'Roadmap', icon: Map },
    { href: '/ai-review', label: 'AI Review', icon: Sparkles },
    { href: '/saved-posts', label: 'Saved', icon: Bookmark },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/friends', label: 'Friends', icon: UserPlus },
  ]

  const closeMenu = () => setMenuOpen(false)

  const renderLink = ({ href, label, icon: Icon }: (typeof navLinks)[number]) => (
    <Link
      key={href}
      href={href}
      onClick={closeMenu}
      className="flex items-center space-x-2 text-ink hover:text-rust transition-colors font-typewriter relative py-1"
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {href === '/friends' && pendingCount > 0 && (
        <Badge className="ml-1 bg-rust text-parchment text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
          {pendingCount}
        </Badge>
      )}
    </Link>
  )

  return (
    <motion.header
      className="sticky top-0 z-50 bg-sepia/90 backdrop-blur-sm border-b-2 border-ink paper-texture"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav aria-label="Main navigation" className="max-w-content mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" onClick={closeMenu} className="flex items-center space-x-3 group min-w-0">
            <motion.div
              className="p-2 bg-ink text-parchment rounded-sm shrink-0"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <PenTool className="w-6 h-6" />
            </motion.div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-typewriter font-bold text-ink truncate">
                The Writer's Corner
              </h2>
              <p className="hidden sm:block text-sm text-forest font-serif">Master the Art of Novel Writing</p>
            </div>
          </Link>

          <div className="flex items-center space-x-3 shrink-0">
            {session ? (
              <>
                <Link href="/profile" aria-label="Profile" className="text-ink hover:text-rust transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <span className="text-ink font-typewriter hidden md:block">
                  Welcome, {(session.user as any)?.firstName || session.user?.name?.split(' ')[0] || 'Writer'}!
                </span>
                <Button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex bg-rust text-parchment border-ink hover:bg-rust/80 font-typewriter"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="btn-vintage">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-rust text-parchment hover:bg-rust/80 font-typewriter">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Hamburger toggle: below lg when signed in, below sm when signed out */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`${session ? 'lg:hidden' : 'sm:hidden'} p-2 text-ink hover:text-rust border-2 border-ink rounded-sm`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop links: own row that wraps instead of overflowing horizontally */}
        {session && (
          <div className="hidden lg:flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-3 pt-3 border-t border-ink/20">
            {navLinks.map(renderLink)}
          </div>
        )}

        {/* Mobile / tablet collapsible menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className={`${session ? 'lg:hidden' : 'sm:hidden'} mt-3 pt-3 border-t border-ink/20 flex flex-col space-y-2`}
          >
            {session ? (
              <>
                {navLinks.map(renderLink)}
                <button
                  type="button"
                  onClick={() => { closeMenu(); signOut({ callbackUrl: '/' }) }}
                  className="sm:hidden flex items-center space-x-2 text-rust font-typewriter py-1 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link href="/auth/signin" onClick={closeMenu} className="text-ink hover:text-rust font-typewriter py-1">
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>
    </motion.header>
  )
}
