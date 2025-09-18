
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Users, Target, CheckCircle, PenTool, Map } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive Guides',
    description: 'In-depth educational content covering every aspect of novel writing from character development to final polish.'
  },
  {
    icon: PenTool,
    title: 'Interactive Exercises',
    description: 'Hands-on writing exercises that put theory into practice, helping you develop your skills through doing.'
  },
  {
    icon: Users,
    title: 'Writer Community',
    description: 'Connect with fellow writers, share your work, and get feedback from a supportive community of novelists.'
  },
  {
    icon: Map,
    title: '3-Month Roadmap',
    description: 'A structured 12-week plan that takes you from idea to finished first draft with clear milestones.'
  },
  {
    icon: Target,
    title: 'Progress Tracking',
    description: 'Monitor your writing journey with milestone tracking and achievement recognition to stay motivated.'
  },
  {
    icon: CheckCircle,
    title: 'Proven Methods',
    description: 'Learn techniques used by successful novelists, backed by decades of writing craft wisdom.'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-parchment">
      <div className="max-w-content mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-typewriter font-bold text-ink mb-6">
            Everything You Need to Write Your Novel
          </h2>
          <p className="text-xl font-serif text-forest max-w-3xl mx-auto">
            Our comprehensive platform provides tools, guidance, and community support 
            to help you complete your novel-writing journey successfully.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-vintage h-full border-2 text-center p-6">
                <CardContent className="p-0">
                  <motion.div 
                    className="w-16 h-16 bg-rust text-parchment rounded-sm flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl font-typewriter font-bold text-ink mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-serif text-forest leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
