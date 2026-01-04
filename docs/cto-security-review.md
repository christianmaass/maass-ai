# CTO Security Review - Navaa Codebase

**Datum:** 2025-01-27  
**Reviewer:** CTO Security Audit  
**Scope:** Gesamte Codebase - Sicherheitsanalyse

---

## Executive Summary

Die Codebase zeigt eine solide Grundlage mit guten Sicherheitspraktiken (Zod-Validierung, Rate-Limiting, Environment-Variable-Trennung). Es wurden jedoch **7 kritische bis mittlere Sicherheitsprobleme** identifiziert, die vor einem Production-Deployment behoben werden müssen.

**Risiko-Score:** 🟡 **MITTEL-HOCH** (vor Behebung) → 🟢 **NIEDRIG** (nach Behebung)

**Status:** ✅ **ALLE PROBLEME BEHOBEN** (2025-01-27)

---

## 🔴 KRITISCHE PROBLEME (P0 - Sofort beheben)

### 1. Middleware-Authentifizierung: Cookie-Existenz statt Token-Validierung

**Datei:** `middleware.ts:22-30`

**Problem:**
```22:30:middleware.ts
  // Check for Supabase access token cookie
  const accessToken = request.cookies.get('sb-access-token');

  if (!accessToken || !accessToken.value) {
    // Redirect to login if no access token
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // User has valid session, continue
  return NextResponse.next();
```

Die Middleware prüft nur, ob ein Cookie existiert, **nicht ob der Token gültig ist**. Ein Angreifer könnte:
- Einen manipulierten/abgelaufenen Token im Cookie setzen
- Zugriff auf geschützte Routen erhalten, ohne gültige Session

**Impact:** 🔴 **KRITISCH** - Unbefugter Zugriff auf geschützte Bereiche möglich

**Empfehlung:**
```typescript
// Token-Validierung über Supabase API
const supabase = createServerClient();
const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}
```

**Alternativ:** Token-Signatur prüfen (JWT-Verify) ohne API-Call für bessere Performance.

---

### 2. Sensible Datei im Repository: `auth.json`

**Datei:** `auth.json` (Root-Verzeichnis)

**Problem:**
- Datei enthält Mock-Auth-Tokens und Test-Credentials
- Ist **nicht** in `.gitignore` enthalten
- Könnte versehentlich committed werden

**Impact:** 🔴 **KRITISCH** - Potenzielle Credential-Leaks

**Empfehlung:**
1. `auth.json` zu `.gitignore` hinzufügen
2. Datei aus Repository entfernen (falls bereits committed)
3. Beispiel-Datei als `auth.json.example` erstellen

```gitignore
# .gitignore
auth.json
*.auth.json
```

---

## 🟠 HOHE PROBLEME (P1 - Vor Production beheben)

### 3. Fehlende Cookie-Sicherheitsattribute

**Datei:** `src/lib/db/createServerClient.ts`

**Problem:**
Die Cookie-Konfiguration wird von Supabase SDK verwaltet, aber es gibt keine explizite Konfiguration für:
- `HttpOnly` (Schutz vor XSS)
- `Secure` (nur HTTPS in Production)
- `SameSite` (CSRF-Schutz)

**Impact:** 🟠 **HOCH** - XSS und Session-Hijacking möglich

**Empfehlung:**
```typescript
return createSupabaseServerClient(
  supabaseUrl,
  supabaseKey,
  {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
        });
      },
    },
  }
);
```

**Hinweis:** Prüfen, ob Supabase SDK diese Optionen bereits setzt. Falls ja, dokumentieren.

---

### 4. Fehlerbehandlung: Potenzielle Information Disclosure

**Dateien:**
- `src/app/api/auth/login/route.ts:57`
- `src/app/api/auth/login/route.ts:90`
- `src/app/api/artifacts/route.ts:135`

**Problem:**
```57:57:src/app/api/auth/login/route.ts
      console.error('Login error:', error);
```

Fehler werden vollständig geloggt, könnten sensible Informationen enthalten:
- Stack Traces mit Dateipfaden
- Datenbank-Fehlermeldungen
- Interne System-Struktur

**Impact:** 🟠 **HOCH** - Information Disclosure, vereinfacht Angriffe

**Empfehlung:**
```typescript
// Generische Fehlermeldungen für User
if (error) {
  // Log nur in Development/Staging
  if (process.env.NODE_ENV !== 'production') {
    console.error('Login error:', error);
  } else {
    // Production: Nur Error-Type loggen
    console.error('Login failed:', error.name);
  }
  
  return NextResponse.json(
    { error: 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.' },
    { status: 401 }
  );
}
```

**Zusätzlich:** Sentry für strukturiertes Error-Logging nutzen (bereits vorhanden).

