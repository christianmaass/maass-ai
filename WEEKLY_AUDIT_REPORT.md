# Wöchentlicher Komplett-Check Report
**Datum:** 2025-01-27  
**Rolle:** Principal Engineer & Quality Auditor  
**Scope:** Gesamtes Repo

---

## Summary of Findings (Top 5 nach Impact)

### 1. **P1: TypeScript Build-Fehler durch Phantom-Routen** 🔴
**Impact:** Build könnte in CI/CD fehlschlagen  
**Details:** `.next/types` referenziert Routen, die nicht existieren:
- `src/app/(app)/catalog/page.ts`
- `src/app/(app)/methodenbaukasten/page.ts`
- `src/app/(app)/strategy-track/page.ts`
- `src/app/(app)/strategy-track/onboarding/page.ts`
- `src/app/(app)/tracks/[slug]/page.ts`
- `src/app/courses/[slug]/page.ts`
- `src/app/courses/layout.ts`
- `src/app/api/courses/route.ts`

**Betroffene Dateien:**
- `.next/types/app/(app)/catalog/page.ts` (Zeile 2, 5)
- `.next/types/app/(app)/methodenbaukasten/page.ts` (Zeile 2, 5)
- Weitere 6 Dateien in `.next/types/`

**Empfehlung:** `.next` Ordner löschen und Build neu ausführen. Falls Fehler persistieren, Next.js Type-Generation prüfen.

---

### 2. **P1: API-Route ohne Input-Validierung** 🔴
**Impact:** Sicherheitsrisiko durch unvalidierte Inputs  
**Details:** `/api/auth/login` verwendet manuelle String-Checks statt Zod-Schema

```4:28:src/app/api/auth/login/route.ts
export async function POST(request: Request) {
  let email: string;
  let password: string;

  // Prüfe Content-Type Header
  const contentType = request.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    // JSON Request (von AuthForm)
    const body = await request.json();
    email = body.email;
    password = body.password;
  } else {
    // FormData Request (von HTML-Form)
    const formData = await request.formData();
    email = String(formData.get('email'));
    password = String(formData.get('password'));
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email und Passwort sind erforderlich' },
      { status: 400 }
    );
  }
```

**Problem:** 
- Keine Email-Format-Validierung
- Keine Passwort-Minimum-Länge-Prüfung
- `LoginSchema` existiert bereits in `src/lib/schemas/index.ts`, wird aber nicht verwendet

**Betroffene Dateien:**
- `src/app/api/auth/login/route.ts` (Zeilen 4-28)

---

### 3. **P2: Ungeschützte API-Routen** 🟡
**Impact:** Potenzielle Informationsleckage  
**Details:** Zwei API-Routen haben keine Authentifizierung:

**a) `/api/auth/logout`** - Keine Session-Validierung
```4:17:src/app/api/auth/logout/route.ts
export async function POST() {
  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
```

**b) `/api/cache/status`** - Öffentlich zugänglich
```9:29:src/app/api/cache/status/route.ts
export async function GET() {
  try {
    const stats = getCacheStats();
    const enabled = isCacheEnabled();

    return NextResponse.json({
      ok: true,
      cache: {
        status: enabled,
        ...stats,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting cache status:', error);
    return NextResponse.json(
      { error: 'Failed to get cache status' },
      { status: 500 }
    );
  }
}
```

**Betroffene Dateien:**
- `src/app/api/auth/logout/route.ts`
- `src/app/api/cache/status/route.ts`

---

### 4. **P2: Asset-Optimierungspotenzial** 🟡
**Impact:** Performance, Ladezeiten  
**Details:** 
- `public/images/navaa-herobanner.png`: 179KB (knapp unter 300KB-Schwelle, aber optimierbar)
- Alle anderen Assets sind < 50KB ✅
- `next/image` wird korrekt verwendet ✅

**Betroffene Dateien:**
- `public/images/navaa-herobanner.png` (179KB)

**Empfehlung:** WebP/AVIF-Konvertierung, Komprimierung auf < 100KB

---

### 5. **P3: Fehlende Rate-Limiting auf Auth-APIs** 🟢
**Impact:** Potenzielle Brute-Force-Angriffe  
**Details:** `/api/auth/login` und `/api/auth/signup` haben keine Rate-Limiting-Mechanismen

