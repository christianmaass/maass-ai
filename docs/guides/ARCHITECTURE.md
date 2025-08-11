# Repository Architecture Overview

This document is a lightweight map to help navigate the codebase quickly. It complements auto-generated visualizations under `docs/`.

## Key Directories

- `src/layout/basic/` — Primary layout components after the layout refactor.
- `components/layout/` — Re-export stubs for backward compatibility.
- `components/ui/ErrorBoundary.tsx` — Re-export using `@layout/basic` ErrorBoundary.
- `components/` — App components (dashboard, courses, foundation manager, admin, etc.).
- `pages/` — Next.js pages and API routes under `pages/api/`.
- `lib/` — Utilities, middleware, and modules (e.g., pricing, auth middleware).
- `types/` — Shared TypeScript types.
- `scripts/` — Node scripts (e.g., API tests).
- `docs/` — Generated structure docs and graphs.

## Path Aliases

- `@layout/*` → `src/layout/*`

Keep `tsconfig.json` paths in sync if aliases change.

## Routing & Guards (Summary)

- Unified Guard Pattern recommended: centralized route protection and redirect logic.
- Avoid multiple distributed guards and redirect loops.
- Admin routes protected via auth middleware (e.g., `requireRole('admin')`).

See `docs/ROUTING.md` for details.

## Dependency Graphs

- `docs/deps-graph.svg` — Module dependency graph (madge).
- `docs/depcruise.svg` — Dependency-Cruiser graph with rule checks.

Regenerate via:

```bash
npm run repo:deps
npm run repo:cruise
```

## Repo Tree Snapshot

- `docs/repo-structure.md` — Generated snapshot of the directory tree (depth 4).

Generate via:

```bash
npm run repo:tree
```
