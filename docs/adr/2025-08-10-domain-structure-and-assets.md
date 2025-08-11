# ADR: Domain-based Structure and Asset Policy

Date: 2025-08-10
Status: Accepted

## Context
- Project grew with mixed concerns across directories.
- Need for clarity, ownership, and performance, aligned with NAVA Guidelines (Stability First, Security, Unified Architecture, DB-First, Routing Standards).
- Today we operate on Next.js Pages Router (`/pages`). App Router is a future option.

## Decision
- Adopt domain-based layout with clear boundaries:
  - Marketing: `(marketing)` area (currently pages: `/index`, `/preise`, `/impressum`)
  - Admin: `(admin)` area
  - App (authenticated): `(app)` area
  - Payments: top-level module with webhooks under `/app/api` (future)
  - Shared: `src/shared` for cross-domain UI/Lib/API/Hooks/Types/Config
- Asset policy:
  - First-use ownership: store assets close to first domain usage under `public/<domain>/...`
  - Promotion rule: when cross-domain, move to `public/shared/...` and update refs
  - Use `next/image` with WebP/AVIF and proper `sizes`
- Documentation:
  - `docs/guides/assets.md` specifies rules and checklist
  - Future ADRs for App Router migration and Payments webhooks placement

## Consequences
- Easier navigation and safer changes (reduced coupling)
- Predictable asset locations and improved performance via static serving
- Non-breaking today (no route moves); only docs and directories created

## Alternatives considered
- Keep flat or feature-only structure → leads to coupling and harder navigation
- Immediate App Router migration → higher risk; postponed to a dedicated phase

## Rollout Plan
- Phase M (Marketing): directories, assets policy, then gradual component consolidation
- Phase A (Admin), Phase APP, Phase P (Payments), Phase S (Shared)

## Risks and mitigations
- Asset duplication → Promotion rule + PR checklist
- Mixed Routers → Migrate per domain with build gates
- Guard complexity → Unified Guard Pattern in shared lib
