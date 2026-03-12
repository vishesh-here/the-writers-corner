
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, ExternalLink, Youtube, Globe, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ResourceCard } from './resource-card'

interface WritingResource {
  id: string
  title: string
  description: string
  url: string
  platform: string
  category: string
  difficultyLevel: string
  resourceType: string
  createdAt: string
  updatedAt: string
}

export function ResourcesLibrary() {
  const [resources, setResources] = useState<WritingResource[]>([])
  const [filteredResources, setFilteredResources] = useState<WritingResource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Fetch resources
  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true)
        const response = await fetch('/api/resources')
        if (response.ok) {
          const data = await response.json()
          setResources(data.resources)
          setFilteredResources(data.resources)
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...resources]

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((r) => r.category === categoryFilter)
    }

    // Apply platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter((r) => r.platform === platformFilter)
    }

    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((r) => r.difficultyLevel === difficultyFilter)
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((r) => r.resourceType === typeFilter)
    }

    setFilteredResources(filtered)
  }, [searchQuery, categoryFilter, platformFilter, difficultyFilter, typeFilter, resources])

  // Get unique values for filters
  const categories = ['all', ...Array.from(new Set(resources.map((r) => r.category)))]
  const platforms = ['all', ...Array.from(new Set(resources.map((r) => r.platform)))]
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced']
  const types = ['all', ...Array.from(new Set(resources.map((r) => r.resourceType)))]

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setPlatformFilter('all')
    setDifficultyFilter('all')
    setTypeFilter('all')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-12 h-12 text-rust mr-4" />
          <h1 className="text-5xl font-typewriter font-bold text-ink">
            Writing Resources Library
          </h1>
        </div>
        <p className="text-lg text-forest font-serif max-w-3xl mx-auto">
          Discover curated writing resources, guides, and tools to enhance your craft.
          From beginner tutorials to advanced techniques, explore a wealth of knowledge
          from across the web.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-6 bg-sepia/50 rounded-lg border-2 border-ink paper-texture"
      >
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest w-5 h-5" />
            <Input
              type="text"
              placeholder="Search resources by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-parchment border-ink font-typewriter"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-typewriter text-ink mb-2 block">
              Category
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-parchment border-ink font-typewriter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="font-typewriter">
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-typewriter text-ink mb-2 block">
              Platform
            </label>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="bg-parchment border-ink font-typewriter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform} className="font-typewriter">
                    {platform === 'all' ? 'All Platforms' : platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-typewriter text-ink mb-2 block">
              Difficulty
            </label>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="bg-parchment border-ink font-typewriter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff} value={diff} className="font-typewriter">
                    {diff === 'all' ? 'All Levels' : diff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-typewriter text-ink mb-2 block">
              Type
            </label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-parchment border-ink font-typewriter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type} className="font-typewriter">
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-forest font-typewriter">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="btn-vintage"
          >
            Clear Filters
          </Button>
        </div>
      </motion.div>

      {/* Resources Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-ink border-t-transparent"></div>
          <p className="mt-4 text-forest font-typewriter">Loading resources...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-sepia/30 rounded-lg border-2 border-dashed border-ink"
        >
          <BookOpen className="w-16 h-16 text-forest mx-auto mb-4 opacity-50" />
          <p className="text-xl text-ink font-typewriter mb-2">No resources found</p>
          <p className="text-forest font-serif">Try adjusting your filters or search query</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResources.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