**Betroffene Dateien:**
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/signup/route.ts`

---

## Identified Risks

### P1 (Kritisch)

1. **TypeScript Build-Fehler**
   - **Pfad:** `.next/types/**/*.ts`
   - **Kategorie:** Build-Stabilität
   - **Beschreibung:** Phantom-Routen-Referenzen blockieren Type-Checking

2. **Unvalidierte API-Inputs**
   - **Pfad:** `src/app/api/auth/login/route.ts:4-28`
   - **Kategorie:** Sicherheit
   - **Beschreibung:** Manuelle Validierung statt Zod-Schema

### P2 (Hoch)

3. **Ungeschützte API-Routen**
   - **Pfade:** 
     - `src/app/api/auth/logout/route.ts`
     - `src/app/api/cache/status/route.ts`
   - **Kategorie:** Sicherheit
   - **Beschreibung:** Keine Auth-Checks, potenzielle Informationsleckage

4. **Asset-Größe**
   - **Pfad:** `public/images/navaa-herobanner.png` (179KB)
   - **Kategorie:** Performance
   - **Beschreibung:** Optimierbar auf < 100KB

### P3 (Mittel)

5. **Fehlendes Rate-Limiting**
   - **Pfade:** `src/app/api/auth/login/route.ts`, `src/app/api/auth/signup/route.ts`
   - **Kategorie:** Sicherheit
   - **Beschreibung:** Brute-Force-Schutz fehlt

---

## Concrete Actionable Recommendations

### Cluster 1: Build & Type-Safety (P1) 🔴

**PR 1: `fix: clean-next-types-and-build-errors`**
- `.next` Ordner löschen
- `npm run build` ausführen
- Falls Fehler persistieren: Next.js Type-Generation debuggen
- CI/CD-Pipeline prüfen, ob Build-Fehler abgefangen werden

**PR 2: `refactor(api): add-zod-validation-to-login`**
- `src/app/api/auth/login/route.ts` refactoren
- `LoginSchema` aus `src/lib/schemas/index.ts` verwenden
- Email- und Passwort-Validierung via Zod
- FormData-Parsing ebenfalls validieren

```typescript
// Vorschlag für src/app/api/auth/login/route.ts
import { LoginSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type');
    let body: unknown;
    
    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = {
        email: formData.get('email'),
        password: formData.get('password'),
      };
    }
    
    const { email, password } = LoginSchema.parse(body);
    // ... rest of logic
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    // ... error handling
  }
}
```

---

### Cluster 2: Security Hardening (P1/P2) 🔴🟡

**PR 3: `security(api): add-auth-guards-to-routes`**
- `src/app/api/auth/logout/route.ts`: Session-Validierung hinzufügen
- `src/app/api/cache/status/route.ts`: Auth-Check oder Admin-Only

```typescript
// Vorschlag für src/app/api/auth/logout/route.ts
import { requireAuth } from '@/lib/auth/guards';

