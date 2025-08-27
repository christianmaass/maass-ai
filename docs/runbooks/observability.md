# Observability Setup

## Sentry Integration (v8)

### Umgebungsvariablen

Füge folgende Variablen zu deiner `.env.local` hinzu:

```bash
# Sentry
SENTRY_DSN=your-sentry-dsn
SENTRY_ENV=development
```

**Hinweis**: v8-API aktiv; `browserTracingIntegration()` statt `BrowserTracing`; kein `next.config.sentry` mehr erforderlich.

### Vercel Setup

1. Gehe zu deinem Vercel-Projekt
2. Navigiere zu Settings → Environment Variables
3. Füge die Sentry-Variablen hinzu:
   - `SENTRY_DSN`: Dein Sentry DSN
   - `SENTRY_ENV`: `production`, `staging`, etc.

### Test der Integration

1. **Lokaler Test**: Setze `SENTRY_DSN` in `.env.local`
2. **Fehler testen**: Füge temporär `throw new Error('Test Sentry')` in eine API-Route ein
3. **Sentry Dashboard**: Überprüfe, ob der Fehler ankommt

### Konfiguration

- **Server**: `src/sentry.server.config.ts`
- **Client**: `src/sentry.client.config.ts`
- **Instrumentation**: `src/instrumentation.ts`

### Wichtige Hinweise

- Sentry lädt nur, wenn `SENTRY_DSN` gesetzt ist
- Build funktioniert auch ohne DSN
- Development-Modus sendet keine Events
- Sampling: 10% für Performance und Errors
