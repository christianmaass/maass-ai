# Navaa Development Guidelines

Ziel: Konsistentes, wartbares Next.js/Supabase-Projekt ohne Tech-Schulden.

## 1) Architektur & Ordner

- App Router: `src/app/(marketing)`, `src/app/(app)`, `src/app/(admin)`
- Infra/Lib: `src/lib/{db,guards,schemas}`
- Shared: `src/shared/{ui,hooks,types,config}`
- Features: `src/features/{auth,catalog,tracks,...}`
- Verboten: `pages/`-Ordner

## 2) Supabase

- Server-Client: `src/lib/db/createServerClient.ts` (SSR, Cookies)
- Browser-Client: `src/lib/db/supabaseClient.ts` (nur NEXT_PUBLIC Keys)
- Types regenerieren nach Schema-Änderungen

## 3) Guards

- (marketing): öffentliches Layout
- (app): requires auth → Guard im `(app)/layout.tsx`
- (admin): requires role=admin → Guard im `(admin)/layout.tsx`
- Keine Page-level Guards

## 4) Styling

- Tailwind + `styles/tokens.css` (CSS-Variablen)
- UI-Primitives in `src/shared/ui`
- Theming je Kurs via Variablen (z. B. `.theme-strategy`)

## 5) Validierung

- Zod-Schemas für alle Inputs (Server Actions/APIs)
- Typen via `z.infer`

## 6) Daten & State

- Bevorzugt Server Components + Server Actions
- Client State sparsam

## 7) Sicherheit

- Service Role Key niemals im Client
- RLS für private Tabellen
- Output filtern (keine sensiblen Felder)

## 8) Tests

- E2E: Login → /catalog, Admin-Redirects
- Unit: Helpers/Guards

## 9) CI-Gates

- Typecheck, Lint, Build müssen grün sein
- Verbot: `pages/` im Repo
- Leak-Check: Service Role Key nicht im `.next`-Bundle

## 10) ADRs

- Größere Entscheidungen in `docs/adr/` dokumentieren
