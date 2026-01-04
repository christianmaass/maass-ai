# Auth SSR Integration

## Umgebungsvariablen

```bash
# Supabase (Client + Server)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Wichtig: KEIN SUPABASE_SERVICE_ROLE_KEY im Client
```

## Cookies & Session-Management

- **Server-seitig**: `src/lib/db/createServerClient.ts` mit `next/headers cookies()`
- **Middleware**: Session-Validierung über `sb-access-token` Cookie
- **Standard-Cookies**: `sb-access-token` & `sb-refresh-token` (Supabase Default)
- **Automatisch**: Cookie-Refresh und Session-Synchronisation

## SSR-Client

```typescript
import { createServerClient } from '@/lib/db/createServerClient';

// In Server Components oder API Routes
const supabase = await createServerClient();
const {
  data: { user },
} = await supabase.auth.getUser();
```

## Redirect-Flow

1. **Ungeschützte Routen**: `/`, `/login`, `/register`, `/api/*` - Keine Auth-Pflicht
2. **Geschützte Routen**: `/app/*`, `/admin/*` - Auth erforderlich
3. **Redirect**: Kein `sb-access-token` Cookie → `/login`
4. **Keine Schleife**: Bereits auf `/login` → `next()`

## Middleware-Konfiguration

```typescript
export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};
```

## Cookie-basierte Authentifizierung

- **Prüfung**: Middleware prüft `sb-access-token` Cookie
- **Performance**: Keine Supabase-API-Calls im Middleware
- **Sicherheit**: Cookie-Validierung vor Route-Zugriff
- **Ausnahmen**: `/login`, `/register`, `/api/*` werden nicht blockiert

## RLS (Row Level Security) Hinweise

- **Supabase Policies**: Immer aktiviert für User-Tabellen
- **User-ID**: Über `auth.uid()` in Policies abfragen
- **Beispiel**:
  ```sql
  CREATE POLICY "Users can only access their own data" ON profiles
  FOR ALL USING (auth.uid() = user_id);
  ```

## Sicherheits-Checkliste

- ✅ Keine Admin-Keys im Client
- ✅ Sessions nur über Cookies (`sb-access-token`)
- ✅ Middleware schützt private Routen (`/app/*`, `/admin/*`)
- ✅ Cookie-Validierung ohne API-Calls
- ✅ RLS aktiviert für alle User-Daten
- ✅ Keine Secrets im Bundle
