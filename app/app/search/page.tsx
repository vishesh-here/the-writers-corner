'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCard } from '@/components/friends/user-card'
import { Search, Filter, X } from 'lucide-react'
import { motion } from 'framer-motion'

const AVAILABLE_INTERESTS = [
  'Fiction Writing', 'Non-Fiction', 'Poetry', 'Screenwriting', 'Blogging',
  'Journalism', 'Creative Writing', 'Technical Writing', 'Academic Writing',
  'Short Stories', 'Novel Writing', 'Editing', 'Worldbuilding', 'Character Development'
]

const AVAILABLE_GENRES = [
  'Fantasy', 'Science Fiction', 'Mystery', 'Thriller', 'Romance',
  'Horror', 'Historical Fiction', 'Literary Fiction', 'Young Adult',
  'Memoir', 'Self-Help', 'Biography', 'Adventure', 'Dystopian'
]

interface SearchUser {
  id: string
  name: string | null
  firstName: string | null
  lastName: string | null
  bio: string | null
  interests: string[]
  genres: string[]
  image: string | null
  friendshipStatus: string
}

export default function SearchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [users, setUsers] = useState<SearchUser[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      selectedInterests.forEach(i => params.append('interests', i))
      selectedGenres.forEach(g => params.append('genres', g))

      const response = await fetch(`/api/users/search?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleAction = async (action: string, userId: string, requestId?: string) => {
    try {
      if (action === 'send_request') {
        const response = await fetch('/api/friends/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiverId: userId })
        })
        if (response.ok) {
          setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, friendshipStatus: 'request_sent' } : u
          ))
        }
      } else if (action === 'accept') {
        // Find the received request for this user
        const pendingResponse = await fetch('/api/friends/pending')
        const pendingData = await pendingResponse.json()
        const request = pendingData.received?.find((r: any) => r.user.id === userId)
        
        if (request) {
          const response = await fetch('/api/friends/accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId: request.requestId })
          })
          if (response.ok) {
            setUsers(prev => prev.map(u => 
              u.id === userId ? { ...u, friendshipStatus: 'friends' } : u
            ))
          }
        }
      }
    } catch (error) {
      console.error('Action error:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink font-typewriter">Loading...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-parchment paper-texture py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-typewriter font-bold text-ink mb-2">
            Find Fellow Writers
          </h1>
          <p className="text-ink/70 font-serif mb-6">
            Search for writers by name, interests, or favorite genres
          </p>

          {/* Search Box */}
          <Card className="paper-texture border-2 border-ink/20 mb-6">
            <CardContent className="p-4">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/50" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name..."
                    className="pl-10 font-typewriter bg-white/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`font-typewriter ${showFilters ? 'bg-ink text-parchment' : ''}`}
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Filters
                </Button>
                <Button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-rust text-parchment hover:bg-rust/80 font-typewriter"
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4 border-t border-ink/10"
                >
                  <div>
                    <h4 className="font-typewriter text-sm font-bold text-ink mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_INTERESTS.map((interest) => (
                        <Badge
                          key={interest}
                          variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                          className={`cursor-pointer transition-colors ${
                            selectedInterests.includes(interest)
                              ? 'bg-forest text-parchment'
                              : 'hover:bg-forest/10'
                          }`}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                          {selectedInterests.includes(interest) && (
                            <X className="w-3 h-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-typewriter text-sm font-bold text-ink mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_GENRES.map((genre) => (
                        <Badge
                          key={genre}
                          variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
                          className={`cursor-pointer transition-colors ${
                            selectedGenres.includes(genre)
                              ? 'bg-rust text-parchment'
                              : 'hover:bg-rust/10'
                          }`}
                          onClick={() => toggleGenre(genre)}
                        >
                          {genre}
                          {selectedGenres.includes(genre) && (
                            <X className="w-3 h-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {searched && (
            <div className="space-y-4">
              <h2 className="font-typewriter text-lg text-ink">
                {users.length} {users.length === 1 ? 'writer' : 'writers'} found
              </h2>
              
              {users.length === 0 ? (
                <Card className="paper-texture border-2 border-ink/20">
                  <CardContent className="p-8 text-center">
                    <p className="text-ink/70 font-serif">
                      No writers found matching your search criteria. Try adjusting your filters.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <UserCard 
                        user={user} 
                        type="search" 
                        onAction={handleAction}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
