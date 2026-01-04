# Suite-First Migration Plan

**Datum:** 2025-01-27  
**Status:** Implementierungsplan  
**Ziel:** Vollständige Trennung Decision OS (Legacy) ↔ Decision Suite v1 (Default)

---

## I. Executive Summary

Decision Suite v1 wird zum Default-Entry-Point. `/app` zeigt Suite v1 (observational), Decision OS ist nur noch über `/app/os` erreichbar (Legacy). Marketing-Landing entfernt "One focused intervention"-Text. Navigation zeigt Suite als primäres Produkt, OS als dezenten "Legacy/Advanced"-Link. Alle UI-Texte werden sprachlich getrennt: Suite = observational (Signale, Hinweise, Bänder), OS = intervention (Interventionen, Guard, Silence). API-Routes bleiben unverändert (`/api/decision-suite-v1`, `/api/decision-review`). Dokumentation wird konsistent aktualisiert: Scope & Boundaries klar getrennt, Terminology/Mapping konsistent.

---

## II. Change List (Files + Changes)

### A) Routing & Pages

#### 1. `/src/app/app/page.tsx`
**Aktuell:** Decision OS (Intervention System)  
**Änderung:** Ersetze vollständig durch Decision Suite v1 Content  
**Warum:** `/app` wird Default-Entry für Suite v1  
**Details:**
- Kopiere Content von `/src/app/app/decision-suite-v1/page.tsx`
- Passe Headline an: "Decision Suite" (ohne "v1" im UI)
- Passe Subheadline an: observational language
- API-Call bleibt `/api/decision-suite-v1`
- Result-Komponente bleibt `DecisionSuiteV1Result`

#### 2. `/src/app/app/os/page.tsx` (NEU)
**Aktuell:** Existiert nicht  
**Änderung:** Erstelle neue Route für Decision OS  
**Warum:** OS muss als Legacy erreichbar bleiben  
**Details:**
- Kopiere aktuellen Content von `/src/app/app/page.tsx` (Decision OS)
- Passe Headline an: "Decision OS (Legacy)" oder "Decision OS"
- Passe Subheadline an: "Intervention system. One focused question or silence."
- API-Call bleibt `/api/decision-review`
- Result-Rendering bleibt unverändert (Intervention-UI)

#### 3. `/src/app/app/decision-suite-v1/page.tsx`
**Aktuell:** Existiert bereits  
**Änderung:** Optional: Redirect zu `/app` oder löschen  
**Warum:** Suite v1 ist jetzt Default unter `/app`  
**Details:**
- Option A: Redirect zu `/app` (empfohlen)
- Option B: Datei löschen (wenn keine externen Links existieren)

### B) Marketing & Landing

#### 4. `/src/app/(marketing)/page.tsx`
**Aktuell:** Zeigt "One decision at a time. One focused intervention."  
**Änderung:** Entferne "One focused intervention"  
**Warum:** Suite-first: observational, nicht intervention  
**Details:**
- Entferne oder ersetze Intervention-Text
- Neue Formulierung: observational, signal-basiert
- CTA bleibt: "Challenge your next decision" oder "Request access"

#### 5. `/src/components/InterventionSection.tsx`
**Aktuell:** Zeigt "One decision at a time. One focused intervention. Until clarity holds."  
**Änderung:** Entferne oder passe an Suite-first  
**Warum:** Suite-first: observational language  
**Details:**
- Option A: Entfernen (wenn nicht mehr benötigt)
- Option B: Umformulieren zu observational language
- Option C: Behalten, aber als "Legacy Feature" markieren

### C) Navigation & Links

#### 6. `/src/shared/ui/components/app-header.tsx`
**Aktuell:** Keine Navigation zu Suite/OS  
**Änderung:** Optional: "Legacy" Link zu `/app/os`  
**Warum:** OS muss erreichbar bleiben, aber dezent  
**Details:**
- Option A: Kein Link (nur direkter URL-Zugriff)
- Option B: Dezenten "Legacy / Advanced" Link hinzufügen
- Option C: Footer-Link (wenn Footer existiert)

#### 7. `/src/shared/ui/forms/AuthForm.tsx`
**Aktuell:** Redirect zu `/app` nach Login  
**Änderung:** Keine Änderung (bleibt `/app` → Suite v1)  
**Warum:** `/app` ist jetzt Suite v1 (korrekt)

### D) Copy & UI-Texte

#### 8. `/src/lib/decisionSuite/copy.ts`
**Aktuell:** Existiert bereits, observational language  
**Änderung:** Keine Änderung (bereits korrekt)  
**Warum:** Copy ist bereits observational

#### 9. `/src/components/DecisionSuiteV1Result.tsx`
**Aktuell:** Existiert bereits, observational language  
**Änderung:** Keine Änderung (bereits korrekt)  
**Warum:** Komponente ist bereits observational

---

## III. New Copy (Suite UI + OS UI minimal)

### A) Decision Suite v1 UI (Default: `/app`)

**Headline:**
- DE: "Decision Suite"
- EN: "Decision Suite"

