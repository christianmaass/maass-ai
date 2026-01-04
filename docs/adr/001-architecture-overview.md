## ADR 001: Architektur-Übersicht Navaa

Status: Accepted
Datum: 2025-08-27
Letzte Aktualisierung: 2025-01-27 (AP-001 bis AP-006 + Weekly Audit Fixes)

### Kurzkontext

Navaa ist eine Next.js 15 App (React 19, App Router) mit Supabase (Auth, DB) und Tailwind CSS v4. Es gibt drei UI-Domänen als Routen-Gruppen: `(marketing)`, `(app)`, `(admin)`. Gemeinsame Komponenten und Utilities leben unter `src/shared`. Authentifizierung erfolgt serverseitig via Supabase-SSR und Cookies. Inhalte (Kurse/Tracks) werden aktuell als statische Seiten und Assets in `public/` sowie `src/app/(app)` gerendert. Tests existieren via Playwright.

### Systemübersicht (Markdown-„Kontextdiagramm")

```mermaid
flowchart TD
  Browser["User Browser\n(SSR/CSR)"] -->|HTTP(S)| Next["Next.js 15 App Router\n(src/app/*, middleware.ts)"]
  Next -->|Supabase Server Client\nCookies (auth.json, Middleware)| Supabase["Supabase\n(Auth, DB, Storage)"]
  Next -->|Static Assets| Public["/public/*\n(Images, Fonts, SVG)"]
  Next -->|Analytics Events\n(Feedback-Layer)| Analytics["Analytics Sink\n(Web/API – to be defined)"]
  Next -->|Cache Layer| Redis["Redis Cache\n(Upstash)"]
  Next -->|Monitoring| Sentry["Sentry v8\n(Error Tracking)"]

  subgraph Next App
    MK[(marketing)]
    AP[(app)]
    AD[(admin)]
    SH[(shared libs)]
    CF[(config)]
  end

  Browser --> MK
  Browser --> AP
  Browser --> AD
  MK --> SH
  AP --> SH
  AD --> SH
  CF --> SH
  CF --> AP
  CF --> AD
```

### Module & Ownership

- `(marketing)`: `src/app/(marketing)` – Landing/Marketing-Seiten, Public Navigation, keine Auth-Pflicht. Owner: Marketing Experience.
- `(app)`: `src/app/(app)` – Produktbereich (Katalog, Tracks, Onboarding). Auth-required Guards. Owner: Product Web.
- `(admin)`: `src/app/(admin)` – Interne Dashboards/Backoffice. Striktere Guards & RBAC. Owner: Platform.
- `shared libs`: `src/shared/*` – UI-Kit (`ui/*`), Form- und Layout-Komponenten, Hooks, Utilities. Owner: Design Systems.
- `lib/auth`: Guards und Server-Auth-Integration (`src/lib/auth/guards.ts`). Owner: Platform.
  - `requireAuth()`, `requireAdmin()`: Für Server Components/Pages (redirect)
  - `getAuthUser()`, `getAdminUser()`: Für API Routes (JSON-Response)
- `lib/db`: Supabase-Client (`src/lib/db/supabaseClient.ts`, `createServerClient.ts`). Owner: Platform.
- `lib/config`: ENV-Guards mit Zod-Validierung (`env.client.ts`, `env.server.ts`, `env.test.ts`). Owner: Platform.
- `lib/cache`: Redis-Cache mit Upstash REST API. Owner: Platform.
- `lib/rate-limit`: Rate-Limiting für API-Routen mit Redis/In-Memory Fallback (`src/lib/rate-limit.ts`). Owner: Platform.
- API Routen: `src/app/api/auth/*` (Login/Signup/Logout/Reset), `/api/health`, `/api/cache/status`. Owner: Platform.

Relevante Verzeichnisse (Auszug, code-referenziert):

- `middleware.ts` (Root) – Request-Vorverarbeitung, Cookie-Weitergabe.
- `src/shared/ui/components/*` – wiederverwendbare UI-Komponenten.

### Datenflüsse

