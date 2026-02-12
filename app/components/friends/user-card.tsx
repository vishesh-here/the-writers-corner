'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserPlus, UserMinus, Check, X, Clock, Users } from 'lucide-react'

interface UserCardProps {
  user: {
    id: string
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    bio?: string | null
    interests?: string[]
    genres?: string[]
    image?: string | null
    friendshipStatus?: string
    requestId?: string
    friendsSince?: string
  }
  type: 'search' | 'friend' | 'received' | 'sent'
  onAction?: (action: string, userId: string, requestId?: string) => Promise<void>
}

export function UserCard({ user, type, onAction }: UserCardProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(user.friendshipStatus || 'none')

  const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous Writer'
  const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '') || displayName.substring(0, 2).toUpperCase()

  const handleAction = async (action: string) => {
    if (!onAction) return
    setLoading(true)
    try {
      await onAction(action, user.id, user.requestId)
      if (action === 'send_request') setStatus('request_sent')
      else if (action === 'accept') setStatus('friends')
    } finally {
      setLoading(false)
    }
  }

  const renderActions = () => {
    if (type === 'search') {
      if (status === 'friends') {
        return (
          <Button variant="outline" size="sm" disabled className="font-typewriter">
            <Users className="w-4 h-4 mr-1" /> Friends
          </Button>
        )
      }
      if (status === 'request_sent') {
        return (
          <Button variant="outline" size="sm" disabled className="font-typewriter">
            <Clock className="w-4 h-4 mr-1" /> Pending
          </Button>
        )
      }
      if (status === 'request_received') {
        return (
          <Button 
            size="sm" 
            onClick={() => handleAction('accept')}
            disabled={loading}
            className="bg-forest text-parchment hover:bg-forest/80 font-typewriter"
          >
            <Check className="w-4 h-4 mr-1" /> Accept Request
          </Button>
        )
      }
      return (
        <Button 
          size="sm" 
          onClick={() => handleAction('send_request')}
          disabled={loading}
          className="bg-rust text-parchment hover:bg-rust/80 font-typewriter"
        >
          <UserPlus className="w-4 h-4 mr-1" /> Add Friend
        </Button>
      )
    }

    if (type === 'friend') {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleAction('unfriend')}
          disabled={loading}
          className="text-rust border-rust hover:bg-rust/10 font-typewriter"
        >
          <UserMinus className="w-4 h-4 mr-1" /> Remove
        </Button>
      )
    }

    if (type === 'received') {
      return (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => handleAction('accept')}
            disabled={loading}
            className="bg-forest text-parchment hover:bg-forest/80 font-typewriter"
          >
            <Check className="w-4 h-4 mr-1" /> Accept
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAction('reject')}
            disabled={loading}
            className="text-rust border-rust hover:bg-rust/10 font-typewriter"
          >
            <X className="w-4 h-4 mr-1" /> Decline
          </Button>
        </div>
      )
    }

    if (type === 'sent') {
      return (
        <Button variant="outline" size="sm" disabled className="font-typewriter">
          <Clock className="w-4 h-4 mr-1" /> Pending
        </Button>
      )
    }

    return null
  }

  return (
    <Card className="paper-texture border-2 border-ink/20 hover:border-ink/40 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12 border-2 border-ink/20">
            <AvatarImage src={user.image || undefined} alt={displayName} />
            <AvatarFallback className="bg-sepia text-ink font-typewriter">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-typewriter font-bold text-ink truncate">{displayName}</h3>
            {user.bio && (
              <p className="text-sm text-ink/70 font-serif line-clamp-2 mt-1">{user.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-1 mt-2">
              {user.interests?.slice(0, 3).map((interest) => (
                <Badge key={interest} variant="secondary" className="bg-forest/10 text-forest text-xs">
                  {interest}
                </Badge>
              ))}
              {user.genres?.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="outline" className="border-rust/50 text-rust text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            {type === 'friend' && user.friendsSince && (
              <p className="text-xs text-ink/50 mt-2 font-serif">
                Friends since {new Date(user.friendsSince).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex-shrink-0">
            {renderActions()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
