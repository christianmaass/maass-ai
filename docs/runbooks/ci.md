# CI-Guardrails

## Lokale Entwicklung

### Pre-Commit Hooks

Husky führt automatisch vor jedem Commit folgende Checks aus:

```bash
npm run format    # Code formatieren
npm run lint      # ESLint prüfen
npm run typecheck # TypeScript-Typen prüfen
```

### Manuelle Checks

```bash
# Alle Checks ausführen
npm run format && npm run lint && npm run typecheck

# Build testen
npm run build

# Tests ausführen (falls Playwright vorhanden)
npm run test
```

## CI-Pipeline (GitHub Actions)

### Trigger

- **Push** zu `main` oder `develop`
- **Pull Request** zu `main` oder `develop`

### Schritte

1. **Checkout** - Code auschecken
2. **Setup Node.js 20** - Node.js-Umgebung einrichten
3. **Install** - Dependencies installieren (`npm ci`)
4. **Lint** - ESLint-Checks ausführen
5. **Typecheck** - TypeScript-Typen prüfen
6. **Build** - Next.js-Build erstellen
7. **Test** - Playwright-Tests ausführen

## Fehler beheben

### ESLint-Fehler

```bash
# Automatisch beheben (wenn möglich)
npm run lint --fix

# Regeln in .eslintrc.json anpassen
```

### TypeScript-Fehler

```bash
# Typen prüfen
npm run typecheck

# Fehler in der IDE beheben
# Oft hilft: npm install @types/[package-name]
```

### Build-Fehler

```bash
# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install

# Build-Cache löschen
rm -rf .next
npm run build
```

### Test-Fehler

```bash
# Tests lokal ausführen
npm run test

# Playwright installieren (falls fehlend)
npm install -D @playwright/test
npx playwright install
```

## Best Practices

### Vor dem Commit

1. `npm run format` - Code formatieren
2. `npm run lint` - Linting-Checks
3. `npm run typecheck` - Typen prüfen
4. `npm run build` - Build testen

### Bei CI-Fehlern

1. **Lokal reproduzieren** - Gleiche Node.js-Version
2. **Dependencies prüfen** - `package-lock.json` aktuell?
3. **Cache löschen** - `.next`, `node_modules`
4. **Fehler analysieren** - GitHub Actions Logs studieren

### Performance

- **Lint-Cache**: ESLint-Cache in CI aktiviert
- **Build-Cache**: Next.js-Build-Cache in CI
- **Dependency-Cache**: npm-Cache in GitHub Actions

## Troubleshooting

### Husky funktioniert nicht

```bash
# Husky neu installieren
npm run prepare

# Git-Hooks prüfen
ls -la .git/hooks/
```

### CI schlägt lokal fehl

```bash
# Node.js-Version prüfen
node --version  # Sollte 20.x sein

# Dependencies prüfen
npm ls --depth=0
```

### Playwright-Probleme

```bash
# Browser installieren
npx playwright install

# Tests im UI-Modus
npx playwright test --ui
```