- Auth (Supabase SSR, Cookies)
  - Serverseitig: `src/lib/db/createServerClient.ts` erstellt den Supabase-Server-Client mit Cookie-Adapter; `middleware.ts` übergibt/liest Auth-Cookies.
  - Guards: `src/lib/auth/guards.ts` schützt Routen (Weiterleitung Login/Catalog). Playwright-Tests validieren (`tests/auth-guards.spec.ts`).
    - Server Components/Pages: `requireAuth()`, `requireAdmin()` (redirect bei fehlender Auth)
    - API Routes: `getAuthUser()`, `getAdminUser()` (JSON-Response bei fehlender Auth)
  - API-Routen: `src/app/api/auth/*/route.ts` kapseln Login/Signup/Logout/Reset und setzen Cookies via Supabase SDK.
    - Input-Validierung: Alle Auth-APIs nutzen Zod-Schemas (`LoginSchema`, `RegisterSchema`)
    - Rate-Limiting: `/api/auth/login` und `/api/auth/signup` haben Rate-Limiting (5 Requests/15min)
    - Auth-Protection: `/api/auth/logout` und `/api/cache/status` sind geschützt (Auth/Admin-only)

- Decision OS (Content)
  - Statisch: Bilder/Assets in `public/images/*` und Seiten unter `src/app/(app)/*`.
  - Decision Assessment: `src/components/DecisionAssessment.tsx` für Decision Quality Scoring.

- Analytics (Feedback-Layer)
  - Klientseitige Events: aktuell kein einheitlicher Layer im Code ersichtlich.
  - Zielbild: Thin-Client API (`/api/analytics`) + Edge Runtime für niedrige Latenz; Enrichment (route, userId aus Supabase Session) serverseitig, Storage zunächst Supabase (table `events`), später export zu DWH.

- Caching & Performance
  - Next.js Cache: ISR für Marketing-Seiten (`revalidate: 3600`), Dynamic für App/Admin-Seiten.
  - Redis-Cache: Serverseitiger Cache für teure Datenbankabfragen mit TTL und Monitoring.
  - Rate-Limiting: Redis-basiert (Upstash) mit in-memory Fallback für API-Routen (`src/lib/rate-limit.ts`).
  - Asset-Optimierung: WebP/AVIF Support, responsive Image-Komponenten mit Priority/Lazy Loading.

### Implementierte Verbesserungen (AP-001 bis AP-006)

#### AP-001: Dependencies bereinigen ✅
- Ungenutzte Dependencies entfernt
- PostCSS-Konfiguration optimiert
- Build-Performance verbessert

#### AP-002: ENV-Guards in Health API implementieren ✅
- `src/lib/config/env.client.ts` und `env.server.ts` mit Zod-Validierung
- `server-only` Guard für sensitive Variablen
- Einheitliche Konfiguration im gesamten Projekt

#### AP-003: Assets optimieren ✅
- Next.js Image-Konfiguration mit WebP/AVIF
- Image-Komponenten mit Priority/Lazy Loading optimiert
- Performance-Dokumentation erstellt

#### AP-004: Unused Exports bereinigen ✅
- 31% Reduktion der ungenutzten Exports (von 147+ auf 102)
- UI-Komponenten, Cache-Funktionen und Schemas bereinigt
- Code-Qualität signifikant verbessert

#### AP-005: Cache-Module optimieren ✅
- Robuste Fehlerbehandlung mit Graceful Degradation
- Cache-Monitoring-API (`/api/cache/status`)
- Verbesserte Performance und Wartbarkeit

#### AP-006: Konfigurationsmodule konsolidieren ✅
- Alle direkten `process.env` Zugriffe eliminiert
- Neue `env.test.ts` für Test-Umgebungen
- Einheitlicher `env` Index für alle Konfigurationen

#### Weekly Audit Fixes (2025-01-27) ✅
- API-Auth-Guards: `getAuthUser()`, `getAdminUser()` für API Routes hinzugefügt
- Rate-Limiting: Neues Modul `src/lib/rate-limit.ts` für API-Schutz
- Input-Validierung: Zod-Schemas für alle Auth-APIs
- Dead Code: Ungenutzte Exports bereinigt (`validate.ts` entfernt)
- Asset-Optimierung: Scripts und Dokumentation hinzugefügt

### Risiken

- P1: Inkonsistente Auth-Zustände zwischen Middleware, Server Actions und API-Routen
  - Grund: Mehrere Integrationspunkte (SSR-Guards, `middleware.ts`, API-Handler) können Cookie-/Session-Divergenz erzeugen; Playwright-Fehlerverzeichnisse deuten auf Navigations-Redirect-Issues hin (`test-results/*`).
  - Status: ⚠️ Teilweise adressiert durch API-spezifische Guards (`getAuthUser()`, `getAdminUser()`), aber vollständige Vereinheitlichung steht noch aus.

