
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Map, CheckCircle, Circle, Target, Calendar, PenTool, BookOpen } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Milestone {
  id: string
  title: string
  description: string
  week: number
  order: number
  completed: boolean
  completedAt?: string
}

export function RoadmapOverview() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    fetchMilestones()
  }, [])

  const fetchMilestones = async () => {
    try {
      const response = await fetch('/api/roadmap/milestones')
      if (response.ok) {
        const data = await response.json()
        setMilestones(data.milestones || [])
        setCompletedCount(data.milestones?.filter((m: Milestone) => m.completed).length || 0)
      }
    } catch (error) {
      console.error('Error fetching milestones:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMilestone = async (milestoneId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/roadmap/milestones/${milestoneId}/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed })
      })

      if (response.ok) {
        // Update local state
        setMilestones(prev => prev.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, completed, completedAt: completed ? new Date().toISOString() : undefined }
            : milestone
        ))
        setCompletedCount(prev => completed ? prev + 1 : prev - 1)

        toast({
          title: completed ? "Milestone Completed!" : "Milestone Updated",
          description: completed 
            ? "Great work! You're making excellent progress." 
            : "Milestone marked as incomplete.",
        })
      } else {
        throw new Error('Failed to update milestone')
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update milestone. Please try again.",
        variant: "destructive",
      })
    }
  }

  const progressPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0

  const getMonthName = (week: number) => {
    if (week <= 4) return 'Month 1'
    if (week <= 8) return 'Month 2'
    return 'Month 3'
  }

  const groupedMilestones = milestones.reduce((acc, milestone) => {
    const month = getMonthName(milestone.week)
    if (!acc[month]) acc[month] = []
    acc[month].push(milestone)
    return acc
  }, {} as Record<string, Milestone[]>)

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
            3-Month Writer Roadmap
          </h1>
          <p className="text-xl font-serif text-forest max-w-3xl mx-auto leading-relaxed mb-8">
            A structured journey from idea to finished first draft. Follow these weekly milestones 
            to transform your novel concept into a completed manuscript in just 12 weeks.
          </p>

          {/* Progress Summary */}
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                  {completedCount}
                </div>
                <p className="font-serif text-forest text-sm">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                  {milestones.length}
                </div>
                <p className="font-serif text-forest text-sm">Total Milestones</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-typewriter font-bold text-rust mb-1">
                  {Math.round(progressPercentage)}%
                </div>
                <p className="font-serif text-forest text-sm">Progress</p>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-typewriter text-ink">Overall Progress</span>
                <span className="font-typewriter text-rust">{completedCount}/{milestones.length}</span>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-sepia border-2 border-ink" />
            </div>
          </div>
        </motion.div>

        {/* Milestones by Month */}
        <div className="space-y-12">
          {Object.entries(groupedMilestones).map(([month, monthMilestones], monthIndex) => (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: monthIndex * 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-typewriter font-bold text-ink mb-2 flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-rust" />
                  {month}
                </h2>
                <p className="font-serif text-forest">
                  Weeks {monthIndex === 0 ? '1-4' : monthIndex === 1 ? '5-8' : '9-12'}
                </p>
              </div>

              <div className="grid gap-6">
                {monthMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className={`card-vintage border-4 transition-all duration-300 ${
                      milestone.completed ? 'bg-green-50 border-green-300' : ''
                    }`}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <motion.button
                            onClick={() => toggleMilestone(milestone.id, !milestone.completed)}
                            className={`mt-1 rounded-full transition-colors ${
                              milestone.completed 
                                ? 'text-green-600 hover:text-green-700' 
                                : 'text-forest hover:text-rust'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {milestone.completed ? (
                              <CheckCircle className="w-8 h-8" fill="currentColor" />
                            ) : (
                              <Circle className="w-8 h-8" />
                            )}
                          </motion.button>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className="bg-rust/20 text-rust font-typewriter">
                                Week {milestone.week}
                              </Badge>
                              {milestone.completed && (
                                <Badge className="bg-green-100 text-green-800 font-typewriter">
                                  Completed
                                </Badge>
                              )}
                            </div>

                            <CardTitle className={`text-2xl font-typewriter mb-3 ${
                              milestone.completed ? 'text-green-800 line-through' : 'text-ink'
                            }`}>
                              {milestone.title}
                            </CardTitle>

                            <CardDescription className="font-serif text-forest text-lg leading-relaxed">
                              {milestone.description}
                            </CardDescription>

                            {milestone.completed && milestone.completedAt && (
                              <p className="text-sm font-serif text-green-700 mt-2">
                                ✅ Completed on{' '}
                                {new Date(milestone.completedAt).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Completion Message */}
        {progressPercentage === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16 p-8 bg-green-50 border-4 border-green-300 rounded-sm"
          >
            <Target className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-3xl font-typewriter font-bold text-green-800 mb-4">
              Congratulations! 🎉
            </h3>
            <p className="font-serif text-green-700 text-lg mb-6 max-w-2xl mx-auto">
              You've completed the 3-month novel writing roadmap! You should now have a finished first draft. 
              Time to celebrate your achievement and begin the revision process!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-600 text-white hover:bg-green-700 font-typewriter">
                Share Your Success
              </Button>
              <Button variant="outline" className="btn-vintage">
                Start Revision Guide
              </Button>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        {progressPercentage < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16 p-8 bg-sepia/50 rounded-sm border-2 border-ink"
          >
            <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="font-serif text-forest mb-6 max-w-2xl mx-auto">
              {completedCount === 0
                ? "Begin your novel-writing adventure with our comprehensive topic guides and exercises. The roadmap will guide you every step of the way!"
                : "Keep up the great work! Continue with the topic exercises and mark off milestones as you complete them."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/topics">
                <Button className="btn-vintage flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Continue Learning
                </Button>
              </Link>
              <Link href="/topics">
                <Button variant="outline" className="bg-rust text-parchment hover:bg-rust/80 font-typewriter">
                  <PenTool className="w-4 h-4 mr-2" />
                  Start Writing
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
