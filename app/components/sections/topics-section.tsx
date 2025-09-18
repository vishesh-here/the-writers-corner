
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Zap, Map, Puzzle } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const topics = [
  {
    title: 'Character Development',
    description: 'Create compelling, three-dimensional characters that drive your story forward with authentic motivations and growth.',
    icon: Users,
    exercises: 8,
    color: 'text-rust',
    slug: 'character-development'
  },
  {
    title: 'Plot Structure',
    description: 'Master the architecture of storytelling with proven frameworks that keep readers engaged from beginning to end.',
    icon: Puzzle,
    exercises: 8,
    color: 'text-forest',
    slug: 'plot-structure'
  },
  {
    title: 'World-Building',
    description: 'Construct immersive, believable worlds that enhance your story and create unforgettable reader experiences.',
    icon: Map,
    exercises: 8,
    color: 'text-gold',
    slug: 'world-building'
  },
  {
    title: 'Writing Tension',
    description: 'Learn to create gripping scenes that maintain reader engagement through masterful pacing and conflict.',
    icon: Zap,
    exercises: 8,
    color: 'text-rust',
    slug: 'writing-tension'
  }
]

export function TopicsSection() {
  const { data: session } = useSession()

  return (
    <section className="py-20 px-4 bg-sepia/30">
      <div className="max-w-content mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-typewriter font-bold text-ink mb-6">
            Four Pillars of Great Fiction
          </h2>
          <p className="text-xl font-serif text-forest max-w-3xl mx-auto">
            Master these essential elements to transform your writing from amateur to professional. 
            Each topic includes comprehensive guides and hands-on exercises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-vintage h-full border-4 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <motion.div 
                    className="mx-auto w-16 h-16 bg-ink text-parchment rounded-sm flex items-center justify-center mb-4"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <topic.icon className="w-8 h-8" />
                  </motion.div>
                  <CardTitle className={`text-2xl font-typewriter ${topic.color} mb-2`}>
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="font-serif text-forest text-base leading-relaxed">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-typewriter text-ink bg-gold/20 px-3 py-1 rounded">
                      {topic.exercises} Interactive Exercises
                    </span>
                  </div>
                  
                  {session ? (
                    <Link href={`/topics/${topic.slug}`}>
                      <Button className="w-full btn-vintage">
                        Start Learning
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/signup">
                      <Button className="w-full bg-rust text-parchment hover:bg-rust/80 font-typewriter">
                        Join to Access
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link href="/topics">
              <Button size="lg" className="btn-vintage text-lg px-8 py-3">
                View All Topics
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
