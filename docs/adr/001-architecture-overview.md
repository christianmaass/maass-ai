## ADR 001: Architektur-Übersicht Navaa

Status: Accepted
Datum: 2025-08-27

### Kurzkontext

Navaa ist eine Next.js 15 App (React 19, App Router) mit Supabase (Auth, DB) und Tailwind CSS v4. Es gibt drei UI-Domänen als Routen-Gruppen: `(marketing)`, `(app)`, `(admin)`. Gemeinsame Komponenten und Utilities leben unter `src/shared`. Authentifizierung erfolgt serverseitig via Supabase-SSR und Cookies. Inhalte (Kurse/Tracks) werden aktuell als statische Seiten und Assets in `public/` sowie `src/app/(app)` gerendert. Tests existieren via Playwright.

### Systemübersicht (Markdown-„Kontextdiagramm“)

```mermaid
flowchart TD
  Browser["User Browser\n(SSR/CSR)"] -->|HTTP(S)| Next["Next.js 15 App Router\n(src/app/*, middleware.ts)"]
  Next -->|Supabase Server Client\nCookies (auth.json, Middleware)| Supabase["Supabase\n(Auth, DB, Storage)"]
  Next -->|Static Assets| Public["/public/*\n(Images, Fonts, SVG)"]
  Next -->|Analytics Events\n(Feedback-Layer)| Analytics["Analytics Sink\n(Web/API – to be defined)"]

  subgraph Next App
    MK[(marketing)]
    AP[(app)]
    AD[(admin)]
    SH[(shared libs)]
  end

  Browser --> MK
  Browser --> AP
  Browser --> AD
  MK --> SH
  AP --> SH
  AD --> SH
```

### Module & Ownership

- `(marketing)`: `src/app/(marketing)` – Landing/Marketing-Seiten, Public Navigation, keine Auth-Pflicht. Owner: Marketing Experience.
- `(app)`: `src/app/(app)` – Produktbereich (Katalog, Tracks, Onboarding). Auth-required Guards. Owner: Product Web.
- `(admin)`: `src/app/(admin)` – Interne Dashboards/Backoffice. Striktere Guards & RBAC. Owner: Platform.
- `shared libs`: `src/shared/*` – UI-Kit (`ui/*`), Form- und Layout-Komponenten, Hooks, Utilities. Owner: Design Systems.
- `lib/auth`: Guards und Server-Auth-Integration (`src/lib/auth/guards.ts`). Owner: Platform.
- `lib/db`: Supabase-Client (`src/lib/db/supabaseClient.ts`, `createServerClient.ts`). Owner: Platform.
- API Routen: `src/app/api/auth/*` (Login/Signup/Logout/Reset). Owner: Platform.

Relevante Verzeichnisse (Auszug, code-referenziert):

- `middleware.ts` (Root) – Request-Vorverarbeitung, Cookie-Weitergabe.
- `src/app/(app)/catalog/page.tsx`, `src/app/(app)/tracks/[slug]/page.tsx` – Kurs-Rendering.
- `src/shared/ui/components/*` – wiederverwendbare UI-Komponenten.

### Datenflüsse

- Auth (Supabase SSR, Cookies)
  - Serverseitig: `src/lib/db/createServerClient.ts` erstellt den Supabase-Server-Client mit Cookie-Adapter; `middleware.ts` übergibt/liest Auth-Cookies.
  - Guards: `src/lib/auth/guards.ts` schützt Routen (Weiterleitung Login/Catalog). Playwright-Tests validieren (`tests/auth-guards.spec.ts`).
  - API-Routen: `src/app/api/auth/*/route.ts` kapseln Login/Signup/Logout/Reset und setzen Cookies via Supabase SDK.

- Kursdaten (Content)
  - Statisch: Bilder/Assets in `public/images/*` und Seiten unter `src/app/(app)/*`. Aktuell keine Headless-CMS-Anbindung; Kurslisten werden als React-Seiten gerendert (z. B. `catalog/page.tsx`).
  - Konfiguration: Onboarding-Schritte in `src/config/onboarding-steps.config.ts`.

- Analytics (Feedback-Layer)
  - Klientseitige Events: aktuell kein einheitlicher Layer im Code ersichtlich.
  - Zielbild: Thin-Client API (`/api/analytics`) + Edge Runtime für niedrige Latenz; Enrichment (route, userId aus Supabase Session) serverseitig, Storage zunächst Supabase (table `events`), später export zu DWH.

### Risiken

- P1: Inkonsistente Auth-Zustände zwischen Middleware, Server Actions und API-Routen
  - Grund: Mehrere Integrationspunkte (SSR-Guards, `middleware.ts`, API-Handler) können Cookie-/Session-Divergenz erzeugen; Playwright-Fehlerverzeichnisse deuten auf Navigations-Redirect-Issues hin (`test-results/*`).

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

— 6 Wochen 4) Content-Entkopplung (Headless-ready)

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

### Referenzen (Code)

- `middleware.ts`
- `src/lib/auth/guards.ts`
- `src/lib/db/createServerClient.ts`, `src/lib/db/supabaseClient.ts`, `src/lib/db/index.ts`
- `src/app/(app)/catalog/page.tsx`, `src/app/(app)/tracks/[slug]/page.tsx`, `src/app/(app)/strategy-track/*`
- `src/app/api/auth/*/route.ts`
- `src/shared/ui/components/*`, `src/shared/lib/utils.ts`
- `tests/auth-guards.spec.ts`
