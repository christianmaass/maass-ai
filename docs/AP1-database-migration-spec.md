# AP1: Foundation Track Datenbank-Migration - DETAILLIERTE SPEZIFIKATION

## 📋 **ARBEITSPAKET-ÜBERSICHT**

- **ID**: AP1
- **Name**: Foundation Track Datenbank-Setup
- **Aufwand**: 🟡 Mittel (1-2 Tage)
- **Risiko**: 🟢 Niedrig
- **Abhängigkeiten**: Keine
- **Freigabe-Status**: ⏳ Wartet auf User-Approval

## 🎯 **ZIELE & SUCCESS-KRITERIEN**

### **Primäre Ziele:**

1. ✅ 4 neue Foundation-spezifische Tabellen erstellen
2. ✅ Konsistenz mit bestehendem Schema gewährleisten
3. ✅ RLS-Policies für sichere Datentrennung implementieren
4. ✅ Alle 12 Foundation Cases als Seed-Data importieren
5. ✅ Performance-Indizes für optimale Query-Performance

### **Success-Kriterien:**

- [ ] Migration läuft fehlerfrei in Staging-Environment
- [ ] Alle 12 Cases erfolgreich importiert
- [ ] RLS-Tests bestehen (User kann nur eigene Daten sehen)
- [ ] Keine Auswirkung auf bestehende Tabellen/Funktionalität
- [ ] Rollback-Script funktioniert einwandfrei

## 🗄️ **DATENBANK-SCHEMA DESIGN**

### **KONSISTENZ-ANALYSE MIT BESTEHENDEM SCHEMA:**

#### **Bestehende Tabellen (UNVERÄNDERT):**

```sql
-- Für dynamische/AI-generierte Cases
cases (id UUID, case_type_id, title, description, context, difficulty, estimated_time_minutes)
user_responses (id UUID, user_id, case_id, response_text, time_spent_seconds)
assessments (id UUID, user_id, case_id, user_response_id, scores JSONB, feedback TEXT)
user_progress (id UUID, user_id, completed_cases INT, average_score DECIMAL)
```

#### **Neue Foundation-Tabellen (SEPARATE & UNABHÄNGIG):**

### **1. foundation_cases Tabelle**

```sql
CREATE TABLE foundation_cases (
  id TEXT PRIMARY KEY, -- 'case-01', 'case-02', etc. (human-readable)
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'foundation',
  cluster TEXT NOT NULL, -- 'Leistung & Wirtschaftlichkeit', etc.
  tool TEXT NOT NULL, -- 'Profit Tree', 'MECE-Prinzip', etc.
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 12),
  estimated_duration INTEGER NOT NULL, -- Minuten
  interaction_type TEXT NOT NULL CHECK (
    interaction_type IN (
      'multiple_choice_with_hypotheses',
      'structured_mbb',
      'free_form_with_hints',
      'minimal_support'
    )
  ),
  content JSONB NOT NULL, -- Kompletter Case-Content aus JSON-Dateien
  learning_objectives TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Design-Rationale:**

- **TEXT ID statt UUID**: Human-readable IDs für einfachere Referenzierung
- **JSONB Content**: Flexible Speicherung aller Case-Varianten ohne Schema-Änderungen
- **CHECK Constraints**: Datenintegrität für difficulty und interaction_type
- **Separate von cases**: Klare Trennung statisch vs. dynamisch

### **2. foundation_responses Tabelle**

```sql
CREATE TABLE foundation_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES foundation_cases(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  responses JSONB NOT NULL, -- Struktur abhängig von interaction_type
  time_spent_seconds INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ein User kann einen Foundation Case nur einmal bearbeiten
  UNIQUE(user_id, case_id)
);
```

**Response-Strukturen je Interaction-Type:**

```json
// multiple_choice_with_hypotheses
{
  "multiple_choice": {
    "mc1": "a",
    "mc2": "c",
    "mc3": "b"
  },
  "hypotheses": {
    "step1": "User hypothesis text...",
    "step2": "User hypothesis text..."
  }
}

// structured_mbb
{
  "mbb_criteria": {
    "problemstrukturierung": "User analysis...",
    "hypothesenbildung": "User hypotheses...",
    "analyse": "User analysis...",
    "synthese": "User synthesis...",
    "kommunikation": "User communication..."
  }
}