---

### 5. Fehlender CSRF-Schutz für State-Changing Operations

**Dateien:**
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/signup/route.ts`
- `src/app/api/artifacts/route.ts`

**Problem:**
POST/PUT/DELETE Requests haben keinen expliziten CSRF-Schutz. Next.js bietet standardmäßig CSRF-Schutz, aber:
- Keine explizite Validierung von Origin/Referer Headers
- Keine CSRF-Token für API-Routes

**Impact:** 🟠 **HOCH** - Cross-Site Request Forgery möglich

**Empfehlung:**
1. Origin-Header-Validierung für API-Routes:
```typescript
const origin = request.headers.get('origin');
const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL];

if (origin && !allowedOrigins.includes(origin)) {
  return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
}
```

2. Oder: CSRF-Token-System implementieren (für komplexere Szenarien)

**Hinweis:** Next.js 15 hat eingebauten CSRF-Schutz, aber explizite Validierung ist sicherer.

---

## 🟡 MITTLERE PROBLEME (P2 - In nächstem Sprint beheben)

### 6. Fehlende CORS-Konfiguration

**Datei:** `next.config.ts`

**Problem:**
Keine explizite CORS-Konfiguration für API-Routes. Next.js erlaubt standardmäßig alle Origins in Development.

**Impact:** 🟡 **MITTEL** - Unerwünschte Cross-Origin-Requests möglich

**Empfehlung:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};
```

---

### 7. Rate Limiting: IP-Spoofing möglich

**Datei:** `src/lib/rate-limit.ts:20-38`

**Problem:**
```20:38:src/lib/rate-limit.ts
function getClientIP(request: NextRequest): string {
  // Prüfe verschiedene Header für IP (Proxy/Load Balancer)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (cfConnectingIP) {
    return cfConnectingIP.split(',')[0].trim();
  }
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIP) {
    return realIP.trim();
  }

  // Fallback: IP aus Request-URL (für lokale Entwicklung)
  return request.ip || 'unknown';
}
```

**Problem:**
- Header können von Clients manipuliert werden (`x-forwarded-for`, `x-real-ip`)
- Nur `cf-connecting-ip` ist vertrauenswürdig (wenn Cloudflare verwendet wird)

**Impact:** 🟡 **MITTEL** - Rate-Limiting kann umgangen werden

**Empfehlung:**
1. **Wenn Cloudflare verwendet wird:** Nur `cf-connecting-ip` nutzen
2. **Wenn kein Proxy:** `request.ip` direkt nutzen
3. **Wenn eigener Proxy:** IP-Whitelist für vertrauenswürdige Proxies

```typescript
function getClientIP(request: NextRequest): string {
  // Cloudflare (vertrauenswürdig)
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP.split(',')[0].trim();
  }
  
  // Direkte Verbindung (kein Proxy)
  if (request.ip) {
    return request.ip;
  }
  
  // Fallback: Warnung loggen
  console.warn('Could not determine client IP');
  return 'unknown';
}
```

---

## ✅ POSITIVE SICHERHEITSPRAKTIKEN

### Gut implementiert:

1. **✅ Input-Validierung mit Zod**
   - Alle Auth-APIs verwenden Zod-Schemas
   - Email-Format-Validierung
   - Passwort-Minimum-Länge

2. **✅ Rate-Limiting implementiert**
   - Login: 5 Requests/15min
   - Signup: 5 Requests/15min
   - Password Reset: 3 Requests/Stunde

3. **✅ Environment-Variable-Trennung**
   - Client/Server-Trennung (`env.client.ts` vs `env.server.ts`)
   - Service Role Key nur server-seitig
   - Zod-Validierung für alle ENV-Variablen

4. **✅ Supabase RLS (Row Level Security)**
   - Dokumentiert in `docs/runbooks/auth-ssr.md`
   - User-ID-basierte Zugriffskontrolle

5. **✅ Parameterisierte Datenbankabfragen**
   - Supabase SDK verwendet automatisch Parameterisierung
   - Keine SQL-Injection-Risiken

6. **✅ Auth Guards**
   - `requireAuth()`, `requireAdmin()` für Server Components
   - `getAuthUser()`, `getAdminUser()` für API Routes

---

## 📋 ACTION ITEMS (Priorisiert)

### ✅ BEHOBEN (2025-01-27):
- [x] **P0-1:** Middleware Token-Validierung implementieren ✅
- [x] **P0-2:** `auth.json` zu `.gitignore` hinzufügen ✅
- [x] **P1-3:** Cookie-Sicherheitsattribute explizit setzen ✅
- [x] **P1-4:** Fehlerbehandlung: Sensible Informationen nicht loggen ✅
- [x] **P1-5:** CSRF-Schutz für API-Routes implementieren ✅
- [x] **P2-6:** CORS-Konfiguration explizit setzen ✅
- [x] **P2-7:** Rate-Limiting IP-Extraktion absichern ✅

