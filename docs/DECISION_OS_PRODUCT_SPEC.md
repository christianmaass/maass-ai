# Decision OS — Product Owner System Description

**Version:** v2.0 (Post-Migration)  
**Datum:** 2025-01-27  
**Status:** Production-Ready nach radikaler Produkttransformation

---

## Scope & Boundaries

**Decision OS ist ein Intervention System:** Es kann eine fokussierte Frage stellen oder bewusst still bleiben. Das System verwendet TR-01/TR-02/TR-03 Pattern-Erkennung, Response-Mapping, Response-Generierung und Response-Guard, um Interventionen zu generieren oder NO_INTERVENTION zurückzugeben.

**Decision OS ist NICHT Decision Suite v1:** Decision OS urteilt über Entscheidungsqualität und generiert Interventionen. Es ist nicht das Decision Suite v1 Observational Signal System, das nur strukturelle Signale produziert (signals, patterns_detected, hint_intensity, hint_band, primary_pattern) ohne Urteile oder Interventionen.

---

## Terminology / Mapping

**Decision OS verwendet TR-IDs als autoritative Runtime-Identifikatoren für Interventionen.** Decision Suite v1 verwendet Pattern-IDs als Beobachtungs-Labels für Signale. Das Mapping dient nur der Dokumentation/Analyse.

**Mapping-Tabelle (Decision OS Trigger → Decision Suite Pattern):**

| Decision OS Trigger | Decision Suite v1 Pattern | Hinweis |
|---------------------|--------------------------|---------|
| TR-01 | MEANS_BEFORE_ENDS | Means-before-Ends (Lösung vor Zielvalidierung) |
| TR-02 | OBJECTIVE_VAGUENESS | Nur wenn `objective_present === false`; sonst kann zu NO_INTERVENTION/Silence in Decision OS mappen |
| TR-03 | OUTCOME_AS_VALIDATION | Outcome-as-Validation (falsche Gewissheit) |

---

## Produktwechsel: Von EdTech zu Decision Quality System

**Historischer Kontext:** Decision OS entstand durch eine radikale Transformation von einer EdTech-Lernplattform zu einem fokussierten Decision Quality System (2025-01-27). Die Migration entfernte alle Learning/Course-Funktionalität und konzentrierte sich ausschließlich auf die Qualitätsprüfung von Entscheidungen.

**Kernänderung:** Statt Wissen zu vermitteln (EdTech), unterstützt das System jetzt direkt bei der Entscheidungsqualität (Decision Quality). Der Fokus liegt auf ex-ante Qualitätsprüfung, nicht auf Bildung oder Training.

**Architekturwechsel:**
- **Entfernt:** Alle Course/Catalog/Track-Routen, Learning-Progress-Tracking, Content-Management
- **Beibehalten:** Base UI Components, Auth-System, Supabase-Integration
- **Neu:** Single Entry Point ("What decision are you making right now?"), Decision Review API, Pattern-Engine

**Bewertung:** ✅ **SOUND** - Radikaler Schnitt schafft fokussiertes Produkt ohne Legacy-Ballast. Saubere API-Struktur, keine versteckten Dependencies. Minimal, direkt — keine Ablenkung durch Learning-Features.

---

## 1. What it is

Decision OS ist ein System, das Führungskräfte bei der Qualitätsprüfung ihrer Entscheidungen unterstützt, bevor sie diese umsetzen. Es richtet sich an Menschen, die Verantwortung tragen und unter Druck klare Entscheidungen treffen müssen — nicht an solche, die mehr Informationen benötigen, sondern an solche, die Klarheit brauchen.

Das System analysiert eine Entscheidung automatisch und identifiziert Denkfehler oder unklare Annahmen, die zu Fehlentscheidungen führen können. Es unterscheidet sich von Wissens- oder Bildungstools dadurch, dass es keine Kurse oder Methoden vermittelt, sondern direkt in den Entscheidungsprozess eingreift: Der Nutzer beschreibt seine Entscheidung, und das System gibt entweder eine präzise Frage zurück oder bleibt bewusst still, wenn die Entscheidung gut strukturiert ist.

Der "Gewinn" für den Nutzer ist Entscheidungsentlastung: Statt endlos zu grübeln oder blind zu entscheiden, erhält er einen fokussierten Hinweis auf das, was wirklich wichtig ist — oder die Bestätigung, dass seine Entscheidung solide ist. Das System verhält sich wie ein seniorer Sparringspartner, der herausfordert, ohne zu belehren.

