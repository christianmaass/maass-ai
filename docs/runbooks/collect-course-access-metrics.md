# Runbook: Collect Course Access Metrics

Purpose: capture before/after performance for course access.

## Metrics Tracked (currently via console)

- `course.access.ttfb` (ms): time from fetch start to first byte for `GET /api/courses/[slug]/access`.
- `course.access.first_paint` (ms): time from fetch start to first paint with fresh access data.
- `course.cached.first_paint` (ms): time to first paint when rendering from sessionStorage cache.

Source: emitted in `pages/course/[slug].tsx` using the Performance API.

## Test Matrix

- Browsers: Chrome latest (desktop). Optionally Safari/Firefox.
- Network profiles: Online, Fast 3G (throttled), Slow 3G (throttled).
- User states:
  - New session (no sessionStorage cache, logged-in).
  - Warm session (sessionStorage warm, same tab).
  - New tab (token cache helps; sessionStorage cold per tab).

## Step-by-Step

1. Open DevTools → Console. Enable "Preserve log".
2. Ensure you are logged in.
3. Cold test (no cache):
   - Hard reload on `/course/[slug]` with DevTools open.
   - Capture console lines for `course.access.ttfb` and `course.access.first_paint`.
4. Warm test (cached):
   - Navigate away and back to `/course/[slug]`.
   - Capture `course.cached.first_paint`.
5. Throttled network:
   - DevTools → Network → Throttling → Slow 3G / Fast 3G.
   - Repeat steps 3–4 and capture numbers.
6. Repeat for 2–3 representative courses (e.g., strategy track + one more).

## Exporting Data

- Right-click Console → Save as... → attach to report.
- Or copy/paste metrics into the report template.

## Acceptance Criteria

- `course.access.ttfb` reduced vs baseline.
- `course.access.first_paint` reduced vs baseline.
- `course.cached.first_paint` consistently < 100 ms on desktop.

## Notes

- Ensure DB indexes are applied in target env before post-change measurements.
- If numbers look off, verify login state and that the new access endpoint is used (Network tab: `/api/courses/[slug]/access`).
