/**
 * DEMO_FAILURE_MODE
 * -----------------
 * A reversible, demo/staging-only "failure mode" for The Writer's Corner.
 *
 * When the `DEMO_FAILURE_MODE` environment variable is set to `true`, the app:
 *   1. Serves a deterministic, frozen fixture for the community timeline/feed
 *      instead of querying the database (read path stays alive even with no DB).
 *   2. Rejects post/submission writes with a controlled HTTP 503 response.
 *   3. Renders a visible "Demo Mode" banner across the app.
 *
 * This flag is OFF by default. Normal behavior is fully preserved when the
 * variable is unset, empty, or any value other than the string "true".
 *
 * IMPORTANT: This is a demo/staging convenience only. It performs NO schema
 * migrations and NO data mutations, so it is 100% reversible — simply unset the
 * variable (or set it to `false`) and restart the app to restore live behavior.
 */

/**
 * Returns true only when DEMO_FAILURE_MODE is explicitly enabled.
 *
 * Accepted "on" values (case-insensitive): "true", "1", "yes", "on".
 * Everything else (unset, "false", "", etc.) is treated as OFF.
 */
export function isDemoFailureMode(): boolean {
  const raw = process.env.DEMO_FAILURE_MODE
  if (!raw) return false
  return ['true', '1', 'yes', 'on'].includes(raw.trim().toLowerCase())
}

/** Standard JSON body returned when a write is attempted in demo mode. */
export const DEMO_WRITE_DISABLED_BODY = {
  error: 'demo_write_disabled',
  message: 'Write operations are disabled in demo mode.',
} as const

/** HTTP status used for blocked writes in demo mode. */
export const DEMO_WRITE_DISABLED_STATUS = 503

/**
 * Deterministic, frozen fixture for the community timeline/feed.
 *
 * The shape matches the `posts` payload returned by
 * GET /api/community/posts so the UI renders identically to live data.
 * All entries are clearly labeled as demo data.
 */
export const DEMO_TIMELINE_POSTS = [
  {
    id: 'demo-post-1',
    title: '[DEMO] Character Development: The Reluctant Hero',
    content:
      'This is frozen demo data. Elias never asked to carry the lantern, yet '
      + 'when the village fell dark he was the only one who remembered where the '
      + 'oil was kept. Courage, he learned, is mostly just showing up with a '
      + 'match when everyone else is looking for an excuse.',
    createdAt: '2025-01-01T09:00:00.000Z',
    user: { firstName: 'Ada', lastName: 'Demo', name: 'Ada Demo' },
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
    id: 'demo-post-2',
    title: '[DEMO] Plot Structure: The Turning Point',
    content:
      'This is frozen demo data. The letter arrived three days too late, and '
      + 'that single delay bent the entire story toward the sea. A good turning '
      + 'point does not announce itself — it simply makes the old plan '
      + 'impossible.',
    createdAt: '2025-01-01T08:30:00.000Z',
    user: { firstName: 'Blaise', lastName: 'Demo', name: 'Blaise Demo' },
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
    id: 'demo-post-3',
    title: '[DEMO] World-Building: The Floating Market',
    content:
      'This is frozen demo data. Every dawn the market untethered from the '
      + 'cliffs and drifted out over the mist, its lanterns swaying like slow '
      + 'fireflies. Trade here was measured not in coin but in stories, and no '
      + 'one left poorer than they arrived.',
    createdAt: '2025-01-01T08:00:00.000Z',
    user: { firstName: 'Cora', lastName: 'Demo', name: 'Cora Demo' },
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
export function getDemoTimelinePayload() {
  return { posts: DEMO_TIMELINE_POSTS, demoMode: true }
}
