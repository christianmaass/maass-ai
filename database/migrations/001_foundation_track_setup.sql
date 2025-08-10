-- =====================================================
-- FOUNDATION TRACK MIGRATION - PHASE 1
-- =====================================================
-- Erstellt alle Foundation Track Tabellen und Policies
-- SAFE: Keine Änderungen an bestehenden Tabellen
-- 
-- AUSFÜHRUNG: In Supabase SQL Editor ausführen
-- ROLLBACK: 001_foundation_track_rollback.sql verwenden
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: FOUNDATION CASES TABLE
-- =====================================================

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

-- =====================================================
-- STEP 2: FOUNDATION RESPONSES TABLE
-- =====================================================

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

-- =====================================================
-- STEP 3: FOUNDATION ASSESSMENTS TABLE
-- =====================================================

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

-- =====================================================
-- STEP 4: FOUNDATION PROGRESS TABLE
-- =====================================================

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

-- =====================================================
-- STEP 5: PERFORMANCE INDEXES
-- =====================================================

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

-- =====================================================
-- STEP 6: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Foundation Cases (Public Read-Only)
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

-- Foundation Responses (User-Specific)
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

-- Foundation Assessments (Read-Only für User)
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

-- Foundation Progress (User-Specific)
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

-- =====================================================
-- STEP 7: TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Trigger-Funktion für updated_at (falls nicht bereits vorhanden)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger für foundation_cases
CREATE TRIGGER update_foundation_cases_updated_at 
    BEFORE UPDATE ON foundation_cases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger für foundation_progress
CREATE TRIGGER update_foundation_progress_updated_at 
    BEFORE UPDATE ON foundation_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 8: VALIDATION
-- =====================================================

-- Validiere dass alle Tabellen erstellt wurden
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'foundation_cases') THEN
        RAISE EXCEPTION 'foundation_cases table was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'foundation_responses') THEN
        RAISE EXCEPTION 'foundation_responses table was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'foundation_assessments') THEN
        RAISE EXCEPTION 'foundation_assessments table was not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'foundation_progress') THEN
        RAISE EXCEPTION 'foundation_progress table was not created';
    END IF;
    
    RAISE NOTICE 'Foundation Track migration completed successfully!';
END $$;

COMMIT;

-- =====================================================
-- MIGRATION COMPLETED
-- =====================================================
-- 
-- NÄCHSTE SCHRITTE:
-- 1. Führe seed_foundation_cases.sql aus um Cases zu importieren
-- 2. Teste RLS-Policies mit test_foundation_schema.sql
-- 3. Validiere Performance mit EXPLAIN ANALYZE
-- 
-- Bei Problemen: Verwende 001_foundation_track_rollback.sql
-- =====================================================
