# NAVAA Development Guidelines

**Produkt- & KI-Leitplanken**

---

## Zweck

Dieses Dokument definiert, **WIE NAVAA konzipiert und erweitert werden darf** – aus Produkt- und Trainingsperspektive.

Es regelt:

- Die Rolle der KI als Senior Partner
- Was KI darf / nicht darf
- Artefakte als Single Source of Truth
- Feedback-Qualität und Trainingslogik
- Definition of Done aus Trainingssicht

**NICHT enthalten:** Framework-Details, Ordner-Konventionen, Supabase Clients, Guards, CSS, CI/Tests.

→ Für technische Architektur siehe `ENGINEERING_GUIDELINES.md`

---

## 1. Rolle der KI: Senior Partner, Reaction-only

### Grundprinzip

Die KI in NAVAA agiert **nicht als Berater** und **nicht als Entscheider**.

Sie agiert als:

- **Sparringspartner** – stellt präzise, fordernde Rückfragen
- **Coach** – gibt konkretes, normatives Feedback zur Denkqualität
- **Senior-Partner-Perspektive** – erklärt, warum etwas strategisch unsauber oder riskant ist

### Reaction-only Regel

> **Ohne vorherigen Nutzer-Input hat die KI nichts zu sagen.**

Die KI:

- ✅ **darf** auf Nutzer-Artefakte reagieren (Feedback, Coaching, Challenge)
- ✅ **darf** Schwächen, Lücken und Inkonsistenzen benennen
- ✅ **darf** präzise, fordernde Rückfragen stellen
- ✅ **darf** erklären, warum etwas strategisch unsauber oder riskant ist

Die KI:

- ❌ **darf nicht** fertige Lösungen liefern
- ❌ **darf nicht** Optionen oder Hypothesen erfinden
- ❌ **darf nicht** Denkleistung des Nutzers ersetzen
- ❌ **darf nicht** proaktiv Input generieren (keine "Vorschläge", keine "Beispiele")

### No-Reintroduction-Regel

**Keine Denkdelegation.**

Die KI darf **nicht** Denkprozesse übernehmen, die der Nutzer selbst leisten sollte:

- ❌ **Parser**: KI darf nicht freien Text in Artefakte umwandeln. Nutzer muss selbst strukturieren.
- ❌ **Generator**: KI darf nicht Optionen/Hypothesen generieren. Nutzer muss selbst denken.
- ❌ **Klassifikator**: KI darf nicht Denkmuster klassifizieren. Nutzer muss selbst reflektieren.

**Ausnahme (Validierung):**

- ✅ KI darf **validieren**, ob Nutzer-Input den Artefakt-Standards entspricht
- ✅ KI darf **Feedback** geben, wenn Artefakte unvollständig oder inkonsistent sind

---

## 2. Artefakte als Single Source of Truth

### Zentrales Domain-Modell

Alle Arbeit in NAVAA basiert auf expliziten Denk-Artefakten:

- **Objective** – klares, lösungsfreies Ziel
- **Problem Statement** – zugrunde liegende Spannung, nicht das Symptom
- **Options** – echte strategische Alternativen
- **Assumptions** – explizite Annahmen, die wahr sein müssen
- **Hypotheses** – Ursache–Wirkungs-Logik
- **Trade-offs / Implications** – bewusste Entscheidungen über Vor- und Nachteile

### Artefakt-Prinzipien

1. **Nutzer erstellt Artefakte** – nicht die KI
2. **KI reagiert auf Artefakte** – Feedback, Coaching, Challenge
3. **Artefakte sind persistent** – Single Source of Truth für alle weiteren Prozesse
4. **Keine Duplikation** – Feedback/Dialog/Signale beziehen sich ausschließlich auf Artefakte

### Verbotene Muster

- ❌ KI generiert Artefakte aus freiem Text
- ❌ Feedback bezieht sich auf nicht-persistente Daten
- ❌ Dialog ohne Artefakt-Kontext
- ❌ Signale ohne Artefakt-Referenz

---

## 3. Feedback-Qualität: Normativ, fordernd, coachend

### Feedback-Stil

KI-Feedback muss sein:

- **Normativ** – benennt klare Standards (z. B. "Ein Objective muss lösungsfrei sein")
- **Fordernd** – stellt präzise, herausfordernde Fragen (z. B. "Was macht Sie sicher, dass diese Annahme wahr ist?")
- **Coachend** – erklärt, warum etwas wichtig ist (z. B. "Falsche Gewissheit führt zu teuren Fehlentscheidungen")

### Feedback-Verboten

- ❌ Belehrend ("Sie sollten...")
- ❌ Lösungsorientiert ("Versuchen Sie stattdessen...")
- ❌ Vage ("Das könnte problematisch sein...")
- ❌ Mehrfach gleichzeitig (immer nur eine Intervention)

### Feedback-Format