### Implementierte Fixes:

1. **Middleware Token-Validierung** (`middleware.ts`)
   - Token wird jetzt über Supabase API validiert
   - Verhindert Zugriff mit ungültigen/abgelaufenen Tokens

2. **Cookie-Sicherheitsattribute** (`src/lib/db/createServerClient.ts`)
   - `httpOnly: true` - Schutz vor XSS
   - `secure: true` in Production - nur HTTPS
   - `sameSite: 'lax'` - CSRF-Schutz

3. **Fehlerbehandlung** (alle API-Routes)
   - In Production werden nur Error-Typen geloggt, keine vollständigen Stack Traces
   - Sensible Informationen werden nicht mehr in Logs ausgegeben

4. **CSRF-Schutz** (`src/lib/security/csrf.ts`)
   - Origin-Header-Validierung für alle POST/PUT/DELETE Requests
   - Implementiert in: login, signup, reset-password, artifacts

5. **CORS-Konfiguration** (`next.config.ts`)
   - Explizite CORS-Header für API-Routes
   - Nur erlaubte Origin wird akzeptiert

6. **Rate-Limiting IP-Extraktion** (`src/lib/rate-limit.ts`)
   - Nur vertrauenswürdige Quellen (Cloudflare, request.ip)
   - Manipulierbare Header nur in Development

### Optional (Nice-to-have):
- [ ] Security Headers (CSP, X-Frame-Options, etc.) in `next.config.ts`
- [ ] Content Security Policy (CSP) für XSS-Schutz
- [ ] Security-Audit-Logging (wer hat was wann gemacht)
- [ ] Penetration Testing vor Production-Launch

---

## 🔍 ZUSÄTZLICHE EMPFEHLUNGEN

### 1. Dependency Security Scanning
```bash
npm audit
# oder
npm audit fix
```

Regelmäßig ausführen, um bekannte Vulnerabilities in Dependencies zu finden.

### 2. Secrets Management
- **Niemals** Secrets in Code committen
- Environment-Variablen über Vercel/Deployment-Platform verwalten
- Secrets Rotation regelmäßig durchführen

### 3. Monitoring & Alerting
- Sentry bereits integriert ✅
- Zusätzlich: Security-Events loggen (failed logins, rate-limit hits, etc.)
- Alerting bei ungewöhnlichen Mustern

### 4. Database Security
- **RLS (Row Level Security)** für alle Tabellen aktivieren
- Regelmäßige Backups
- Connection-Pooling (Supabase verwaltet dies automatisch)

### 5. API Security
- API-Versioning für Breaking Changes
- Request-ID für Tracing
- Response-Time-Monitoring

---

## 📊 RISIKO-MATRIX

| Problem | Severity | Likelihood | Impact | Priority |
|---------|----------|------------|--------|----------|
| Middleware Token-Validierung | 🔴 Kritisch | Hoch | Hoch | P0 |
| auth.json im Repo | 🔴 Kritisch | Mittel | Hoch | P0 |
| Cookie-Sicherheitsattribute | 🟠 Hoch | Hoch | Mittel | P1 |
| Information Disclosure | 🟠 Hoch | Mittel | Mittel | P1 |
| CSRF-Schutz | 🟠 Hoch | Mittel | Hoch | P1 |
| CORS-Konfiguration | 🟡 Mittel | Niedrig | Niedrig | P2 |
| Rate-Limiting IP-Spoofing | 🟡 Mittel | Niedrig | Mittel | P2 |

---

## ✅ CHECKLISTE FÜR PRODUCTION-DEPLOYMENT

- [x] Alle P0-Probleme behoben ✅
- [x] Alle P1-Probleme behoben ✅
- [x] Alle P2-Probleme behoben ✅
- [ ] `npm audit` ohne kritische Vulnerabilities (manuell prüfen)
- [ ] Environment-Variablen in Production gesetzt (manuell prüfen)
- [ ] RLS für alle Supabase-Tabellen aktiviert (manuell prüfen)
- [ ] Cookie-Sicherheitsattribute getestet (manuell testen)
- [ ] Rate-Limiting getestet (manuell testen)
- [ ] Error-Logging getestet (keine sensiblen Daten) ✅
- [ ] CORS-Konfiguration getestet (manuell testen)
- [ ] Security Headers getestet (z.B. mit securityheaders.com) (manuell testen)

---

**Review abgeschlossen:** 2025-01-27  
**Nächste Review:** Nach Behebung der P0/P1-Probleme

