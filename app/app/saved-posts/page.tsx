'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, BookmarkX, PenTool } from 'lucide-react'
import { DownloadPostButton } from '@/components/community/download-post-button'
import Link from 'next/link'

interface SavedPost {
  id: string
  savedPostId: string
  title: string
  content: string
  createdAt: string
  savedAt: string
  user: {
    firstName?: string
    lastName?: string
    name?: string
  }
  exercise?: {
    title: string
    topic: {
      title: string
      slug: string
    }
  }
}

export default function SavedPostsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<SavedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [unsavingPostId, setUnsavingPostId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchSavedPosts()
    }
  }, [session])

  const fetchSavedPosts = async () => {
    try {
      const response = await fetch('/api/saved-posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const unsavePost = async (savedPostId: string) => {
    if (unsavingPostId) return
    
    setUnsavingPostId(savedPostId)
    
    try {
      const response = await fetch(`/api/saved-posts/${savedPostId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setPosts(prev => prev.filter(p => p.savedPostId !== savedPostId))
      }
    } catch (error) {
      console.error('Error unsaving post:', error)
    } finally {
      setUnsavingPostId(null)
    }
  }

  const getExcerpt = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <section className="py-12 px-4 paper-texture min-h-screen">
        <div className="max-w-content mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-sepia rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-sepia rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  return (
    <section className="py-12 px-4 paper-texture min-h-screen">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Bookmark className="w-10 h-10 text-rust" />
            <h1 className="text-4xl md:text-5xl font-typewriter font-bold text-ink">
              Saved Posts
            </h1>
          </div>
          <p className="text-xl font-serif text-forest max-w-3xl mx-auto leading-relaxed">
            Your personal collection of inspiring writing from the community.
            Return to these pieces whenever you need motivation or reference.
          </p>
        </motion.div>

        {/* Saved Posts Count */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 text-center"
          >
            <Badge className="bg-rust/20 text-rust font-typewriter text-lg px-4 py-2">
              {posts.length} saved {posts.length === 1 ? 'post' : 'posts'}
            </Badge>
          </motion.div>
        )}

        {/* Empty State */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-16"
          >
            <PenTool className="w-16 h-16 text-forest mx-auto mb-4" />
            <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
              No saved posts yet
            </h3>
            <p className="font-serif text-forest mb-6 max-w-md mx-auto">
              Browse the community and save posts that inspire you. 
              They'll appear here for easy access later.
            </p>
            <Link href="/community">
              <Button className="btn-vintage">
                Explore Community
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.savedPostId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-vintage border-2 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="font-typewriter text-ink text-xl mb-2">
                          {post.title || 'Exercise Response'}
                        </CardTitle>
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <Badge className="bg-rust/20 text-rust font-typewriter">
                            {post.user?.firstName && post.user?.lastName 
                              ? `${post.user.firstName} ${post.user.lastName}`
                              : post.user?.name || 'Anonymous Writer'
                            }
                          </Badge>
                          {post.exercise && (
                            <Badge className="bg-gold/20 text-ink font-typewriter">
                              {post.exercise.topic.title}
                            </Badge>
                          )}
                          <span className="text-sm font-serif text-forest">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                        {post.exercise && (
                          <p className="text-sm font-serif text-forest mb-2">
                            From exercise: <span className="font-semibold">{post.exercise.title}</span>
                          </p>
                        )}
                        <p className="text-xs font-serif text-forest/70">
                          Saved on {formatDate(post.savedAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-serif text-forest leading-relaxed mb-4">
                      {getExcerpt(post.content)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-rust hover:text-rust/80"
                          onClick={() => unsavePost(post.savedPostId)}
                          disabled={unsavingPostId === post.savedPostId}
                        >
                          <BookmarkX className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                        <DownloadPostButton post={post} />
                      </div>
                      
                      {post.exercise && (
                        <Link href={`/topics/${post.exercise.topic.slug}`}>
                          <Button variant="outline" size="sm" className="btn-vintage text-xs">
                            Try This Exercise
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16 p-8 bg-sepia/50 rounded-sm border-2 border-ink"
          >
            <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
              Discover More Inspiration
            </h3>
            <p className="font-serif text-forest mb-6 max-w-2xl mx-auto">
              The community is full of talented writers sharing their work. 
              Continue exploring to find more pieces worth saving!
            </p>
            <Link href="/community">
              <Button className="btn-vintage">
                Browse Community
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
