# Contributing to Navaa

Danke für deinen Beitrag! Bitte lies diese Regeln vor jedem PR.

## Voraussetzungen

- Node LTS, npm/pnpm
- `.env.local` gemäß `.env.example`
- Start: `npm run dev`

## Branches & Commits

- Branch aus `main`: `feat/...`, `fix/...`, `chore/...`
- Conventional Commits:
  - `feat(catalog): add multi-course list`
  - `fix(auth): redirect logged-in users away from /login`

## PR-Checkliste

- [ ] `npm run typecheck && npm run lint && npm run build`
- [ ] Zod-Validierung bei neuen Inputs
- [ ] Guards nur in Layouts ((app)/(admin))
- [ ] `pages/` existiert nicht
- [ ] Service-Role-Key taucht nicht im Client-Bundle auf
- [ ] `.env.example` aktualisiert (falls relevant)
- [ ] Screenshots/GIFs bei UI-Änderungen

## Code-Standards

- App Router only (kein `pages/`)
- Supabase-Clients nur via `src/lib/db/*`
- Zod für Inputs; Typen via `z.infer`
- Shared UI unter `src/shared/ui`
- Design Tokens in `styles/tokens.css`

## Tests

- E2E (Playwright) für Auth/Guards/Katalog
- Unit-Tests für Guards/Helper

## Datenbank

- Änderungen als Migration; danach Types neu erzeugen:

```bash
npx supabase gen types typescript --schema public > src/types/supabase.ts
```

- RLS-Policies verpflichtend
