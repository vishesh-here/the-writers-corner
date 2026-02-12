'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Save, User } from 'lucide-react'
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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bio, setBio] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile')
      if (response.ok) {
        const data = await response.json()
        setBio(data.user.bio || '')
        setInterests(data.user.interests || [])
        setGenres(data.user.genres || [])
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const toggleGenre = (genre: string) => {
    setGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, interests, genres })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-ink font-typewriter">Loading...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-parchment paper-texture py-8">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-typewriter font-bold text-ink mb-2">
            Your Profile
          </h1>
          <p className="text-ink/70 font-serif mb-6">
            Complete your profile to help other writers find you
          </p>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-md ${
                message.type === 'success' 
                  ? 'bg-forest/10 text-forest border border-forest/20' 
                  : 'bg-rust/10 text-rust border border-rust/20'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <Card className="paper-texture border-2 border-ink/20">
            <CardHeader>
              <CardTitle className="font-typewriter flex items-center gap-2">
                <User className="w-5 h-5" />
                {(session.user as any)?.firstName} {(session.user as any)?.lastName}
              </CardTitle>
              <CardDescription className="font-serif">
                {session.user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="bio" className="font-typewriter text-ink">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other writers about yourself..."
                  className="mt-2 font-serif bg-white/50"
                  rows={4}
                />
              </div>

              <div>
                <Label className="font-typewriter text-ink">
                  Writing Interests
                </Label>
                <p className="text-sm text-ink/60 font-serif mb-3">
                  Select your areas of interest in writing
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTERESTS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={interests.includes(interest) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-colors ${
                        interests.includes(interest)
                          ? 'bg-forest text-parchment hover:bg-forest/80'
                          : 'hover:bg-forest/10'
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                      {interests.includes(interest) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-typewriter text-ink">
                  Favorite Genres
                </Label>
                <p className="text-sm text-ink/60 font-serif mb-3">
                  Select the genres you enjoy writing or reading
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_GENRES.map((genre) => (
                    <Badge
                      key={genre}
                      variant={genres.includes(genre) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-colors ${
                        genres.includes(genre)
                          ? 'bg-rust text-parchment hover:bg-rust/80'
                          : 'hover:bg-rust/10'
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                      {genres.includes(genre) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-rust text-parchment hover:bg-rust/80 font-typewriter"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
