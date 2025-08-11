# Course Access Performance Report

This report tracks Click→Render performance for course pages using the access endpoint.

## Context

- Environment: <Stage/Prod>
- Date: <YYYY-MM-DD>
- Branch/Commit: <main @ SHA>
- Browser: <Chrome x.y>
- Network profiles tested: Online, Fast 3G, Slow 3G

## Metrics (ms)

Record 3 runs each and note median.

### Cold (no sessionStorage cache)

| Course   | TTFB (`course.access.ttfb`) | First Paint (`course.access.first_paint`) |
| -------- | --------------------------: | ----------------------------------------: |
| <slug-1> |                             |                                           |
| <slug-2> |                             |                                           |
| <slug-3> |                             |                                           |

### Warm (sessionStorage cache)

| Course   | Cached First Paint (`course.cached.first_paint`) |
| -------- | -----------------------------------------------: |
| <slug-1> |                                                  |
| <slug-2> |                                                  |
| <slug-3> |                                                  |

## Procedure

1. Open DevTools → Console (Preserve log ON).
2. Ensure you are logged in.
3. Cold: Hard reload on `/course/[slug]` and capture `course.access.ttfb` + `course.access.first_paint`.
4. Warm: Navigate away/back to `/course/[slug]` and capture `course.cached.first_paint`.
5. Repeat 3× per course and per network profile.

## Results Summary

- ## Observations:
- Regressions: none/…
- ## Improvements vs prior baseline:

## Follow-ups

- [ ] Tweak dashboard to reuse access logic (optional)
- [ ] Reduce log verbosity after validation
- [ ] Consider SSR `authorized` flag (optional)
