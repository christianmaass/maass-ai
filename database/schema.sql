-- Case/Assessment Feature Database Schema
-- Führe diese SQL-Befehle in deiner Supabase-Konsole aus

-- 1. Case Types Tabelle (10 Standard-Falltypen)
CREATE TABLE case_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  framework_hints TEXT,
  difficulty_level INTEGER DEFAULT 1, -- 1-5 Schwierigkeitsgrad
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Cases Tabelle
CREATE TABLE cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_type_id UUID REFERENCES case_types(id),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  context TEXT, -- Zusätzlicher Kontext für den Fall
  difficulty INTEGER DEFAULT 1,
  estimated_time_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Responses Tabelle
CREATE TABLE user_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Referenz zu auth.users
  case_id UUID REFERENCES cases(id),
  response_text TEXT NOT NULL,
  time_spent_seconds INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Assessments Tabelle
CREATE TABLE assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  case_id UUID REFERENCES cases(id),
  user_response_id UUID REFERENCES user_responses(id),
  scores JSONB NOT NULL, -- {"problemstrukturierung": 7, "analytik": 8, ...}
  feedback TEXT NOT NULL,
  total_score DECIMAL(3,1), -- Durchschnittsscore
  improvement_areas TEXT[], -- Array von Schwächen
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Progress Tabelle (für Tracking)
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  completed_cases INTEGER DEFAULT 0,
  average_score DECIMAL(3,1) DEFAULT 0,
  strong_areas TEXT[],
  weak_areas TEXT[],
  last_case_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indizes für Performance
CREATE INDEX idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_case_id ON assessments(case_id);
CREATE INDEX idx_cases_type ON cases(case_type_id);

-- Row Level Security (RLS) aktivieren
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies (User kann nur eigene Daten sehen)
CREATE POLICY "Users can view own responses" ON user_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses" ON user_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);
