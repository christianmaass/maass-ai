# Caching-Strategien & Redis-Integration

## Übersicht

Dieses Runbook dokumentiert die Caching-Strategien für das Navaa-Projekt, einschließlich Next.js Cache-Tags, Redis-Integration und Performance-Optimierungen.

## Cache-Architektur

### Mehrschichtiges Caching

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Next.js       │    │   Redis         │
│   Cache         │◄──►│   Cache-Tags    │◄──►│   (Upstash)     │
│   (HTTP)        │    │   (ISR/SSR)     │    │   (TTL)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Cache-Ebenen

1. **Browser Cache**: HTTP Cache-Control Headers
2. **Next.js Cache**: Cache-Tags, revalidateTag, ISR
3. **Redis Cache**: Serverseitiger Cache mit TTL

## Implementierung

### 1. Next.js Cache-Konfiguration

#### Marketing-Routen (ISR)
```typescript
// app/(marketing)/layout.tsx
export const revalidate = 3600; // 1 Stunde
```

#### App/Admin-Routen (Dynamic)
```typescript
// app/(app)/layout.tsx
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';
```

### 2. Redis-Cache (Upstash)

#### Konfiguration
```bash
# .env.local
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

#### Cache-API
```typescript
import { getCache, setCache, deleteCache } from '@/lib/cache';

// Cache setzen
await setCache('courses:all', courses, 3600);

// Cache abrufen
const cached = await getCache<Course[]>('courses:all');

// Cache löschen
await deleteCache('courses:all');
```

### 3. Cache-Strategien

#### GET-Endpoints (mit Cache)
```typescript
export async function GET(request: NextRequest) {
  const cacheKey = `courses:${category || 'all'}`;
  
  // Redis-Cache prüfen
  const cached = await getCache<Course[]>(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'Cache-Control': 'public, max-age=3600' }
    });
  }
  
  // Datenbankabfrage
  const courses = await fetchCourses();
  
  // Cache setzen
  await setCache(cacheKey, courses, 3600);
  
  return NextResponse.json(courses);
}
```

#### POST-Endpoints (Cache-Invalidierung)
```typescript
export async function POST(request: NextRequest) {
  // Daten erstellen
  const course = await createCourse();
  
  // Next.js Cache invalidieren
  revalidateTag('courses');
  revalidateTag(`courses:${course.category}`);
  
  // Redis-Cache löschen
  await deleteCache(`courses:${course.category}`);
  await deleteCache('courses:all');
  
  return NextResponse.json(course, { status: 201 });
}
```

## Cache-Optimierungen (AP-005)

### Implementierte Verbesserungen

#### 1. Robuste Fehlerbehandlung
```typescript
try {
  await setCache(cacheKey, courses, 3600);
} catch (cacheError) {
  console.warn('Failed to set cache, continuing without cache:', cacheError);
}
```

#### 2. Verbessertes Logging
```typescript
console.log(`Cache hit for key: ${key}`);
console.log(`Cache set for key: ${key} with TTL: ${ttl}s`);
console.log(`Cache expired for key: ${key}`);
```

#### 3. Cache-Monitoring
```typescript
// Cache-Status abrufen
GET /api/cache/status

// Response
{
  "ok": true,
  "cache": {
    "enabled": true,
    "baseUrl": "https://...",
    "hasToken": true
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### 4. Performance-Verbesserungen
- **Default TTL**: Konfigurierbare Standard-TTL
- **Error Recovery**: Graceful Degradation bei Cache-Fehlern
- **Statistiken**: Monitoring und Debugging-Informationen

## Best Practices

### Cache-Key-Strategien
```typescript
// Kategorisierte Keys
const cacheKey = `courses:${category || 'all'}`;
const cacheKey = `user:${userId}:preferences`;

// Versionierte Keys
const cacheKey = `courses:v2:${category}`;
```

### TTL-Strategien
```typescript
// Häufig geänderte Daten
await setCache('user:session', session, 1800); // 30 Min

// Stabile Daten
await setCache('courses:list', courses, 86400); // 24 Std

// Konfiguration
await setCache('app:config', config, 3600); // 1 Std
```

### Cache-Invalidierung
```typescript
// Nach Mutationen
revalidateTag('courses');
await deleteCache('courses:all');

// Nach Benutzeraktionen
revalidateTag(`user:${userId}`);
await deleteCache(`user:${userId}:profile`);
```

## Monitoring & Debugging

### Cache-Status prüfen
```bash
# Cache-Status
curl http://localhost:3000/api/cache/status

# Health-Check
curl http://localhost:3000/api/health
```

### Logs analysieren
```bash
# Cache-Hits/Misses
grep "Cache hit\|Cache miss" logs/

# Cache-Fehler
grep "Redis cache request failed\|Error setting cache" logs/
```

## Troubleshooting

### Häufige Probleme

#### Cache funktioniert nicht
1. **ENV-Variablen prüfen**: `UPSTASH_REDIS_REST_URL` und `UPSTASH_REDIS_REST_TOKEN`
2. **Cache-Status prüfen**: `/api/cache/status`
3. **Logs analysieren**: Console-Ausgaben prüfen

#### Cache-Performance-Probleme
1. **TTL optimieren**: Zu kurze TTLs vermeiden
2. **Cache-Keys optimieren**: Zu viele Keys vermeiden
3. **Redis-Plan prüfen**: Upstash-Limits beachten

### Fallback-Strategien
```typescript
// Graceful Degradation
const cached = await getCache(key);
if (!cached) {
  // Fallback: Direkte Datenbankabfrage
  return await fetchFromDatabase();
}
```

## Nächste Schritte

1. **Cache-Metriken**: Hit-Rate, Miss-Rate, Response-Zeiten
2. **Cache-Warming**: Proaktives Laden häufig abgerufener Daten
3. **Distributed Caching**: Multi-Instance-Cache-Synchronisation
4. **Cache-Compression**: Gzip/Deflate für große Daten
