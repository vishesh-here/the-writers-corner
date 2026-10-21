
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Footer } from '@/components/footer'

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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ink focus:text-parchment focus:font-typewriter focus:rounded-sm"
        >
          Skip to main content
        </a>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
