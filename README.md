# ✍️ The Writer's Corner

A full-stack web application for aspiring novelists to learn, practice, and grow — with a community of fellow writers.

Built with **Next.js 14**, **Prisma**, **PostgreSQL**, and **NextAuth**.

---

## 🚀 Features

### 📚 Writing Topics & Exercises
- Structured writing curriculum across 4 core topics: Character Development, Plot Structure, World-Building, and Writing Tension
- Each topic contains guided exercises with prompts and instructions
- Submit responses and optionally share them with the community
- Track your progress through a 12-week milestone roadmap

### 👥 Community
- Browse public exercise submissions from all writers
- **Like posts** with real-time optimistic updates
- **Comment on posts** — works across both community posts and exercise submissions
- **Save posts** to your personal reading list
- Download posts or generate video summaries

### 🤝 Friends & Social
- Send and receive friend requests
- View pending requests with a live badge counter in the navigation
- Accept, reject, or unfriend connections
- Search for other writers by name

### 📖 Published Works
- Share your external published works (stories, novels, poems, articles, essays)
- Browse featured works from the community
- Like and view-count tracking on published works
- Supports Story/Novel, Poem, and Article/Essay types

### 📚 Writing Resources Library
- Curated library of writing resources (videos, articles, threads, courses, tools)
- Filter by category, difficulty level, platform, and resource type
- Covers beginner through advanced levels

### 🤖 AI Writing Review
- Submit your writing for AI-powered feedback
- Get structured critique on style, structure, and technique

### 🗺️ Roadmap
- 12-week structured learning path broken into weekly milestones
- Toggle milestones as complete to track your journey

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | NextAuth.js v4 (Credentials + Google + GitHub) |
| Styling | Tailwind CSS + custom vintage/typewriter theme |
| Animations | Framer Motion |
| UI Components | shadcn/ui |
| Package Manager | npm |

---

## 📦 Database Schema

Key models:

- **User** — auth, profile, relations to all content
- **WritingTopic / Exercise / ExerciseSubmission** — core curriculum
- **CommunityPost** — standalone community posts
- **Like / Comment** — reactions on exercise submissions
- **PostLike / PostComment** — unified reactions across both post types
- **SavedPost** — bookmarked submissions
- **FriendRequest / Friendship** — social graph
- **PublishedWork / WorkLike** — external published works
- **WritingResource** — curated resource library
- **Milestone / UserProgress** — roadmap tracking

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/vishesh-here/the-writers-corner.git
cd the-writers-corner/app

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, NEXTAUTH_SECRET, and OAuth credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional OAuth providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
app/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # API endpoints
│   │   ├── auth/           # NextAuth handler
│   │   ├── community/      # Community posts, likes, comments
│   │   ├── friends/        # Friend requests & management
│   │   ├── likes/          # Exercise submission likes
│   │   ├── resources/      # Writing resources CRUD
│   │   ├── saved-posts/    # Bookmarks
│   │   ├── works/          # Published works
│   │   └── ...
│   ├── community/          # Community page
│   ├── friends/            # Friends page
│   ├── my-works/           # Published works management
│   ├── resources/          # Writing resources library
│   ├── roadmap/            # Learning roadmap
│   ├── topics/             # Writing topics & exercises
│   └── ...
├── components/             # Shared React components
│   ├── community/          # Community-specific components
│   │   ├── like-button.tsx
│   │   ├── comment-button.tsx
│   │   └── community-overview.tsx
│   ├── navigation.tsx      # Main nav with friend badge
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── auth.ts             # NextAuth config + session helpers
│   └── db.ts               # Prisma client + connect/disconnect helpers
├── prisma/
│   └── schema.prisma       # Full database schema
└── ...
```

---

## 🔀 Merged Features (March 2026)

The following feature branches were merged into `main`:

| Branch | Feature |
|---|---|
| `feature/unknown-20260212153345` | Base auth & DB setup |
| `feature/unknown-20260212153400` | Session helpers (`getCurrentUser`, `requireAuth`) |
| `feat/likes-comments` | Like/comment system on exercise submissions |
| `feature/likes-comments` | Enhanced LikeButton with optimistic updates |
| `feature/friend-requests` | Friend request & friendship system |
| `feature/published-works` | Published works showcase |
| `feat/writing-resources-library` | Curated writing resources library |

All merge conflicts were resolved preserving all features. Build verified clean (`npm run build` passes with 0 errors).

---

## 📝 License

MIT