## 2. What it does (Capabilities)

- **Decision Intake**: Akzeptiert Entscheidungen in natürlicher Sprache oder strukturiertem Format (Ziel, Optionen, Annahmen)
- **Decision Framing Review**: Analysiert die Struktur der Entscheidung und extrahiert objektive, Optionen und Annahmen
- **Pattern Detection**: Erkennt drei spezifische Denkmuster:
  - TR-01: Means-before-Ends (Lösung vor Zielvalidierung)
  - TR-02: Objective Vagueness (unklares Ziel)
  - TR-03: Outcome-as-Validation (falsche Gewissheit über Ergebnisse)
- **Intervention Generation**: Generiert präzise, kurze Fragen (9–12 Wörter) statt langer Erklärungen
- **Silence/No Intervention als bewusstes Ergebnis**: Bleibt still bei gut strukturierten Entscheidungen, auch wenn nicht alle Details vorhanden sind
- **Logging/Traceability (Explainability)**: Speichert alle erkannten Patterns, Flags und die Begründung für jede Intervention, sodass nachvollziehbar ist, warum eine Frage gestellt wurde
- **MAPIC Lens Mapping (Shadow Mode)**: Paralleles Mapping-System zur Erkennung von Decision Patterns mit Explainability-Features ("Syncing Mode")
- **Persistenz**: Speichert alle Decision Reviews in Supabase für Analyse und Nachvollziehbarkeit

## 3. How it works (High-level architecture, no code)

### 3.1 Operational Determinism

**LLMs sind nicht mathematisch deterministisch**, auch nicht bei Temperature 0 (Model-Updates, API-Variabilität). **Das System ist operationally deterministic:** Gleiche Eingabe → gleiche Pipeline → gleiches Produktergebnis. Die Operational Determinism wird durch Regel-Engines, deterministische Fallbacks, Guards und Schema-Enforcement erzwungen. Nutzer erleben stabiles Verhalten, auch wenn LLM-Interna variieren.

Das System arbeitet operationally deterministisch: Für jede Entscheidung wird derselbe Prozess durchlaufen, der immer zum gleichen Produktergebnis führt. Bei LLM-Fehlern greifen deterministische Fallbacks, sodass das System nie mit HTTP 502 antwortet.

**Schritt 1: Input-Parsing**
Der Nutzer gibt seine Entscheidung ein (als Text oder strukturiert). Das System extrahiert automatisch: Was ist das Ziel? Welche Optionen gibt es? Welche Annahmen werden gemacht? Bei LLM-Parser-Fehlern greift ein deterministischer Fallback-Parser, der regex-basiert die Struktur extrahiert.

**Schritt 2: Flag-Klassifikation**
Das System analysiert die Entscheidung anhand von acht binären Flags:
- Sind die Optionen Implementierungsentscheidungen (Tool A vs Tool B) oder strategische Optionen (Enterprise vs SMB)?
- Ist das Ziel präsent und operational (Effekt-basiert)?
- Hat das Ziel Constraints (Kosten, Zeit, Risiko, Qualität)? **(Policy v1.1: Neues Flag)**
- Wird der Status Quo ausgeschlossen?
- Ist ein kausaler Zusammenhang explizit genannt?
- Werden Annahmen als Outcomes formuliert?
- Werden Annahmen als garantierte Ergebnisse formuliert (falsche Gewissheit)? **(Policy v1.1: Neues Flag)**

Bei Classifier-Fehlern greift ein deterministischer Fallback-Klassifizierer mit konservativen Defaults ("unknown ⇒ false"), der zu SOFT_CLARITY führt. Das System antwortet nie mit HTTP 502.

**Schritt 3: Pattern-Engine (Policy v1.1)**
Die Flags werden durch drei Pattern-Regeln geprüft, in strikter Prioritätsreihenfolge:
1. **TR-03** (höchste Priorität): Fires, wenn strategische Optionen mit **garantierten** Annahmen ohne Evidenz verglichen werden. Unterscheidet zwischen falscher Gewissheit und plausiblen kausalen Ketten.
2. **TR-01** (mittlere Priorität): Fires, wenn Implementierungen ohne Constraints **und** ohne kausale Logik gewählt werden. **Safe Harbor**: Wenn `objective_has_constraints === true` oder `causal_link_explicit === true`, wird TR-01 **nicht** ausgelöst. Dies schützt Standard Executive Trade-offs (Hire vs Train, Cloud vs On-Prem) mit Constraints.
3. **TR-02** (niedrigste Priorität): Fires, wenn das Ziel komplett fehlt (`objective_present === false`) oder thematisch ist (`objective_is_effect === false`). Thematische Ziele können zu NO_INTERVENTION führen.

