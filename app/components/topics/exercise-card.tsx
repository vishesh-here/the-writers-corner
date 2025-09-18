
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { PenTool, CheckCircle, Save, Share, ChevronDown, ChevronUp } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'

interface Exercise {
  id: string
  title: string
  prompt: string
  instructions: string
  order: number
}

interface ExerciseCardProps {
  exercise: Exercise
  exerciseNumber: number
  topicSlug: string
}

export function ExerciseCard({ exercise, exerciseNumber, topicSlug }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [response, setResponse] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    // Load existing submission
    loadExistingSubmission()
  }, [exercise.id])

  const loadExistingSubmission = async () => {
    try {
      const response = await fetch(`/api/exercises/${exercise.id}/submission`)
      if (response.ok) {
        const data = await response.json()
        if (data.submission) {
          setResponse(data.submission.content)
          setIsSubmitted(true)
          setIsPublic(data.submission.isPublic)
        }
      }
    } catch (error) {
      console.error('Error loading submission:', error)
    }
  }

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast({
        title: "Response Required",
        description: "Please write your response before submitting.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/exercises/${exercise.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: response,
          isPublic: isPublic
        }),
      })

      if (res.ok) {
        setIsSubmitted(true)
        toast({
          title: "Exercise Completed!",
          description: "Your response has been saved successfully.",
        })
      } else {
        const error = await res.json()
        toast({
          title: "Submission Failed",
          description: error.message || "Failed to submit response. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const wordCount = response.trim().split(/\s+/).filter(word => word.length > 0).length

  return (
    <Card className="card-vintage border-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 bg-rust text-parchment rounded-sm flex items-center justify-center font-typewriter font-bold text-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {exerciseNumber}
            </motion.div>
            <div>
              <CardTitle className="text-xl font-typewriter text-ink flex items-center gap-2">
                {exercise.title}
                {isSubmitted && <CheckCircle className="w-5 h-5 text-green-600" />}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-gold/20 text-ink font-typewriter">
                  Exercise {exerciseNumber}
                </Badge>
                {isSubmitted && (
                  <Badge className="bg-green-100 text-green-800 font-typewriter">
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            className="text-ink hover:text-rust"
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
        <CardDescription className="font-serif text-forest text-base leading-relaxed mt-4">
          {exercise.prompt}
        </CardDescription>
      </CardHeader>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent>
            {/* Instructions */}
            <div className="mb-6 p-4 bg-sepia/30 rounded border-l-4 border-rust">
              <h4 className="font-typewriter font-bold text-ink mb-2 flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Instructions
              </h4>
              <p className="font-serif text-forest leading-relaxed">
                {exercise.instructions}
              </p>
            </div>

            {/* Response Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-typewriter font-bold text-ink">Your Response:</label>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-typewriter text-forest">
                    {wordCount} words
                  </span>
                  <label className="flex items-center gap-2 font-typewriter text-ink">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded border-ink focus:ring-rust"
                    />
                    Share with community
                  </label>
                </div>
              </div>

              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response here... Take your time to craft a thoughtful response that demonstrates your understanding of the concepts."
                className="min-h-[200px] font-serif text-base leading-relaxed border-2 border-ink focus:border-rust resize-none"
                disabled={loading}
              />

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !response.trim()}
                  className="btn-vintage flex items-center gap-2"
                >
                  {loading ? (
                    'Submitting...'
                  ) : isSubmitted ? (
                    <>
                      <Save className="w-4 h-4" />
                      Update Response
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Exercise
                    </>
                  )}
                </Button>

                {isSubmitted && isPublic && (
                  <Button
                    variant="outline"
                    className="bg-forest text-parchment hover:bg-forest/80 font-typewriter flex items-center gap-2"
                  >
                    <Share className="w-4 h-4" />
                    View in Community
                  </Button>
                )}
              </div>

              {isSubmitted && (
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 font-serif">
                    ✅ Great work! You've completed this exercise. 
                    {isPublic ? ' Your response is now visible in the community section.' : ' Your response is saved privately.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </motion.div>
      )}
    </Card>
  )
}
