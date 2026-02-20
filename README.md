<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-6.7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

# ✍️ The Writer's Corner

> *A vintage-themed learning platform for aspiring novel writers, featuring interactive exercises, educational content, and a supportive community.*

The Writer's Corner is a comprehensive Next.js 14 application designed to help aspiring writers master the craft of novel writing. With its distinctive typewriter aesthetic and structured curriculum, it provides an immersive learning experience covering character development, plot structure, world-building, and more.

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Design Patterns & Architecture](#-design-patterns--architecture)
- [Code Rules & Conventions](#-code-rules--conventions)
- [Feature Documentation](#-feature-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 📚 Writing Topics
Comprehensive educational content covering essential novel writing techniques:
- **Character Development** - Create memorable, multi-dimensional characters
- **Plot Structure** - Master story architecture and pacing
- **World-Building** - Craft immersive fictional universes
- **Writing Tension** - Build suspense and keep readers engaged

### 📝 Interactive Exercises
Hands-on writing prompts with real-time feedback:
- Save drafts and track progress
- Submit completed exercises
- Share work with the community

### 👥 Community Hub
Connect with fellow writers:
- Share your exercises publicly
- Read and learn from others' submissions
- Build a supportive writing network

### 🗺️ Learning Roadmap
12-week structured curriculum:
- Track your progress through milestones
- Set and achieve writing goals
- Visualize your learning journey

### 🔐 Secure Authentication
Complete user management:
- Email/password registration
- Secure session handling
- Protected routes and API endpoints

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (App Router) | 14.2.28 |
| **Language** | TypeScript | 5.2.2 |
| **Database** | PostgreSQL + Prisma ORM | 6.7.0 |
| **Styling** | Tailwind CSS | 3.3.3 |
| **UI Components** | shadcn/ui (Radix primitives) | Latest |
| **Authentication** | NextAuth.js | 4.24.11 |
| **Animations** | Framer Motion | 10.18.0 |
| **State Management** | Jotai, React Query | 2.6.0, 5.0.0 |
| **Form Handling** | React Hook Form + Zod | 7.53.0, 3.23.8 |
| **Date Handling** | date-fns | 3.6.0 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** >= 14

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishesh-here/the-writers-corner.git
   cd the-writers-corner
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/writers_corner"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
the-writers-corner/
└── app/                          # Main application directory
    ├── app/                      # Next.js App Router
    │   ├── api/                  # API routes
    │   │   ├── auth/             # NextAuth endpoints
    │   │   ├── community/        # Community posts API
    │   │   ├── exercises/        # Exercise submission API
    │   │   ├── roadmap/          # Milestone tracking API
    │   │   └── signup/           # User registration
    │   ├── auth/                 # Auth pages (signin/signup)
    │   ├── community/            # Community page
    │   ├── roadmap/              # User roadmap page
    │   ├── topics/               # Writing topics pages
    │   │   └── [slug]/           # Dynamic topic routes
    │   ├── layout.tsx            # Root layout
    │   ├── page.tsx              # Homepage
    │   └── globals.css           # Global styles
    │
    ├── components/               # React components
    │   ├── ui/                   # shadcn/ui base components
    │   ├── sections/             # Homepage sections
    │   ├── topics/               # Topic-related components
    │   ├── community/            # Community components
    │   ├── roadmap/              # Roadmap components
    │   ├── navigation.tsx        # Main navigation
    │   ├── providers.tsx         # Context providers
    │   └── theme-provider.tsx    # Theme context
    │
    ├── lib/                      # Utilities & configuration
    │   ├── auth.ts               # NextAuth configuration
    │   ├── db.ts                 # Prisma client singleton
    │   ├── types.ts              # TypeScript extensions
    │   └── utils.ts              # Utility functions
    │
    ├── prisma/                   # Database
    │   └── schema.prisma         # Prisma schema
    │
    ├── data/                     # Static content
    │   └── novel_writing_guide.md
    │
    ├── hooks/                    # Custom React hooks
    │   └── use-toast.ts
    │
    └── scripts/                  # Utility scripts
        └── seed.ts               # Database seeding
```

---

## 🏗️ Design Patterns & Architecture

### 1. Component Architecture

#### Atomic Design Pattern
Components are organized following atomic design principles:

```
components/
├── ui/           # Atoms: buttons, inputs, cards (shadcn/ui)
├── sections/     # Molecules/Organisms: composed features
├── topics/       # Feature modules: domain-specific
└── community/    # Feature modules: domain-specific
```

#### Server vs Client Components

**Decision Tree:**
```
Is the component...
├── Fetching data? → Server Component
├── Using hooks (useState, useEffect)? → Client Component
├── Using browser APIs? → Client Component
├── Rendering static content? → Server Component
└── Handling user interactions? → Client Component
```

**Example - Server Component:**
```tsx
// app/topics/page.tsx
export default async function TopicsPage() {
  const topics = await prisma.writingTopic.findMany()
  return <TopicList topics={topics} />
}
```

**Example - Client Component:**
```tsx
// components/navigation.tsx
'use client'

import { useSession } from 'next-auth/react'

export function Navigation() {
  const { data: session } = useSession()
  // Interactive UI logic...
}
```

### 2. Database Access Pattern (Singleton)

Prevents connection exhaustion during development hot-reloading:

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 3. Authentication Pattern

NextAuth.js with JWT strategy and protected routes:

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validation logic...
        const isValid = await bcrypt.compare(password, user.password)
        return isValid ? user : null
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) { /* ... */ },
    async session({ session, token }) { /* ... */ }
  }
}
```

**Protected API Route Pattern:**
```typescript
// app/api/exercises/[id]/submit/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Protected logic...
}
```

### 4. Styling Architecture

**Layered Approach:**
```
1. Base Layer: Tailwind CSS utilities
2. Component Layer: shadcn/ui components
3. Theme Layer: Custom vintage CSS variables
4. Utility Layer: Custom utility classes (.btn-vintage, .card-vintage)
```

**Custom Color System:**
```css
/* globals.css */
:root {
  --parchment: 43 74% 94%;   /* Background */
  --ink: 25 25% 15%;          /* Primary text */
  --sepia: 37 45% 85%;        /* Secondary bg */
  --rust: 16 85% 55%;         /* Accent */
  --forest: 145 25% 35%;      /* Success */
  --gold: 45 85% 65%;         /* Highlight */
}
```

### 5. State Management Strategy

| Use Case | Solution |
|----------|----------|
| Server state | React Query / SWR |
| Global UI state | Jotai atoms |
| Form state | React Hook Form |
| Auth state | NextAuth useSession |
| Local component state | useState |

---

## 📏 Code Rules & Conventions

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | kebab-case | `topic-detail.tsx` |
| Pages | page.tsx in folders | `app/topics/page.tsx` |
| Utilities | kebab-case | `use-toast.ts` |
| Types | camelCase | `types.ts` |

### Component Structure

```tsx
// 1. Imports (grouped by type)
'use client' // if needed

import { useState } from 'react'           // React
import { motion } from 'framer-motion'     // External libs
import { Button } from '@/components/ui/button' // Internal
import { cn } from '@/lib/utils'           // Utilities

// 2. Types
interface ComponentProps {
  title: string
  isActive?: boolean
}

// 3. Component
export function ComponentName({ title, isActive = false }: ComponentProps) {
  // Hooks
  const [state, setState] = useState(false)
  
  // Handlers
  const handleClick = () => { /* ... */ }
  
  // Render
  return (
    <div className={cn('base-classes', isActive && 'active-classes')}>
      {title}
    </div>
  )
}
```

### Import Order

```tsx
// 1. React imports
import { useState, useEffect } from 'react'

// 2. External libraries
import { motion } from 'framer-motion'
import { z } from 'zod'

// 3. Internal absolute imports (@/)
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'

// 4. Relative imports
import { TopicCard } from './topic-card'

// 5. Types (if separate)
import type { WritingTopic } from '@prisma/client'

// 6. Styles (if any)
import './styles.css'
```

### TypeScript Guidelines

```typescript
// ✅ Use interfaces for objects
interface User {
  id: string
  name: string
}

// ✅ Use type for unions/intersections
type Status = 'pending' | 'completed' | 'failed'

// ✅ Extend NextAuth types properly
declare module 'next-auth' {
  interface Session {
    user: User & { id: string }
  }
}

// ✅ Use Zod for runtime validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
```

### Tailwind CSS Guidelines

**Class Order (recommended):**
```tsx
<div className={cn(
  // 1. Layout (display, position)
  'flex flex-col relative',
  // 2. Sizing
  'w-full max-w-md h-auto',
  // 3. Spacing
  'p-4 m-2 gap-4',
  // 4. Typography
  'font-typewriter text-ink text-lg',
  // 5. Visual (bg, border, shadow)
  'bg-parchment border-2 border-ink rounded-lg shadow-lg',
  // 6. States & animations
  'hover:bg-sepia transition-colors',
  // 7. Responsive
  'md:flex-row lg:max-w-lg'
)}>
```

### API Route Guidelines

```typescript
// app/api/resource/route.ts

// ✅ Use proper HTTP methods
export async function GET(request: Request) { }
export async function POST(request: Request) { }
export async function PUT(request: Request) { }
export async function DELETE(request: Request) { }

// ✅ Validate input with Zod
const bodySchema = z.object({
  content: z.string().min(1).max(10000)
})

// ✅ Return proper status codes
return NextResponse.json({ data }, { status: 200 })
return NextResponse.json({ error: 'Not found' }, { status: 404 })
return NextResponse.json({ error: 'Server error' }, { status: 500 })

// ✅ Always wrap in try-catch
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const body = await request.json()
    const validated = bodySchema.parse(body)
    
    // Business logic...
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

---

## 📖 Feature Documentation

### Writing Topics System

Topics are stored in the database with full CRUD support:

```typescript
// Schema
model WritingTopic {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  description String     @db.Text
  content     String     @db.Text
  exercises   Exercise[]
  order       Int        @default(0)
}
```

**Available Topics:**
1. Character Development
2. Plot Structure  
3. World-Building
4. Writing Tension

### Exercise Submission Flow

```
1. User selects a topic
2. Views exercises for that topic
3. Writes response in textarea
4. Saves draft (autosave) OR submits
5. Optionally shares to community
```

### Roadmap & Milestones

12-week curriculum with progress tracking:

| Week | Focus Area |
|------|------------|
| 1-3 | Character Development |
| 4-6 | Plot Structure |
| 7-9 | World-Building |
| 10-12 | Writing Tension & Refinement |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run linting: `npm run lint`
5. Commit with conventional commits: `git commit -m 'feat: add new feature'`
6. Push to your fork: `git push origin feature/your-feature`
7. Open a Pull Request

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Formatting, missing semicolons
refactor: Code refactoring
test: Adding tests
chore: Maintenance tasks
```

### Pull Request Guidelines

- Keep PRs focused and small
- Update documentation if needed
- Add tests for new features
- Ensure all tests pass
- Request review from maintainers

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

<p align="center">
  <strong>Happy Writing! ✍️📚</strong>
</p>
