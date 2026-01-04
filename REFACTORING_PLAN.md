# Refactoring-Plan: navaa - Radikale Vereinfachung

**Datum:** 2025-01-27  
**Ziel:** Radikale Vereinfachung - Löschen statt Verbessern  
**Philosophie:** Artefakt-orientiertes Training statt KI-generierte Antworten

---

## Executive Summary

### Was fliegt raus (Top 10)
1. **Decision OS komplett** - `/app/os/page.tsx`, `/api/decision-review`, alle Decision-OS-Module
2. **LLM-System komplett** - `src/lib/llm/*` (Wrapper, Provider, Prompts, Schemas)
3. **Decision Review API** - `/api/decision-review/route.ts` (nutzt LLM)
4. **Response Generator** - `response-generator.ts` (LLM-generierte Antworten)
5. **Response Guard** - `responseGuard.ts` (korrigiert LLM-Fehler)
6. **MAPIC Mapping** - `mapping/*` (nur für Explainability, nicht für Training)
7. **Decision Suite v1 API** - `/api/decision-suite-v1` (nutzt LLM für Parsing/Classification)
8. **Decision Review Tests** - Alle Tests, die Decision Review/LLM benötigen
9. **Decision Review Scripts** - Alle Scripts in `scripts/decisionReview*.ts`
10. **Fallback Parser/Classifier** - In beiden APIs (nicht mehr nötig bei strukturierter Eingabe)

### Was bleibt
1. **Auth-System** - Komplett (Login, Register, Guards, Middleware)
2. **Startseiten-Struktur** - Layout/Grundaufbau behalten, Inhalte anpassen
3. **Post-Login-Route** - `/app/page.tsx` (Entry Point behalten, Logik ersetzen)
4. **Decision Suite v1 Signals** - `signals.ts` (observational, deterministisch)
5. **Decision Suite v1 Copy** - `copy.ts` (Template-System, deterministisch)
6. **Triggers** - `triggers.ts` (Logik behalten, aber nur für interne Signale)
7. **Supabase** - Für Persistenz behalten
8. **Marketing-Komponenten** - `DecisionAssessment.tsx`, `InterventionSection.tsx`, `WhoThisIsForSection.tsx`

### Größte Risiken
1. **Route-Abhängigkeiten**: `/app/os` wird gelöscht, aber möglicherweise noch verlinkt
2. **API-Abhängigkeiten**: Frontend (`/app/page.tsx`) ruft `/api/decision-suite-v1` auf (muss ersetzt werden)
3. **Type-Abhängigkeiten**: Viele Types aus `@/lib/llm/schemas` werden noch importiert
4. **Test-Abhängigkeiten**: Tests nutzen alte APIs/LLM
5. **Build-Abhängigkeiten**: LLM-Imports blockieren möglicherweise Build

---

## Komponenten-Tabelle