**Subheadline:**
- DE: "Beobachtungssystem für Entscheidungsstrukturen. Keine Urteile, nur strukturelle Signale."
- EN: "Observational system for decision structure analysis. No judgments, only structural signals."

**Input Card Title:**
- DE: "Welche Entscheidung triffst du gerade?"
- EN: "What decision are you making right now?"

**Button:**
- DE: "Entscheidung analysieren" / "Analysiere…"
- EN: "Analyze decision" / "Analyzing…"

**Result Badge Labels:**
- Bereits in `copy.ts` definiert (NO_HINT, CLARIFICATION_NEEDED, STRUCTURALLY_UNCLEAR)
- Keine Änderung

**Focus Question Section:**
- Bereits in `copy.ts` definiert
- Keine Änderung

### B) Decision OS UI (Legacy: `/app/os`)

**Headline:**
- DE: "Decision OS"
- EN: "Decision OS"

**Subheadline:**
- DE: "Interventionssystem. Eine fokussierte Frage oder bewusstes Schweigen."
- EN: "Intervention system. One focused question or deliberate silence."

**Input Card Title:**
- DE: "Welche Entscheidung triffst du gerade?"
- EN: "What decision are you making right now?"

**Button:**
- DE: "Entscheidung prüfen" / "Prüfe…"
- EN: "Review decision" / "Reviewing…"

**Result Badge Labels:**
- NO_INTERVENTION: "NO_INTERVENTION" (grün)
- SOFT_CLARIFY: "SOFT_CLARIFY" (blau)
- HARD_CHALLENGE: "HARD_CHALLENGE" (orange)

**Intervention Text:**
- Bereits in API definiert
- Keine Änderung

**Syncing Mode:**
- Bereits in API definiert
- Keine Änderung

**Explainability:**
- Bereits in API definiert
- Keine Änderung

### C) Marketing Landing Page

**Entfernen:**
- "One decision at a time. One focused intervention. Until clarity holds."

**Ersetzen durch (optional):**
- DE: "Bessere Entscheidungen unter Unsicherheit. Strukturelle Signale statt Urteile."
- EN: "Better decisions under uncertainty. Structural signals, not judgments."

**Oder entfernen komplett:**
- Wenn InterventionSection nicht mehr benötigt wird

---

## IV. Docs Deltas (stichpunktartig pro Dokument)

### A) `/docs/DECISION_SUITE_V1.md`

**Änderungen:**
- ✅ Scope & Boundaries: Bereits korrekt ("Observational Signal System", "keine Urteile, keine Interventionen")
- ✅ Terminology / Mapping: Bereits korrekt (Pattern-IDs, Mapping-Tabelle)
- ✅ Operational Determinism: Bereits korrekt dokumentiert
- ➕ **NEU:** Abschnitt "Default Entry Point": Suite v1 ist jetzt Default unter `/app`
- ➕ **NEU:** Abschnitt "Routing": `/app` = Suite v1, `/app/os` = Decision OS (Legacy)
- ➕ **NEU:** Abschnitt "UI Language": Suite UI spricht ausschließlich observational language (keine Intervention-Felder)

### B) `/docs/DECISION_OS_PRODUCT_SPEC.md`

**Änderungen:**
- ✅ Scope & Boundaries: Bereits korrekt ("Intervention System")
- ✅ Terminology / Mapping: Bereits korrekt (TR-IDs, Mapping-Tabelle)
- ➕ **NEU:** Abschnitt "Legacy Status": Decision OS ist jetzt Legacy, nicht mehr primäres Produkt
- ➕ **NEU:** Abschnitt "Routing": OS ist nur noch über `/app/os` erreichbar (nicht Default)
- ➕ **NEU:** Abschnitt "UI Language": OS UI spricht ausschließlich intervention language (keine Suite-Felder)
- ➕ **NEU:** Abschnitt "Backward Compatibility": API `/api/decision-review` bleibt erreichbar, UI ist Legacy

### C) `/docs/TECHNICAL_REVIEW_DECISION_OS.md`

**Änderungen:**
- ✅ Scope & Boundaries: Bereits korrekt
- ✅ Terminology / Mapping: Bereits korrekt
- ➕ **NEU:** Abschnitt "Legacy Status": Decision OS ist eingefroren, keine aktive Weiterentwicklung
- ➕ **NEU:** Abschnitt "Routing": OS ist nur noch über `/app/os` erreichbar
- ➕ **NEU:** Abschnitt "Suite-First Migration": Referenz auf Suite v1 als Default

### D) `/docs/concept/decision-os-routes.md`

**Änderungen:**
- ➕ **NEU:** Status aktualisieren: "Legacy (Not Default)"
- ➕ **NEU:** Abschnitt "Suite-First": Suite v1 ist jetzt Default unter `/app`
- ➕ **NEU:** Abschnitt "OS Routing": OS ist nur noch über `/app/os` erreichbar

---

## V. Smoke Tests (Checkliste)

### Routing & Navigation

