'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  BookOpen,
  Pencil,
  LayoutList,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface ReviewItem {
  issue: string
  suggestion: string
  severity: 'low' | 'medium' | 'high'
}

interface ReviewCategory {
  title: string
  items: ReviewItem[]
}

interface ReviewResponse {
  overallScore: number
  summary: string
  categories: {
    grammarAndSpelling: ReviewCategory
    styleAndTone: ReviewCategory
    structureAndCoherence: ReviewCategory
    contentSuggestions: ReviewCategory
  }
}

export function AIReviewForm() {
  const [content, setContent] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [review, setReview] = useState<ReviewResponse | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    grammarAndSpelling: true,
    styleAndTone: true,
    structureAndCoherence: true,
    contentSuggestions: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    setReview(null)

    try {
      const response = await fetch('/api/ai-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, apiKey }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI review')
      }

      setReview(data.review)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grammarAndSpelling':
        return <BookOpen className="w-5 h-5" />
      case 'styleAndTone':
        return <Pencil className="w-5 h-5" />
      case 'structureAndCoherence':
        return <LayoutList className="w-5 h-5" />
      case 'contentSuggestions':
        return <Lightbulb className="w-5 h-5" />
      default:
        return <Sparkles className="w-5 h-5" />
    }
  }

  const characterCount = content.length
  const isContentValid = characterCount >= 50 && characterCount <= 50000

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-ink/20 paper-texture">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-typewriter text-ink">
              <Sparkles className="w-6 h-6 text-rust" />
              Submit Your Writing for AI Review
            </CardTitle>
            <CardDescription className="font-serif text-ink/70">
              Paste your writing below and provide your OpenAI API key to receive a comprehensive review.
              Your API key is used only for this request and is never stored.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Writing Content */}
              <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-typewriter text-ink">
                  Your Writing *
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your writing here... (minimum 50 characters)"
                  className="min-h-[300px] font-serif bg-parchment border-ink/30 focus:border-rust resize-y"
                  disabled={isLoading}
                />
                <div className="flex justify-between text-xs font-typewriter">
                  <span className={characterCount < 50 ? 'text-red-600' : 'text-ink/60'}>
                    {characterCount.toLocaleString()} / 50,000 characters
                  </span>
                  {characterCount < 50 && (
                    <span className="text-red-600">Minimum 50 characters required</span>
                  )}
                </div>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <label htmlFor="apiKey" className="block text-sm font-typewriter text-ink">
                  OpenAI API Key *
                </label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="pr-10 font-mono bg-parchment border-ink/30 focus:border-rust"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition-colors"
                    disabled={isLoading}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-ink/60 font-serif">
                  Your API key is sent directly to OpenAI and is never stored on our servers.
                  Get your API key at{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-rust hover:underline"
                  >
                    platform.openai.com
                  </a>
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-md"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-serif">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !isContentValid || !apiKey}
                className="w-full bg-rust text-parchment hover:bg-rust/90 font-typewriter text-lg py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Writing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get AI Review
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Review Results */}
      <AnimatePresence>
        {review && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Overall Score Card */}
            <Card className="border-2 border-ink/20 paper-texture">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center justify-center">
                    <div className={`text-6xl font-bold ${getScoreColor(review.overallScore)}`}>
                      {review.overallScore}
                    </div>
                    <span className="text-2xl text-ink/50 ml-1">/100</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-typewriter text-ink mb-2 flex items-center justify-center md:justify-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Review Complete
                    </h3>
                    <p className="text-ink/70 font-serif">{review.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Cards */}
            {Object.entries(review.categories).map(([key, category]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-2 border-ink/20 paper-texture overflow-hidden">
                  <button
                    onClick={() => toggleCategory(key)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-ink/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rust/10 rounded-md text-rust">
                        {getCategoryIcon(key)}
                      </div>
                      <div className="text-left">
                        <h4 className="font-typewriter text-ink text-lg">{category.title}</h4>
                        <p className="text-sm text-ink/60 font-serif">
                          {category.items.length} {category.items.length === 1 ? 'item' : 'items'} found
                        </p>
                      </div>
                    </div>
                    {expandedCategories[key] ? (
                      <ChevronUp className="w-5 h-5 text-ink/50" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-ink/50" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedCategories[key] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0 pb-4">
                          {category.items.length === 0 ? (
                            <p className="text-ink/60 font-serif italic py-4 text-center">
                              No issues found in this category. Great job!
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {category.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-parchment/50 rounded-md border border-ink/10"
                                >
                                  <div className="flex items-start gap-3">
                                    <span
                                      className={`px-2 py-0.5 text-xs font-typewriter rounded border ${getSeverityColor(item.severity)}`}
                                    >
                                      {item.severity}
                                    </span>
                                    <div className="flex-1 space-y-2">
                                      <p className="font-serif text-ink">{item.issue}</p>
                                      <p className="text-sm text-ink/70 font-serif">
                                        <span className="font-typewriter text-rust">Suggestion:</span>{' '}
                                        {item.suggestion}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
