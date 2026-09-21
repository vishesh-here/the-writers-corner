
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'The Writer\'s Corner - Master the Art of Novel Writing',
  description: 'Learn character development, plot structure, world-building, and writing tension with our comprehensive guides and interactive exercises.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-typewriter bg-parchment text-ink antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