**Schritt 4: Response-Mapping (Soft Intervention Model)**
Pattern-Erkennung und Antwort-Schweregrad sind entkoppelt:
- **TR-03** → `HARD_CHALLENGE` → `HARD_CLARITY`: Eine herausfordernde Frage, weil falsche Gewissheit gefährlich ist
- **TR-01** → `SOFT_CLARIFY` → `SOFT_CLARITY`: Eine klärende Frage, nie blockierend
- **TR-02** → `SOFT_CLARIFY` → `SOFT_CLARITY` oder `NO_INTERVENTION`: Nur wenn das Ziel komplett fehlt, sonst Stille
- **Kein Pattern** → `NO_INTERVENTION`: Bewusste Stille bei gut strukturierten Entscheidungen

Das System gibt immer nur eine Intervention zurück — nie mehrere Fragen gleichzeitig. Die Priorität stellt sicher, dass nur das wichtigste Problem adressiert wird.

**Schritt 5: MAPIC Lens Mapping (Trigger-based, authoritative)**
Lens-Auswahl basiert auf `trigger_id` als Single Source of Truth:
- **TR-03** → `OUTCOME_AS_VALIDATION`: Falsche Gewissheit über Outcomes
- **TR-01** → `MEANS_BEFORE_ENDS`: Implementierung vor Zielvalidierung
- **TR-02** (objective_present === false) → `OBJECTIVE_VAGUENESS`: Unklares Ziel
- **TR-02** (thematic objective) → `NONE`: Thematisches Ziel, akzeptabel
- **Kein Trigger** → `NONE`: Kein Pattern erkannt

Jeder Lens hat Explainability-Daten ("Syncing Mode"), die nur bei SOFT_CLARITY oder HARD_CLARITY angezeigt werden:
- **thinking_mode**: Kurze Bezeichnung des Denkmusters (max 5 Wörter)
- **lens_explainer**: Beschreibung des Patterns (max 14 Wörter)
- **why_it_matters**: Warum es wichtig ist (max 14 Wörter)
- **user_next_step**: Optionaler Hinweis für den Nutzer (max 10 Wörter)

**Schritt 6: Response-Generierung**
Ein LLM generiert eine strukturierte Response basierend auf Pattern-Erkennung, Flags und Sprachdetektion. Bei LLM-Fehlern greift ein deterministischer Fallback mit Template-basierten Antworten.

**Schritt 7: Response Guard (Untrusted Input Protection)**
LLM-Output wird als untrusted input behandelt. Der Response Guard validiert und korrigiert alle LLM-generierten Inhalte:

- **Schema-Enforcement**: NO_INTERVENTION darf keine optionalen Felder haben; SOFT/HARD müssen alle optionalen Felder haben
- **Keyword-Guards**: Verbotene Keywords werden erkannt und durch Template-Text ersetzt (z.B. "options" bei OUTCOME_AS_VALIDATION, wenn options_are_implementations unbekannt)
- **Sprachkonsistenz**: Sprache wird aus Input erkannt, Templates werden sprachspezifisch angewendet
- **Non-Empty Enforcement**: Alle optionalen Felder müssen vorhanden und nicht leer sein für SOFT/HARD

Der Guard hat Vorrang vor LLM-Output: Operational Determinism und Korrektheit gehen vor Expressivität.

**Schritt 8: Response-Zusammenstellung**
Die API gibt zurück:
- `judgment`: FRAGILE oder NOT_FRAGILE (Legacy)
- `trigger_id`: Höchstpriorisiertes Pattern (Legacy)
- `intervention`: Interventionstext (Legacy, backward compatibility)
- `patterns_detected`: Alle erkannten Patterns
- `response_type`: HARD_CHALLENGE, SOFT_CLARIFY oder NO_INTERVENTION
- `intervention_text`: Präziser Interventionstext
- `status`: NO_INTERVENTION, SOFT_CLARITY oder HARD_CLARITY (neues Format)
- `result_line`: Haupttext (max 120 Zeichen)
- `syncing_mode_title`: Kurzes Label (nur bei SOFT/HARD, max 50 Zeichen)
- `why_this_matters`: Erklärung der Lücke (nur bei SOFT/HARD, max 200 Zeichen)
- `what_to_focus_on`: Genau eine Frage oder Direktive (nur bei SOFT/HARD, max 150 Zeichen)
- `meta`: Flags, MAPIC-Daten, Explainability, Guard-Metadaten (im Debug-Mode)

