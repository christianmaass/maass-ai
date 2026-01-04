# Phase 1 Smoke Tests - Decision Review

## Übersicht

Phase 1 Stabilisierung für decision-review mit 20 realistischen Testfällen.

## Voraussetzungen

- Next.js Dev-Server muss laufen
- Standard-Port: `http://localhost:3000`

## Ausführung

### Standard-Ausführung

```bash
# 1. Starte den Dev-Server (in einem Terminal)
npm run dev

# 2. Führe die Phase 1 Smoke Tests aus (in einem anderen Terminal)
npx tsx scripts/decisionReviewSmokeTest.phase1.ts
```

### Mit alternativer Base URL

```bash
DECISION_REVIEW_BASE_URL=http://localhost:3001 npx tsx scripts/decisionReviewSmokeTest.phase1.ts
```

### Ohne Debug-Header

```bash
DECISION_REVIEW_DEBUG_HEADER=0 npx tsx scripts/decisionReviewSmokeTest.phase1.ts
```

### Kombiniert

```bash
DECISION_REVIEW_BASE_URL=http://localhost:3001 DECISION_REVIEW_DEBUG_HEADER=0 npx tsx scripts/decisionReviewSmokeTest.phase1.ts
```

## Testfälle

Die Testfälle befinden sich in `scripts/decisionReviewTestCases.phase1.ts` und umfassen 20 realistische Entscheidungsszenarien mit erwarteten Triggern (TR-01, TR-02, TR-03 oder null).

## Erwartetes Ergebnis

Alle 20 Testfälle sollten erfolgreich durchlaufen (✅). Bei Fehlern werden Details zu erwarteten vs. tatsächlichen Werten sowie Debug-Metadaten ausgegeben.

## Legacy Tests

Die alten synthetischen Tests wurden nach `scripts/legacy/` verschoben und werden nicht mehr ausgeführt. Siehe `scripts/legacy/README.md` für Details.

