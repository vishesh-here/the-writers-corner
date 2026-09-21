/**
 * Regression suite — Post-PR #21 (commit c0cdbfe)
 * -------------------------------------------------
 * PR #21 ("fix: remove FEED_CACHE_STATIC 503/static-snapshot broken behavior")
 * removed two broken short-circuits that were gated on FEED_CACHE_STATIC:
 *   1. exercises/[id]/submit: a pre-DB HTTP 503 that rejected submissions.
 *   2. community/posts GET: a static-snapshot response that skipped the DB.
 * After PR #21 both routes must ALWAYS hit the database (dynamic feed), even
 * when FEED_CACHE_STATIC is set to a truthy value.
 *
 * These tests exercise the real Next.js route handlers with safe, in-memory
 * mocks for auth (next-auth session) and the database (Prisma). No real
 * credentials, tokens, or DB connections are used.
 *
 * Endpoints covered:
 *   - POST /api/exercises/[id]/submit  (authenticated exercise submission)
 *   - POST /api/community/posts        (authenticated community post creation)
 *   - GET  /api/community/posts        (authenticated feed retrieval)
 *   - New-post visibility: a created post appears in a subsequent feed read.
 *   - Regression: FEED_CACHE_STATIC no longer changes behavior (dynamic feed).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// A safe, fake authenticated session. Never a real user / token.
const TEST_SESSION = { user: { id: 'test-user-123', name: 'Test Author' } }

// Shared in-memory DB state so create -> read flows through the mock like a DB.
const { store, resetStore } = vi.hoisted(() => {
  const store = { communityPosts: [] as any[], submissions: [] as any[] }
  return {
    store,
    resetStore: () => {
      store.communityPosts = []
      store.submissions = []
    },
  }
})

// --- Mock auth: authOptions is inert; getServerSession is controlled per-test.
vi.mock('@/lib/auth', () => ({ authOptions: {} }))
vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))

// --- Mock the Prisma client with a small stateful fake.
vi.mock('@/lib/db', () => {
  const prisma = {
    exercise: {
      findUnique: vi.fn(async ({ where }: any) => ({
        id: where.id,
        title: 'Test Exercise',
      })),
    },
    exerciseSubmission: {
      findMany: vi.fn(async () => store.submissions),
      upsert: vi.fn(async ({ create }: any) => {
        const submission = { id: 'sub-1', ...create }
        store.submissions.push(submission)
        return submission
      }),
    },
    communityPost: {
      findMany: vi.fn(async () =>
        store.communityPosts.filter((p) => p.isPublic !== false),
      ),
      create: vi.fn(async ({ data }: any) => {
        const post = {
          id: `cp-${store.communityPosts.length + 1}`,
          createdAt: new Date(),
          user: { firstName: 'Test', lastName: 'Author', name: 'Test Author' },
          ...data,
        }
        store.communityPosts.push(post)
        return post
      }),
    },
    postLike: {
      groupBy: vi.fn(async () => []),
      findMany: vi.fn(async () => []),
    },
    postComment: {
      groupBy: vi.fn(async () => []),
    },
  }
  return { prisma, db: prisma, default: prisma }
})

// Imports must come after the mocks are registered (vi.mock is hoisted).
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { GET as getFeed, POST as createPost } from '@/app/api/community/posts/route'
import { POST as submitExercise } from '@/app/api/exercises/[id]/submit/route'

const mockedGetSession = getServerSession as unknown as ReturnType<typeof vi.fn>

// Minimal request stub — only .json() is used by the handlers.
function jsonRequest(body: unknown) {
  return { json: async () => body } as any
}

const ORIGINAL_STATIC = process.env.FEED_CACHE_STATIC

beforeEach(() => {
  resetStore()
  vi.clearAllMocks()
  // Default: authenticated with the safe fake session.
  mockedGetSession.mockResolvedValue(TEST_SESSION)
})

afterEach(() => {
  if (ORIGINAL_STATIC === undefined) {
    delete process.env.FEED_CACHE_STATIC
  } else {
    process.env.FEED_CACHE_STATIC = ORIGINAL_STATIC
  }
})

describe('POST /api/exercises/[id]/submit — authenticated exercise submission', () => {
  it('rejects unauthenticated requests with 401', async () => {
    mockedGetSession.mockResolvedValueOnce(null)
    const res = await submitExercise(
      jsonRequest({ content: 'hello' }),
      { params: { id: 'ex-1' } },
    )
    expect(res.status).toBe(401)
  })

  it('rejects empty content with 400', async () => {
    const res = await submitExercise(
      jsonRequest({ content: '   ' }),
      { params: { id: 'ex-1' } },
    )
    expect(res.status).toBe(400)
  })

  it('saves the submission for an authenticated user', async () => {
    const res = await submitExercise(
      jsonRequest({ content: 'My exercise answer', isPublic: true }),
      { params: { id: 'ex-1' } },
    )
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toHaveProperty('submissionId')
    expect(prisma.exercise.findUnique).toHaveBeenCalled()
    expect(prisma.exerciseSubmission.upsert).toHaveBeenCalledTimes(1)
  })

  it('REGRESSION (PR #21): does not 503 short-circuit when FEED_CACHE_STATIC=true', async () => {
    // Before PR #21 this returned a pre-DB HTTP 503. It must now hit the DB.
    process.env.FEED_CACHE_STATIC = 'true'
    const res = await submitExercise(
      jsonRequest({ content: 'Still works with static flag on' }),
      { params: { id: 'ex-1' } },
    )
    expect(res.status).not.toBe(503)
    expect(res.status).toBe(200)
    expect(prisma.exerciseSubmission.upsert).toHaveBeenCalledTimes(1)
  })
})

describe('POST /api/community/posts — authenticated community post creation', () => {
  it('rejects unauthenticated requests with 401', async () => {
    mockedGetSession.mockResolvedValueOnce(null)
    const res = await createPost(jsonRequest({ title: 'T', content: 'C' }))
    expect(res.status).toBe(401)
  })

  it('rejects missing title/content with 400', async () => {
    const res = await createPost(jsonRequest({ title: '', content: '' }))
    expect(res.status).toBe(400)
  })

  it('creates a post for an authenticated user and returns 201 + postId', async () => {
    const res = await createPost(
      jsonRequest({ title: 'A New Story', content: 'Once upon a time...' }),
    )
    const body = await res.json()
    expect(res.status).toBe(201)
    expect(body).toHaveProperty('postId')
    expect(prisma.communityPost.create).toHaveBeenCalledTimes(1)
    expect(store.communityPosts).toHaveLength(1)
  })
})

describe('GET /api/community/posts — authenticated feed retrieval', () => {
  it('rejects unauthenticated requests with 401', async () => {
    mockedGetSession.mockResolvedValueOnce(null)
    const res = await getFeed()
    expect(res.status).toBe(401)
  })

  it('returns a posts array for an authenticated user and queries the DB', async () => {
    const res = await getFeed()
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(body.posts)).toBe(true)
    // Dynamic feed reads both submissions and direct community posts from DB.
    expect(prisma.exerciseSubmission.findMany).toHaveBeenCalled()
    expect(prisma.communityPost.findMany).toHaveBeenCalled()
  })

  it('REGRESSION (PR #21): feed stays dynamic (queries DB) when FEED_CACHE_STATIC=true', async () => {
    // Before PR #21 this returned a static snapshot without touching the DB.
    process.env.FEED_CACHE_STATIC = 'true'
    await createPost(
      jsonRequest({ title: 'Dynamic Post', content: 'From the database' }),
    )
    const res = await getFeed()
    const body = await res.json()
    expect(res.status).toBe(200)
    // The DB was queried despite the static flag being on...
    expect(prisma.communityPost.findMany).toHaveBeenCalled()
    // ...and the response reflects live DB data, not a hardcoded snapshot.
    expect(body.posts.some((p: any) => p.title === 'Dynamic Post')).toBe(true)
  })
})

describe('New-post visibility — created post appears in the dynamic feed', () => {
  it('a community post created via POST is returned by a subsequent GET', async () => {
    const createRes = await createPost(
      jsonRequest({ title: 'Visible Story', content: 'Should show in feed' }),
    )
    const created = await createRes.json()
    expect(createRes.status).toBe(201)

    const feedRes = await getFeed()
    const feed = await feedRes.json()
    expect(feedRes.status).toBe(200)

    const match = feed.posts.find((p: any) => p.id === created.postId)
    expect(match).toBeTruthy()
    expect(match.title).toBe('Visible Story')
    expect(match.content).toBe('Should show in feed')
  })
})
