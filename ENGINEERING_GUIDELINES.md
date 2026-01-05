# NAVAA Engineering Guidelines

**Technik & Architektur**

---

## Zweck

Dieses Dokument definiert, **WIE NAVAA technisch gebaut wird** – Framework, Architektur, Security, Tests.

Es regelt:

- Next.js App Router Struktur
- Ordnerkonventionen
- Supabase Server/Browser Clients
- Guards (auth/admin)
- Zod-Validierung
- ENV-Handling
- Security & Rate-Limiting
- Tests & CI-Gates
- ADR-Vorgehen

**NICHT enthalten:** Produktpositionierung, Trainingsphilosophie, KI-Rollenbilder, Didaktische Prinzipien.

→ Für Produkt & Positionierung siehe `README.md`  
→ Für Produkt- & KI-Leitplanken siehe `DEVELOPMENT_GUIDELINES.md`

---

## 1. Architektur & Ordnerstruktur

### Next.js App Router

- **App Router**: `src/app/(marketing)`, `src/app/(app)`, `src/app/(admin)`
- **Infra/Lib**: `src/lib/{db,guards,schemas,rate-limit,cache,config}`
- **Shared**: `src/shared/{ui,hooks,types,config}`
- **Components**: `src/components/` (Domain-Komponenten wie `DecisionAssessment`)
- **Verboten**: `pages/`-Ordner (nur App Router)

### Routen-Gruppen

- `(marketing)`: Öffentliches Layout, keine Auth-Pflicht
- `(app)`: Produktbereich, requires auth → Guard im `(app)/layout.tsx`
- `(admin)`: Interne Dashboards, requires role=admin → Guard im `(admin)/layout.tsx`
- **Keine Page-level Guards** – Guards nur in Layouts

---

## 2. Supabase

### Server-Client (SSR)

- **Datei**: `src/lib/db/createServerClient.ts`
- **Zweck**: SSR, Cookies, Server Components
- **Verwendung**: Server Actions, Server Components, API Routes

```typescript
import { createServerClient } from '@/lib/db/createServerClient';
const supabase = await createServerClient();
```

### Browser-Client

- **Datei**: `src/lib/db/supabaseClient.ts`
- **Zweck**: Client-side Zugriff
- **Verwendung**: Client Components, nur mit `NEXT_PUBLIC_*` Keys

```typescript
import { supabaseClient } from '@/lib/db/supabaseClient';
```

### Types

- **Regenerieren** nach Schema-Änderungen: `npx supabase gen types typescript`
- **Speicherort**: `src/types/supabase.ts`

---

## 3. Guards

### Server Components/Pages

- **Funktion**: `requireAuth()`, `requireAdmin()` (redirect bei fehlender Auth)
- **Verwendung**: Layouts, Server Components

```typescript
import { requireAuth } from '@/lib/auth/guards';
const user = await requireAuth(); // redirects to /login if not authenticated
```

### API Routes

- **Funktion**: `getAuthUser()`, `getAdminUser()` (JSON-Response bei fehlender Auth)
- **Verwendung**: API Route Handlers