| Pfad/Komponente | Zweck heute | Kategorie | Begründung | Risiko beim Löschen | Nacharbeit |
|-----------------|-------------|-----------|------------|---------------------|------------|
| **AUTH & ROUTING** |
| `src/app/login/page.tsx` | Login-Seite | **KEEP** | Notwendig für Auth-Flow | Hoch - Login funktioniert nicht | Keine |
| `src/app/register/page.tsx` | Registrierungs-Seite | **KEEP** | Notwendig für Auth-Flow | Hoch - Registrierung funktioniert nicht | Keine |
| `src/app/(marketing)/page.tsx` | Startseite | **KEEP** | Layout/Grundaufbau muss erhalten bleiben | Mittel - Struktur muss erhalten bleiben | Keine |
| `src/app/app/page.tsx` | Post-Login Entry Point | **REFACTOR** | Entry Point behalten, Logik ersetzen (kein LLM, keine Decision OS) | Hoch - Nutzer landet hier nach Login | Ersetze API-Call, entferne LLM-Abhängigkeiten |
| `src/app/app/os/page.tsx` | Decision OS Page | **REMOVE** | Komplett Decision OS | Niedrig - Redirect zu `/app` | Löschen |
| `src/app/app/decision-suite-v1/page.tsx` | Decision Suite v1 Page | **REMOVE** | Redirect-Seite, Code ist tot | Niedrig - Redirect bereits vorhanden | Löschen |
| `middleware.ts` | Auth-Middleware | **KEEP** | Notwendig für Route-Protection | Hoch - Routes nicht mehr geschützt | Keine |
| `src/lib/auth/guards.ts` | Auth-Guards | **KEEP** | Notwendig für API-Protection | Hoch - APIs nicht mehr geschützt | Keine |
| **API ROUTES** |
| `src/app/api/decision-review/route.ts` | Decision Review API | **REMOVE** | Nutzt LLM, Decision OS | Mittel - Frontend muss angepasst werden | Löschen |
| `src/app/api/decision-suite-v1/route.ts` | Decision Suite v1 API | **REMOVE** | Nutzt LLM für Parsing/Classification | Mittel - Frontend nutzt es | Löschen, ersetze durch `/api/artifacts` |
| `src/app/api/auth/*` | Auth APIs | **KEEP** | Notwendig für Login/Register | Hoch - Auth funktioniert nicht | Keine |
| `src/app/api/health/route.ts` | Health Check | **KEEP** | Monitoring | Niedrig - Optional | Keine |
| `src/app/api/cache/status/route.ts` | Cache Status | **ISOLATE** | Kurzfristig behalten, später löschen | Niedrig - Optional | Später löschen |
| **DECISION REVIEW (ALT - WIRD GELÖSCHT)** |
| `src/lib/decisionReview/triggers.ts` | Trigger-Logik | **ISOLATE** | Wird nur von Decision OS genutzt | Niedrig - Wird mit Decision OS gelöscht | Löschen mit Decision OS |
| `src/lib/decisionReview/response-generator.ts` | LLM Response Generator | **REMOVE** | Ersetzen durch Template-System | Niedrig - Wird nur von Decision Review genutzt | Löschen |
| `src/lib/decisionReview/responseGuard.ts` | Response Guard | **REMOVE** | Korrigiert LLM-Fehler, nicht mehr nötig | Niedrig - Wird nur von Decision Review genutzt | Löschen |
| `src/lib/decisionReview/response-schema.ts` | Response Schema | **REMOVE** | Nur für Decision OS Response | Niedrig - Wird nur von Decision Review genutzt | Löschen |
| `src/lib/decisionReview/signals.ts` | Signals (Decision Suite) | **KEEP** | Observational Basis, deterministisch | Niedrig - Wird von neuem System genutzt | Behalten, aber Types anpassen |
| `src/lib/decisionReview/mapping/*` | MAPIC Mapping | **REMOVE** | Nur für Explainability, nicht für Training | Niedrig - Wird nur von Decision Review genutzt | Löschen |
| `src/lib/decisionReview/language.ts` | Sprachdetektion | **KEEP** | Nützlich für Templates | Niedrig - Optional | Behalten |
| `src/lib/decisionReview/index.ts` | Exports | **REMOVE** | Wird mit Decision Review gelöscht | Niedrig - Nur Exports | Löschen |
| **DECISION SUITE V1** |
| `src/lib/decisionSuite/copy.ts` | Template-System | **KEEP** | Deterministische Templates, gut | Niedrig - Wird genutzt | Behalten |
| `src/lib/decisionSuite/types.ts` | Types | **KEEP** | Notwendig für API | Niedrig - Wird genutzt | Behalten, aber anpassen |
| `src/lib/decisionSuite/__tests__/*` | Decision Suite Tests | **REMOVE** | Nutzen LLM-Mocks | Niedrig - Tests | Löschen |
| `src/lib/decisionSuite/__fixtures__/*` | Test Fixtures | **REMOVE** | Nur für Tests | Niedrig - Tests | Löschen |
| **LLM SYSTEM (KOMPLETT LÖSCHEN)** |
| `src/lib/llm/prompts.ts` | LLM Prompts | **REMOVE** | Komplett LLM | Niedrig - Wird nur von APIs genutzt | Löschen |
| `src/lib/llm/schemas.ts` | Zod Schemas | **REFACTOR** | Types behalten, aber ohne LLM-Kontext | Mittel - Wird noch importiert | Types extrahieren, LLM-Schemas löschen |
| `src/lib/llm/index.ts` | LLM Wrapper | **REMOVE** | Komplett LLM | Niedrig - Wird nur von APIs genutzt | Löschen |
| `src/lib/llm/providers/openai.ts` | OpenAI Provider | **REMOVE** | Komplett LLM | Niedrig - Wird nur von APIs genutzt | Löschen |
| `src/lib/llm/types.ts` | LLM Types | **REMOVE** | Komplett LLM | Niedrig - Wird nur von APIs genutzt | Löschen |
| `src/lib/llm/utils.ts` | LLM Utils | **REMOVE** | Komplett LLM | Niedrig - Wird nur von APIs genutzt | Löschen |
| `src/lib/llm/README.md` | LLM Dokumentation | **REMOVE** | Komplett LLM | Niedrig - Dokumentation | Löschen |
| **UI KOMPONENTEN** |
| `src/components/DecisionAssessment.tsx` | Assessment-Quiz | **KEEP** | Wird auf Startseite genutzt | Niedrig - Marketing-Tool | Keine |
| `src/components/DecisionSuiteV1Result.tsx` | Result Display | **REFACTOR** | Zeigt Decision Suite Results, muss angepasst werden | Mittel - Wird genutzt | Anpassen für neue Artefakt-Struktur |
| `src/components/InterventionSection.tsx` | Marketing Section | **KEEP** | Wird auf Startseite genutzt | Niedrig - Marketing | Keine |
| `src/components/WhoThisIsForSection.tsx` | Marketing Section | **KEEP** | Wird auf Startseite genutzt | Niedrig - Marketing | Keine |
| **TESTS** |
| `tests/decision-review-*.spec.ts` | Decision Review Tests | **REMOVE** | Nicht mehr relevant | Niedrig - Tests | Löschen |
| `tests/auth-guards.spec.ts` | Auth Guards Tests | **KEEP** | Auth bleibt | Niedrig - Tests | Keine |
| `src/lib/decisionReview/responseGuard.test.ts` | Response Guard Tests | **REMOVE** | Nicht mehr relevant | Niedrig - Tests | Löschen |
| `src/lib/decisionReview/triggers.test.ts` | Trigger Tests | **REMOVE** | Wird mit Decision Review gelöscht | Niedrig - Tests | Löschen |
| `src/lib/decisionReview/mapping/evaluator.test.ts` | Mapping Tests | **REMOVE** | Wird mit Mapping gelöscht | Niedrig - Tests | Löschen |
| **SCRIPTS** |
| `scripts/decisionReview*.ts` | Decision Review Scripts | **REMOVE** | Nur für Tests der alten Logik | Niedrig - Scripts | Löschen |
| `scripts/decisionTestCases.ts` | Test Cases | **REMOVE** | Nicht mehr relevant | Niedrig - Scripts | Löschen |
| `scripts/legacy/*` | Legacy Scripts | **REMOVE** | Bereits Legacy | Niedrig - Scripts | Löschen |
| `scripts/optimize-images.sh` | Image Optimization | **KEEP** | Nützlich | Niedrig - Scripts | Keine |