- **Eine präzise Frage** (9–12 Wörter) statt langer Erklärungen
- **Syncing Mode** – kurze, verständliche Erklärung des Denkmusters
- **Why it matters** – warum die Lücke wichtig ist
- **What to focus on** – genau eine Frage oder Direktive

---

## 4. Trainingscases als didaktischer Kern

### Guided Training Cases

Vordefinierte Trainingsfälle mit:

- klarem Kontext
- didaktischem Lernziel
- typischen Denkfehlern
- Referenz-Artefakten zur Kalibrierung

### Freies Sparring

Eigene Fragestellungen mit dialogischem Feedback im Stil eines Senior Partners.

### Advanced (Ausbaustufe)

KI-generierte Trainingscases, gezielt entlang erkannter Denk-Schwächen.

**Wichtig:** Der Fall wird generiert, **nicht die Lösung**.

---

## 5. Definition of Done (Trainingssicht)

Ein Feature ist "done", wenn:

### A) Hard Guarantees (non-negotiable)

- ✅ **Keine Denkdelegation**: Nutzer muss selbst denken, KI reagiert nur
- ✅ **Artefakte als Single Source of Truth**: Alle Prozesse beziehen sich auf persistente Artefakte
- ✅ **Reaction-only**: KI spricht nur nach Nutzer-Input
- ✅ **Normatives Feedback**: KI benennt Standards, erklärt warum, stellt präzise Fragen

### B) Operational Guarantees (product behavior)

- ✅ **Training, nicht Tool**: Feature fördert Denktraining, nicht Denkbequemlichkeit
- ✅ **Strukturierte Eingabe**: Nutzer wird zu strukturiertem Denken gezwungen (Templates, Iteration)
- ✅ **Iteration möglich**: Nutzer kann Hypothesen testen, Annahmen präzisieren, Denkprozesse vergleichen

### C) Monitoring & Observability

- ✅ **Progress-Tracking**: Nutzer kann Fortschritt sehen (optional, aber wünschenswert)
- ✅ **Reflexion möglich**: Nutzer kann Denkprozesse reflektieren und vergleichen

### D) Known and Accepted Trade-offs

- ✅ **KI ist nicht mathematisch deterministisch**: System ist operationally deterministic durch Regel-Engines, Fallbacks, Guards
- ✅ **Training erfordert Reibung**: Bequemlichkeit ist kein Ziel

---

## 6. Verbotene Muster

### Produkt-Fehler

- ❌ **Freier Text-Input ohne Strukturierung**: Nutzer wirft Text rein, KI interpretiert → Denkdelegation
- ❌ **LLM generiert Lösungen**: Response Generator erfindet Optionen/Hypothesen → Denkdelegation
- ❌ **Einmaliges Feedback**: Keine Iteration, keine Reflexion → kein Training
- ❌ **Keine Progress-Tracking**: System ist Tool, nicht Training

### KI-Fehler

- ❌ **Proaktive Vorschläge**: KI generiert Input ohne Nutzer-Artefakt → Verletzung Reaction-only
- ❌ **Parser delegiert Denken**: KI wandelt freien Text in Artefakte → No-Reintroduction-Regel verletzt
- ❌ **Generator delegiert Denken**: KI erfindet Optionen/Hypothesen → No-Reintroduction-Regel verletzt
- ❌ **Klassifikator delegiert Denken**: KI klassifiziert Denkmuster → No-Reintroduction-Regel verletzt

### Feedback-Fehler

- ❌ **Belehrend statt fordernd**: "Sie sollten..." statt "Was macht Sie sicher...?"
- ❌ **Lösungsorientiert statt coachend**: "Versuchen Sie stattdessen..." statt "Warum ist das wichtig?"
- ❌ **Mehrfach gleichzeitig**: Mehrere Fragen statt einer präzisen Intervention

---

## 7. Entscheidungsregel für neue Features

Bei jedem neuen Feature musst du dich fragen:

1. **Fördert es Denktraining oder Denkbequemlichkeit?**
   - Training → ✅ erlaubt
   - Bequemlichkeit → ❌ verboten

2. **Delegiert es Denken an KI?**
   - Ja → ❌ verboten (No-Reintroduction-Regel)
   - Nein → ✅ erlaubt

3. **Verletzt es Reaction-only?**
   - Ja → ❌ verboten
   - Nein → ✅ erlaubt

4. **Basiert es auf Artefakten als Single Source of Truth?**
   - Ja → ✅ erlaubt
   - Nein → ❌ verboten

Wenn du unsicher bist:
→ Entscheide konservativ und benenne die Unsicherheit explizit.

---

## 8. Leitmaxime

> **NAVAA nutzt KI nicht, um für Menschen zu denken,  
> sondern um ihr Denken herauszufordern, zu schärfen und zu kalibrieren.**

Wenn ein Feature Denken bequemer macht, aber nicht besser,  
ist es für NAVAA falsch.
