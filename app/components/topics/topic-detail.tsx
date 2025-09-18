
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Zap, Map, Puzzle, BookOpen, PenTool, ChevronRight, ChevronDown } from 'lucide-react'
import { ExerciseCard } from './exercise-card'
import Link from 'next/link'

interface Exercise {
  id: string
  title: string
  prompt: string
  instructions: string
  order: number
}

interface Topic {
  id: string
  title: string
  slug: string
  description: string
  content: string
  exercises: Exercise[]
}

interface TopicDetailProps {
  topic: Topic
}

const topicIcons: { [key: string]: any } = {
  'character-development': Users,
  'plot-structure': Puzzle,
  'world-building': Map,
  'writing-tension': Zap
}

const topicColors: { [key: string]: string } = {
  'character-development': 'text-rust',
  'plot-structure': 'text-forest',
  'world-building': 'text-gold',
  'writing-tension': 'text-rust'
}

export function TopicDetail({ topic }: TopicDetailProps) {
  const [showContent, setShowContent] = useState(false)
  const Icon = topicIcons[topic.slug] || BookOpen
  const colorClass = topicColors[topic.slug] || 'text-ink'

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
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div 
              className="w-20 h-20 bg-ink text-parchment rounded-sm flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="w-10 h-10" />
            </motion.div>
          </div>
          
          <h1 className={`text-4xl md:text-5xl font-typewriter font-bold ${colorClass} mb-4`}>
            {topic.title}
          </h1>
          <p className="text-xl font-serif text-forest max-w-3xl mx-auto leading-relaxed mb-6">
            {topic.description}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-gold/20 text-ink font-typewriter px-4 py-2">
              {topic.exercises.length} Interactive Exercises
            </Badge>
            <Badge className="bg-sepia text-ink font-typewriter px-4 py-2">
              Comprehensive Guide
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowContent(!showContent)}
              className="btn-vintage text-lg px-6 py-3"
            >
              {showContent ? (
                <>Hide Topic Guide <ChevronUp className="w-5 h-5 ml-2" /></>
              ) : (
                <>Read Topic Guide <ChevronDown className="w-5 h-5 ml-2" /></>
              )}
            </Button>
            <Link href="#exercises">
              <Button 
                variant="outline"
                className="bg-rust text-parchment hover:bg-rust/80 font-typewriter text-lg px-6 py-3"
              >
                Jump to Exercises
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Topic Content */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card className="card-vintage border-4">
              <CardHeader>
                <CardTitle className="font-typewriter text-ink text-2xl flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  Complete Topic Guide
                </CardTitle>
                <CardDescription className="font-serif text-forest text-lg">
                  Comprehensive educational content covering all aspects of {topic.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <div className="font-serif text-forest leading-relaxed whitespace-pre-line">
                    {/* For now, show a placeholder. In a real implementation, we'd parse the markdown content */}
                    <div className="space-y-6">
                      <p>
                        Welcome to the comprehensive guide on {topic.title}. This section contains detailed 
                        educational content that will teach you the fundamental principles and advanced 
                        techniques needed to master this essential aspect of novel writing.
                      </p>
                      <p>
                        The guide covers theory, practical applications, examples from published works, 
                        and step-by-step methods that you can immediately apply to your own writing projects.
                      </p>
                      <p>
                        After reading this guide, proceed to the interactive exercises below to practice 
                        and reinforce what you've learned.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Exercises Section */}
        <div id="exercises">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-typewriter font-bold text-ink mb-4 flex items-center gap-3">
              <PenTool className="w-8 h-8 text-rust" />
              Interactive Exercises
            </h2>
            <p className="font-serif text-forest text-lg leading-relaxed">
              Practice what you've learned with these hands-on writing exercises. Each exercise builds 
              upon the previous ones to develop your skills progressively.
            </p>
          </motion.div>

          <div className="space-y-8">
            {topic.exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ExerciseCard 
                  exercise={exercise} 
                  exerciseNumber={index + 1}
                  topicSlug={topic.slug}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 p-8 bg-sepia/50 rounded-sm border-2 border-ink"
        >
          <h3 className="text-2xl font-typewriter font-bold text-ink mb-4">
            Ready for the Next Topic?
          </h3>
          <p className="font-serif text-forest mb-6">
            Continue your writing education with our other essential topics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/topics">
              <Button className="btn-vintage">
                All Topics
              </Button>
            </Link>
            <Link href="/roadmap">
              <Button variant="outline" className="bg-rust text-parchment hover:bg-rust/80 font-typewriter">
                View Roadmap
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Add missing ChevronUp import fix
import { ChevronUp } from 'lucide-react'