---

## Löschplan in 3 Wellen

### Wave 1: 100% sicher zu löschen (keine Abhängigkeiten auf Start/Login/Post-Login)

**Dateien:**
- `src/app/app/os/page.tsx` (Decision OS Page)
- `src/app/app/decision-suite-v1/page.tsx` (Redirect-Seite)
- `tests/decision-review-*.spec.ts` (3 Dateien)
- `src/lib/decisionReview/responseGuard.test.ts`
- `src/lib/decisionReview/triggers.test.ts`
- `src/lib/decisionReview/mapping/evaluator.test.ts`
- `scripts/decisionReview*.ts` (alle Decision Review Scripts)
- `scripts/decisionTestCases.ts`
- `scripts/legacy/*` (alle Legacy Scripts)
- `src/lib/llm/README.md` (Dokumentation)

**Verifikation:**
```bash
# Prüfe, ob Dateien noch importiert werden
grep -r "app/os" src/ --exclude-dir=node_modules
grep -r "decision-suite-v1/page" src/ --exclude-dir=node_modules
grep -r "decision-review" src/ --exclude-dir=node_modules | grep -v "decisionReview"
grep -r "responseGuard.test" src/ --exclude-dir=node_modules
grep -r "triggers.test" src/ --exclude-dir=node_modules
```