**Schritt 9: Persistenz**
Alle Decision Reviews werden asynchron in Supabase gespeichert (non-blocking), inklusive Input, Response-Type, Patterns, Flags und Prompt-Version.

## 4. How it behaves in the user experience

**User Journey:**

1. Der Nutzer öffnet Decision OS und sieht eine einzige Frage: "What decision are you making right now?"
2. Er beschreibt seine Entscheidung in natürlicher Sprache (z. B. "Sollen wir Tool A oder Tool B für unser Projektmanagement wählen? Unser Ziel ist, die Team-Effizienz zu steigern.")
3. Das System analysiert die Entscheidung und gibt eine von drei Antworten:
   - **Stille** (`NO_INTERVENTION`): Die Entscheidung ist gut strukturiert, keine Intervention nötig. Zeigt "Looks solid. Proceed."
   - **Eine präzise Frage** (`SOFT_CLARIFY` oder `HARD_CHALLENGE`): Eine kurze Frage, die den Nutzer zum Nachdenken anregt
4. **Syncing Mode**: Das System zeigt zusätzlich den "Syncing Mode" an — eine kurze Erklärung des Denkmusters (z. B. "Confidence Check", "Outcome Definition", "Clear Framing")
5. **Explainability**: Der Nutzer kann auf "Why am I seeing this?" klicken, um Details zu sehen: Welche Patterns wurden erkannt? Welche Flags waren gesetzt?
6. Der Nutzer kann iterieren: Er beantwortet die Frage mental oder passt seine Entscheidung an und gibt sie erneut ein
7. Das System vermeidet Bürokratie: Es stellt nie Checklisten, gibt nie mehrere Fragen gleichzeitig und bleibt still, wenn die Entscheidung solide ist

**Beispiel-Interaktionen:**

**Beispiel 1: TR-03 (HARD_CHALLENGE)**
```
Nutzer: "Sollen wir unsere Vertriebsanstrengungen auf Enterprise-Kunden oder kleine Unternehmen fokussieren? Wir nehmen an, dass Enterprise-Kunden größere Verträge bringen werden. Unser Ziel ist, den Jahresumsatz um 15% zu steigern."

System: 
- Intervention: "What makes you confident this will work as expected?"
- Syncing Mode: "Confidence Check — You expect an outcome, but the mechanism is not anchored."
- Why it matters: "False certainty drives expensive commitments."
```

Das System erkennt falsche Gewissheit (Annahme als Garantie formuliert) und fordert den Nutzer heraus, seine Annahmen zu hinterfragen.

**Beispiel 2: TR-01 (SOFT_CLARIFY)**
```
Nutzer: "Wir müssen zwischen Tool A und Tool B für unser Projektmanagement wählen. Unser Ziel ist, die Team-Effizienz zu steigern. Tool A ist bereits in einer anderen Abteilung im Einsatz."

System:
- Intervention: "Which outcome dimension matters most here — and how will you assess it?"
- Syncing Mode: "Outcome Definition — You are choosing an implementation before success is measurable."
- Why it matters: "Teams ship activity without impact."
```

Das System erkennt, dass eine Implementierung ohne Constraints oder kausale Logik gewählt wird, und fragt nach dem wichtigsten Erfolgskriterium.

**Beispiel 3: NO_INTERVENTION (Safe Harbor)**
```
Nutzer: "Sollen wir unser Support-Team erweitern oder Chatbot-Technologie einsetzen? Unser Ziel ist, Antwortzeiten unter 2 Stunden zu halten. Mehr Personal erhöht die Verfügbarkeit, ein Chatbot beantwortet einfache Anfragen sofort."

System:
- Intervention: [Stille — keine Intervention]
- Syncing Mode: "Clear Framing — Decision framing is sufficient."
- Why it matters: "Proceed — focus on execution."
```

Das System erkennt eine gut strukturierte Entscheidung mit klaren Constraints und kausaler Logik und bleibt bewusst still. Dies ist ein Beispiel für den "Safe Harbor" — Standard Executive Trade-offs mit Constraints lösen keine Intervention aus.

