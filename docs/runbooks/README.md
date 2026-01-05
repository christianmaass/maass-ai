# Runbooks

Dieses Verzeichnis enthält die technischen Runbooks für das Navaa-Projekt.

## Übersicht

| Runbook                                          | Titel                                  | Status          | Letzte Aktualisierung       |
| ------------------------------------------------ | -------------------------------------- | --------------- | --------------------------- |
| [deploy.md](./deploy.md)                         | Deployment & Environment Management    | ✅ Aktualisiert | 2025-01-27 (AP-006)         |
| [performance.md](./performance.md)               | Performance & Asset-Optimierung        | ✅ Aktualisiert | 2025-01-27 (AP-003, AP-004) |
| [caching.md](./caching.md)                       | Caching-Strategien & Redis-Integration | ✅ Aktualisiert | 2025-01-27 (AP-005)         |
| [ci.md](./ci.md)                                 | CI-Guardrails                          | ✅ Aktualisiert | 2025-01-27 (AP-001)         |
| [auth-ssr.md](./auth-ssr.md)                     | Supabase Auth SSR Integration          | ✅ Aktualisiert | 2025-01-27 (AP-002)         |
| [observability.md](./observability.md)           | Sentry v8 Integration                  | ✅ Aktualisiert | 2025-01-27 (AP-001)         |
| [001_supabase_setup.md](./001_supabase_setup.md) | Supabase Setup                         | ⚠️ Überprüfen   | 2025-08-27                  |
| [000_post_scaffold.md](./000_post_scaffold.md)   | Post-Scaffold Setup                    | ⚠️ Überprüfen   | 2025-08-27                  |
| [git-workflow.md](./git-workflow.md)             | Git Workflow                           | ⚠️ Überprüfen   | 2025-08-27                  |

## Implementierte Arbeitspakete

### AP-001: Dependencies bereinigen ✅

- **Betroffene Runbooks**: `ci.md`, `observability.md`
- **Änderungen**: PostCSS-Konfiguration, Sentry v8 Setup

### AP-002: ENV-Guards implementieren ✅

- **Betroffene Runbooks**: `deploy.md`, `auth-ssr.md`
- **Änderungen**: ENV-Guards mit Zod-Validierung, `server-only` Guard

### AP-003: Assets optimieren ✅

- **Betroffene Runbooks**: `performance.md`
- **Änderungen**: Next.js Image-Optimierung, WebP/AVIF Support

### AP-004: Unused Exports bereinigen ✅

- **Betroffene Runbooks**: `performance.md`
- **Änderungen**: Code-Bereinigung, 31% Reduktion ungenutzter Exports

### AP-005: Cache-Module optimieren ✅

- **Betroffene Runbooks**: `caching.md`, `performance.md`
- **Änderungen**: Redis-Cache mit Upstash, Cache-Monitoring-API

### AP-006: Konfigurationsmodule konsolidieren ✅

- **Betroffene Runbooks**: `deploy.md`
- **Änderungen**: Einheitliche ENV-Konfiguration, Test-ENVs

## Nächste Schritte

- **AP-008**: Runbooks aktualisieren ✅ (Aktuell)
- **AP-009**: Veraltete Runbooks bereinigen (Geplant)

## Weitere Informationen

- **ADRs**: Siehe [docs/adr/](../adr/)
- **Code-Implementierung**: Siehe entsprechende `src/` Verzeichnisse
- **Performance-Metriken**: Siehe [performance.md](./performance.md)