**Risiko:** Niedrig - Keine Abhängigkeiten auf kritische Routes

---

### Wave 2: Löschen nach minimaler Entkopplung

#### 2.1: Decision Review API entfernen

**Entkopplung:**
1. Frontend (`src/app/app/os/page.tsx`) nutzt Decision Review API → **Wird in Wave 1 gelöscht**
2. Tests nutzen Decision Review API → **Wird in Wave 1 gelöscht**
3. Scripts nutzen Decision Review API → **Wird in Wave 1 gelöscht**

**Dateien:**
- `src/app/api/decision-review/route.ts`

**Verifikation:**
```bash
# Prüfe, ob API noch aufgerufen wird
grep -r "/api/decision-review" src/ --exclude-dir=node_modules
grep -r "decision-review/route" src/ --exclude-dir=node_modules
```

**Risiko:** Niedrig - Frontend wird in Wave 1 gelöscht

#### 2.2: Response Generator, Response Guard, Response Schema entfernen

**Entkopplung:**
1. Response Generator wird nur von Decision Review API genutzt → **Wird in 2.1 gelöscht**
2. Response Guard wird nur von Decision Review API genutzt → **Wird in 2.1 gelöscht**
3. Response Schema wird nur von Decision Review API genutzt → **Wird in 2.1 gelöscht**

**Dateien:**
- `src/lib/decisionReview/response-generator.ts`
- `src/lib/decisionReview/responseGuard.ts`
- `src/lib/decisionReview/response-schema.ts`

**Verifikation:**
```bash
# Prüfe, ob noch importiert wird
grep -r "response-generator" src/ --exclude-dir=node_modules
grep -r "responseGuard" src/ --exclude-dir=node_modules
grep -r "response-schema" src/ --exclude-dir=node_modules
grep -r "generateStructuredResponse" src/ --exclude-dir=node_modules
grep -r "applyResponseGuard" src/ --exclude-dir=node_modules
```

**Risiko:** Niedrig - Nur von Decision Review genutzt

#### 2.3: MAPIC Mapping entfernen

**Entkopplung:**
1. MAPIC wird nur von Decision Review API genutzt → **Wird in 2.1 gelöscht**

**Dateien:**
- `src/lib/decisionReview/mapping/*` (alle Mapping-Dateien)

**Verifikation:**
```bash
# Prüfe, ob noch importiert wird
grep -r "mapping/evaluator" src/ --exclude-dir=node_modules
grep -r "mapping/explainability" src/ --exclude-dir=node_modules
grep -r "mapping/mapping" src/ --exclude-dir=node_modules
grep -r "explainability" src/ --exclude-dir=node_modules
```

**Risiko:** Niedrig - Nur für Explainability, nicht für Training

#### 2.4: Decision Review Index und Triggers entfernen

**Entkopplung:**
1. Decision Review Index wird nur von Decision Review API genutzt → **Wird in 2.1 gelöscht**
2. Triggers werden nur von Decision Review API genutzt → **Wird in 2.1 gelöscht**

**Dateien:**
- `src/lib/decisionReview/index.ts`
- `src/lib/decisionReview/triggers.ts`

**Verifikation:**
```bash
# Prüfe, ob noch importiert wird
grep -r "from '@/lib/decisionReview'" src/ --exclude-dir=node_modules
grep -r "evaluateTriggers" src/ --exclude-dir=node_modules
grep -r "determineJudgment" src/ --exclude-dir=node_modules
grep -r "determineResponse" src/ --exclude-dir=node_modules
```

