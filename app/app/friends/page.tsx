'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserCard } from '@/components/friends/user-card'
import { Users, Inbox, Send, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface FriendUser {
  id: string
  name: string | null
  firstName: string | null
  lastName: string | null
  bio: string | null
  interests: string[]
  genres: string[]
  image: string | null
  friendshipId?: string
  friendsSince?: string
}

interface PendingRequest {
  requestId: string
  user: FriendUser
  createdAt: string
}

export default function FriendsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [friends, setFriends] = useState<FriendUser[]>([])
  const [received, setReceived] = useState<PendingRequest[]>([])
  const [sent, setSent] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('friends')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [friendsRes, pendingRes] = await Promise.all([
        fetch('/api/friends/list'),
        fetch('/api/friends/pending')
      ])

      if (friendsRes.ok) {
        const data = await friendsRes.json()
        setFriends(data.friends)
      }

      if (pendingRes.ok) {
        const data = await pendingRes.json()
        setReceived(data.received)
        setSent(data.sent)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string, userId: string, requestId?: string) => {
    try {
      if (action === 'accept' && requestId) {
        const response = await fetch('/api/friends/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId })
        })
        if (response.ok) {
          // Remove from received and add to friends
          const acceptedRequest = received.find(r => r.requestId === requestId)
          if (acceptedRequest) {
            setReceived(prev => prev.filter(r => r.requestId !== requestId))
            setFriends(prev => [...prev, { ...acceptedRequest.user, friendsSince: new Date().toISOString() }])
          }
        }
      } else if (action === 'reject' && requestId) {
        const response = await fetch('/api/friends/reject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId })
        })
        if (response.ok) {
          setReceived(prev => prev.filter(r => r.requestId !== requestId))
        }
      } else if (action === 'unfriend') {
        const response = await fetch('/api/friends/unfriend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ friendId: userId })
        })
        if (response.ok) {
          setFriends(prev => prev.filter(f => f.id !== userId))
        }
      }
    } catch (error) {
      console.error('Action error:', error)
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
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-typewriter font-bold text-ink mb-2">
                Friends & Connections
              </h1>
              <p className="text-ink/70 font-serif">
                Manage your writer connections
              </p>
            </div>
            <Link href="/search">
              <Button className="bg-rust text-parchment hover:bg-rust/80 font-typewriter">
                <Search className="w-4 h-4 mr-2" />
                Find Writers
              </Button>
            </Link>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-sepia/50 border-2 border-ink/20">
              <TabsTrigger 
                value="friends" 
                className="font-typewriter data-[state=active]:bg-ink data-[state=active]:text-parchment"
              >
                <Users className="w-4 h-4 mr-2" />
                Friends ({friends.length})
              </TabsTrigger>
              <TabsTrigger 
                value="received" 
                className="font-typewriter data-[state=active]:bg-ink data-[state=active]:text-parchment"
              >
                <Inbox className="w-4 h-4 mr-2" />
                Received
                {received.length > 0 && (
                  <Badge className="ml-2 bg-rust text-parchment">{received.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="sent" 
                className="font-typewriter data-[state=active]:bg-ink data-[state=active]:text-parchment"
              >
                <Send className="w-4 h-4 mr-2" />
                Sent ({sent.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="mt-6">
              {friends.length === 0 ? (
                <Card className="paper-texture border-2 border-ink/20">
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto text-ink/30 mb-4" />
                    <p className="text-ink/70 font-serif mb-4">
                      You haven't connected with any writers yet.
                    </p>
                    <Link href="/search">
                      <Button className="bg-rust text-parchment hover:bg-rust/80 font-typewriter">
                        Find Writers to Connect
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <UserCard 
                        user={friend}
                        type="friend" 
                        onAction={handleAction}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="received" className="mt-6">
              {received.length === 0 ? (
                <Card className="paper-texture border-2 border-ink/20">
                  <CardContent className="p-8 text-center">
                    <Inbox className="w-12 h-12 mx-auto text-ink/30 mb-4" />
                    <p className="text-ink/70 font-serif">
                      No pending friend requests.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {received.map((request) => (
                    <motion.div
                      key={request.requestId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <UserCard 
                        user={{ ...request.user, requestId: request.requestId }}
                        type="received" 
                        onAction={handleAction}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="mt-6">
              {sent.length === 0 ? (
                <Card className="paper-texture border-2 border-ink/20">
                  <CardContent className="p-8 text-center">
                    <Send className="w-12 h-12 mx-auto text-ink/30 mb-4" />
                    <p className="text-ink/70 font-serif">
                      You haven't sent any friend requests.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {sent.map((request) => (
                    <motion.div
                      key={request.requestId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <UserCard 
                        user={{ ...request.user, requestId: request.requestId }}
                        type="sent" 
                        onAction={handleAction}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
