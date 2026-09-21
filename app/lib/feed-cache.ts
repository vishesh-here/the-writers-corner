/**
 * Static feed cache
 * -----------------
 * When the `FEED_CACHE_STATIC` environment variable is set to `true`, the app:
 *   1. Serves a precomputed, static snapshot for the community timeline/feed
 *      instead of querying the database (read path stays alive even with no DB).
 *   2. Rejects post/submission writes with an HTTP 503 response while the
 *      upstream submission service is unavailable.
 *
 * This flag is OFF by default. Normal behavior is fully preserved when the
 * variable is unset, empty, or any value other than the string "true".
 */

/**
 * Returns true only when FEED_CACHE_STATIC is explicitly enabled.
 *
 * Accepted "on" values (case-insensitive): "true", "1", "yes", "on".
 * Everything else (unset, "false", "", etc.) is treated as OFF.
 */
export function isStaticCacheEnabled(): boolean {
  const raw = process.env.FEED_CACHE_STATIC
  if (!raw) return false
  return ['true', '1', 'yes', 'on'].includes(raw.trim().toLowerCase())
}

/** Standard JSON body returned when a write cannot be persisted. */
export const WRITE_UNAVAILABLE_BODY = {
  error: 'upstream_write_timeout',
  message: 'The submission service is temporarily unavailable. Please try again later.',
} as const

/** HTTP status used when a write cannot be persisted. */
export const WRITE_UNAVAILABLE_STATUS = 503

/**
 * Precomputed static snapshot for the community timeline/feed.
 *
 * The shape matches the `posts` payload returned by
 * GET /api/community/posts so the UI renders identically to live data.
 */
export const STATIC_TIMELINE_POSTS = [
  {
    id: 'post-8f3a21',
    title: 'Character Development: The Reluctant Hero',
    content:
      'Elias never asked to carry the lantern, yet when the village fell dark '
      + 'he was the only one who remembered where the oil was kept. Courage, he '
      + 'learned, is mostly just showing up with a match when everyone else is '
      + 'looking for an excuse.',
    createdAt: '2025-01-01T09:00:00.000Z',
    user: { firstName: 'Ada', lastName: 'Whitfield', name: 'Ada Whitfield' },
    exercise: {
      title: 'Character Development: The Reluctant Hero',
      topic: { title: 'Character Development', slug: 'character-development' },
    },
    isSaved: false,
    savedPostId: null,
    likesCount: 12,
    commentsCount: 3,
    isLikedByUser: false,
  },
  {
    id: 'post-4c7e90',
    title: 'Plot Structure: The Turning Point',
    content:
      'The letter arrived three days too late, and that single delay bent the '
      + 'entire story toward the sea. A good turning point does not announce '
      + 'itself — it simply makes the old plan impossible.',
    createdAt: '2025-01-01T08:30:00.000Z',
    user: { firstName: 'Blaise', lastName: 'Moreau', name: 'Blaise Moreau' },
    exercise: {
      title: 'Plot Structure: The Turning Point',
      topic: { title: 'Plot Structure', slug: 'plot-structure' },
    },
    isSaved: false,
    savedPostId: null,
    likesCount: 8,
    commentsCount: 1,
    isLikedByUser: false,
  },
  {
    id: 'post-1b6d05',
    title: 'World-Building: The Floating Market',
    content:
      'Every dawn the market untethered from the cliffs and drifted out over '
      + 'the mist, its lanterns swaying like slow fireflies. Trade here was '
      + 'measured not in coin but in stories, and no one left poorer than they '
      + 'arrived.',
    createdAt: '2025-01-01T08:00:00.000Z',
    user: { firstName: 'Cora', lastName: 'Nguyen', name: 'Cora Nguyen' },
    exercise: {
      title: 'World-Building: The Floating Market',
      topic: { title: 'World-Building', slug: 'world-building' },
    },
    isSaved: false,
    savedPostId: null,
    likesCount: 21,
    commentsCount: 5,
    isLikedByUser: false,
  },
] as const

/** Convenience payload matching the GET /api/community/posts response body. */
export function getStaticTimelinePayload() {
  return { posts: STATIC_TIMELINE_POSTS }
}
