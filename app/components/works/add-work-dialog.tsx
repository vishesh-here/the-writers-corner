'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'

interface AddWorkDialogProps {
  onSuccess?: () => void
  editWork?: {
    id: string
    title: string
    description: string
    externalLink: string
    workType: string
    genre: string
  } | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const GENRES = [
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

export function AddWorkDialog({ onSuccess, editWork, open, onOpenChange }: AddWorkDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [title, setTitle] = useState(editWork?.title || '')
  const [description, setDescription] = useState(editWork?.description || '')
  const [externalLink, setExternalLink] = useState(editWork?.externalLink || '')
  const [workType, setWorkType] = useState(editWork?.workType || '')
  const [genre, setGenre] = useState(editWork?.genre || '')

  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : isOpen
  const setDialogOpen = isControlled ? onOpenChange! : setIsOpen

  const resetForm = () => {
    if (!editWork) {
      setTitle('')
      setDescription('')
      setExternalLink('')
      setWorkType('')
      setGenre('')
    }
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = editWork ? `/api/works/${editWork.id}` : '/api/works/create'
      const method = editWork ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          externalLink,
          workType,
          genre
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save work')
      }

      resetForm()
      setDialogOpen(false)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Update form when editWork changes
  if (editWork) {
    if (title !== editWork.title) setTitle(editWork.title)
    if (description !== editWork.description) setDescription(editWork.description)
    if (externalLink !== editWork.externalLink) setExternalLink(editWork.externalLink)
    if (workType !== editWork.workType) setWorkType(editWork.workType)
    if (genre !== editWork.genre) setGenre(editWork.genre)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      if (!open) resetForm()
      setDialogOpen(open)
    }}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="btn-vintage">
            <Plus className="w-4 h-4 mr-2" />
            Add Published Work
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-parchment border-2 border-ink max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-typewriter text-ink text-xl">
            {editWork ? 'Edit Published Work' : 'Add Published Work'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-sm font-serif text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="font-typewriter text-ink block mb-2">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your work's title"
              className="font-serif border-2 border-ink focus:border-rust"
              required
            />
          </div>

          <div>
            <label className="font-typewriter text-ink block mb-2">Description *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your work..."
              className="font-serif border-2 border-ink focus:border-rust min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="font-typewriter text-ink block mb-2">External Link *</label>
            <Input
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://..."
              type="url"
              className="font-serif border-2 border-ink focus:border-rust"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-typewriter text-ink block mb-2">Work Type *</label>
              <Select value={workType} onValueChange={setWorkType} required>
                <SelectTrigger className="font-serif border-2 border-ink focus:border-rust">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STORY_NOVEL">Story/Novel</SelectItem>
                  <SelectItem value="POEM">Poem</SelectItem>
                  <SelectItem value="ARTICLE_ESSAY">Article/Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-typewriter text-ink block mb-2">Genre *</label>
              <Select value={genre} onValueChange={setGenre} required>
                <SelectTrigger className="font-serif border-2 border-ink focus:border-rust">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="font-typewriter"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="btn-vintage"
              disabled={loading || !title || !description || !externalLink || !workType || !genre}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editWork ? 'Update Work' : 'Add Work'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
