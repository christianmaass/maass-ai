-- Simplified script for Supabase: Create Multiple Choice table
-- This version avoids PostgreSQL functions not available in Supabase

-- Create table for Multiple Choice questions
CREATE TABLE IF NOT EXISTS case_multiple_choice (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  foundation_case_id TEXT NOT NULL REFERENCES foundation_cases(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 5),
  question_number INTEGER NOT NULL CHECK (question_number BETWEEN 1 AND 3),
  
  -- Question content
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL, 
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  
  -- Generation metadata
  generated_by_gpt BOOLEAN DEFAULT true,
  generation_prompt TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combination of case + step + question number
  UNIQUE(foundation_case_id, step_number, question_number)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_case_mc_case_step ON case_multiple_choice(foundation_case_id, step_number);
CREATE INDEX IF NOT EXISTS idx_case_mc_case_id ON case_multiple_choice(foundation_case_id);

-- Enable RLS (Row Level Security)
ALTER TABLE case_multiple_choice ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated read access" ON case_multiple_choice;
DROP POLICY IF EXISTS "Allow service role full access" ON case_multiple_choice;

-- RLS Policy: Allow authenticated users to read, service role to write
CREATE POLICY "Allow authenticated read access" ON case_multiple_choice
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service role full access" ON case_multiple_choice
  FOR ALL TO service_role USING (true);

-- Add helpful comments
COMMENT ON TABLE case_multiple_choice IS 'Multiple Choice questions for foundation cases, organized by case and processing step (1-5)';
COMMENT ON COLUMN case_multiple_choice.step_number IS 'Case processing step: 1=Problemverständnis, 2=Strukturierung, 3=Analyse, 4=Synthetisieren, 5=Empfehlung';
COMMENT ON COLUMN case_multiple_choice.question_number IS 'Question number within the step (1-3, as per requirement)';

-- Success message
SELECT 'case_multiple_choice table created successfully!' as result;
