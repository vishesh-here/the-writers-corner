
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PenTool, User, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from '@/hooks/use-toast'

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account Created!",
          description: "Welcome to The Writer's Corner. Signing you in...",
        })

        // Automatically sign in the user
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          toast({
            title: "Sign In Failed",
            description: "Account created but sign in failed. Please sign in manually.",
            variant: "destructive",
          })
          router.push('/auth/signin')
        } else {
          router.push('/topics')
        }
      } else {
        toast({
          title: "Sign Up Failed",
          description: data.error || "Failed to create account. Please try again.",
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

  return (
    <div className="min-h-screen bg-parchment paper-texture flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="card-vintage border-4">
          <CardHeader className="text-center">
            <motion.div 
              className="mx-auto w-16 h-16 bg-ink text-parchment rounded-sm flex items-center justify-center mb-4"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <PenTool className="w-8 h-8" />
            </motion.div>
            <CardTitle className="text-2xl font-typewriter text-ink">Join The Writer's Corner</CardTitle>
            <CardDescription className="font-serif text-forest">
              Start your journey to becoming a master novelist
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-typewriter text-ink flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="font-typewriter border-2 border-ink focus:border-rust"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-typewriter text-ink">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="font-typewriter border-2 border-ink focus:border-rust"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-typewriter text-ink flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="font-typewriter border-2 border-ink focus:border-rust pl-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-typewriter text-ink flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="font-typewriter border-2 border-ink focus:border-rust pl-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-typewriter text-ink flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="font-typewriter border-2 border-ink focus:border-rust pl-10"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-vintage text-lg py-3"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Start Writing Journey'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 text-center">
            <p className="text-sm text-forest font-serif">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-rust font-typewriter hover:underline">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