// free_form_with_hints
{
  "selected_hint_categories": ["financial", "commercial", "technical"],
  "mbb_response": {
    "problemstrukturierung": "...",
    "hypothesenbildung": "...",
    "analyse": "...",
    "synthese": "...",
    "kommunikation": "..."
  },
  "hints_used": ["financial_hint_1", "commercial_hint_2"]
}
```

### **3. foundation_assessments Tabelle**

```sql
CREATE TABLE foundation_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES foundation_responses(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  assessment_data JSONB NOT NULL, -- GPT Assessment Results
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  criteria_scores JSONB, -- Scores per criterion/question
  feedback JSONB NOT NULL, -- Structured feedback
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Assessment-Strukturen je Interaction-Type:**

```json
// multiple_choice_with_hypotheses
{
  "mc_scores": {
    "mc1": { "correct": true, "points": 1 },
    "mc2": { "correct": false, "points": 0 }
  },
  "hypothesis_scores": {
    "step1": {
      "score": 85,
      "feedback": "Sehr gute Strukturierung...",
      "criteria": ["clarity", "logic", "completeness"]
    }
  }
}

// structured_mbb / free_form
{
  "mbb_scores": {
    "problemstrukturierung": {
      "score": 78,
      "feedback": "Gute Analyse, aber...",
      "strengths": ["..."],
      "improvements": ["..."]
    }
  }
}
```

### **4. foundation_progress Tabelle**

```sql
CREATE TABLE foundation_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cases_completed INTEGER DEFAULT 0 CHECK (cases_completed >= 0 AND cases_completed <= 12),
  cases_total INTEGER DEFAULT 12,
  current_case_id TEXT REFERENCES foundation_cases(id),
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  average_score DECIMAL(5,2),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_data JSONB DEFAULT '{}', -- Additional metrics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Progress-Data Struktur:**

```json
{
  "case_scores": {
    "case-01": { "score": 85, "completed_at": "2024-01-15T10:30:00Z" },
    "case-02": { "score": 92, "completed_at": "2024-01-16T14:20:00Z" }
  },
  "cluster_progress": {
    "Leistung & Wirtschaftlichkeit": { "completed": 3, "total": 3, "avg_score": 88.5 }
  },
  "learning_streaks": {
    "current_streak": 5,
    "longest_streak": 8
  }
}
```

## 🔐 **ROW LEVEL SECURITY (RLS) POLICIES**

### **foundation_cases (Public Read-Only):**

```sql
ALTER TABLE foundation_cases ENABLE ROW LEVEL SECURITY;

-- Alle authentifizierten User können alle Foundation Cases lesen
CREATE POLICY "foundation_cases_select_authenticated"
ON foundation_cases FOR SELECT
TO authenticated
USING (true);

-- Nur Admins können Foundation Cases erstellen/ändern
CREATE POLICY "foundation_cases_admin_crud"
ON foundation_cases FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### **foundation_responses (User-Specific):**

```sql
ALTER TABLE foundation_responses ENABLE ROW LEVEL SECURITY;

-- User können nur eigene Responses sehen
CREATE POLICY "foundation_responses_select_own"
ON foundation_responses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- User können eigene Responses erstellen
CREATE POLICY "foundation_responses_insert_own"
ON foundation_responses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- User können eigene Responses NICHT updaten (Integrität)
-- Admins können alle Responses sehen (für Support)
CREATE POLICY "foundation_responses_admin_select"
ON foundation_responses FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### **foundation_assessments (Read-Only für User):**

```sql
ALTER TABLE foundation_assessments ENABLE ROW LEVEL SECURITY;

-- User können nur Assessments ihrer eigenen Responses sehen
CREATE POLICY "foundation_assessments_select_own"
ON foundation_assessments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM foundation_responses
    WHERE id = response_id AND user_id = auth.uid()
  )
);

-- Nur Service Role kann Assessments erstellen (via API)
CREATE POLICY "foundation_assessments_service_insert"
ON foundation_assessments FOR INSERT
TO service_role
WITH CHECK (true);

