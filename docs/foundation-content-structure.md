# Foundation Cases Content Structure

## 📊 SAUBERE DATENSTRUKTUR

Die generierten Inhalte werden **strukturiert im bestehenden `foundation_cases.content` JSONB-Feld** gespeichert, um Datenbank-Chaos zu vermeiden.

## 🗂️ CONTENT JSONB STRUKTUR

```json
{
  // ===== CASE DESCRIPTION =====
  "introduction": "Framework-Einleitung und Kontext...",
  "situation": "Detaillierte Unternehmenssituation...",
  "question": "Zentrale Fragestellung...",
  "context": ["Datenpunkt 1", "Datenpunkt 2", "..."],

  // ===== BACKWARDS COMPATIBILITY =====
  "multiple_choice_questions": [
    {
      "id": "mc1",
      "question": "Welche Hauptkomponenten gehören in einen Profit Tree?",
      "options": [
        {
          "id": "a",
          "text": "Umsatz und Kosten",
          "correct": true,
          "explanation": "Richtig! Der Gewinn ergibt sich aus..."
        }
      ]
    }
  ],

  // ===== STEP-SPECIFIC GENERATED CONTENT =====
  "step_content": {
    "step_0": {
      "multiple_choice_questions": [...],
      "step_title": "Problemverständnis & Zielklärung",
      "framework": "profit_tree",
      "generated_at": "2025-01-31T06:12:00Z",
      "learning_forms": ["multiple_choice"]
    },
    "step_1": {
      "framework_template": {
        "type": "profit_tree",
        "title": "Profit Tree Template",
        "description": "Strukturiertes Template für Profit Tree...",
        "structure": {
          "main_categories": ["Umsatz", "Kosten"],
          "sub_elements": {
            "Umsatz": ["Anzahl Kunden", "Preis pro Kunde"],
            "Kosten": ["Fixkosten", "Variable Kosten"]
          }
        },
        "instructions": "1. Beginne mit der Gewinnformel..."
      },
      "tips_and_hints": {
        "tips": [
          "Beginne Hypothesenbildung mit einer klaren Struktur",
          "Sammle alle relevanten Informationen systematisch"
        ],
        "hints": [
          "Verwende das MECE-Prinzip",
          "Stelle die richtigen Fragen zur richtigen Zeit"
        ],
        "best_practices": [
          "Strukturiere deine Analyse von oben nach unten",
          "Validiere deine Hypothesen mit Daten"
        ]
      },
      "step_title": "Hypothesenbildung",
      "framework": "profit_tree",
      "generated_at": "2025-01-31T06:12:00Z",
      "learning_forms": ["framework", "tips_hints"]
    }
  }
}
```

## 🎯 VORTEILE DIESER STRUKTUR

### ✅ SAUBER & ORGANISIERT

- **Keine neuen Tabellen** - alles im bestehenden JSONB-Feld
- **Step-spezifische Organisation** - jeder Step hat eigenen Bereich
- **Versionierung** durch `generated_at` Timestamps
- **Backwards Compatibility** für bestehende MC-Fragen

### 🔄 FLEXIBEL & ERWEITERBAR

- **Neue Content-Typen** einfach hinzufügbar
- **Framework-spezifische Templates** pro Step
- **Manuelle Überschreibung** jederzeit möglich
- **Historische Versionen** durch Timestamps nachvollziehbar

### 🚀 PERFORMANCE-OPTIMIERT

- **Einzelne Datenbank-Query** für kompletten Case-Content
- **JSONB-Indizierung** für schnelle Suche
- **Minimaler Overhead** durch kompakte Struktur

## 📋 VERWENDUNG IM CODE

### Frontend (Foundation Manager)

```typescript
// Zugriff auf step-spezifischen Content
const stepContent = selectedCase.content?.step_content?.[`step_${stepIndex}`];
const mcQuestions = stepContent?.multiple_choice_questions;
const frameworkTemplate = stepContent?.framework_template;
const tipsAndHints = stepContent?.tips_and_hints;
```

### Backend (Content Generation API)

```typescript
// Speicherung im step_content Bereich
existingContent.step_content[`step_${step_index}`] = {
  ...generatedContent,
  step_title: step_title,
  framework: framework,
  generated_at: new Date().toISOString(),
  learning_forms: learning_forms,
};
```

## 🔧 MIGRATION & KOMPATIBILITÄT

- **Bestehende Cases** funktionieren weiterhin
- **Neue Struktur** wird automatisch erstellt
- **Backwards Compatibility** für MC-Fragen gewährleistet
- **Keine Datenbank-Migration** erforderlich