```typescript
import { getAuthUser } from '@/lib/auth/guards';
const user = await getAuthUser();
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Guard-Prinzipien

- **Layout-level Guards**: Guards in `(app)/layout.tsx` und `(admin)/layout.tsx`
- **Keine Page-level Guards**: Guards nur in Layouts, nicht in einzelnen Pages
- **API-Auth**: Alle geschützten API-Routen müssen `getAuthUser()` oder `getAdminUser()` nutzen

---

## 4. Validierung

### Zod-Schemas

- **Pflicht**: Alle Inputs (Server Actions/APIs) müssen Zod-Schemas nutzen
- **Auth-APIs**: `LoginSchema`, `RegisterSchema` in `src/lib/schemas`
- **Typen**: Via `z.infer<typeof Schema>`

```typescript
import { LoginSchema } from '@/lib/schemas';
const { email, password } = LoginSchema.parse(body);
```

### Fehlerbehandlung

- **ZodError**: Aussagekräftige Fehlermeldungen
- **Validation**: Vor jeder Business-Logik

---

## 5. Styling

### Tailwind CSS

- **Konfiguration**: `tailwind.config.mjs`
- **Globals**: `app/globals.css` (CSS-Variablen)
- **UI-Primitives**: `src/shared/ui`

### Design Tokens

- **CSS-Variablen**: `navaa-*` für konsistente Farben/Spacing
- **Verwendung**: Design Tokens statt Hardcoded-Werten

---

## 6. Daten & State

### Server Components bevorzugt

- **Prinzip**: Server Components + Server Actions bevorzugt
- **Client State**: Sparsam, nur wenn nötig

---

## 7. Sicherheit

### ENV-Guards

- **Pflicht**: Nur `env.client.ts` und `env.server.ts` nutzen, nie direkt `process.env`
- **Dateien**:
  - `src/lib/config/env.client.ts` (NEXT*PUBLIC*\*)
  - `src/lib/config/env.server.ts` (Server-only, mit `server-only` Guard)
  - `src/lib/config/env.test.ts` (Test-Umgebungen)

```typescript
import { env } from '@/lib/config';
const apiKey = env.server.SUPABASE_SERVICE_ROLE_KEY; // ✅
// const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ❌
```

### Service Role Key

- **Niemals im Client**: Service Role Key nur serverseitig
- **Guard**: `server-only` Package verhindert Client-Import

### RLS (Row Level Security)

- **Pflicht**: RLS für private Tabellen
- **Output filtern**: Keine sensiblen Felder im Response

### Rate-Limiting

- **Pflicht**: Auth-APIs (`/api/auth/login`, `/api/auth/signup`) müssen Rate-Limiting haben
- **Modul**: `src/lib/rate-limit.ts`
- **Verwendung**: Redis-basiert (Upstash) mit in-memory Fallback

```typescript
import { rateLimit } from '@/lib/rate-limit';
const result = await rateLimit(request, 5, 900); // 5 Requests/15min
if (!result.success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}
```

### API-Auth

- **Pflicht**: Alle geschützten API-Routen müssen `getAuthUser()` oder `getAdminUser()` nutzen

---

## 8. Tests

### E2E-Tests (Playwright)

- **Datei**: `tests/auth-guards.spec.ts`
- **Coverage**: Login → /app, Admin-Redirects, Auth-Guards
- **Konfiguration**: `playwright.config.ts`

### Unit-Tests

- **Coverage**: Helpers/Guards, Rate-Limiting, Validierung
- **Framework**: Vitest (`vitest.config.ts`)

---

## 9. CI-Gates

### Hard Gates (non-negotiable)

- ✅ **Typecheck**: `tsc --noEmit` muss grün sein
- ✅ **Lint**: `eslint .` muss grün sein
- ✅ **Build**: `next build` muss erfolgreich sein
- ✅ **Verbot**: `pages/`-Ordner im Repo
- ✅ **Leak-Check**: Service Role Key nicht im `.next`-Bundle

### Optional Gates

- ✅ **Tests**: E2E-Tests sollten grün sein
- ✅ **Dead Code**: Ungenutzte Exports sollten bereinigt sein

---

## 10. ADRs (Architecture Decision Records)

### Vorgehen

- **Größere Entscheidungen**: In `docs/adr/` dokumentieren
- **Template**: `docs/adr/ADR-TEMPLATE.md`
- **Format**: Status, Datum, Kontext, Entscheidung, Konsequenzen

### Bestehende ADRs

- `docs/adr/001-architecture-overview.md`: Architektur-Übersicht

---

## 11. Caching & Performance

### Next.js Cache

- **ISR**: Marketing-Seiten (`revalidate: 3600`)
- **Dynamic**: App/Admin-Seiten

### Redis-Cache

- **Modul**: `src/lib/cache.ts`
- **Zweck**: Serverseitiger Cache für teure Datenbankabfragen
- **TTL**: Konfigurierbar
- **Monitoring**: `/api/cache/status`

### Asset-Optimierung

- **WebP/AVIF**: Next.js Image-Komponente
- **Priority/Lazy Loading**: Responsive Images
- **Scripts**: `scripts/optimize-images.sh`

---

## 12. Monitoring & Observability

### Sentry

- **Konfiguration**: `sentry.client.config.ts`, `sentry.server.config.ts`
- **Instrumentation**: `instrumentation.ts`
- **Zweck**: Error Tracking

### Health-Check

- **Endpoint**: `/api/health`
- **Zweck**: System-Status prüfen

---

## 13. Code-Qualität

### Linting

- **Konfiguration**: `eslint.config.mjs`
- **Regeln**: TypeScript, React, Next.js

### TypeScript

- **Konfiguration**: `tsconfig.json`
- **Strict Mode**: Aktiviert

### Dead Code

- **Bereinigung**: Ungenutzte Exports entfernen
- **Monitoring**: Regelmäßige Audits

---

## 14. Verbotene Muster

### Architektur-Fehler

- ❌ **Pages Router**: `pages/`-Ordner verwenden
- ❌ **Direkte ENV-Zugriffe**: `process.env` statt ENV-Guards
- ❌ **Service Role Key im Client**: Client-seitiger Zugriff auf Service Role Key
- ❌ **Page-level Guards**: Guards in einzelnen Pages statt Layouts

### Security-Fehler

- ❌ **Keine Input-Validierung**: APIs ohne Zod-Schemas
- ❌ **Kein Rate-Limiting**: Auth-APIs ohne Rate-Limiting
- ❌ **Keine API-Auth**: Geschützte APIs ohne `getAuthUser()`/`getAdminUser()`
- ❌ **RLS fehlt**: Private Tabellen ohne RLS

### Code-Qualität-Fehler

- ❌ **Ungenutzte Exports**: Dead Code im Repo
- ❌ **Hardcoded Werte**: Statt Design Tokens
- ❌ **Client State überall**: Statt Server Components

---

## 15. Entscheidungsregel für technische Änderungen

Bei jeder technischen Änderung musst du dich fragen:

1. **Geht es um Code, Architektur, Security, Build, Struktur?**
   - Ja → ✅ gehört hierher
   - Nein → ❌ gehört nicht hierher

2. **Verletzt es Architektur-Prinzipien?**
   - Ja → ❌ verboten
   - Nein → ✅ erlaubt

3. **Verletzt es Security-Prinzipien?**
   - Ja → ❌ verboten
   - Nein → ✅ erlaubt

Wenn du unsicher bist:
→ Entscheide konservativ und benenne die Unsicherheit explizit.

---

## Referenzen

- **ADR**: `docs/adr/001-architecture-overview.md`
- **Runbooks**: `docs/runbooks/`
- **Code**: `src/lib/`, `src/shared/`, `src/app/`
