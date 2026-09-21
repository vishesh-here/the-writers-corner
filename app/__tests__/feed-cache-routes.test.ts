import { describe, it, expect, afterEach } from 'vitest'
import type { NextRequest } from 'next/server'
import { GET as communityPostsGET } from '@/app/api/community/posts/route'
import { POST as submitPOST } from '@/app/api/exercises/[id]/submit/route'
import { STATIC_TIMELINE_POSTS } from '@/lib/feed-cache'

const ORIGINAL = process.env.FEED_CACHE_STATIC

afterEach(() => {
  if (ORIGINAL === undefined) {
    delete process.env.FEED_CACHE_STATIC
  } else {
    process.env.FEED_CACHE_STATIC = ORIGINAL
  }
})

describe('GET /api/community/posts (timeline) with FEED_CACHE_STATIC', () => {
  it('returns the static snapshot (no DB) when enabled', async () => {
    process.env.FEED_CACHE_STATIC = 'true'
    const res = await communityPostsGET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.posts).toEqual(STATIC_TIMELINE_POSTS)
  })
})

describe('POST /api/exercises/[id]/submit (write) with FEED_CACHE_STATIC', () => {
  it('returns a 503 upstream_write_timeout error when enabled', async () => {
    process.env.FEED_CACHE_STATIC = 'true'
    // The static-cache branch short-circuits before the request body is read,
    // so a stub request is sufficient here.
    const req = { json: async () => ({}) } as unknown as NextRequest
    const res = await submitPOST(req, { params: { id: 'sample-exercise' } })
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toEqual({
      error: 'upstream_write_timeout',
      message: 'The submission service is temporarily unavailable. Please try again later.',
    })
  })
})