export async function POST() {
  try {
    await requireAuth(); // Session-Validierung
    const supabase = await createServerClient();
    // ... rest
  }
}
```

**PR 4: `security(api): add-rate-limiting`**
- Rate-Limiting für `/api/auth/login` und `/api/auth/signup`
- Optionen: Upstash Redis (bereits im Projekt), oder Next.js Middleware-basiert
- Empfehlung: 5 Requests pro 15 Minuten pro IP

---

### Cluster 3: Performance (P2) 🟡

**PR 5: `perf(assets): optimize-hero-banner`**
- `public/images/navaa-herobanner.png` konvertieren zu WebP/AVIF
- Ziel: < 100KB
- `next/image` bereits korrekt verwendet ✅

---

### Cluster 4: Code Quality (P3) 🟢

**PR 6: `chore: run-depcheck-and-ts-prune`**
- `npx depcheck` ausführen (unused dependencies)
- `npx ts-prune` ausführen (unused exports)
- Ergebnisse dokumentieren und bereinigen

**Hinweis:** Tools konnten aufgrund von Sandbox-Beschränkungen nicht ausgeführt werden. Manuell ausführen oder in CI/CD integrieren.

---

## Appendix: Tool-Outputs (Kurzprotokoll)

### Lint/Types/Build

**Lint:** ❌ Nicht ausführbar (Sandbox-Beschränkungen: EPERM auf node_modules)

**Typecheck:** ⚠️ **Fehler gefunden**
```
.next/types/app/(app)/catalog/page.ts(2,24): error TS2307: Cannot find module '../../../../../src/app/(app)/catalog/page.js'
.next/types/app/(app)/methodenbaukasten/page.ts(2,24): error TS2307: Cannot find module '../../../../../src/app/(app)/methodenbaukasten/page.js'
[... weitere 6 ähnliche Fehler]
```

**Build:** ❌ Nicht ausführbar (Sandbox-Beschränkungen: EPERM auf node_modules)

**Empfehlung:** Lokal oder in CI/CD ausführen:
```bash
rm -rf .next
npm run build
npm run typecheck
npm run lint
```

---

### Dead/Unused Code

**depcheck:** ❌ Nicht ausführbar (Sandbox-Beschränkungen)

**ts-prune:** ❌ Nicht ausführbar (Sandbox-Beschränkungen)

**Empfehlung:** Manuell ausführen:
```bash
npx depcheck --json > depcheck-report.json
npx ts-prune > ts-prune-report.txt
```

---

### Security Scan

**ENV-Leaks:** ✅ **Keine gefunden**
- Alle `process.env` Zugriffe nur in ENV-Guards (`env.client.ts`, `env.server.ts`)
- Korrekte Verwendung von `clientEnv` und `serverEnv` im gesamten Code

**API-Routen Validierung:**
- ✅ `/api/auth/signup`: Verwendet `RegisterSchema.parse()` ✅
- ✅ `/api/auth/reset-password`: Verwendet `ResetPasswordSchema.parse()` ✅
- ❌ `/api/auth/login`: Nur manuelle Checks ❌
- ✅ `/api/health`: Keine Inputs, nur ENV-Guards ✅
- ⚠️ `/api/auth/logout`: Keine Auth-Validierung ⚠️
- ⚠️ `/api/cache/status`: Keine Auth-Validierung ⚠️

**Server Actions:** ✅ Keine gefunden (keine `"use server"` Direktiven im Code)

---

### Performance Scan

**Next.js Caching-Matrix:** ✅ **Korrekt konfiguriert**
- `(marketing)/layout.tsx`: `revalidate = 3600` (ISR) ✅
- `(app)/layout.tsx`: `dynamic = 'force-dynamic'`, `fetchCache = 'default-no-store'` ✅
- `(admin)/layout.tsx`: `dynamic = 'force-dynamic'`, `fetchCache = 'default-no-store'` ✅

**Assets:**
```
public/images/navaa-herobanner.png: 179KB ⚠️ (optimierbar)
public/images/strategy-check.png: 36KB ✅
public/images/navaa-logo.png: 21KB ✅
```

**next/image Nutzung:** ✅ **Korrekt verwendet**
- `src/app/(marketing)/page.tsx`: `import Image from 'next/image'` ✅
- `src/shared/ui/components/marketing-header.tsx`: `Image` Komponente ✅
- `src/shared/ui/components/hero-banner.tsx`: `Image` mit `priority`, `sizes` ✅
- `src/shared/ui/components/app-header.tsx`: `Image` Komponente ✅

---

### Docs & ADRs

**ADR 001 (Architecture Overview):** ✅ **Aktuell**
- Beschreibt aktuelle Architektur korrekt
- Erwähnt ISR für Marketing, Dynamic für App/Admin ✅
- ENV-Guards dokumentiert ✅
- Letzte Aktualisierung: 2025-01-27

**Runbooks:**
- `auth-ssr.md`: ✅ Passt zu aktuellem Code (Middleware, Guards)

**Guidelines:**
- `README.md`: ✅ Produkt & Positionierung
- `DEVELOPMENT_GUIDELINES.md`: ✅ Produkt- & KI-Leitplanken
- `ENGINEERING_GUIDELINES.md`: ✅ Technik & Architektur

**Keine Diskrepanzen zwischen Docs und Code gefunden.**

---

## Priorisierter Maßnahmenplan

### Sofort (Diese Woche)
1. ✅ **PR 1:** `.next` löschen, Build-Fehler beheben
2. ✅ **PR 2:** Zod-Validierung für `/api/auth/login`

### Diese Woche (P1/P2)
3. ✅ **PR 3:** Auth-Guards für `/api/auth/logout` und `/api/cache/status`
4. ✅ **PR 4:** Rate-Limiting für Auth-APIs (optional, aber empfohlen)

### Nächste Woche (P2/P3)
5. ✅ **PR 5:** Asset-Optimierung (Hero-Banner)
6. ✅ **PR 6:** Dead/Unused Code bereinigen (depcheck, ts-prune)

---

## Zusammenfassung

**Gesamtstatus:** 🟡 **Verbesserungswürdig**

- ✅ **Stärken:** ENV-Guards korrekt, Caching-Matrix korrekt, next/image verwendet, Docs aktuell
- ⚠️ **Schwächen:** Build-Fehler, fehlende Validierung, ungeschützte API-Routen
- 📊 **Risiko-Score:** 2x P1, 2x P2, 1x P3

**Empfohlene PR-Reihenfolge:**
1. `fix: clean-next-types-and-build-errors`
2. `refactor(api): add-zod-validation-to-login`
3. `security(api): add-auth-guards-to-routes`
4. `perf(assets): optimize-hero-banner`
5. `security(api): add-rate-limiting` (optional)
6. `chore: run-depcheck-and-ts-prune`

---

*Report generiert am 2025-01-27*

