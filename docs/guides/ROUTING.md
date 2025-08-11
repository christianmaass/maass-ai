# Routing & Guard Overview

This project follows a centralized guard approach for stability and predictable navigation.

## Principles

- Unified Guard Pattern: one central place for auth/role checks and redirects.
- Loop Prevention: detect and break redirect loops with a safe fallback.
- Minimal useEffect deps: never put the router instance in dependencies.

## Guarding

- Admin APIs: `requireRole('admin')` middleware on `pages/api/admin/*`.
- User APIs: `withAuth()` middleware for authenticated endpoints under `pages/api/user/*`.
- Client-side guards: Dashboard/Course/Onboarding guards coordinate redirects.

## Key Routes

- `/` — Dashboard entry for authenticated users, marketing for guests.
- `/onboarding` — First-time user guidance into the course flow.
- `/course/[slug]` — Course page (e.g., strategy track).
- `/admin` — Admin dashboard with dedicated `AdminLayout`.

## Notes

- Layouts: `src/layout/basic/` for main layouts; `components/layout/` provides re-exports for compatibility.
- Path alias: `@layout/*` → `src/layout/*`.

For detailed standards, see `docs/ARCHITECTURE.md` and the development guidelines in the repo.
