# refactor_step_02_move_marketing_to_src.windsurf.md

**Ziel**

- Marketing‑Implementierung vom Repo‑Root `marketing/` nach `src/(marketing)/` verschieben.
- `pages/` bleibt als **einziger** Pages‑Router‑Entry und re‑exportiert Marketing‑Seiten via Wrapper.
- Aliases/ESLint/Madge/Husky so setzen, dass künftige relative Aufwärts‑Imports verhindert werden und Orphan‑Noise klein bleibt.
- Nach jedem Schritt: **typecheck/lint/build** grün.

---

## 0) Voraussetzungen / Safety

- Branch: `git switch -c chore/refactor-marketing-to-src`
- Tools: `npm i` (alle Scripts vorhanden)
- Diese Datei Schritt für Schritt ausführen (keine Big‑Bang‑Moves).

---

## 1) Struktur anlegen & Dateien verschieben

**Shell (idempotent)**

```bash
set -euo pipefail

# 1.1 Zielstruktur sicherstellen
mkdir -p src/'(marketing)'/pages
mkdir -p src/'(marketing)'/components
mkdir -p src/'(marketing)'/sections
mkdir -p src/'(marketing)'/assets
mkdir -p src/'(marketing)'/copy

# 1.2 Falls altes Root-marketing existiert: verschieben (bewahrt Struktur)
if [ -d "marketing" ]; then
  rsync -a --remove-source-files marketing/ src/'(marketing)'/
  # Leere Ordner entfernen
  find marketing -type d -empty -delete || true
fi

# 1.3 README-Stubs (optional) für Orientierung
[ -f src/'(marketing)'/README.md ] || cat > src/'(marketing)'/README.md <<'MD'
# (marketing)
Implementierung der öffentlichen Marketingseite (Komponenten, Sektionen, Copy, Assets).
Routing bleibt im Root `pages/` (Pages Router), via Wrapper-Reexports.
MD
```

**Check:**
`npm run typecheck && npm run build`

**Commit:**

```bash
git add -A
git commit -m "chore(marketing): move implementation to src/(marketing)/*; keep pages router at root"
```

---

## 2) Pages‑Wrapper sicherstellen (Routing bleibt im Root)

> Wir behalten die Routen in **`pages/`** und re‑exportieren die Implementierung aus `@marketing/*`.

**Beispiele (nur anlegen/überschreiben, wenn sinnvoll):**

```bash
# Impressum
cat > pages/impressum.tsx <<'TSX'
export { default } from '@marketing/pages/ImpressumPage';
TSX

# Preise
cat > pages/preise.tsx <<'TSX'
export { default } from '@marketing/pages/PreisePage';
TSX

# Startseite (falls Marketing-Home gewünscht)
cat > pages/index.tsx <<'TSX'
export { default } from '@marketing/pages/HomePage';
TSX
```

> **Hinweis:** Die tatsächlichen Implementierungen gehören nach `src/(marketing)/pages/ImpressumPage.tsx`, `PreisePage.tsx`, `HomePage.tsx` usw. – wenn sie noch unter `src/(marketing)/components` liegen, bitte in `pages/` umbenennen/verschieben oder in der Wrapper‑Datei den korrekten Pfad importieren.

**Check:**
`npm run typecheck && npm run build`

**Commit:**

```bash
git add -A
git commit -m "feat(pages): add wrapper re-exports for marketing routes (impressum, preise, home)"
```

---

## 3) TypeScript Aliases finalisieren