**Beispiel 4: TR-02 (SOFT_CLARIFY)**
```
Nutzer: "Sollen wir Node.js oder Python für unser Backend verwenden?"

System:
- Intervention: "What would success look like here, and by when?"
- Syncing Mode: "Goal Clarification — The decision has options, but success is not defined yet."
- Why it matters: "You cannot evaluate trade-offs without a target."
```

Das System erkennt, dass das Ziel komplett fehlt, und stellt eine klärende Frage.

## 5. What we changed and why (Evolution)

### 5.1 Pattern-Engine Evolution

**Ursprüngliche Annahmen:**
Zu Beginn gingen wir davon aus, dass jedes erkannte Pattern eine Intervention rechtfertigt. Das Ziel musste als "Hard Gate" vorhanden sein, und jedes Pattern sollte "feuern", wenn die Bedingungen erfüllt waren. Das System war zu streng: Es intervenierte bei legitimen Executive-Trade-offs wie "Hire vs Train" oder "Cloud vs On-Prem", die zwar keine explizite Evidenz hatten, aber durch Constraints (Kosten, Zeit) gut strukturiert waren.

**Erste Iteration: TR-02 und TR-03 hinzugefügt**
Wir fügten TR-02 (Objective Vagueness) und TR-03 (Outcome-as-Validation) hinzu, was die Kalibrierung komplexer machte. Das System erkannte mehr Patterns, aber die Frage war: Wann sollte es wirklich intervenieren?

**Kern-Insight: Pattern-Erkennung ≠ Response-Schweregrad**
Wir erkannten, dass nicht jedes erkannte Pattern eine Intervention rechtfertigt. Pattern-Erkennung ist eine technische Klassifikation; die Entscheidung, ob und wie interveniert wird, ist eine Produktentscheidung. Wir entkoppelten Pattern-Erkennung und Response-Mapping.

**Neues Design: Soft Interventions, Stille als Feature (Policy v1.1)**
- **TR-03 als einziger Hard Anchor**: Nur falsche Gewissheit rechtfertigt eine herausfordernde Intervention. Unterscheidung zwischen "garantiert formuliert" und "plausibel formuliert".
- **TR-01 als Soft Clarify mit Safe Harbor**: Implementierungsentscheidungen ohne Constraints werden sanft hinterfragt, nie blockiert. **Standard Executive Trade-offs mit Constraints lösen TR-01 nicht aus** — dies ist der "Safe Harbor".
- **TR-02 kann Stille sein**: Thematische Ziele sind manchmal akzeptabel; nur wenn das Ziel komplett fehlt, wird gefragt.
- **Neue Flags**: `objective_has_constraints` und `assumptions_are_guaranteed` ermöglichen präzisere Kalibrierung.

**Tone-Iteration: Vom Prüfer zum Sparringspartner**
Wir änderten die Formulierungen von korrigierend ("You are assuming...") zu explorativ ("What makes you confident..."). Das System stellt Fragen, die Exploration ermöglichen, statt Fehler zu detektieren.

**MAPIC Lens Mapping (Shadow Mode)**
Wir fügten ein paralleles Mapping-System hinzu, das Decision Patterns in "Lenses" kategorisiert und Explainability-Daten bereitstellt. Dies läuft im "Shadow Mode" — es beeinflusst das Verhalten nicht, sondern liefert zusätzliche Kontext-Informationen für den Nutzer ("Syncing Mode").

**Warum diese Änderungen wichtig waren:**
- **Trust**: Zu viele False Positives zerstören Vertrauen schneller als False Negatives
- **Adoption**: Executives nutzen Tools, die Entscheidungsentlastung bieten, nicht solche, die Bürokratie erzeugen
- **Cognitive Load**: Eine präzise Frage reduziert mentale Belastung; mehrere Fragen oder lange Erklärungen erhöhen sie
- **Explainability**: Nutzer können nachvollziehen, warum eine Intervention ausgelöst wurde, ohne technische Details zu verstehen

## 6. Is it still operationally deterministic and explainable?

**Ist es noch operationally deterministic?**
Ja. Das System ist operationally deterministic: Gleiche Eingabe → gleiche Pipeline → gleiches Produktergebnis. Die LLM-Komponenten (Parser, Classifier, Response-Generator) sind intern nicht mathematisch deterministisch, aber das System verwendet feste Regeln, deterministische Fallbacks und Guards, um stabiles Produktverhalten zu garantieren. Die Pattern-Engine ist vollständig regelbasiert.

