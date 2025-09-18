
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Zap, Map, Puzzle, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'

const topics = [
  {
    title: 'Character Development',
    description: 'Master the art of creating compelling, three-dimensional characters that drive your story forward with authentic motivations, realistic flaws, and meaningful growth arcs.',
    icon: Users,
    exercises: 8,
    color: 'text-rust',
    slug: 'character-development',
    skills: ['Character Psychology', 'Dialogue Voice', 'Character Arcs', 'Relationship Dynamics']
  },
  {
    title: 'Plot Structure',
    description: 'Learn to construct engaging narratives with perfect pacing, using proven storytelling frameworks that keep readers turning pages from the first chapter to the last.',
    icon: Puzzle,
    exercises: 8,
    color: 'text-forest',
    slug: 'plot-structure',
    skills: ['Three-Act Structure', 'Conflict Building', 'Pacing Control', 'Scene Purpose']
  },
  {
    title: 'World-Building',
    description: 'Construct immersive, believable worlds that enhance your story through rich settings, detailed cultures, and environmental elements that feel authentic.',
    icon: Map,
    exercises: 8,
    color: 'text-gold',
    slug: 'world-building',
    skills: ['Setting Design', 'Cultural Creation', 'Environmental Storytelling', 'Consistency Rules']
  },
  {
    title: 'Writing Tension',
    description: 'Create gripping scenes that maintain reader engagement through masterful tension techniques, conflict escalation, and emotional investment strategies.',
    icon: Zap,
    exercises: 8,
    color: 'text-rust',
    slug: 'writing-tension',
    skills: ['Conflict Creation', 'Stakes Escalation', 'Dramatic Irony', 'Pacing Mastery']
  }
]

export function TopicsOverview() {
  return (
    <section className="py-12 px-4 paper-texture min-h-screen">
      <div className="max-w-content mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-typewriter font-bold text-ink mb-6">
            Writing Topics
          </h1>
          <p className="text-xl font-serif text-forest max-w-3xl mx-auto leading-relaxed">
            Dive deep into the essential elements of novel writing. Each topic contains comprehensive guides 
            and interactive exercises designed to transform your writing skills.
          </p>
        </motion.div>

        <div className="grid gap-8 md:gap-12">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="card-vintage border-4 overflow-hidden">
                <div className="grid md:grid-cols-3 gap-8 p-8">
                  <div className="md:col-span-2">
                    <CardHeader className="p-0 mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div 
                          className="w-16 h-16 bg-ink text-parchment rounded-sm flex items-center justify-center"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <topic.icon className="w-8 h-8" />
                        </motion.div>
                        <div>
                          <CardTitle className={`text-3xl font-typewriter ${topic.color} mb-2`}>
                            {topic.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm font-typewriter text-ink">
                            <span className="bg-gold/20 px-3 py-1 rounded">
                              {topic.exercises} Exercises
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              Comprehensive Guide
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="font-serif text-forest text-lg leading-relaxed">
                        {topic.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <div className="mb-6">
                      <h3 className="font-typewriter font-bold text-ink mb-3">What You'll Learn:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {topic.skills.map((skill, skillIndex) => (
                          <div key={skill} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-rust rounded-full"></div>
                            <span className="font-serif text-forest">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <Link href={`/topics/${topic.slug}`}>
                      <Button className="w-full btn-vintage text-lg py-4 mb-4 group">
                        Start Learning
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <p className="text-sm font-serif text-forest text-center">
                      Estimated time: 2-3 hours
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 p-8 bg-sepia/50 rounded-sm border-2 border-ink"
        >
          <h2 className="text-2xl font-typewriter font-bold text-ink mb-4">
            Ready for Your Writing Journey?
          </h2>
          <p className="font-serif text-forest mb-6 max-w-2xl mx-auto">
            Follow our structured 3-month roadmap to turn your novel idea into a completed first draft. 
            Track your progress and celebrate milestones along the way.
          </p>
          <Link href="/roadmap">
            <Button className="btn-vintage text-lg px-6 py-3">
              View 3-Month Roadmap
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
