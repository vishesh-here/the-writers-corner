'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Filter, Star, TrendingUp } from 'lucide-react'
import { WorkCard } from './work-card'
import Link from 'next/link'

interface Work {
  id: string
  title: string
  description: string
  externalLink: string
  workType: 'STORY_NOVEL' | 'POEM' | 'ARTICLE_ESSAY'
  genre: string
  likesCount: number
  viewsCount: number
  hasLiked: boolean
  createdAt: string
  user: {
    id: string
    firstName?: string
    lastName?: string
    name?: string
  }
}

const GENRES = [
  'All Genres',
  'Fiction',
  'Non-Fiction',
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Romance',
  'Horror',
  'Thriller',
  'Drama',
  'Comedy',
  'Poetry',
  'Literary Fiction',
  'Historical',
  'Self-Help',
  'Biography',
  'Other'
]

export function FeaturedWorksContent() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'likes' | 'views'>('likes')
  const [genreFilter, setGenreFilter] = useState('All Genres')
  const [workTypeFilter, setWorkTypeFilter] = useState('all')

  useEffect(() => {
    fetchWorks()
  }, [sortBy, genreFilter, workTypeFilter])

  const fetchWorks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ sortBy })
      if (genreFilter !== 'All Genres') {
        params.append('genre', genreFilter)
      }
      if (workTypeFilter !== 'all') {
        params.append('workType', workTypeFilter)
      }
      
      const response = await fetch(`/api/works/featured?${params}`)
      if (response.ok) {
        const data = await response.json()
        setWorks(data.works || [])
      }
    } catch (error) {
      console.error('Error fetching featured works:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
          <h1 className="text-4xl md:text-5xl font-typewriter font-bold text-ink mb-6">
            Featured Works
          </h1>
          <p className="text-xl font-serif text-forest max-w-3xl mx-auto leading-relaxed mb-8">
            Discover outstanding published works from our community of talented writers.
            Browse stories, poems, and essays that have captured readers' hearts.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
            <div className="text-center">
              <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                {works.length}
              </div>
              <p className="font-serif text-forest text-sm">Published Works</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                {works.reduce((acc, w) => acc + w.likesCount, 0)}
              </div>
              <p className="font-serif text-forest text-sm">Total Likes</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="card-vintage border-2">
            <CardHeader>
              <CardTitle className="font-typewriter text-ink flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter & Sort
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="font-typewriter text-ink block mb-2">Sort By:</label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'likes' | 'views')}>
                    <SelectTrigger className="font-serif border-2 border-ink focus:border-rust">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="likes">
                        <span className="flex items-center gap-2">
                          <Star className="w-4 h-4" /> Most Liked
                        </span>
                      </SelectItem>
                      <SelectItem value="views">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Most Viewed
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-typewriter text-ink block mb-2">Work Type:</label>
                  <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
                    <SelectTrigger className="font-serif border-2 border-ink focus:border-rust">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="STORY_NOVEL">Story/Novel</SelectItem>
                      <SelectItem value="POEM">Poem</SelectItem>
                      <SelectItem value="ARTICLE_ESSAY">Article/Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-typewriter text-ink block mb-2">Genre:</label>
                  <Select value={genreFilter} onValueChange={setGenreFilter}>
                    <SelectTrigger className="font-serif border-2 border-ink focus:border-rust">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Works Grid */}
        {works.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-forest mx-auto mb-4" />
            <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
              No works found
            </h3>
            <p className="font-serif text-forest mb-6 max-w-md mx-auto">
              {genreFilter !== 'All Genres' || workTypeFilter !== 'all'
                ? 'Try adjusting your filters to see more works.'
                : 'Be the first to share your published work with the community!'
              }
            </p>
            <Link href="/my-works">
              <Button className="btn-vintage">
                Add Your Work
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {works.map((work, index) => (
              <WorkCard key={work.id} work={work} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 p-8 bg-sepia/50 rounded-sm border-2 border-ink"
        >
          <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
            Share Your Published Work
          </h3>
          <p className="font-serif text-forest mb-6 max-w-2xl mx-auto">
            Have you published a story, poem, or article? Add it to our collection
            and let fellow writers discover your work!
          </p>
          <Link href="/my-works">
            <Button className="btn-vintage">
              Manage Your Works
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
