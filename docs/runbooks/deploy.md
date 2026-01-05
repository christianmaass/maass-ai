# Deployment & Environment Management

## Übersicht

Dieses Runbook dokumentiert den Deployment-Prozess und die Environment-Management-Strategien für das Navaa-Projekt.

## Environment Variables

### ENV-Guards (AP-006)

Das Projekt verwendet moderne ENV-Guards mit Zod-Validierung:

#### Client Environment (`env.client.ts`)

```typescript
// NEXT_PUBLIC_* Variablen für Client-seitigen Zugriff
NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional();
NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional();
NEXT_PUBLIC_APP_VERSION: z.string().optional();
NEXT_PUBLIC_APP_URL: z.string().url().optional();
NEXT_PUBLIC_SENTRY_DSN: z.string().optional();
NEXT_PUBLIC_SENTRY_ENV: z.string().optional();
```

#### Server Environment (`env.server.ts`)

```typescript
// Server-seitige Variablen (server-only)
SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional();
SENTRY_DSN: z.string().optional();
SENTRY_ENV: z.string().default('development');
UPSTASH_REDIS_REST_URL: z.string().url().optional();
UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional();
```

#### Test Environment (`env.test.ts`)

```typescript
// Test-spezifische Variablen
CI: z.string().optional();
```

### Verwendung

```typescript
// Client-seitig
import { clientEnv } from '@/lib/config/env.client';
const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;

// Server-seitig
import { serverEnv } from '@/lib/config/env.server';
const sentryDsn = serverEnv.SENTRY_DSN;

// Alle ENVs
import { env } from '@/lib/config';
const clientConfig = env.client;
const serverConfig = env.server;
```

### Vorteile der ENV-Guards

- **Type Safety**: Vollständige TypeScript-Unterstützung
- **Validierung**: Zod-basierte Laufzeitvalidierung
- **Sicherheit**: `server-only` Guard für sensitive Variablen
- **Konsistenz**: Einheitliche Konfiguration im gesamten Projekt
- **Wartbarkeit**: Zentrale Verwaltung aller Environment-Variablen

## Deployment-Checkliste

### 1. Environment Variables setzen

#### Production

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Sentry
SENTRY_DSN=https://your-dsn@sentry.io/project
SENTRY_ENV=production

# Redis (Optional)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# App
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### Staging

```bash
SENTRY_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
```

### 2. Health Check

```bash
# Health-Status prüfen
curl https://your-domain.com/api/health

# Cache-Status prüfen (falls Redis aktiviert)
curl https://your-domain.com/api/cache/status
```

### 3. Runtime Configuration

- **Edge Runtime**: Für einfache API-Routes
- **Node.js Runtime**: Für Supabase-Mutationen und Redis-Cache
- **ISR**: Marketing-Seiten mit `revalidate: 3600`
- **Dynamic**: App/Admin-Seiten mit `force-dynamic`

### 4. Staging-Konfiguration

```typescript
// robots.txt für Staging
User-agent: *
Disallow: /

// Sentry Environment
SENTRY_ENV=staging
```

### 5. Smoke Tests

```bash
# Build testen
npm run build

# Lint prüfen
npm run lint

# Type-Check
npm run typecheck

# Tests (falls vorhanden)
npm run test
```

## Rollback-Plan

### 1. Vercel Rollback

- Dashboard → Project → Deployments
- Previous Deployment auswählen
- "Promote to Production" klicken

### 2. Environment Variables

- Alte Werte in Vercel Dashboard wiederherstellen
- Deployment neu starten

### 3. Database Rollback

- Supabase Backups prüfen
- Point-in-time Recovery (falls verfügbar)

## Monitoring & Alerts

### 1. Health Checks

- `/api/health` - Basis-Status
- `/api/cache/status` - Cache-Status
- Sentry Error Tracking

### 2. Performance Monitoring

- Vercel Analytics
- Core Web Vitals
- Cache-Hit-Rate (Redis)

### 3. Error Tracking

- Sentry für Client- und Server-Fehler
- Vercel Function Logs
- Supabase Logs

## Troubleshooting

### Häufige Probleme

#### ENV-Guards schlagen fehl

1. **Zod-Validierung prüfen**: Alle erforderlichen Variablen gesetzt?
2. **Type-Check**: `npm run typecheck` ausführen
3. **Build-Logs**: Fehlermeldungen analysieren

#### Cache funktioniert nicht

1. **Redis-ENVs prüfen**: `UPSTASH_REDIS_REST_URL` und `TOKEN`
2. **Cache-Status**: `/api/cache/status` aufrufen
3. **Logs analysieren**: Console-Ausgaben prüfen

#### Supabase-Verbindung fehl

1. **Client-ENVs prüfen**: `NEXT_PUBLIC_SUPABASE_URL` und `ANON_KEY`
2. **Service-Role-Key**: Für Admin-Operationen erforderlich
3. **CORS-Einstellungen**: Supabase-Dashboard prüfen

### Debugging-Tools

```bash
# Environment-Status prüfen
npm run build  # Zeigt ENV-Validierungsfehler

# Type-Check
npm run typecheck  # TypeScript-Fehler identifizieren

# Lint
npm run lint  # Code-Qualität prüfen
```

## Nächste Schritte

1. **ENV-Monitoring**: Automatische Validierung in CI/CD
2. **Secret Management**: Vercel Secrets für sensitive Daten
3. **Environment Templates**: Standardisierte ENV-Konfigurationen
4. **Configuration Testing**: Unit-Tests für ENV-Validierung
