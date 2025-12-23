
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, PenTool, BookOpen, Heart, MessageCircle, Filter, Search, Trash2, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface CommunityPost {
  id: string
  title: string
  content: string
  createdAt: string
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

interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
  author: {
    id: string
    name: string
  }
  isOwner: boolean
}

interface PostInteractions {
  likeCount: number
  userLiked: boolean
  commentsCount: number
  commentsExpanded: boolean
  comments: Comment[]
  commentText: string
  isSubmitting: boolean
}

export function CommunityOverview() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [topicFilter, setTopicFilter] = useState('all')
  const [interactions, setInteractions] = useState<Record<string, PostInteractions>>({})

  useEffect(() => {
    fetchCommunityPosts()
  }, [])

  const fetchCommunityPosts = async () => {
    try {
      const response = await fetch('/api/community/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
        
        // Initialize interactions for each post
        const initialInteractions: Record<string, PostInteractions> = {}
        data.posts?.forEach((post: CommunityPost) => {
          initialInteractions[post.id] = {
            likeCount: 0,
            userLiked: false,
            commentsCount: 0,
            commentsExpanded: false,
            comments: [],
            commentText: '',
            isSubmitting: false
          }
        })
        setInteractions(initialInteractions)
        
        // Fetch likes for all posts
        data.posts?.forEach((post: CommunityPost) => {
          fetchPostLikes(post.id)
        })
      }
    } catch (error) {
      console.error('Error fetching community posts:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchPostLikes = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/likes`)
      if (response.ok) {
        const data = await response.json()
        setInteractions(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            likeCount: data.likeCount,
            userLiked: data.userLiked
          }
        }))
      }
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }
  
  const handleToggleLike = async (postId: string) => {
    if (!session) {
      toast.error('Please sign in to like posts')
      return
    }
    
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setInteractions(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            userLiked: data.liked,
            likeCount: prev[postId].likeCount + (data.liked ? 1 : -1)
          }
        }))
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to like post')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to like post')
    }
  }
  
  const handleToggleComments = async (postId: string) => {
    const isExpanding = !interactions[postId]?.commentsExpanded
    
    setInteractions(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        commentsExpanded: isExpanding
      }
    }))
    
    // Fetch comments if expanding and haven't loaded yet
    if (isExpanding && interactions[postId]?.comments.length === 0) {
      await fetchComments(postId)
    }
  }
  
  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setInteractions(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            comments: data.comments,
            commentsCount: data.comments.length
          }
        }))
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }
  
  const handleSubmitComment = async (postId: string) => {
    if (!session) {
      toast.error('Please sign in to comment')
      return
    }
    
    const commentText = interactions[postId]?.commentText?.trim()
    if (!commentText) {
      toast.error('Please enter a comment')
      return
    }
    
    setInteractions(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        isSubmitting: true
      }
    }))
    
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: commentText })
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success('Comment added!')
        
        setInteractions(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            comments: [data.comment, ...prev[postId].comments],
            commentsCount: prev[postId].commentsCount + 1,
            commentText: '',
            isSubmitting: false
          }
        }))
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to post comment')
        setInteractions(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            isSubmitting: false
          }
        }))
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Failed to post comment')
      setInteractions(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          isSubmitting: false
        }
      }))
    }
  }
  
  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Comment deleted')
        
        setInteractions(prev => ({
          ...prev,
          [postId]: {
            ...prev[postId],
            comments: prev[postId].comments.filter(c => c.id !== commentId),
            commentsCount: prev[postId].commentsCount - 1
          }
        }))
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = topicFilter === 'all' || post.exercise?.topic.slug === topicFilter
    return matchesSearch && matchesTopic
  })

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
            Writer's Community
          </h1>
          <p className="text-xl font-serif text-forest max-w-3xl mx-auto leading-relaxed mb-8">
            Connect with fellow writers, share your exercise responses, and discover inspiration 
            from the creative work of others in our supportive community.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                {posts.length}
              </div>
              <p className="font-serif text-forest text-sm">Shared Works</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                {new Set(posts.map(p => p.user?.name || `${p.user?.firstName} ${p.user?.lastName}`)).size}
              </div>
              <p className="font-serif text-forest text-sm">Active Writers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                4
              </div>
              <p className="font-serif text-forest text-sm">Topics</p>
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
                Find Writing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="font-typewriter text-ink block mb-2">Search:</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-forest" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 font-serif border-2 border-ink focus:border-rust"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-typewriter text-ink block mb-2">Topic:</label>
                  <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="font-serif border-2 border-ink focus:border-rust">
                      <SelectValue placeholder="All Topics" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      <SelectItem value="character-development">Character Development</SelectItem>
                      <SelectItem value="plot-structure">Plot Structure</SelectItem>
                      <SelectItem value="world-building">World-Building</SelectItem>
                      <SelectItem value="writing-tension">Writing Tension</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Posts */}
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-16"
          >
            <PenTool className="w-16 h-16 text-forest mx-auto mb-4" />
            <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
              {searchTerm || topicFilter !== 'all' ? 'No matches found' : 'No shared work yet'}
            </h3>
            <p className="font-serif text-forest mb-6 max-w-md mx-auto">
              {searchTerm || topicFilter !== 'all' 
                ? 'Try adjusting your search terms or filters.'
                : 'Be the first to share your exercise responses with the community! Complete exercises and make them public to start building our creative library.'
              }
            </p>
            {!searchTerm && topicFilter === 'all' && (
              <Link href="/topics">
                <Button className="btn-vintage">
                  Start Writing Exercises
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
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
                        <div className="flex items-center gap-3 mb-3">
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
                          className={`${interactions[post.id]?.userLiked ? 'text-rust' : 'text-forest'} hover:text-rust transition-colors`}
                          onClick={() => handleToggleLike(post.id)}
                          disabled={!session}
                        >
                          <Heart 
                            className={`w-4 h-4 mr-1 ${interactions[post.id]?.userLiked ? 'fill-rust' : ''}`} 
                          />
                          {interactions[post.id]?.likeCount || 0}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-forest hover:text-rust"
                          onClick={() => handleToggleComments(post.id)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {interactions[post.id]?.commentsCount || 0}
                        </Button>
                      </div>
                      
                      {post.exercise && (
                        <Link href={`/topics/${post.exercise.topic.slug}`}>
                          <Button variant="outline" size="sm" className="btn-vintage text-xs">
                            Try This Exercise
                          </Button>
                        </Link>
                      )}
                    </div>
                    
                    {/* Comments Section */}
                    <AnimatePresence>
                      {interactions[post.id]?.commentsExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t border-ink/20"
                        >
                          {/* Comment Input */}
                          {session ? (
                            <div className="mb-4">
                              <Textarea
                                placeholder="Share your thoughts..."
                                value={interactions[post.id]?.commentText || ''}
                                onChange={(e) => setInteractions(prev => ({
                                  ...prev,
                                  [post.id]: {
                                    ...prev[post.id],
                                    commentText: e.target.value
                                  }
                                }))}
                                className="font-serif border-2 border-ink focus:border-rust resize-none mb-2"
                                rows={3}
                                maxLength={2000}
                              />
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-serif text-forest">
                                  {interactions[post.id]?.commentText?.length || 0}/2000
                                </span>
                                <Button
                                  size="sm"
                                  className="btn-vintage"
                                  onClick={() => handleSubmitComment(post.id)}
                                  disabled={!interactions[post.id]?.commentText?.trim() || interactions[post.id]?.isSubmitting}
                                >
                                  <Send className="w-3 h-3 mr-1" />
                                  {interactions[post.id]?.isSubmitting ? 'Posting...' : 'Post Comment'}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4 p-3 bg-sepia/30 rounded-sm border border-ink/20">
                              <p className="font-serif text-forest text-sm text-center">
                                <Link href="/auth/signin" className="text-rust hover:underline font-semibold">
                                  Sign in
                                </Link>
                                {' '}to join the conversation
                              </p>
                            </div>
                          )}
                          
                          {/* Comments List */}
                          <div className="space-y-4">
                            {interactions[post.id]?.comments.length === 0 ? (
                              <p className="font-serif text-forest text-sm text-center py-4">
                                No comments yet. Be the first to share your thoughts!
                              </p>
                            ) : (
                              interactions[post.id]?.comments.map((comment) => (
                                <motion.div
                                  key={comment.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="p-3 bg-sepia/30 rounded-sm border border-ink/20"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <Badge className="bg-rust/20 text-rust font-typewriter text-xs">
                                        {comment.author.name}
                                      </Badge>
                                      <span className="text-xs font-serif text-forest ml-2">
                                        {formatDate(comment.createdAt)}
                                      </span>
                                    </div>
                                    {comment.isOwner && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-forest hover:text-rust h-auto p-1"
                                        onClick={() => handleDeleteComment(post.id, comment.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                  <p className="font-serif text-forest text-sm leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                  </p>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 p-8 bg-sepia/50 rounded-sm border-2 border-ink"
        >
          <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
            Share Your Creative Work
          </h3>
          <p className="font-serif text-forest mb-6 max-w-2xl mx-auto">
            When you complete writing exercises, you can choose to share them with the community. 
            Your work might inspire another writer or receive helpful feedback!
          </p>
          <Link href="/topics">
            <Button className="btn-vintage">
              Start Writing
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