**Deterministische Fallbacks:**
- **Parser-Fallback**: Bei LLM-Parser-Fehlern greift ein regex-basierter Fallback-Parser
- **Classifier-Fallback**: Bei Classifier-Fehlern greift ein deterministischer Fallback mit konservativen Defaults ("unknown ⇒ false"), der zu SOFT_CLARITY führt. Das System antwortet nie mit HTTP 502.
- **Response-Generator-Fallback**: Bei Response-Generator-Fehlern werden Template-basierte Fallback-Responses verwendet
- **Response Guard**: Validiert und korrigiert alle LLM-Outputs deterministisch

**Was macht es erklärbar?**
1. **Flags**: Jede Entscheidung wird durch acht binäre Flags klassifiziert, die transparent sind (im Debug-Mode verfügbar)
2. **Pattern-Regeln**: Die drei Pattern-Regeln (TR-01, TR-02, TR-03) sind explizit definiert und nachvollziehbar
3. **Prioritätsreihenfolge**: Die Reihenfolge der Pattern-Prüfung ist festgelegt (TR-03 > TR-01 > TR-02)
4. **Single Intervention**: Es wird immer nur eine Intervention zurückgegeben, nie mehrere gleichzeitig
5. **Meta-Daten**: Jede Antwort enthält `patterns_detected` (alle erkannten Patterns) und `flags` (die Klassifikations-Flags), sodass nachvollziehbar ist, warum eine Intervention ausgelöst wurde
6. **MAPIC Explainability**: Das System zeigt "Syncing Mode" an — eine kurze, verständliche Erklärung des Denkmusters. Lens-Auswahl basiert auf `trigger_id` als Single Source of Truth.
7. **Response Guard Metadaten**: Im Debug-Mode werden Guard-Aktionen getrackt (welche Felder wurden korrigiert, welche Keywords wurden gefunden)
8. **Persistenz**: Alle Decision Reviews werden in Supabase gespeichert, sodass die Entscheidungsgeschichte nachvollziehbar ist

**Was hat sich geändert?**
Nicht die Deterministik, sondern die Response-Policy und die Robustheit:
- **Weniger Interventionen**: Das System bleibt öfter still, auch wenn Patterns erkannt werden
- **Entkoppelte Schweregrade**: Pattern-Erkennung und Response-Mapping sind getrennt; nicht jedes Pattern rechtfertigt eine Intervention
- **Safe Harbor**: Legitime Executive-Trade-offs lösen keine Interventionen aus
- **Explainability**: Zusätzliche Kontext-Informationen durch MAPIC Lens Mapping und "Syncing Mode"
- **Robustheit**: Deterministische Fallbacks für alle LLM-Komponenten, nie HTTP 502
- **Response Guard**: LLM-Output wird als untrusted input behandelt und validiert

**Explainability Hooks (für Nutzer oder interne Teams):**

1. **"Warum wurde diese Frage gestellt?"**: Die Meta-Daten zeigen, welche Patterns erkannt wurden (z. B. `patterns_detected: ["TR-01"]`) und welche Flags gesetzt waren (z. B. `objective_has_constraints: false`). Der "Syncing Mode" gibt eine verständliche Erklärung.

2. **"Warum wurde keine Frage gestellt?"**: Wenn `response_type: "NO_INTERVENTION"`, zeigt `patterns_detected: []` oder die Flags zeigen, dass Constraints vorhanden waren oder kausale Logik explizit war. Der "Syncing Mode" zeigt "Clear Framing".

3. **"Welche Patterns wurden erkannt, aber nicht interveniert?"**: `patterns_detected` listet alle erkannten Patterns auf, auch wenn nur eines zur Intervention führt (z. B. TR-02 erkannt, aber TR-03 hat Priorität)

4. **"Warum TR-03 statt TR-01?"**: Die Prioritätsreihenfolge ist dokumentiert; TR-03 hat höchste Priorität und überschreibt TR-01

5. **"Warum Soft Clarify statt Hard Challenge?"**: Das Response-Mapping ist explizit: TR-01 → SOFT_CLARIFY, TR-03 → HARD_CHALLENGE

6. **"Was bedeutet dieser Syncing Mode?"**: Jeder Lens hat eine verständliche Erklärung: thinking_mode, lens_explainer, why_it_matters, user_next_step

## 7. Risks & Monitoring – Control Table

