# Dokumentation (NAVA)

## Struktur
- **adr/** – Architektur-Entscheidungen (kurz, 5–10 Zeilen)
- **runbooks/** – Betriebs- & Incident-Anleitungen
- **specs/** – Produkt- & Tech-Spezifikationen
- **guides/** – How‑tos & Entwicklungsrichtlinien

## Einstieg
- Onboarding: guides/navaa-development-guidelines.md
- Testing-Policy: guides/testing-policy.md
- Architektur (Foundation/Tracks): specs/foundation-track-architecture.md

## Ordnerstruktur & Path-Aliase (Final)

Die Codebasis nutzt zentrale TS-Path-Aliase und eine modernisierte Ordnerstruktur. Alle UI-Komponenten liegen unter `src/ui/`. Sämtliche Legacy-Re-Export-Stubs unter `components/ui/*` wurden entfernt; alle Importe zeigen direkt auf `@ui/*`.

### Ordnerstruktur (Auszug)

```
.
├─ src/
│  ├─ ui/                       # UI-Atoms/Molecules/Organisms (z.B. Typography, Button, Card, Tabs, Panel, ...)
│  ├─ layout/                   # Layout-Komponenten (z.B. Header, Footer, App/Marketing-Layouts)
│  ├─ (marketing)/              # Marketing-spezifische Seiten & Komponenten
│  ├─ (admin)/                  # Admin-Bereich
│  ├─ (app)/                    # App-Routen
│  └─ shared/                   # Geteilte Hilfen/Utils/Typen
├─ components/                  # Feature-/Legacy-Komponenten (schrittweise Migration)
│  ├─ admin/
│  ├─ courses/
│  ├─ sections/
│  └─ tracks/
├─ lib/                         # Server-/Domain-Logik (Middleware, Pricing, etc.)
├─ contexts/                    # React Contexts (z.B. Auth)
├─ hooks/                       # React Hooks
├─ data/                        # Statische Daten
├─ types/                       # Projektweite Typdefinitionen
├─ docs/                        # Dokumentation
└─ pages/                       # Next.js Pages (inkl. API-Routen)
```

Wichtig: `components/ui/*` existiert nicht mehr. Re-Export-Stubs wurden entfernt, um Doppelungen zu vermeiden.

### Path-Aliase (tsconfig.json)

Relevante Aliase, wie in `tsconfig.json` definiert:

```
@components/*       -> components/*
@lib/*              -> lib/*
@contexts/*         -> contexts/*
@hooks/*            -> hooks/*
@project-types/*    -> types/*
@config/*           -> config/*
@data/*             -> data/*
@payments/*         -> payments/*
@supabaseClient     -> supabaseClient
@styles/*           -> styles/*
@layout/*           -> src/layout/*
@ui/*               -> src/ui/*
@docs/*             -> docs/*
@marketing/*        -> src/(marketing)/*
@/marketing/*       -> src/(marketing)/*
@/admin/*           -> src/(admin)/*
@/app/*             -> src/(app)/*
@/tracks/strategy/* -> src/(app)/tracks/strategy/*
@/shared/*          -> src/shared/*
@/layout/*          -> src/layout/*
@/ui/*              -> src/ui/*
@/payments/*        -> src/payments/*
@/db/*              -> db/*
```

### Import-Konventionen

- __UI-Komponenten__: immer über `@ui/*` importieren.
  Beispiel:

  ```tsx
  import { Heading, Text } from '@ui/Typography';
  import { Button } from '@ui/button';
  ```

- __Layouts__: `@layout/*` verwenden.
- __Contexts__: `@contexts/*` verwenden (z.B. `@contexts/AuthContext`).
- __Styles__: globale Styles via `@styles/globals.css` importieren (keine relativen CSS-Pfade in `pages/_app.tsx`).
- __Keine tiefen relativen Pfade__ (z.B. `../../../ui/Typography`) – stattdessen Aliase.

### Migrationsnotizen

- Alle Importe von `components/ui/*` bzw. relatives `../ui/*` → auf `@ui/*` umgestellt.
- Re-Export-Stubs unter `components/ui/*` entfernt; Projekt baut ohne "module not found"-Fehler.
- Einzelne ESLint-Restriktionswarnungen aus Altbeständen sind bekannt und werden iterativ bereinigt.

### Checks

- Lint: `eslint . --ext .ts,.tsx --max-warnings=0`
- Typecheck: `tsc --noEmit`
- Build: `next build`

### CI (GitHub Actions)

Automatisierte Qualitätssicherung bei Push/PR:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint --workspaces=false --if-present || npm run lint
      - run: npm run typecheck --workspaces=false --if-present || npm run typecheck
      - run: npm run build --workspaces=false --if-present || npm run build
```