- P2: Fehlender standardisierter Analytics-Layer
  - Grund: Keine zentrale API/SDK; Events könnten verstreut oder gar nicht erfasst werden, erschwert Produktentscheidungen.

- P2: Statischer Kurs-Content ohne Versions-/Entkopplung vom Deploy
  - Grund: Inhalte liegen im Repo (`public/` + `src/app/(app)`), was Time-to-Publish verlängert und Rebuilds erfordert.

- P3: UI-Kit ohne strikte SemVer/Release-Disziplin
  - Grund: `src/shared/ui/*` wird direkt konsumiert; breaking changes können Domänen unbeabsichtigt treffen.

### Maßnahmenplan

Zeitachsen enthalten konkrete PR-Vorschläge (kleine, reviewbare Einheiten).

— 2 Wochen

1. Vereinheitlichte SSR-Auth-Integration
   - PR: "auth: consolidate server client + cookie handling"
     - Zentralisieren von Supabase-Client-Erstellung in `src/lib/db/createServerClient.ts` (Single entry), Export in `src/lib/db/index.ts`.
     - Abgleich `middleware.ts` mit gleicher Cookie-Quelle, Tests erweitern (Happy/Unhappy Paths).
   - PR: "guards: add typed helpers + route constants"
     - Verwendung von `src/lib/constants/routes.ts` in Guards und Pages; typisierte Redirect-Helfer.

2. Admin-RBAC und Route Guards härten
   - PR: "admin: enforce role-based guard"
     - `src/lib/auth/guards.ts`: Rolle aus Supabase Claims lesen; `(admin)` Routen um RBAC erweitern; E2E-Tests in `tests/auth-guards.spec.ts` ergänzen.

3. Analytics Thin API (MVP)
   - PR: "analytics: add /api/analytics + client util"
     - `src/app/api/analytics/route.ts` (POST), validiert Zod-Schema (`src/lib/schemas`), schreibt nach Supabase Tabelle `events`.
     - `src/shared/lib/utils.ts` oder neues `shared/analytics.ts`: `track(eventName, payload)` mit Queue + `navigator.sendBeacon` Fallback.

— 6 Wochen

4. Content-Entkopplung (Headless-ready)
   - PR: "content: introduce provider interface + server fetchers"
     - Interface in `src/shared/types/index.ts` (z. B. `Course`, `Track`), Fetcher in `src/lib/db/` (Supabase Tables) oder Adapter für Headless CMS.
     - `catalog/page.tsx` und `tracks/[slug]/page.tsx` auf Server-Data-Fetch umstellen; SSG/ISR nutzen.

5. Analytics v2 (Edge, Enrichment, Export)
   - PR: "analytics: edge runtime + server enrichment"
     - `/api/analytics` als Edge-Route; Enrichment mit `userId`, `route`, `referrer` serverseitig; Backpressure/Retry.
   - PR: "analytics: nightly export job"
     - Export in CSV/Parquet nach Storage oder externes DWH (Supabase functions/cron oder externe Pipeline).

6. Design System Stabilisierung
   - PR: "ui: promote shared/ui to versioned package"
     - Optional via Changesets/packemon; SemVer, Storybook (separates Paket), Visual Regression in CI.

### Entscheidungsbegründung

- Next.js App Router + SSR-Auth via Supabase ist gesetzt und wird vereinheitlicht, um Redirect-Flakes zu eliminieren.
- Analytics als Thin API ermöglicht saubere Trennung von Event-Erzeugung und -Persistenz, mit späterer Skalierung.
- Content-Entkopplung reduziert Coupling zum Deploy und beschleunigt Änderungen ohne Rebuild.
- ENV-Guards und Cache-Optimierung verbessern Sicherheit und Performance.

### Referenzen (Code)

- `middleware.ts`
- `src/lib/auth/guards.ts`
- `src/lib/db/createServerClient.ts`, `src/lib/db/supabaseClient.ts`, `src/lib/db/index.ts`
- `src/lib/config/env.client.ts`, `src/lib/config/env.server.ts`, `src/lib/config/env.test.ts`
- `src/lib/cache.ts`, `src/app/api/cache/status/route.ts`
- `src/lib/rate-limit.ts` (Rate-Limiting für API-Routen)
- `src/app/api/auth/*/route.ts`, `src/app/api/health/route.ts`
- `src/shared/ui/components/*`, `src/shared/lib/utils.ts`
- `src/components/DecisionAssessment.tsx`
- `tests/auth-guards.spec.ts`
- `next.config.ts` (Image-Optimierung)
- `playwright.config.ts`