-- Admins können alle Assessments sehen
CREATE POLICY "foundation_assessments_admin_select"
ON foundation_assessments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### **foundation_progress (User-Specific):**

```sql
ALTER TABLE foundation_progress ENABLE ROW LEVEL SECURITY;

-- User können nur eigenen Progress sehen/ändern
CREATE POLICY "foundation_progress_crud_own"
ON foundation_progress FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service Role kann Progress updaten (via API)
CREATE POLICY "foundation_progress_service_update"
ON foundation_progress FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Admins können allen Progress sehen
CREATE POLICY "foundation_progress_admin_select"
ON foundation_progress FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## 📊 **PERFORMANCE-INDIZES**

```sql
-- Foundation Cases Queries optimieren
CREATE INDEX idx_foundation_cases_difficulty ON foundation_cases(difficulty);
CREATE INDEX idx_foundation_cases_cluster ON foundation_cases(cluster);
CREATE INDEX idx_foundation_cases_interaction_type ON foundation_cases(interaction_type);

-- Foundation Responses Queries optimieren
CREATE INDEX idx_foundation_responses_user_id ON foundation_responses(user_id);
CREATE INDEX idx_foundation_responses_case_id ON foundation_responses(case_id);
CREATE INDEX idx_foundation_responses_submitted_at ON foundation_responses(submitted_at);

-- Foundation Assessments Queries optimieren
CREATE INDEX idx_foundation_assessments_response_id ON foundation_assessments(response_id);
CREATE INDEX idx_foundation_assessments_overall_score ON foundation_assessments(overall_score);

-- Foundation Progress Queries optimieren
CREATE INDEX idx_foundation_progress_last_activity ON foundation_progress(last_activity);
CREATE INDEX idx_foundation_progress_completion ON foundation_progress(completion_percentage);
```

## 📥 **SEED-DATA IMPORT**

### **Foundation Cases Import-Script:**

```sql
-- Import aller 12 Foundation Cases aus JSON-Dateien
INSERT INTO foundation_cases (id, title, category, cluster, tool, difficulty, estimated_duration, interaction_type, content, learning_objectives) VALUES
('case-01', 'Profit Tree Analyse', 'foundation', 'Leistung & Wirtschaftlichkeit', 'Profit Tree', 1, 15, 'multiple_choice_with_hypotheses',
 -- JSON Content aus case-01-profit-tree.json
 '{ ... }',
 ARRAY['Profit Tree Methodik verstehen', 'Problemdiagnose durchführen', 'Strukturierte Analyse anwenden']
),
('case-02', 'MECE-Prinzip Anwendung', 'foundation', 'Leistung & Wirtschaftlichkeit', 'MECE-Prinzip', 2, 20, 'multiple_choice_with_hypotheses',
 -- JSON Content aus case-02-mece-optimization.json
 '{ ... }',
 ARRAY['MECE-Prinzip verstehen', 'Strukturierte Problemzerlegung', 'Optimierungsansätze entwickeln']
),
-- ... weitere 10 Cases
;
```

## 🔄 **MIGRATION & ROLLBACK STRATEGIE**

### **Migration-Script: `001_foundation_track_setup.sql`**

```sql
-- =====================================================
-- FOUNDATION TRACK MIGRATION - PHASE 1
-- =====================================================
-- Erstellt alle Foundation Track Tabellen und Policies
-- SAFE: Keine Änderungen an bestehenden Tabellen

BEGIN;

-- 1. Tabellen erstellen
-- [Alle CREATE TABLE Statements von oben]

-- 2. RLS Policies erstellen
-- [Alle RLS Policy Statements von oben]

-- 3. Indizes erstellen
-- [Alle CREATE INDEX Statements von oben]

-- 4. Trigger für updated_at erstellen
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_foundation_cases_updated_at
    BEFORE UPDATE ON foundation_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foundation_progress_updated_at
    BEFORE UPDATE ON foundation_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### **Rollback-Script: `001_foundation_track_rollback.sql`**

