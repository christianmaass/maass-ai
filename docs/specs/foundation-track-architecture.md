# Foundation Track - Technische Architektur & Arbeitspaket-Planung

## 📋 **ANFORDERUNGSANALYSE AUS 12 CASES**

### **Interaction-Types identifiziert:**

1. **multiple_choice_with_hypotheses** (Cases 1-4)
2. **structured_mbb** (Cases 5-8)
3. **free_form_with_hints** (Cases 9-11)
4. **minimal_support** (Case 12)

### **Datenstrukturen aus Cases abgeleitet:**

#### **Case Content Structure:**

```json
{
  "id": "case-01",
  "title": "Case Title",
  "category": "foundation",
  "cluster": "Leistung & Wirtschaftlichkeit",
  "tool": "Framework Name",
  "difficulty": 1-12,
  "estimated_duration": 10-60,
  "interaction_type": "multiple_choice_with_hypotheses",
  "learning_objectives": ["..."],
  "scenario": {
    "company": "...",
    "industry": "...",
    "situation": "...",
    "challenge": "...",
    "context": "..."
  },
  "tool_explanation": {
    "name": "...",
    "description": "...",
    "key_principles": ["..."],
    "application": "..."
  }
}
```

#### **Multiple Choice Structure:**

```json
{
  "multiple_choice": {
    "instructions": "...",
    "questions": [
      {
        "id": "mc1",
        "question": "...",
        "options": [
          {
            "id": "a",
            "text": "...",
            "correct": true/false,
            "explanation": "..."
          }
        ]
      }
    ]
  }
}
```

#### **Hypothesis Steps Structure:**

```json
{
  "hypothesis_steps": [
    {
      "id": "step1",
      "title": "...",
      "prompt": "...",
      "guidance": "...",
      "ideal_response": "...",
      "evaluation_criteria": ["..."],
      "max_words": 300
    }
  ]
}
```

#### **Structured MBB Structure:**

```json
{
  "structured_input": {
    "instructions": "...",
    "mbb_criteria": [
      {
        "id": "problemstrukturierung",
        "title": "Problemstrukturierung",
        "prompt": "...",
        "guidance": "...",
        "ideal_response": "...",
        "max_words": 400
      }
    ]
  }
}
```

#### **Hint System Structure:**

```json
{
  "help_system": {
    "available": true,
    "type": "selective_hints",
    "total_hints": 5,
    "user_selectable": 3,
    "hint_categories": [
      {
        "id": "financial",
        "title": "Financial Due Diligence",
        "description": "..."
      }
    ],
    "hints": {
      "financial": ["Hint 1", "Hint 2"]
    }
  }
}
```

## 🗄️ **DATENBANK-SCHEMA DESIGN**

### **Minimale, pragmatische Lösung:**

#### **foundation_cases Tabelle:**

```sql
CREATE TABLE foundation_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'foundation',
  cluster TEXT NOT NULL,
  tool TEXT NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 12),
  estimated_duration INTEGER NOT NULL,
  interaction_type TEXT NOT NULL,
  content JSONB NOT NULL, -- Kompletter Case-Content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **foundation_responses Tabelle:**

```sql
CREATE TABLE foundation_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES foundation_cases(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  responses JSONB NOT NULL, -- User Antworten
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, case_id) -- Ein User kann einen Case nur einmal bearbeiten
);
```

#### **foundation_assessments Tabelle:**

```sql
CREATE TABLE foundation_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES foundation_responses(id) ON DELETE CASCADE,
  assessment_data JSONB NOT NULL, -- GPT Assessment Results
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  criteria_scores JSONB, -- Scores per MBB criterion
  feedback JSONB, -- Detailed feedback
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **foundation_progress Tabelle:**

```sql
CREATE TABLE foundation_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cases_completed INTEGER DEFAULT 0,
  cases_total INTEGER DEFAULT 12,
  current_case_id TEXT REFERENCES foundation_cases(id),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_data JSONB -- Additional progress metrics
);
```

### **RLS Policies:**

```sql
-- foundation_cases: Alle können lesen
ALTER TABLE foundation_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "foundation_cases_select" ON foundation_cases FOR SELECT USING (true);

-- foundation_responses: Nur eigene Responses
ALTER TABLE foundation_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "foundation_responses_crud" ON foundation_responses
  USING (auth.uid() = user_id);

-- foundation_assessments: Nur eigene Assessments
ALTER TABLE foundation_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "foundation_assessments_select" ON foundation_assessments FOR SELECT
  USING (auth.uid() = (SELECT user_id FROM foundation_responses WHERE id = response_id));

-- foundation_progress: Nur eigener Progress
ALTER TABLE foundation_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "foundation_progress_crud" ON foundation_progress
  USING (auth.uid() = user_id);
```

