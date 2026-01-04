# Decision Suite v1 — Observational Signal System

**Version:** v1.0  
**Datum:** 2025-01-27  
**Status:** Production-Ready

---

## Scope & Boundaries

**Decision Suite v1 ist ein Observational Signal System:** Es produziert nur strukturelle Signale (signals, patterns_detected, hint_intensity, hint_band, primary_pattern) ohne Urteile oder Interventionen. Das System verwendet deterministische Banding- und Copy-Mapping-Logik (kein LLM Textizer in v1).

**Decision Suite v1 urteilt NICHT:** Es beurteilt keine Entscheidungsqualität, generiert keine Interventionen und stellt keine Fragen. Es beobachtet nur strukturelle Signale und produziert Hinweis-Intensitäten, die auf Klärungsbedarf hinweisen können.

**Decision Suite v1 ist NICHT Decision OS:** Es ist nicht das Decision OS Intervention System, das TR-01/TR-02/TR-03 verwendet, um Interventionen zu generieren oder NO_INTERVENTION zurückzugeben.

---

## Terminology / Mapping

**Decision Suite v1 verwendet Pattern-IDs als Beobachtungs-Labels für Signale.** Decision OS verwendet TR-IDs als autoritative Runtime-Identifikatoren für Interventionen. Das Mapping dient nur der Dokumentation/Analyse.

**Mapping-Tabelle (Decision OS Trigger → Decision Suite Pattern):**

| Decision OS Trigger | Decision Suite v1 Pattern | Hinweis |
|---------------------|--------------------------|---------|
| TR-01 | MEANS_BEFORE_ENDS | Means-before-Ends (Lösung vor Zielvalidierung) |
| TR-02 | OBJECTIVE_VAGUENESS | Nur wenn `objective_present === false`; sonst kann zu NO_INTERVENTION/Silence in Decision OS mappen |
| TR-03 | OUTCOME_AS_VALIDATION | Outcome-as-Validation (falsche Gewissheit) |

---

## 1. What it is

Decision Suite v1 ist ein beobachtendes System, das strukturelle Signale in Entscheidungen identifiziert, ohne Urteile zu fällen oder Interventionen zu generieren. Es analysiert Entscheidungen konservativ und produziert nur strukturelle Beobachtungen, die auf Klärungsbedarf hinweisen können.

Das System unterscheidet sich von Intervention-Systemen dadurch, dass es keine Fragen stellt, keine Urteile fällt (FRAGILE/NOT_FRAGILE) und keine Interventionen generiert. Es produziert nur JSON-Output mit strukturellen Signalen, Hinweis-Intensitäten und erkannten Mustern.

---

## 2. What it does (Capabilities)

- **Signal-Beobachtung**: Beobachtet strukturelle Signale für Objective, Optionen, Annahmen und Evidenz (konservativ: nur explizit vorhandene Merkmale)
- **Pattern-Erkennung**: Erkennt strukturelle Muster (MEANS_BEFORE_ENDS, OBJECTIVE_VAGUENESS, OUTCOME_AS_VALIDATION) ohne Urteile
- **Hint-Intensität**: Berechnet Hinweis-Intensität (0.0 - 1.0) basierend auf erkannten Mustern
- **Hint-Band**: Leitet deterministisch ein Hint-Band ab (NO_HINT, CLARIFICATION_NEEDED, STRUCTURALLY_UNCLEAR)
- **Primary Pattern**: Leitet deterministisch eine primäre Pattern aus patterns_detected ab (Priorität: OUTCOME_AS_VALIDATION > MEANS_BEFORE_ENDS > OBJECTIVE_VAGUENESS)
- **Deterministische Logik**: Alle Berechnungen sind deterministisch, keine probabilistischen Komponenten
- **Konservative Strategie**: Bei Zweifeln immer false, keine Annahmen über unbekannte Eigenschaften

---

## 3. What it does NOT do

- **Keine Urteile**: Produziert keine FRAGILE/NOT_FRAGILE Urteile
- **Keine Interventionen**: Generiert keine Fragen, keine Interventionstexte, keine Response-Types
- **Keine LLM-Textgenerierung**: Verwendet keine LLM-basierte Textgenerierung (kein Textizer in v1)
- **Keine Response-Mapping**: Kein Response-Mapping, keine Response-Generierung, kein Response-Guard
- **Keine TR-Trigger**: Verwendet keine TR-01/TR-02/TR-03 Trigger-Logik (das ist Decision OS)

---