**Risiko:** Niedrig - Nur von Decision Review genutzt

#### 2.5: Decision Suite v1 API entfernen

**Entkopplung:**
1. Frontend (`src/app/app/page.tsx`) nutzt Decision Suite v1 API → **Muss ersetzt werden durch neue Artefakt-API**
2. Tests nutzen Decision Suite v1 API → **Wird in Wave 1 gelöscht**

**Aktion vor Löschung:**
- Erstelle neue `/api/artifacts` Route (ohne LLM)
- Passe Frontend (`src/app/app/page.tsx`) an, um neue API zu nutzen

**Dateien:**
- `src/app/api/decision-suite-v1/route.ts`

**Verifikation:**
```bash
# Prüfe, ob API noch aufgerufen wird
grep -r "/api/decision-suite-v1" src/ --exclude-dir=node_modules
grep -r "decision-suite-v1/route" src/ --exclude-dir=node_modules
```

**Risiko:** Mittel - Frontend muss angepasst werden

#### 2.6: LLM-System komplett entfernen

**Entkopplung:**
1. LLM wird nur von Decision Review API genutzt → **Wird in 2.1 gelöscht**
2. LLM wird nur von Decision Suite v1 API genutzt → **Wird in 2.5 gelöscht**
3. Types aus `@/lib/llm/schemas` werden noch importiert → **Müssen extrahiert werden**

**Aktion vor Löschung:**
- Extrahiere Types (`Decision`, `ClassifierFlags`) aus `@/lib/llm/schemas` nach `@/lib/schemas` oder `@/types/decision.ts`
- Passe alle Imports an

**Dateien:**
- `src/lib/llm/*` (komplettes Verzeichnis)

**Verifikation:**
```bash
# Prüfe, ob noch importiert wird
grep -r "from '@/lib/llm'" src/ --exclude-dir=node_modules
grep -r "import.*llm" src/ --exclude-dir=node_modules
grep -r "runLLM" src/ --exclude-dir=node_modules
grep -r "LLMValidationError" src/ --exclude-dir=node_modules
grep -r "LLMRequestError" src/ --exclude-dir=node_modules
```

**Risiko:** Mittel - Types müssen extrahiert werden

#### 2.7: Decision Suite Tests entfernen

**Entkopplung:**
1. Tests nutzen LLM-Mocks → **Wird in 2.6 gelöscht**

**Dateien:**
- `src/lib/decisionSuite/__tests__/*`
- `src/lib/decisionSuite/__fixtures__/*`

**Verifikation:**
```bash
# Prüfe, ob noch importiert wird
grep -r "decisionSuite/__tests__" src/ --exclude-dir=node_modules
grep -r "decisionSuite/__fixtures__" src/ --exclude-dir=node_modules
```

**Risiko:** Niedrig - Nur Tests

---

### Wave 3: Später löschen (Migration/Altpfade)

#### 3.1: Cache API isolieren

**Aktion:** Nicht löschen, sondern isolieren
- Aktuell: Optional, nicht kritisch
- Neu: Später löschen, wenn nicht mehr benötigt

**Dateien:**
- `src/app/api/cache/status/route.ts`

**Risiko:** Niedrig - Optional

---

## Minimal-Architektur (neu, deterministisch)

### Routes/API

**Bleiben:**
- `/` - Startseite (Marketing)
- `/login` - Login
- `/register` - Registrierung
- `/app` - Post-Login Entry Point (neue Artefakt-Eingabe)
- `/api/auth/*` - Auth APIs
- `/api/health` - Health Check

**Neu:**
- `/api/artifacts` - Speichern/Laden von Artefakten (POST/GET)
  - POST: Artefakte speichern (Objective, Problem Statement, Options, Assumptions, Hypotheses, Trade-offs)
  - GET: Artefakte laden (optional, für History)

**Entfernen:**
- `/app/os` - Decision OS Page
- `/app/decision-suite-v1` - Redirect-Seite
- `/api/decision-review` - Decision Review API
- `/api/decision-suite-v1` - Decision Suite v1 API

### Data Model

