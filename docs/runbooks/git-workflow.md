# Git Workflow & Best Practices

## Übersicht

Dieses Runbook dokumentiert den Git-Workflow und die Best Practices für das Navaa-Projekt.

## Branch-Strategie

### Main Branch
- **`main`**: Production-ready Code, immer deploybar
- **`develop`**: Integration Branch für Features (optional)

### Feature Branches
```bash
# Feature-Branch erstellen
git checkout -b feature/AP-XXX-kurze-beschreibung

# Beispiel
git checkout -b feature/AP-001-dependencies-bereinigen
git checkout -b feature/AP-002-env-guards-implementieren
```

### Naming Convention
- **Features**: `feature/AP-XXX-kurze-beschreibung`
- **Bugs**: `bug/AP-XXX-kurze-beschreibung`
- **Hotfixes**: `hotfix/AP-XXX-kurze-beschreibung`
- **Docs**: `docs/AP-XXX-kurze-beschreibung`

## Commit-Message Format

### Conventional Commits
```bash
# Format
<type>(<scope>): <description>

# Beispiele
feat(auth): implement ENV-Guards with Zod validation
fix(cache): resolve Redis connection timeout issues
docs(adr): update architecture overview with latest implementations
refactor(ui): clean up unused exports and components
perf(images): add WebP/AVIF support and responsive sizing
```

### Commit Types
- **`feat`**: Neue Features
- **`fix`**: Bug-Fixes
- **`docs`**: Dokumentation
- **`style`**: Code-Formatierung
- **`refactor`**: Code-Refactoring
- **`perf`**: Performance-Verbesserungen
- **`test`**: Tests hinzufügen/ändern
- **`chore`**: Build-Tasks, Dependencies

## Pre-commit Workflow

### Husky Hooks
Das Projekt verwendet Husky für automatische Pre-commit-Checks:

```bash
# .husky/pre-commit
npm run format && npm run lint && npm run typecheck
```

### Manuelle Checks
```bash
# Code formatieren
npm run format

# Linting
npm run lint

# Type-Check
npm run typecheck

# Build testen
npm run build
```

## Pull Request Workflow

### 1. Feature Branch erstellen
```bash
git checkout main
git pull origin main
git checkout -b feature/AP-XXX-beschreibung
```

### 2. Änderungen committen
```bash
git add .
git commit -m "feat(scope): implement feature description"

# Oder mehrere Commits für komplexe Features
git add src/lib/config/
git commit -m "feat(config): add ENV-Guards with Zod validation"

git add src/lib/cache/
git commit -m "feat(cache): implement Redis cache with Upstash"
```

### 3. Push und PR erstellen
```bash
git push origin feature/AP-XXX-beschreibung
# GitHub PR erstellen
```

### 4. PR-Template verwenden
```markdown
## Beschreibung
Kurze Beschreibung der Änderungen

## Arbeitspaket
AP-XXX: Kurze Beschreibung

## Änderungen
- [ ] Feature implementiert
- [ ] Tests hinzugefügt
- [ ] Dokumentation aktualisiert
- [ ] Build läuft grün

## Checkliste
- [ ] Code formatiert (`npm run format`)
- [ ] Lint-Checks bestanden (`npm run lint`)
- [ ] Type-Check bestanden (`npm run typecheck`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Tests laufen (`npm run test`)

## Screenshots (falls UI-Änderungen)
```

## Code Review

### Review-Kriterien
1. **Funktionalität**: Feature funktioniert wie erwartet
2. **Code-Qualität**: Sauberer, lesbarer Code
3. **Tests**: Ausreichende Test-Abdeckung
4. **Dokumentation**: ADRs und Runbooks aktualisiert
5. **Performance**: Keine Performance-Regressionen

### Review-Prozess
1. **Automatische Checks**: CI/CD Pipeline läuft grün
2. **Code Review**: Mindestens ein Review erforderlich
3. **Approval**: Alle Review-Kommentare adressiert
4. **Merge**: Squash und Merge in main

## Release Workflow

### Versionierung
```bash
# Package.json aktualisieren
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0
```

### Release Notes
```markdown
## Version 0.1.0

### Features
- ENV-Guards mit Zod-Validierung implementiert
- Redis-Cache mit Upstash Integration
- Module-Boundaries für Courses-Domain

### Improvements
- 31% Reduktion ungenutzter Exports
- WebP/AVIF Support für Images
- Performance-Optimierungen

### Bug Fixes
- Cache-Fehlerbehandlung verbessert
- Build-Performance optimiert
```

## Best Practices

### 1. Atomic Commits
```bash
# ✅ Gut: Ein Commit pro logischer Änderung
git commit -m "feat(auth): add ENV-Guards for Supabase config"

# ❌ Schlecht: Viele Änderungen in einem Commit
git commit -m "fix: various improvements and bug fixes"
```

### 2. Meaningful Messages
```bash
# ✅ Gut: Klare, beschreibende Messages
git commit -m "feat(cache): implement Redis cache with error handling"

# ❌ Schlecht: Unklare, kurze Messages
git commit -m "fix"
```

### 3. Branch Management
```bash
# Feature-Branches nach Merge löschen
git branch -d feature/AP-XXX-beschreibung

# Lokale Branches aufräumen
git remote prune origin
git branch --merged | grep -v main | xargs git branch -d
```

### 4. Conflict Resolution
```bash
# Bei Merge-Conflicts
git status  # Konflikt-Dateien anzeigen
# Manuell Konflikte lösen
git add .
git commit -m "merge: resolve conflicts in feature branch"
```

## Troubleshooting

### Häufige Probleme

#### Pre-commit Hook schlägt fehl
```bash
# Manuell Checks ausführen
npm run format
npm run lint
npm run typecheck

# Bei Lint-Fehlern
npm run lint -- --fix
```

#### Build schlägt fehl
```bash
# Dependencies aktualisieren
npm install

# Cache löschen
rm -rf .next
npm run build
```

#### Type-Check Fehler
```bash
# TypeScript-Cache löschen
rm -rf tsconfig.tsbuildinfo
npm run typecheck
```

## Weitere Informationen

- **CI/CD**: Siehe [ci.md](./ci.md)
- **Deployment**: Siehe [deploy.md](./deploy.md)
- **Code-Qualität**: Siehe [performance.md](./performance.md)
- **ADRs**: Siehe [docs/adr/](../adr/)