## 4. How it works (High-level architecture)

### 4.1 Operational Determinism

**LLMs sind nicht mathematisch deterministisch**, auch nicht bei Temperature 0 (Model-Updates, API-Variabilität). **Das System ist operationally deterministic:** Gleiche Eingabe → gleiche Pipeline → gleiches Produktergebnis. Die Operational Determinism wird durch Regel-Engines, deterministische Fallbacks und Schema-Enforcement erzwungen. Nutzer erleben stabiles Verhalten, auch wenn LLM-Interna variieren.

Das System arbeitet operationally deterministisch: Für jede Entscheidung wird derselbe Prozess durchlaufen, der immer zum gleichen Produktergebnis führt.

**Schritt 1: Input-Parsing**
Der Nutzer gibt seine Entscheidung ein (als Text oder strukturiert). Das System extrahiert automatisch: Was ist das Ziel? Welche Optionen gibt es? Welche Annahmen werden gemacht? Bei LLM-Parser-Fehlern greift ein deterministischer Fallback-Parser.

**Schritt 2: Flag-Klassifikation**
Das System analysiert die Entscheidung anhand von acht binären Flags (konservativ: nur explizit vorhandene Merkmale). Bei Classifier-Fehlern greift ein deterministischer Fallback-Klassifizierer mit konservativen Defaults ("unknown ⇒ false").

**Schritt 3: Signal-Beobachtung**
Das System beobachtet strukturelle Signale für Objective, Optionen, Annahmen und Evidenz (konservativ: nur explizit vorhandene Merkmale).

**Schritt 4: Pattern-Erkennung**
Das System erkennt strukturelle Muster (MEANS_BEFORE_ENDS, OBJECTIVE_VAGUENESS, OUTCOME_AS_VALIDATION) ohne Urteile.

**Schritt 5: Hint-Intensität**
Das System berechnet Hinweis-Intensität (0.0 - 1.0) basierend auf erkannten Mustern und strukturellen Signalen.

**Schritt 6: Hint-Band**
Das System leitet deterministisch ein Hint-Band ab (NO_HINT, CLARIFICATION_NEEDED, STRUCTURALLY_UNCLEAR) aus hint_intensity.

**Schritt 7: Primary Pattern**
Das System leitet deterministisch eine primäre Pattern aus patterns_detected ab (Priorität: OUTCOME_AS_VALIDATION > MEANS_BEFORE_ENDS > OBJECTIVE_VAGUENESS).

**Schritt 8: Response-Zusammenstellung**
Die API gibt zurück:
- `signals`: Strukturelle Signale (nur beobachtet, nicht beurteilt)
- `hint_intensity`: Hinweis-Intensität (0.0 - 1.0)
- `hint_band`: Hint-Band (NO_HINT, CLARIFICATION_NEEDED, STRUCTURALLY_UNCLEAR)
- `patterns_detected`: Alle erkannten Pattern-IDs
- `primary_pattern`: Primäre Pattern-ID oder null

---

## 5. Response Schema

```typescript
{
  signals: {
    objective_present: boolean;
    objective_is_effect: boolean;
    objective_has_constraints: boolean;
    options_are_implementations: boolean;
    status_quo_excluded: boolean;
    assumptions_are_outcomes: boolean;
    assumptions_are_guaranteed: boolean;
    causal_link_explicit: boolean;
  };
  hint_intensity: number; // 0.0 - 1.0
  hint_band: 'NO_HINT' | 'CLARIFICATION_NEEDED' | 'STRUCTURALLY_UNCLEAR';
  patterns_detected: string[]; // Pattern-IDs
  primary_pattern: 'OUTCOME_AS_VALIDATION' | 'MEANS_BEFORE_ENDS' | 'OBJECTIVE_VAGUENESS' | null;
}
```

---

## 6. Operational Determinism & Robustheit

**Ist es operationally deterministic?**
Ja. Das System ist operationally deterministic: Gleiche Eingabe → gleiche Pipeline → gleiches Produktergebnis. Die LLM-Komponenten (Parser, Classifier) sind intern nicht mathematisch deterministisch, aber das System verwendet feste Regeln, deterministische Fallbacks und Schema-Enforcement, um stabiles Produktverhalten zu garantieren. Alle Berechnungen (Hint-Intensität, Hint-Band, Primary Pattern) sind vollständig regelbasiert.