**Tabellen (Supabase):**
```sql
-- Artefakte (neue Struktur)
artifacts (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES auth.users(id),
  objective: text,
  problem_statement: text,
  options: jsonb, -- Array von {id, text, trade_offs}
  assumptions: jsonb, -- Array von {id, text, evidence}
  hypotheses: jsonb, -- Array von {id, text, test}
  created_at: timestamp DEFAULT now(),
  updated_at: timestamp DEFAULT now()
)

-- Ergebnisse (deterministisches Feedback)
artifact_results (
  id: uuid PRIMARY KEY,
  artifact_id: uuid REFERENCES artifacts(id),
  signals: jsonb, -- Decision Suite v1 Signals (deterministisch)
  hint_intensity: float,
  hint_band: text,
  patterns_detected: text[],
  feedback: jsonb, -- Template-basiertes Feedback (aus copy.ts)
  created_at: timestamp DEFAULT now()
)
```

**Entfernen:**
- `decision_reviews` - Alte Tabelle (kann migriert werden, aber nicht notwendig)

### UI: Komponenten/Pages

**Bleiben:**
- `src/app/(marketing)/page.tsx` - Startseite (Layout behalten, Inhalte anpassen)
- `src/app/login/page.tsx` - Login
- `src/app/register/page.tsx` - Registrierung
- `src/app/app/page.tsx` - **NEU: Artefakt-Eingabe** (ersetzt alte Textarea)
- `src/components/DecisionAssessment.tsx` - Marketing-Quiz
- `src/components/DecisionSuiteV1Result.tsx` - Result Display (anpassen für neue Struktur)
- `src/components/InterventionSection.tsx` - Marketing
- `src/components/WhoThisIsForSection.tsx` - Marketing

**Neu:**
- `src/components/ArtifactForm.tsx` - Strukturierte Artefakt-Eingabe
  - Objective (mit Constraints)
  - Problem Statement
  - Options (mit Trade-offs)
  - Assumptions (mit Evidence)
  - Hypotheses (mit Test-Möglichkeiten)

**Entfernen:**
- `src/app/app/os/page.tsx` - Decision OS Page
- `src/app/app/decision-suite-v1/page.tsx` - Redirect-Seite

### Logik-Flow (neu)

```
1. Nutzer gibt strukturierte Artefakte ein (UI)
   ↓
2. Validierung (Schema/Constraints, deterministisch, Zod)
   ↓
3. Signals beobachten (Decision Suite v1 signals.ts, deterministisch)
   ↓
4. Template-basiertes Feedback generieren (Copy-System, deterministisch)
   ↓
5. Speichern in Supabase (Artefakte + Ergebnisse)
   ↓
6. Anzeigen (Result Display)
```

**Entfernen:**
- LLM Parser (freier Text → strukturiert)
- LLM Classifier (Flags generieren)
- LLM Response Generator (Antworten generieren)
- Response Guard (Korrektur von LLM-Fehlern)
- Fallback Parser/Classifier (nicht mehr nötig bei strukturierter Eingabe)

---

## Konkrete Git-Tasks (max 12)

### Task 1: Wave 1 - Tote Dateien löschen
**Aktion:** Löschen von Redirect-Seiten, Tests, Scripts
- `src/app/app/os/page.tsx`
- `src/app/app/decision-suite-v1/page.tsx`
- `tests/decision-review-*.spec.ts`
- `src/lib/decisionReview/responseGuard.test.ts`
- `src/lib/decisionReview/triggers.test.ts`
- `src/lib/decisionReview/mapping/evaluator.test.ts`
- `scripts/decisionReview*.ts`
- `scripts/decisionTestCases.ts`
- `scripts/legacy/*`
- `src/lib/llm/README.md`

**Verifikation:** 
```bash
npm run build
npm run typecheck
grep -r "app/os" src/ --exclude-dir=node_modules
grep -r "decision-suite-v1/page" src/ --exclude-dir=node_modules
```

---

### Task 2: Decision Review API entfernen
**Aktion:** Löschen der Decision Review API Route
- `src/app/api/decision-review/route.ts`

