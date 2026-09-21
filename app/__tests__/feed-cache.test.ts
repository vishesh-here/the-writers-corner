import { describe, it, expect, afterEach } from 'vitest'
import {
  isStaticCacheEnabled,
  getStaticTimelinePayload,
  STATIC_TIMELINE_POSTS,
  WRITE_UNAVAILABLE_BODY,
  WRITE_UNAVAILABLE_STATUS,
} from '@/lib/feed-cache'

const ORIGINAL = process.env.FEED_CACHE_STATIC

afterEach(() => {
  if (ORIGINAL === undefined) {
    delete process.env.FEED_CACHE_STATIC
  } else {
    process.env.FEED_CACHE_STATIC = ORIGINAL
  }
})

describe('isStaticCacheEnabled()', () => {
  it('is OFF when unset', () => {
    delete process.env.FEED_CACHE_STATIC
    expect(isStaticCacheEnabled()).toBe(false)
  })

  it('is OFF for "false" and empty string', () => {
    process.env.FEED_CACHE_STATIC = 'false'
    expect(isStaticCacheEnabled()).toBe(false)
    process.env.FEED_CACHE_STATIC = ''
    expect(isStaticCacheEnabled()).toBe(false)
  })

  it('is ON for accepted truthy values (case-insensitive)', () => {
    for (const v of ['true', 'TRUE', 'True', '1', 'yes', 'on', ' on ']) {
      process.env.FEED_CACHE_STATIC = v
      expect(isStaticCacheEnabled(), `value=${JSON.stringify(v)}`).toBe(true)
    }
  })
})

describe('static timeline snapshot & write-unavailable response', () => {
  it('exposes a deterministic static timeline', () => {
    expect(STATIC_TIMELINE_POSTS.length).toBeGreaterThan(0)
    for (const post of STATIC_TIMELINE_POSTS) {
      expect(typeof post.title).toBe('string')
      expect(post.title.length).toBeGreaterThan(0)
      expect(typeof post.content).toBe('string')
      expect(typeof post.id).toBe('string')
      expect(typeof post.createdAt).toBe('string')
    }
  })

  it('getStaticTimelinePayload matches the GET /community/posts shape', () => {
    const payload = getStaticTimelinePayload()
    expect(payload).toHaveProperty('posts')
    expect(payload.posts).toEqual(STATIC_TIMELINE_POSTS)
  })

  it('write-unavailable body & status match the required contract', () => {
    expect(WRITE_UNAVAILABLE_STATUS).toBe(503)
    expect(WRITE_UNAVAILABLE_BODY).toEqual({
      error: 'upstream_write_timeout',
      message: 'The submission service is temporarily unavailable. Please try again later.',
    })
  })
})