**`tsconfig.json` ergänzen/vereinheitlichen** (nur relevante Auszüge; Pfade anpassen):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/(app)/*"],
      "@admin/*": ["src/(admin)/*"],
      "@marketing/*": ["src/(marketing)/*"],
      "@layout/*": ["src/layout/*"],
      "@shared/*": ["src/shared/*"],
      "@lib/*": ["lib/*"],
      "@payments/*": ["payments/*"],
      "@types/*": ["types/*"]
    }
  }
}
```

**Check & Commit**

```bash
npm run typecheck && npm run build
git add tsconfig.json
git commit -m "chore(tsconfig): ensure domain aliases incl. @marketing/*"
```

---

## 4) ESLint‑Guard gegen neue relative Aufwärts‑Imports

**`.eslintrc.cjs` (oder `.eslintrc.js`) – Regeln hinzufügen:**

```js
module.exports = {
  // ...
  plugins: ['import'],
  rules: {
    'no-restricted-imports': ['error', { patterns: ['../*', '../../*', '../../../*'] }],
  },
  overrides: [
    // bei Bedarf Ausnahmen für Tests/Skripte
  ],
};
```

**Check & Commit**

```bash
npm run lint
git add .eslintrc.*
git commit -m "chore(eslint): forbid upward relative imports across domains"
```

---

## 5) Madge‑Konfiguration gegen Orphan‑Noise

**`madge.config.js` neu:**

```js
/** @type {import('madge').MadgeConfig} */
module.exports = {
  fileExtensions: ['ts', 'tsx'],
  excludeRegExp: [
    '^node_modules',
    '^dev/_trash',
    '^pages/', // Pages-Router bleibt Entry, Wrapper erzeugen sonst Noise
  ],
  detectiveOptions: { es6: { mixedImports: true } },
};
```

**Adhoc‑Lauf & Commit**

```bash
npx madge --orphans --circular --config madge.config.js .
git add madge.config.js
git commit -m "chore(madge): add config to reduce false-positive orphans"
```

---

## 6) Husky (falls noch Legacy‑Hooks)

**(Nur wenn nötig) Minimal‑Hooks setzen:**

```bash
# init, falls noch nicht
[ -d .husky ] || (npx husky-init && npm i)

# pre-commit
cat > .husky/pre-commit <<'SH'
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npm run lint && npm run typecheck
SH
chmod +x .husky/pre-commit

# commit-msg (commitlint)
cat > .husky/commit-msg <<'SH'
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
SH
chmod +x .husky/commit-msg

git add .husky
git commit -m "chore(husky): ensure pre-commit typecheck/lint and commit-msg commitlint"
```

---

## 7) Aufräumen: altes Root‑`marketing/` entfernen

Wenn Schritt 1 alles verschoben hat und Build grün bleibt, Ordner löschen (oder in Trash):

```bash
if [ -d "marketing" ]; then
  git mv marketing dev/_trash/marketing_root_backup || true
fi

npm run typecheck && npm run build
git add -A
git commit -m "chore(marketing): archive legacy root marketing dir to dev/_trash (post-move)"
```

> **Optional:** Nach 2–3 Wochen ohne Beschwerden endgültig löschen.

---

## 8) Abschluss‑Checks

```bash
npm run typecheck && npm run lint && npm run build
npx madge --orphans --circular --config madge.config.js .
```

**Erwartung:**

- Build grün.
- `pages/` enthält nur Wrapper‑Dateien (keine breite Implementierungslogik).
- Marketing‑Implementierung vollständig unter `src/(marketing)/*`.
- Keine neuen `../`‑Imports über Domain‑Grenzen.

**Commit / PR:**

```bash
git push --set-upstream origin chore/refactor-marketing-to-src
```

---

## Rollback‑Plan (kurz)

- `git reset --hard <letzter grüner Commit>` oder
- gezielt Wrapper/tsconfig‑Änderungen zurücknehmen.
- Falls Inhalte in `dev/_trash/marketing_root_backup`: jederzeit zurückkopierbar.

---

## Notizen für Windsurf

- **Bitte in Micro‑Schritten ausführen** (je Abschnitt separat), nach jedem Abschnitt `typecheck/lint/build`.
- Falls Implementierungen der Marketing‑Seiten noch nicht unter `src/(marketing)/pages/*` liegen, **nicht raten** – stattdessen den korrekten Importpfad in den Wrappern verwenden (z. B. `@marketing/components/...`) **oder** die Datei in `src/(marketing)/pages/` verschieben und als Page‑Komponente exportieren.
- `pages/` **nicht** verschieben oder duplizieren. Nur Wrapper dort belassen. verstehst du was zu tun ist?
