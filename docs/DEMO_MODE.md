# Demo Failure Mode (`DEMO_FAILURE_MODE`)

A reversible, **demo/staging-only** failure mode that makes The Writer's Corner
safe to show off without touching real data.

## What it does

When the `DEMO_FAILURE_MODE` environment variable is enabled, the app behaves as
a read-only demonstration:

| Area | Normal behavior | Demo mode behavior |
| --- | --- | --- |
| **Community timeline/feed** (`GET /api/community/posts`) | Queries the database for public exercise submissions | Returns a **deterministic frozen fixture** (3 clearly-labeled `[DEMO]` posts) — no DB query |
| **Post creation** (`POST /api/exercises/[id]/submit`) | Upserts the submission into the database | Returns **HTTP 503** with `{ "error": "demo_write_disabled", "message": "Write operations are disabled in demo mode." }` — no DB write |
| **UI shell** (root layout) | No banner | A sticky yellow banner: **"⚠️ Demo Mode — writes are disabled. This is a read-only demonstration."** |

When the flag is **off/unset**, every code path falls through to the original
behavior — nothing changes.

## Why

- Run public demos or staging environments where the database may be empty,
  unavailable, or must not be modified.
- Simulate a controlled write-failure (503) for testing client resilience.
- Guarantee a stable, predictable timeline for screenshots and walkthroughs.

## How to enable

Set the environment variable to any of `true`, `1`, `yes`, or `on`
(case-insensitive):

```bash
# app/.env
DEMO_FAILURE_MODE=true
```

Then restart the app:

```bash
cd app
yarn dev      # or: yarn build && yarn start
```

You should immediately see the yellow banner, the frozen `[DEMO]` timeline, and
503 responses on submission writes.

## How to disable / rollback

Set it back to `false` or remove the line, then restart:

```bash
# app/.env
DEMO_FAILURE_MODE=false
```

That is the entire rollback. The feature is **100% reversible**:

- No database schema migrations are added or run.
- No data is mutated (the write path is short-circuited *before* any DB call).
- All fixture data is hardcoded and clearly labeled as demo data.
- Removing the branch/PR fully removes the feature.

## Implementation notes

- Core logic lives in [`app/lib/demo-mode.ts`](../app/lib/demo-mode.ts):
  - `isDemoFailureMode()` — flag detection.
  - `getDemoTimelinePayload()` / `DEMO_TIMELINE_POSTS` — frozen feed fixture.
  - `DEMO_WRITE_DISABLED_BODY` / `DEMO_WRITE_DISABLED_STATUS` — 503 response.
- Wired into `app/app/api/community/posts/route.ts`,
  `app/app/api/exercises/[id]/submit/route.ts`, and the banner component
  `app/components/demo-banner.tsx` (rendered from `app/app/layout.tsx`).