1. ✅ **Default Entry:** Nach Login zu `/app` → Zeigt Decision Suite v1 (nicht OS)
   - Headline: "Decision Suite"
   - Subheadline: observational language
   - Button: "Analyze decision"
   - API-Call: `/api/decision-suite-v1`

2. ✅ **OS Legacy Route:** Direkter Zugriff auf `/app/os` → Zeigt Decision OS
   - Headline: "Decision OS"
   - Subheadline: intervention language
   - Button: "Review decision"
   - API-Call: `/api/decision-review`

3. ✅ **Suite Route (optional):** Direkter Zugriff auf `/app/decision-suite-v1` → Redirect zu `/app` oder zeigt Suite
   - Falls Redirect: Automatische Weiterleitung zu `/app`
   - Falls keine Redirect: Zeigt Suite v1 (wie `/app`)

### UI Language Separation

4. ✅ **Suite UI - Observational:** Suite-Seite zeigt nur observational Felder
   - Badge: hint_label (NO_HINT, CLARIFICATION_NEEDED, STRUCTURALLY_UNCLEAR)
   - Result: result_line (observational)
   - Focus: focus_question (optional)
   - **KEINE** Felder: trigger_id, judgment, status, guard_applied, intervention_text

5. ✅ **OS UI - Intervention:** OS-Seite zeigt nur intervention Felder
   - Badge: response_type (NO_INTERVENTION, SOFT_CLARIFY, HARD_CHALLENGE)
   - Result: intervention_text oder "Looks solid. Proceed."
   - Syncing Mode: thinking_mode, lens_explainer, why_it_matters
   - Explainability: patterns_detected, flags
   - **KEINE** Felder: hint_band, hint_intensity, primary_pattern

### API Integration

6. ✅ **Suite API:** Suite-Seite ruft `/api/decision-suite-v1` auf
   - Request: `{ text: string }`
   - Response: `DecisionSuiteV1AggregatedResult` (signals, hint_band, patterns_detected, primary_pattern)
   - Keine 5xx-Fehler bei LLM-Fehlern (Fallbacks greifen)

7. ✅ **OS API:** OS-Seite ruft `/api/decision-review` auf
   - Request: `{ text: string }`
   - Response: `DecisionReviewResponse` (response_type, intervention_text, patterns_detected, meta)
   - Keine 5xx-Fehler bei LLM-Fehlern (Fallbacks greifen)

### Marketing Landing

8. ✅ **Landing Page:** Marketing-Landing zeigt keine "One focused intervention"-Text
   - Hero: "Better decisions under uncertainty."
   - **KEINE** Intervention-Text in Hero oder Sections
   - CTA: "Request access" oder "Challenge your next decision"

9. ✅ **InterventionSection:** InterventionSection zeigt keine "One focused intervention"-Text
   - Option A: Komponente entfernt
   - Option B: Text angepasst zu observational language
   - Option C: Als "Legacy Feature" markiert

### Navigation & Links

10. ✅ **App Header:** App-Header zeigt keine prominenten Links zu OS
   - Option A: Kein Link zu OS (nur direkter URL-Zugriff)
   - Option B: Dezenten "Legacy / Advanced" Link zu `/app/os`
   - Option C: Footer-Link (wenn Footer existiert)

11. ✅ **Login Redirect:** Nach Login → Redirect zu `/app` (Suite v1)
   - AuthForm redirectet zu `/app`
   - `/app` zeigt Suite v1 (nicht OS)

### Copy Consistency

12. ✅ **Suite Copy:** Suite-UI verwendet ausschließlich observational language
   - Headline: "Decision Suite" (nicht "Decision Suite v1")
   - Subheadline: "Observational system..." (nicht "Intervention system...")
   - Button: "Analyze decision" (nicht "Review decision")
   - Result: hint_label, result_line, focus_question (keine intervention_text)

13. ✅ **OS Copy:** OS-UI verwendet ausschließlich intervention language
   - Headline: "Decision OS" (optional: "(Legacy)")
   - Subheadline: "Intervention system..." (nicht "Observational system...")
   - Button: "Review decision" (nicht "Analyze decision")
   - Result: response_type, intervention_text, syncing_mode (keine hint_band)

### Backward Compatibility

14. ✅ **OS API:** `/api/decision-review` bleibt erreichbar
   - Request/Response-Schema unverändert
   - Keine Breaking Changes
   - OS-UI funktioniert weiterhin

15. ✅ **Suite API:** `/api/decision-suite-v1` bleibt erreichbar
   - Request/Response-Schema unverändert
   - Keine Breaking Changes
   - Suite-UI funktioniert weiterhin

---

## VI. Implementation Order

1. **Routing:** `/app/page.tsx` → Suite v1, `/app/os/page.tsx` → OS (NEU)
2. **Copy:** Suite-UI Copy anpassen (Headline, Subheadline)
3. **Marketing:** Landing Page Intervention-Text entfernen
4. **Navigation:** Optional: Legacy-Link zu OS
5. **Docs:** Dokumentation aktualisieren (Scope, Routing, Legacy Status)
6. **Smoke Tests:** Alle 15 Tests durchführen

---

**Dokument abgeschlossen.**