## 🔌 **API-ENDPUNKTE DESIGN**

### **Minimale API-Struktur:**

#### **1. GET /api/foundation/cases**

```typescript
// Alle Foundation Cases abrufen
Response: {
  cases: FoundationCase[],
  user_progress?: {
    completed_cases: string[],
    current_case: string,
    progress_percentage: number
  }
}
```

#### **2. GET /api/foundation/cases/[id]**

```typescript
// Einzelnen Case abrufen
Response: {
  case: FoundationCase,
  user_response?: FoundationResponse,
  assessment?: FoundationAssessment
}
```

#### **3. POST /api/foundation/submit**

```typescript
// Case-Response einreichen
Request: {
  case_id: string,
  interaction_type: string,
  responses: object // Je nach interaction_type
}
Response: {
  response_id: string,
  assessment: FoundationAssessment
}
```

#### **4. GET /api/foundation/progress**

```typescript
// User Progress abrufen
Response: {
  cases_completed: number,
  cases_total: number,
  completion_percentage: number,
  current_case: string,
  case_progress: {
    case_id: string,
    completed: boolean,
    score?: number,
    completed_at?: string
  }[]
}
```

## 🎨 **FRONTEND-KOMPONENTEN DESIGN**

### **Komponenten-Hierarchie:**

```
FoundationTrackLayout
├── FoundationCasesList
├── FoundationCaseWorkflow
│   ├── CaseScenario
│   ├── CaseToolExplanation
│   ├── InteractionComponent
│   │   ├── MultipleChoiceComponent
│   │   ├── HypothesisStepsComponent
│   │   ├── StructuredMBBComponent
│   │   └── FreeFormComponent
│   ├── HelpSystem
│   │   ├── HintSelector
│   │   └── HintDisplay
│   └── AssessmentDisplay
└── FoundationProgressPage
```

### **Interaction-Components:**

#### **MultipleChoiceComponent:**

```typescript
interface MCProps {
  questions: MCQuestion[];
  onAnswerSubmit: (questionId: string, answerId: string) => void;
  showFeedback: boolean;
}
```

#### **StructuredMBBComponent:**

```typescript
interface MBBProps {
  criteria: MBBCriterion[];
  onResponseSubmit: (criterionId: string, response: string) => void;
  maxWords: { [criterionId: string]: number };
}
```

#### **HelpSystem:**

```typescript
interface HelpSystemProps {
  helpConfig: HelpSystemConfig;
  selectedCategories: string[];
  onHintRequest: (category: string) => void;
}
```

## 📦 **ARBEITSPAKET-BREAKDOWN MIT RISIKO/AUFWAND-BEWERTUNG**

### **ARBEITSPAKET 1: Datenbank-Setup**

**Beschreibung:** Foundation Cases Datenbank-Schema implementieren
**Aufwand:** 🟡 Mittel (1-2 Tage)
**Risiko:** 🟢 Niedrig
**Abhängigkeiten:** Keine
**Deliverables:**

- Migration Script für 4 neue Tabellen
- RLS Policies implementiert
- Seed-Script für alle 12 Cases
- Backup der bestehenden DB

**Risiko-Mitigation:**

- Separate Migration-Dateien für Rollback
- Staging-Environment testen
- Bestehende Tabellen nicht ändern

---

### **ARBEITSPAKET 2: API-Endpunkte**

**Beschreibung:** 4 Foundation Track API-Endpunkte implementieren
**Aufwand:** 🟡 Mittel (2-3 Tage)
**Risiko:** 🟡 Mittel (GPT-Integration)
**Abhängigkeiten:** AP1 (Datenbank)
**Deliverables:**

- GET /api/foundation/cases
- GET /api/foundation/cases/[id]
- POST /api/foundation/submit (mit GPT-Assessment)
- GET /api/foundation/progress

**Risiko-Mitigation:**

- Bestehende assess-response.ts als Vorlage
- Error-Handling für GPT-Ausfälle
- Rate-Limiting implementieren
- Fallback für Assessment-Fehler

---

### **ARBEITSPAKET 3: Base Components**

**Beschreibung:** Grundlegende Foundation Track Komponenten
**Aufwand:** 🟡 Mittel (2-3 Tage)
**Risiko:** 🟢 Niedrig
**Abhängigkeiten:** AP2 (APIs)
**Deliverables:**

- FoundationTrackLayout
- FoundationCasesList
- CaseScenario & ToolExplanation
- FoundationProgressPage

**Risiko-Mitigation:**