**Verifikation:** 
```bash
grep -r "/api/decision-review" src/ --exclude-dir=node_modules
grep -r "decision-review/route" src/ --exclude-dir=node_modules
npm run build
npm run typecheck
```

---

### Task 3: Response Generator, Guard, Schema entfernen
**Aktion:** Löschen des Response Generators, Guards, Schemas
- `src/lib/decisionReview/response-generator.ts`
- `src/lib/decisionReview/responseGuard.ts`
- `src/lib/decisionReview/response-schema.ts`

**Verifikation:**
```bash
grep -r "response-generator" src/ --exclude-dir=node_modules
grep -r "responseGuard" src/ --exclude-dir=node_modules
grep -r "response-schema" src/ --exclude-dir=node_modules
npm run build
npm run typecheck
```

---

### Task 4: MAPIC Mapping entfernen
**Aktion:** Mapping-Dateien löschen
- `src/lib/decisionReview/mapping/*` (komplettes Verzeichnis)

**Verifikation:**
```bash
grep -r "mapping/evaluator" src/ --exclude-dir=node_modules
grep -r "mapping/explainability" src/ --exclude-dir=node_modules
grep -r "mapping/mapping" src/ --exclude-dir=node_modules
npm run build
npm run typecheck
```

---

### Task 5: Decision Review Index und Triggers entfernen
**Aktion:** Decision Review Index und Triggers löschen
- `src/lib/decisionReview/index.ts`
- `src/lib/decisionReview/triggers.ts`

**Verifikation:**
```bash
grep -r "from '@/lib/decisionReview'" src/ --exclude-dir=node_modules
grep -r "evaluateTriggers" src/ --exclude-dir=node_modules
grep -r "determineJudgment" src/ --exclude-dir=node_modules
npm run build
npm run typecheck
```

---

### Task 6: Types extrahieren (vor LLM-Löschung)
**Aktion:** Types aus LLM-Schemas extrahieren
- Erstelle `src/types/decision.ts` mit `Decision`, `ClassifierFlags` Types
- Passe alle Imports an (außer in LLM-Modulen)

**Verifikation:**
```bash
grep -r "from '@/lib/llm/schemas'" src/ --exclude-dir=node_modules
npm run typecheck
```

---

### Task 7: LLM-System komplett entfernen
**Aktion:** Komplettes LLM-Verzeichnis löschen
- `src/lib/llm/*` (komplettes Verzeichnis)

**Verifikation:**
```bash
grep -r "from '@/lib/llm'" src/ --exclude-dir=node_modules
grep -r "runLLM" src/ --exclude-dir=node_modules
grep -r "LLMValidationError" src/ --exclude-dir=node_modules
npm run build
npm run typecheck
```

---

### Task 8: Decision Suite v1 API entfernen
**Aktion:** Decision Suite v1 API löschen
- `src/app/api/decision-suite-v1/route.ts`

**Verifikation:**
```bash
grep -r "/api/decision-suite-v1" src/ --exclude-dir=node_modules
grep -r "decision-suite-v1/route" src/ --exclude-dir=node_modules
npm run build
npm run typecheck
```

---

### Task 9: Decision Suite Tests entfernen
**Aktion:** Decision Suite Tests löschen
- `src/lib/decisionSuite/__tests__/*`
- `src/lib/decisionSuite/__fixtures__/*`

**Verifikation:**
```bash
grep -r "decisionSuite/__tests__" src/ --exclude-dir=node_modules
grep -r "decisionSuite/__fixtures__" src/ --exclude-dir=node_modules
npm run build
npm run typecheck
```

---

### Task 10: Neue Artefakt-API erstellen
**Aktion:** Neue API Route für Artefakte erstellen
- `src/app/api/artifacts/route.ts` (POST/GET)
- Validierung (Schema/Constraints, deterministisch)
- Signals beobachten (Decision Suite v1 signals.ts)
- Template-basiertes Feedback (Copy-System)

**Verifikation:**
```bash
npm run build
npm run typecheck
# Manuell: API-Test mit curl oder Postman
```

---