**Deterministische Fallbacks:**
- **Parser-Fallback**: Bei LLM-Parser-Fehlern greift ein regex-basierter Fallback-Parser
- **Classifier-Fallback**: Bei Classifier-Fehlern greift ein deterministischer Fallback mit konservativen Defaults ("unknown ⇒ false")
- **Berechnungen**: Alle Berechnungen (Hint-Intensität, Hint-Band, Primary Pattern) sind vollständig deterministisch

---

## 7. Unterschied zu Decision OS

| Aspekt | Decision Suite v1 | Decision OS |
|--------|-------------------|--------------|
| **Zweck** | Observational Signal System | Intervention System |
| **Output** | Signale, Hint-Intensität, Pattern-IDs | Interventionen oder NO_INTERVENTION |
| **Urteile** | Keine Urteile | FRAGILE/NOT_FRAGILE Urteile |
| **Interventionen** | Keine Interventionen | Kann Fragen stellen oder still bleiben |
| **Pattern-Logik** | Strukturelle Pattern-Erkennung | TR-01/TR-02/TR-03 Trigger-Logik |
| **Response-Mapping** | Kein Response-Mapping | Response-Mapping, Response-Generierung, Response-Guard |
| **LLM-Textgenerierung** | Kein LLM Textizer (v1) | LLM-basierte Response-Generierung |

---

## 8. Definition of Done – Production

### A) Hard Guarantees (non-negotiable)
- **Keine 5xx-Fehler durch LLM-Fehler**: System antwortet nie mit HTTP 502 bei LLM-Fehlern; deterministische Fallbacks (Parser, Classifier) greifen immer
- **Alle API-Responses sind schema-valid**: DecisionSuiteV1ResponseSchema validiert alle Responses (Zod strict mode)
- **Konservative Strategie ist immer durchgesetzt**: "unknown ⇒ false" Defaults bei Classifier-Fehlern
- **Deterministische Berechnungen**: Hint-Intensität, Hint-Band und Primary Pattern sind vollständig regelbasiert

### B) Operational Guarantees (product behavior)
- **Gleiche Eingabe führt zu stabilem Produktverhalten**: Operational Determinism durch Regel-Engines (Pattern-Erkennung, Hint-Berechnung), deterministische Fallbacks, Schema-Enforcement
- **Konservative Signal-Beobachtung**: Nur explizit vorhandene Merkmale werden als true markiert
- **Prioritätsreihenfolge für Primary Pattern**: OUTCOME_AS_VALIDATION > MEANS_BEFORE_ENDS > OBJECTIVE_VAGUENESS

### C) Monitoring & Observability
- **Pattern-Detection-Frequenz**: Tracke, wie oft MEANS_BEFORE_ENDS, OBJECTIVE_VAGUENESS, OUTCOME_AS_VALIDATION erkannt werden
- **Hint-Band-Verteilung**: NO_HINT, CLARIFICATION_NEEDED, STRUCTURALLY_UNCLEAR Ratio
- **Primary Pattern-Verteilung**: Anteil der Responses mit primary_pattern !== null
- **Persistenz-Fehler-Logs**: Asynchrone, non-blocking Persistenz-Fehler werden geloggt (falls implementiert)

### D) Known and Accepted Trade-offs
- **LLMs sind nicht mathematisch deterministisch**: System ist operationally deterministic, nicht mathematisch deterministisch; LLM-Interna können variieren, Produktverhalten bleibt stabil
- **Persistenz ist asynchron und non-retrying**: Falls implementiert, Fehler werden nur geloggt, keine Retry-Logik (akzeptabel für non-blocking Design)
- **Semantische Klassifikation ist probabilistisch**: Mitigated durch konservative Defaults ("unknown ⇒ false") und deterministische Fallbacks
- **Konservative Strategie kann False Negatives produzieren**: Akzeptabel für Observational System, das keine Urteile fällt

---

## 9. Production-Readiness

**Status:** ✅ **PRODUCTION-SAFE**

**Begründung:**
- Alle Berechnungen sind operationally deterministic
- Deterministische Fallbacks für alle LLM-Komponenten
- Konservative Strategie ("unknown ⇒ false") reduziert False Positives
- Klare Trennung von Observational Signals und Interventionen
- Vollständig typisiert (TypeScript, Zod)

**Bekannte Trade-offs:**
- LLM-Abhängigkeit bleibt bestehen (Parser, Classifier), aber Fallbacks reduzieren das Risiko erheblich
- Konservative Strategie kann False Negatives produzieren (akzeptabel für Observational System)

---

**Dokument abgeschlossen.**

