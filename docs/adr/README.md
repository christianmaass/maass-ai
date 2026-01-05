# Architecture Decision Records (ADRs)

Dieses Verzeichnis enthält die Architecture Decision Records für das Navaa-Projekt.

## Übersicht

| ADR                                       | Titel                       | Status   | Datum      | Letzte Aktualisierung                               |
| ----------------------------------------- | --------------------------- | -------- | ---------- | --------------------------------------------------- |
| [ADR-001](./001-architecture-overview.md) | Architektur-Übersicht Navaa | Accepted | 2025-08-27 | 2025-01-27 (AP-001 bis AP-006 + Weekly Audit Fixes) |

## Implementierte Arbeitspakete

### AP-001: Dependencies bereinigen ✅

- Ungenutzte Dependencies entfernt
- PostCSS-Konfiguration optimiert
- Build-Performance verbessert

### AP-002: ENV-Guards in Health API implementieren ✅

- `src/lib/config/env.client.ts` und `env.server.ts` mit Zod-Validierung
- `server-only` Guard für sensitive Variablen
- Einheitliche Konfiguration im gesamten Projekt

### AP-003: Assets optimieren ✅

- Next.js Image-Konfiguration mit WebP/AVIF
- Image-Komponenten mit Priority/Lazy Loading optimiert
- Performance-Dokumentation erstellt

### AP-004: Unused Exports bereinigen ✅

- 31% Reduktion der ungenutzten Exports (von 147+ auf 102)
- UI-Komponenten, Cache-Funktionen und Schemas bereinigt
- Code-Qualität signifikant verbessert

### AP-005: Cache-Module optimieren ✅

- Robuste Fehlerbehandlung mit Graceful Degradation
- Cache-Monitoring-API (`/api/cache/status`)
- Verbesserte Performance und Wartbarkeit

### AP-006: Konfigurationsmodule konsolidieren ✅

- Alle direkten `process.env` Zugriffe eliminiert
- Neue `env.test.ts` für Test-Umgebungen
- Einheitlicher `env` Index für alle Konfigurationen

## Nächste Schritte

- **AP-007**: ADRs aktualisieren ✅ (Abgeschlossen)
- **AP-008**: Runbooks aktualisieren (Geplant)

## ADR-Template

Verwende [ADR-TEMPLATE.md](./ADR-TEMPLATE.md) als Vorlage für neue ADRs.

## Weitere Informationen

- **Architektur-Dokumentation**: Siehe [docs/runbooks/](../runbooks/)
- **Code-Implementierung**: Siehe entsprechende `src/` Verzeichnisse
- **Performance-Metriken**: Siehe [docs/runbooks/performance.md](../runbooks/performance.md)
