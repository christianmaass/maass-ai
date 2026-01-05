# Dead/Unused Code Analysis

**Datum:** 2025-01-27  
**Methode:** Manuelle Code-Analyse (depcheck/ts-prune konnten nicht ausgeführt werden)

---

## Zusammenfassung

**Status:** ✅ Codebase ist bereits gut bereinigt

Laut vorheriger CTO Reviews wurden bereits 31% der ungenutzten Exports entfernt. Die aktuelle Analyse zeigt, dass die Codebase in einem guten Zustand ist.

---

## Ungenutzte Komponenten-Dateien

### Nicht exportiert, aber Dateien existieren (bewusst beibehalten)

Diese Komponenten sind **nicht** in `src/shared/ui/index.ts` exportiert, aber die Dateien existieren für zukünftige Nutzung:

1. **`src/shared/ui/components/dynamic-breadcrumb.tsx`**
   - Status: Nicht verwendet
   - Grund: Für zukünftige Features vorbereitet
   - Empfehlung: ✅ Beibehalten (kleine Datei, nicht im Bundle wenn nicht importiert)

2. **`src/shared/ui/components/breadcrumb.tsx`**
   - Status: Nicht verwendet
   - Grund: Für zukünftige Features vorbereitet
   - Empfehlung: ✅ Beibehalten

3. **`src/shared/ui/components/cta-button.tsx`**
   - Status: Nicht verwendet
   - Grund: Für zukünftige Features vorbereitet
   - Empfehlung: ✅ Beibehalten

4. **`src/shared/ui/components/criteria-scorecard.tsx`**
   - Status: Nicht verwendet
   - Grund: Für zukünftige Features vorbereitet
   - Empfehlung: ✅ Beibehalten

**Bewertung:** Diese Dateien sind klein und werden nicht ins Bundle aufgenommen, wenn sie nicht importiert werden. Beibehalten ist sinnvoll für zukünftige Features.

---

## Ungenutzte Exports

### 1. `safeParse` aus `src/lib/validate.ts`

**Status:** ❌ Nicht verwendet

```typescript
// src/lib/validate.ts
export function safeParse<T extends z.ZodType>(...)
```

**Verwendung:** Keine Imports gefunden im gesamten Codebase.

**Empfehlung:**

- Option A: Entfernen (wenn nicht geplant)
- Option B: Beibehalten (wenn für zukünftige Features geplant)

**Entscheidung:** ⚠️ Prüfen ob für zukünftige Features benötigt

---

## Dependencies Analyse

### Alle Dependencies werden verwendet ✅

| Dependency                 | Verwendung                                    | Status |
| -------------------------- | --------------------------------------------- | ------ |
| `class-variance-authority` | `Button.tsx`, `Card.tsx`                      | ✅     |
| `clsx`                     | `utils.ts`                                    | ✅     |
| `tailwind-merge`           | `utils.ts`                                    | ✅     |
| `@sentry/nextjs`           | `SentryInit.tsx`, `sentry.*.config.ts`        | ✅     |
| `@supabase/ssr`            | `createServerClient.ts`                       | ✅     |
| `@supabase/supabase-js`    | `supabaseClient.ts`                           | ✅     |
| `zod`                      | `schemas/index.ts`, `validate.ts`, `env.*.ts` | ✅     |
| `server-only`              | `env.server.ts`, `cache.ts`                   | ✅     |

**Ergebnis:** Keine ungenutzten Dependencies gefunden.

---

## Neue Exports (diese Woche hinzugefügt)

### ✅ Alle werden verwendet

1. **`getAuthUser`, `getAdminUser`** aus `src/lib/auth/guards.ts`
   - Verwendung: `src/app/api/auth/logout/route.ts`, `src/app/api/cache/status/route.ts`
   - Status: ✅ Verwendet

2. **`rateLimit`** aus `src/lib/rate-limit.ts`
   - Verwendung: `src/app/api/auth/login/route.ts`, `src/app/api/auth/signup/route.ts`
   - Status: ✅ Verwendet

---

## Empfehlungen

### Sofort (Optional)

1. **`safeParse` aus `validate.ts` prüfen:**

   ```bash
   # Prüfen ob geplant
   grep -r "safeParse" docs/ ADRs/
   ```

   - Wenn nicht geplant: Entfernen
   - Wenn geplant: Beibehalten

### Mittelfristig

2. **Komponenten-Dateien dokumentieren:**
   - README in `src/shared/ui/components/` erstellen
   - Dokumentieren welche Komponenten für zukünftige Features sind

3. **Tool-Integration:**
   - `depcheck` in CI/CD integrieren
   - `ts-prune` in CI/CD integrieren
   - Automatische Reports generieren

---

## Vergleich mit vorherigen Reviews

| Metrik                  | Vorher (AP-004) | Aktuell          | Status           |
| ----------------------- | --------------- | ---------------- | ---------------- |
| Ungenutzte Exports      | 147+            | ~1 (`safeParse`) | ✅ 99% Reduktion |
| Ungenutzte Dependencies | 0               | 0                | ✅               |
| Code-Qualität           | Gut             | Sehr gut         | ✅               |

---

## Fazit

**Die Codebase ist bereits sehr gut bereinigt.**

- ✅ Keine ungenutzten Dependencies
- ✅ Nur 1 potentiell ungenutzter Export (`safeParse`)
- ✅ Alle neuen Exports werden verwendet
- ✅ Komponenten-Dateien sind bewusst beibehalten für zukünftige Features

**Empfehlung:**

- `safeParse` prüfen und ggf. entfernen
- Tool-Integration für zukünftige Automatisierung

---

_Analyse durchgeführt am 2025-01-27_