| Risk | Metric / Signal | Target / Threshold | Mitigation | Review Cadence |
|------|----------------|-------------------|------------|----------------|
| False Positives bei Standard Executive Trade-offs | False-Positive-Rate auf Standard-Trade-offs mit Constraints (z.B. "Hire vs Train", "Cloud vs On-Prem") | < 5% False Positives | Safe Harbor: TR-01 feuert nicht bei `objective_has_constraints === true` oder `causal_link_explicit === true` | Wöchentlich |
| TR-03 feuert bei plausiblen kausalen Ketten | TR-03 Frequenz, `assumptions_are_guaranteed` Flag-Verteilung | TR-03 nur bei falscher Gewissheit, nicht bei plausiblen Ketten | `assumptions_are_guaranteed` Flag unterscheidet "garantiert formuliert" von "plausibel formuliert" | Monatlich |
| Intervention-Frequenz zu hoch (zu "chatty") | TR-01 Frequenz, NO_INTERVENTION Ratio | TR-01 < 20%, NO_INTERVENTION > 60% bei gut strukturierten Entscheidungen | Soft Intervention Model, Safe Harbor reduziert False Positives | Kontinuierlich |
| LLM-Output enthält verbotene Keywords oder inkonsistente Inhalte | Guard-Anwendungsrate, Keyword-Findungen (Debug-Mode) | < 10% Guard-Anwendung | Response Guard: Keyword-Guards, Schema-Enforcement, Sprachkonsistenz | Kontinuierlich (Debug-Mode) |
| System-Ausfälle durch LLM-Fehler | 5xx Error Rate (HTTP 502), Fallback-Aktivierung | 0% 5xx durch LLM-Fehler | Deterministische Fallbacks für Parser, Classifier, Response-Generator | Kontinuierlich |
| Persistenz-Fehler (non-blocking) | Persistenz-Fehler-Logs | Fehler werden geloggt (non-blocking) | Asynchrone Persistenz, Fehler-Logging (keine Retry-Logik) | Kontinuierlich |

---

## Definition of Done – Production

### A) Hard Guarantees (non-negotiable)
- **Keine 5xx-Fehler durch LLM-Fehler**: System antwortet nie mit HTTP 502 bei LLM-Fehlern; deterministische Fallbacks greifen immer
- **Alle API-Responses sind schema-valid**: Response Guard validiert und korrigiert alle LLM-Outputs
- **Single Intervention Policy ist immer durchgesetzt**: Nie mehrere Fragen gleichzeitig, nur eine Intervention pro Request
- **NO_INTERVENTION Responses enthalten keine optionalen Felder**: Schema-Enforcement stellt sicher, dass NO_INTERVENTION keine optionalen Felder hat
- **Guards überschreiben LLM-Output in allen Fällen**: Response Guard hat Vorrang vor LLM-Output (Keyword-Guards, Schema-Enforcement, Sprachkonsistenz)

### B) Operational Guarantees (product behavior)
- **Gleiche Eingabe führt zu stabilem Produktverhalten**: Operational Determinism durch Regel-Engines, Fallbacks, Guards
- **Intervention-Frequenz bleibt in definierten Grenzen**: TR-01 < 20%, NO_INTERVENTION > 60% bei gut strukturierten Entscheidungen
- **Safe Harbor verhindert False Positives bei Standard Executive Trade-offs**: TR-01 feuert nicht bei Constraints oder expliziter kausaler Logik

### C) Monitoring & Observability
- **Guard-Anwendungsrate**: Tracke, wie oft Response Guard eingreift (Ziel: < 10% der Fälle)
- **Intervention-Frequenz pro Pattern**: TR-01, TR-02, TR-03 Frequenz-Tracking
- **NO_INTERVENTION Ratio**: Anteil der NO_INTERVENTION Responses
- **Persistenz-Fehler-Logs**: Asynchrone, non-blocking Persistenz-Fehler werden geloggt (keine Retry-Logik)

### D) Known and Accepted Trade-offs
- **LLMs sind nicht mathematisch deterministisch**: System ist operationally deterministic, nicht mathematisch deterministisch
- **Persistenz ist asynchron und non-retrying**: Fehler werden nur geloggt, keine Retry-Logik (akzeptabel für non-blocking Design)
- **Semantische Klassifikation ist probabilistisch**: Mitigated durch konservative Defaults ("unknown ⇒ false") und deterministische Fallbacks

---

## 8. Management Summary (one page max)

