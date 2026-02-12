'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus, AlertTriangle } from 'lucide-react'
import { WorkCard } from './work-card'
import { AddWorkDialog } from './add-work-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  createdAt: string
  user: {
    firstName?: string
    lastName?: string
    name?: string
  }
}

export function MyWorksContent() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [editWork, setEditWork] = useState<Work | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchWorks()
  }, [])

  const fetchWorks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/works/my-works')
      if (response.ok) {
        const data = await response.json()
        setWorks(data.works || [])
      }
    } catch (error) {
      console.error('Error fetching works:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    const work = works.find(w => w.id === id)
    if (work) {
      setEditWork(work)
      setEditDialogOpen(true)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    
    try {
      const response = await fetch(`/api/works/${deleteId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setWorks(works.filter(w => w.id !== deleteId))
      }
    } catch (error) {
      console.error('Error deleting work:', error)
    } finally {
      setDeleting(false)
      setDeleteId(null)
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
            My Published Works
          </h1>
          <p className="text-xl font-serif text-forest max-w-3xl mx-auto leading-relaxed mb-8">
            Manage your collection of published works. Add links to your stories, poems,
            and articles published elsewhere to showcase your writing portfolio.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
            <div className="text-center">
              <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                {works.length}
              </div>
              <p className="font-serif text-forest text-sm">Works</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                {works.reduce((acc, w) => acc + w.likesCount, 0)}
              </div>
              <p className="font-serif text-forest text-sm">Total Likes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                {works.reduce((acc, w) => acc + w.viewsCount, 0)}
              </div>
              <p className="font-serif text-forest text-sm">Total Views</p>
            </div>
          </div>

          <AddWorkDialog onSuccess={fetchWorks} />
        </motion.div>

        {/* Works List */}
        {works.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-forest mx-auto mb-4" />
            <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
              No works yet
            </h3>
            <p className="font-serif text-forest mb-6 max-w-md mx-auto">
              Start building your portfolio by adding links to your published works.
              Share your stories, poems, and essays with the community!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {works.map((work, index) => (
              <WorkCard 
                key={work.id} 
                work={work} 
                showActions 
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
                index={index} 
              />
            ))}
          </div>
        )}

        {/* View Featured CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 p-8 bg-sepia/50 rounded-sm border-2 border-ink"
        >
          <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
            Discover More Works
          </h3>
          <p className="font-serif text-forest mb-6 max-w-2xl mx-auto">
            Browse the featured works page to discover amazing stories, poems, and essays
            from fellow writers in our community.
          </p>
          <Link href="/featured-works">
            <Button className="btn-vintage">
              View Featured Works
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <AddWorkDialog 
        editWork={editWork}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) setEditWork(null)
        }}
        onSuccess={fetchWorks}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-parchment border-2 border-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-typewriter text-ink flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rust" />
              Delete Work?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-serif text-forest">
              Are you sure you want to delete this work? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-typewriter">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 font-typewriter"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