```sql
-- =====================================================
-- FOUNDATION TRACK ROLLBACK
-- =====================================================
-- Entfernt alle Foundation Track Änderungen

BEGIN;

-- 1. Trigger entfernen
DROP TRIGGER IF EXISTS update_foundation_cases_updated_at ON foundation_cases;
DROP TRIGGER IF EXISTS update_foundation_progress_updated_at ON foundation_progress;

-- 2. Tabellen entfernen (in umgekehrter Abhängigkeits-Reihenfolge)
DROP TABLE IF EXISTS foundation_assessments CASCADE;
DROP TABLE IF EXISTS foundation_responses CASCADE;
DROP TABLE IF EXISTS foundation_progress CASCADE;
DROP TABLE IF EXISTS foundation_cases CASCADE;

-- 3. Funktion entfernen (falls nicht anderweitig verwendet)
-- DROP FUNCTION IF EXISTS update_updated_at_column(); -- VORSICHT: Wird evtl. anderweitig verwendet

COMMIT;
```

## 🧪 **TESTING-STRATEGIE**

### **1. Schema-Validierung:**

```sql
-- Teste Tabellen-Erstellung
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_name LIKE 'foundation_%';

-- Teste Constraints
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name LIKE 'foundation_%';
```

### **2. RLS-Tests:**

```sql
-- Test 1: User kann nur eigene Responses sehen
-- Test 2: Admin kann alle Responses sehen
-- Test 3: Service Role kann Assessments erstellen
-- Test 4: User kann Foundation Cases lesen
```

### **3. Performance-Tests:**

```sql
-- Test Query-Performance mit Indizes
EXPLAIN ANALYZE SELECT * FROM foundation_cases WHERE difficulty = 5;
EXPLAIN ANALYZE SELECT * FROM foundation_responses WHERE user_id = 'test-uuid';
```

## 📋 **DELIVERABLES CHECKLIST**

### **Code-Deliverables:**

- [ ] `001_foundation_track_setup.sql` - Migration-Script
- [ ] `001_foundation_track_rollback.sql` - Rollback-Script
- [ ] `seed_foundation_cases.sql` - Import aller 12 Cases
- [ ] `test_foundation_schema.sql` - Validierungs-Tests

### **Dokumentation:**

- [ ] Schema-Dokumentation mit ER-Diagramm
- [ ] RLS-Policy Dokumentation
- [ ] Performance-Benchmark Ergebnisse
- [ ] Migration-Anleitung für Staging/Production

### **Validierung:**

- [ ] Staging-Environment Migration erfolgreich
- [ ] Alle 12 Cases erfolgreich importiert
- [ ] RLS-Tests bestanden
- [ ] Performance-Tests bestanden
- [ ] Rollback-Test erfolgreich

## ⚠️ **RISIKEN & MITIGATION**

### **Identifizierte Risiken:**

1. **JSONB Performance**: Große JSON-Objekte könnten Queries verlangsamen
   - **Mitigation**: Indizes auf häufig abgefragte JSON-Felder
2. **RLS Complexity**: Komplexe Policies könnten Performance beeinträchtigen
   - **Mitigation**: Performance-Tests vor Production-Deployment
3. **Migration Failure**: Fehler während Migration könnte DB beschädigen
   - **Mitigation**: Staging-Tests + Backup vor Migration

### **Rollback-Strategie:**

- Vollständiges Rollback-Script getestet
- Backup vor Migration
- Staging-Environment für Tests

## 🎯 **FREIGABE-KRITERIEN**

### **Technische Kriterien:**

- [ ] Schema-Design reviewed und approved
- [ ] RLS-Policies security-reviewed
- [ ] Performance-Impact analysiert
- [ ] Migration/Rollback-Scripts getestet

### **Business-Kriterien:**

- [ ] Konsistenz mit bestehender Architektur bestätigt
- [ ] Skalierbarkeit für 12+ Cases gewährleistet
- [ ] Erweiterbarkeit für zukünftige Features

---

## 🚀 **BEREIT FÜR USER-FREIGABE**

Diese Spezifikation ist **implementierungsreif** und wartet auf deine Freigabe. Nach Approval kann die Implementierung sofort beginnen.

**Nächste Schritte nach Freigabe:**

1. Migration-Scripts erstellen
2. Staging-Environment testen
3. Seed-Data importieren
4. Performance-Validierung
5. Production-Deployment vorbereiten