**Produktwechsel (2025-01-27):**
Decision OS entstand durch eine radikale Transformation von einer EdTech-Lernplattform zu einem fokussierten Decision Quality System. Alle Learning/Course-Funktionalität wurde entfernt, um einen klaren Fokus auf Entscheidungsqualität zu ermöglichen. Die Migration war bewusst radikal gewählt, um Produktklarheit zu schaffen — kein schrittweiser Übergang, sondern ein sauberer Schnitt.

**Was wir gebaut haben:**
Decision OS ist ein System, das Führungskräfte bei der Qualitätsprüfung ihrer Entscheidungen unterstützt, bevor sie diese umsetzen. Es analysiert automatisch Entscheidungen, erkennt Denkfehler oder unklare Annahmen und gibt entweder eine präzise Frage zurück oder bleibt bewusst still, wenn die Entscheidung gut strukturiert ist.

**Warum es wichtig ist:**
Führungskräfte treffen täglich Entscheidungen unter Druck. Entscheidungsqualität wird oft erst im Nachhinein bewertet — wenn es zu spät ist. Decision OS ermöglicht ex-ante Qualitätsprüfung: Es identifiziert falsche Gewissheit, unklare Ziele oder vorzeitige Lösungsauswahl, bevor Ressourcen verschwendet werden.

**Wie es sich verhält:**
Das System ist ruhig, minimal und vertrauenswürdig. Es stellt nie Checklisten, gibt nie mehrere Fragen gleichzeitig und bleibt still, wenn die Entscheidung solide ist. Es verhält sich wie ein seniorer Sparringspartner, der herausfordert, ohne zu belehren. Eine Intervention ist immer eine kurze Frage (9–12 Wörter), nie eine lange Erklärung. Zusätzlich zeigt es "Syncing Mode" an — eine verständliche Erklärung des Denkmusters.

**Was ist "v1.1 done":**
- Automatische Entscheidungsanalyse mit drei Pattern-Regeln (TR-01, TR-02, TR-03)
- Operationally deterministische, regelbasierte Engine mit strikter Prioritätsreihenfolge
- Soft Intervention Model: Pattern-Erkennung und Response-Schweregrad sind entkoppelt
- Safe Harbor für Executive Trade-offs: Entscheidungen mit Constraints lösen keine False Positives aus (korrekt implementiert)
- Policy v1.1: Neue Flags (`objective_has_constraints`, `assumptions_are_guaranteed`) für präzisere Kalibrierung
- MAPIC Lens Mapping (Trigger-based): Lens-Auswahl basiert auf `trigger_id` als Single Source of Truth
- Explainability: Alle Flags, Patterns und Begründungen sind nachvollziehbar, inklusive verständlicher Erklärungen ("Syncing Mode")
- Deterministische Fallbacks: Parser, Classifier und Response-Generator haben Fallbacks, System antwortet nie mit HTTP 502
- Response Guard: LLM-Output wird als untrusted input behandelt, validiert und korrigiert (Keyword-Guards, Schema-Enforcement, Sprachkonsistenz)
- Production-ready API mit vollständiger Typisierung und Fehlerbehandlung
- Persistenz: Alle Decision Reviews werden in Supabase gespeichert (asynchron, non-blocking)
- Single Entry Point UI: "What decision are you making right now?"

**Was kommt als Nächstes:**
- **Monitoring**: False-Positive-Rate auf Standard-Trade-offs validieren (< 5% Ziel)
- **Real User Pilot**: Mit echten Führungskräften testen, ob Interventionen als Entscheidungsentlastung empfunden werden
- **Kalibrierung**: TR-03-Distinktion (garantiert vs. plausibel) in der Praxis validieren
- **MAPIC Alignment**: Sicherstellen, dass MAPIC Lens Mapping die Trigger-Logik widerspiegelt
- **Nicht mehr Regeln**: Das System ist kalibriert; weitere Patterns würden die Komplexität erhöhen, ohne Mehrwert zu schaffen
- **Post-Migration Cleanup**: Validierung, dass keine EdTech-Legacy-Code-Fragmente verbleiben
- **Decision Log (Future)**: Immutable Decision History für Langzeit-Analyse (nicht in v1.1)

**Erfolgskriterien:**
- False-Positive-Rate < 5% auf Standard-Trade-offs
- Intervention-Frequenz < 20% (TR-01)
- NO_INTERVENTION bei > 60% der gut strukturierten Entscheidungen
- Nutzer-Feedback: "Fühlt sich wie Entscheidungsentlastung an, nicht wie Bürokratie"
- MAPIC Alignment: Lens Mapping sollte Trigger-Logik widerspiegeln (Shadow Mode)