- Bestehende Case-Komponenten als Vorlage
- Responsive Design von Anfang an
- TypeScript für Type-Safety

---

### **ARBEITSPAKET 4: Interaction Components**

**Beschreibung:** Spezifische Interaction-Type Komponenten
**Aufwand:** 🔴 Hoch (3-4 Tage)
**Risiko:** 🟡 Mittel (Komplexität)
**Abhängigkeiten:** AP3 (Base Components)
**Deliverables:**

- MultipleChoiceComponent (mit Feedback)
- HypothesisStepsComponent
- StructuredMBBComponent
- FreeFormComponent
- HelpSystem (HintSelector + Display)

**Risiko-Mitigation:**

- Schrittweise Entwicklung (MC → MBB → Hints)
- Umfangreiche Tests für jede Interaction
- Fallback für unbekannte Interaction-Types

---

### **ARBEITSPAKET 5: Assessment Integration**

**Beschreibung:** GPT-basierte Assessment-Engine für Foundation Cases
**Aufwand:** 🟡 Mittel (2 Tage)
**Risiko:** 🔴 Hoch (GPT-Qualität)
**Abhängigkeiten:** AP2 (APIs), AP4 (Interactions)
**Deliverables:**

- Assessment-Logic für alle Interaction-Types
- Feedback-Generation
- Score-Calculation
- AssessmentDisplay Component

**Risiko-Mitigation:**

- Extensive Prompt-Testing
- Fallback-Bewertungen definieren
- Human-Review für erste Cases
- A/B-Testing verschiedener Prompts

---

### **ARBEITSPAKET 6: Navigation & Integration**

**Beschreibung:** Foundation Track in bestehende App integrieren
**Aufwand:** 🟢 Niedrig (1 Tag)
**Risiko:** 🟢 Niedrig
**Abhängigkeiten:** AP3 (Components)
**Deliverables:**

- Navigation in UnifiedHeader
- Routing zu Foundation Track
- User-Flow von Onboarding zu Foundation
- Progress-Tracking Integration

**Risiko-Mitigation:**

- Bestehende Navigation-Patterns nutzen
- Keine Breaking Changes
- Feature-Flag für schrittweisen Rollout

---

### **ARBEITSPAKET 7: Testing & Polish**

**Beschreibung:** QA, Performance-Optimierung, Bug-Fixes
**Aufwand:** 🟡 Mittel (2 Tage)
**Risiko:** 🟢 Niedrig
**Abhängigkeiten:** AP1-6 (Alle)
**Deliverables:**

- End-to-End Tests für alle Case-Types
- Performance-Optimierung
- Mobile-Responsiveness
- Accessibility-Compliance
- Documentation

**Risiko-Mitigation:**

- Automated Testing Setup
- Performance-Monitoring
- Cross-Browser Testing
- User-Acceptance Testing

## 📊 **GESAMTAUFWAND & TIMELINE**

### **Aufwand-Schätzung:**

- **Gesamt:** 13-18 Tage
- **Kritischer Pfad:** AP1 → AP2 → AP3 → AP4 → AP5
- **Parallelisierbar:** AP6 + AP7 nach AP4

### **Risiko-Assessment:**

- **Höchstes Risiko:** AP5 (GPT-Assessment-Qualität)
- **Mittleres Risiko:** AP2 (API-Komplexität), AP4 (Interaction-Komplexität)
- **Niedrigstes Risiko:** AP1, AP3, AP6, AP7

### **Empfohlene Reihenfolge:**

1. **Woche 1:** AP1 + AP2 (Datenbank + APIs)
2. **Woche 2:** AP3 + AP4 (Components + Interactions)
3. **Woche 3:** AP5 + AP6 + AP7 (Assessment + Integration + Testing)

### **Erfolgs-Kriterien:**

- ✅ Alle 12 Cases technisch lauffähig
- ✅ Alle 4 Interaction-Types funktional
- ✅ GPT-Assessment für alle Cases
- ✅ Progress-Tracking vollständig
- ✅ Mobile-responsive Design
- ✅ Keine Breaking Changes für bestehende Features

## 🚀 **NÄCHSTE SCHRITTE**

1. **User-Approval** für Architektur und Arbeitspaket-Plan
2. **AP1 starten:** Datenbank-Migration entwickeln
3. **Staging-Environment** für Foundation Track Setup
4. **Parallel:** Case-Content in Datenbank importieren
5. **Iterative Entwicklung** mit wöchentlichen Reviews

---

**FAZIT:** Pragmatische, risikoarme Architektur mit klarer Arbeitspaket-Struktur. Fokus auf Wiederverwendung bestehender Patterns und schrittweise Integration ohne Over-Engineering.
