import { describe, it, expect, afterEach } from 'vitest'
import type { NextRequest } from 'next/server'
import { GET as communityPostsGET } from '@/app/api/community/posts/route'
import { POST as submitPOST } from '@/app/api/exercises/[id]/submit/route'
import { DEMO_TIMELINE_POSTS } from '@/lib/demo-mode'

const ORIGINAL = process.env.DEMO_FAILURE_MODE

afterEach(() => {
  if (ORIGINAL === undefined) {
    delete process.env.DEMO_FAILURE_MODE
  } else {
    process.env.DEMO_FAILURE_MODE = ORIGINAL
  }
})

describe('GET /api/community/posts (timeline) with DEMO_FAILURE_MODE', () => {
  it('returns the frozen fixture (no DB) when enabled', async () => {
    process.env.DEMO_FAILURE_MODE = 'true'
    const res = await communityPostsGET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.demoMode).toBe(true)
    expect(body.posts).toEqual(DEMO_TIMELINE_POSTS)
  })
})

describe('POST /api/exercises/[id]/submit (write) with DEMO_FAILURE_MODE', () => {
  it('returns a 503 demo_write_disabled error when enabled', async () => {
    process.env.DEMO_FAILURE_MODE = 'true'
    // The demo branch short-circuits before the request body is read, so a
    // stub request is sufficient here.
    const req = { json: async () => ({}) } as unknown as NextRequest
    const res = await submitPOST(req, { params: { id: 'demo-exercise' } })
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toEqual({
      error: 'demo_write_disabled',
      message: 'Write operations are disabled in demo mode.',
    })
  })
})