### Task 11: Neue Artefakt-Form erstellen
**Aktion:** Neue UI-Komponente für strukturierte Eingabe
- `src/components/ArtifactForm.tsx` erstellen
- Objective, Problem Statement, Options, Assumptions, Hypotheses, Trade-offs

**Verifikation:**
```bash
npm run build
npm run typecheck
# Manuell: Komponente rendert
```

---

### Task 12: App Page umbauen
**Aktion:** `src/app/app/page.tsx` umbauen
- Alte Textarea entfernen
- Neue Artefakt-Form einbauen
- Result Display anpassen (nutzt neue API)

**Verifikation:**
```bash
npm run build
npm run typecheck
# Manuell: Page funktioniert, Post-Login-Route lädt
```

---

## Definition of Done „Saubere Absprungbasis“

### Prüfliste (6-10 Punkte)

- [ ] **Build erfolgreich**: `npm run build` läuft ohne Fehler
- [ ] **Typecheck erfolgreich**: `npm run typecheck` läuft ohne Fehler
- [ ] **Keine LLM-Imports**: `grep -r "from '@/lib/llm'" src/` findet keine Treffer
- [ ] **Keine Decision-OS-Referenzen**: `grep -r "decision-review\|DecisionOS\|decision-os" src/` findet keine Treffer (außer in Kommentaren/Docs)
- [ ] **Startseite rendert**: Marketing-Seite lädt und zeigt korrektes Layout
- [ ] **Login/Register funktionieren**: Auth-Flow funktioniert end-to-end
- [ ] **Post-Login-Route lädt**: `/app` lädt nach Login (auch wenn noch keine Funktionalität)
- [ ] **Artefakt-Session speichern**: Eine Artefakt-Session kann gespeichert werden (minimal)
- [ ] **Artefakt-Session anzeigen**: Eine gespeicherte Artefakt-Session kann angezeigt werden (minimal)
- [ ] **Keine toten Imports**: Alle Imports sind aufgelöst, keine ungenutzten Dateien

### Exit-Kriterium

Die Refactoring-Basis gilt als erreicht, wenn:
- ✅ Build erfolgreich ohne LLM-Codepfade
- ✅ Startseite rendert (Struktur erhalten)
- ✅ Login/Register funktionieren
- ✅ Post-Login-Route lädt
- ✅ Eine Artefakt-Session kann gespeichert + angezeigt werden (minimal)
- ✅ Keine LLM/Decision-OS-Reste im Code

---

## Risiko-Matrix

| Task | Risiko | Abhängigkeiten | Verifikation |
|------|--------|----------------|--------------|
| Task 1 | Niedrig | Keine | Build erfolgreich |
| Task 2 | Niedrig | Frontend (aber bereits entkoppelt) | Keine Imports mehr |
| Task 3 | Niedrig | Nur Decision Review | Keine Imports mehr |
| Task 4 | Niedrig | Nur Decision Review | Keine Imports mehr |
| Task 5 | Niedrig | Nur Decision Review | Keine Imports mehr |
| Task 6 | Mittel | Alle Dateien, die LLM-Schemas importieren | Typecheck erfolgreich |
| Task 7 | Mittel | Task 6 muss abgeschlossen sein | Build erfolgreich |
| Task 8 | Mittel | Frontend nutzt API | Frontend muss angepasst werden |
| Task 9 | Niedrig | Nur Tests | Build erfolgreich |
| Task 10 | Mittel | Neue Architektur | API-Tests |
| Task 11 | Niedrig | Keine | Komponente rendert |
| Task 12 | Mittel | Task 10 + 11 müssen abgeschlossen sein | Page funktioniert |

---

## Nächste Schritte

1. **Sofort:** Wave 1 ausführen (Task 1) - 100% sicher
2. **Kurzfristig:** Wave 2 ausführen (Tasks 2-9) - Nach Verifikation
3. **Mittelfristig:** Neue Architektur (Tasks 10-12) - Schrittweise

**Priorität:** Löschen vor Bauen - Erst alles entfernen, was nicht mehr gebraucht wird, dann neue Struktur aufbauen.
