import { describe, it, expect, afterEach } from 'vitest'
import {
  isDemoFailureMode,
  getDemoTimelinePayload,
  DEMO_TIMELINE_POSTS,
  DEMO_WRITE_DISABLED_BODY,
  DEMO_WRITE_DISABLED_STATUS,
} from '@/lib/demo-mode'

const ORIGINAL = process.env.DEMO_FAILURE_MODE

afterEach(() => {
  if (ORIGINAL === undefined) {
    delete process.env.DEMO_FAILURE_MODE
  } else {
    process.env.DEMO_FAILURE_MODE = ORIGINAL
  }
})

describe('isDemoFailureMode()', () => {
  it('is OFF when unset', () => {
    delete process.env.DEMO_FAILURE_MODE
    expect(isDemoFailureMode()).toBe(false)
  })

  it('is OFF for "false" and empty string', () => {
    process.env.DEMO_FAILURE_MODE = 'false'
    expect(isDemoFailureMode()).toBe(false)
    process.env.DEMO_FAILURE_MODE = ''
    expect(isDemoFailureMode()).toBe(false)
  })

  it('is ON for accepted truthy values (case-insensitive)', () => {
    for (const v of ['true', 'TRUE', 'True', '1', 'yes', 'on', ' on ']) {
      process.env.DEMO_FAILURE_MODE = v
      expect(isDemoFailureMode(), `value=${JSON.stringify(v)}`).toBe(true)
    }
  })
})

describe('demo fixtures & write-disabled response', () => {
  it('exposes a deterministic, clearly-labeled frozen timeline', () => {
    expect(DEMO_TIMELINE_POSTS.length).toBeGreaterThan(0)
    for (const post of DEMO_TIMELINE_POSTS) {
      expect(post.title).toContain('[DEMO]')
      expect(post.content).toContain('demo data')
      expect(typeof post.id).toBe('string')
      expect(typeof post.createdAt).toBe('string')
    }
  })

  it('getDemoTimelinePayload matches the GET /community/posts shape', () => {
    const payload = getDemoTimelinePayload()
    expect(payload).toHaveProperty('posts')
    expect(payload.demoMode).toBe(true)
    expect(payload.posts).toEqual(DEMO_TIMELINE_POSTS)
  })

  it('write-disabled body & status match the required contract', () => {
    expect(DEMO_WRITE_DISABLED_STATUS).toBe(503)
    expect(DEMO_WRITE_DISABLED_BODY).toEqual({
      error: 'demo_write_disabled',
      message: 'Write operations are disabled in demo mode.',
    })
  })
})
