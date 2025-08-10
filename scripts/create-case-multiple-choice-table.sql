-- Create table for Multiple Choice questions linked to cases and steps
-- This ensures proper relationship between case, step, and MC questions

CREATE TABLE case_multiple_choice (
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
CREATE INDEX idx_case_mc_case_step ON case_multiple_choice(foundation_case_id, step_number);
CREATE INDEX idx_case_mc_case_id ON case_multiple_choice(foundation_case_id);

-- Enable RLS (Row Level Security)
ALTER TABLE case_multiple_choice ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to read, service role to write
CREATE POLICY "Allow authenticated read access" ON case_multiple_choice
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service role full access" ON case_multiple_choice
  FOR ALL TO service_role USING (true);

-- Test the table structure with a real case ID
-- First, get an existing case ID for testing
DO $$
DECLARE
    test_case_id TEXT;
BEGIN
    -- Get the first available case ID
    SELECT id INTO test_case_id FROM foundation_cases LIMIT 1;
    
    IF test_case_id IS NOT NULL THEN
        -- Insert test data with real case ID
        INSERT INTO case_multiple_choice (
            foundation_case_id, 
            step_number, 
            question_number,
            question,
            option_a,
            option_b, 
            option_c,
            option_d,
            correct_answer,
            explanation
        ) VALUES (
            test_case_id,
            1,
            1,
            'Test question for step 1?',
            'Option A',
            'Option B', 
            'Option C',
            'Option D',
            'B',
            'Option B is correct because...'
        );
        
        -- Verify the insert worked
        RAISE NOTICE 'Test insert successful for case ID: %', test_case_id;
        
        -- Clean up test data immediately
        DELETE FROM case_multiple_choice WHERE foundation_case_id = test_case_id AND question = 'Test question for step 1?';
        
        RAISE NOTICE 'Test data cleaned up successfully';
    ELSE
        RAISE NOTICE 'No foundation cases found - skipping test insert';
    END IF;
END $$;

COMMENT ON TABLE case_multiple_choice IS 'Multiple Choice questions for foundation cases, organized by case and processing step (1-5)';
COMMENT ON COLUMN case_multiple_choice.step_number IS 'Case processing step: 1=Problemverständnis, 2=Strukturierung, 3=Analyse, 4=Synthetisieren, 5=Empfehlung';
COMMENT ON COLUMN case_multiple_choice.question_number IS 'Question number within the step (1-3, as per requirement)';
