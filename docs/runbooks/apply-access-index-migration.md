# Runbook: Apply Access Index Migration

Purpose: apply performance indexes for course access path.

Migration file:

- `database/migrations/2025-08-08-add-course-access-indexes.sql`

## Prereqs

- DB credentials for Stage/Prod
- One of:
  - Supabase SQL Editor access
  - psql CLI

## Change window / risk

- Index creation is online and safe. No data changes.
- Runtime impact: minimal; may add background I/O while building.

## Plan A: Supabase SQL Editor (UI)

1. Open Supabase project → SQL → New query
2. Paste contents of:
   - `database/migrations/2025-08-08-add-course-access-indexes.sql`
3. Execute. Verify “Success”.
4. Re-run to confirm idempotency (uses IF NOT EXISTS).

## Plan B: psql CLI

```
# Stage
psql "$STAGE_DATABASE_URL" -f database/migrations/2025-08-08-add-course-access-indexes.sql

# Prod
psql "$PROD_DATABASE_URL" -f database/migrations/2025-08-08-add-course-access-indexes.sql
```

## Verification

- Confirm indexes exist:

```
-- Courses
SELECT indexname, indexdef FROM pg_indexes WHERE tablename='courses' AND schemaname='public';
-- Enrollments
SELECT indexname, indexdef FROM pg_indexes WHERE tablename='user_course_enrollments' AND schemaname='public';
-- Progress
SELECT indexname, indexdef FROM pg_indexes WHERE tablename='user_course_progress' AND schemaname='public';
-- Foundation Cases
SELECT indexname, indexdef FROM pg_indexes WHERE tablename='course_foundation_cases' AND schemaname='public';
```

## Rollback

- Not required. Indexes are additive. To drop if needed:

```
DROP INDEX IF EXISTS idx_courses_slug;
DROP INDEX IF EXISTS idx_user_course_enrollments_user_course;
DROP INDEX IF EXISTS idx_user_course_progress_user_course;
DROP INDEX IF EXISTS idx_course_foundation_cases_course;
DROP INDEX IF EXISTS idx_course_foundation_cases_course_required;
DROP INDEX IF EXISTS idx_course_foundation_cases_sequence;
```

## Post-Deployment Checks

- Navigate to any course page and watch DevTools console for:
  - `⏱️ course.access.ttfb`
  - `⏱️ course.access.first_paint`
  - `⏱️ course.cached.first_paint`
- Compare to baseline in the performance report.
