-- Create table for Free Text responses with GPT feedback
-- This supports hypothesis formulation and other free text exercises

CREATE TABLE IF NOT EXISTS case_free_text_responses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  foundation_case_id TEXT NOT NULL REFERENCES foundation_cases(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 5),
  
  -- User input
  user_response TEXT NOT NULL,
  prompt_text TEXT NOT NULL, -- The prompt/question shown to user
  
  -- GPT feedback
  gpt_feedback JSONB, -- Contains: score, feedback, strengths, improvements, ideal_answer
  feedback_generated_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_case_ft_case_step ON case_free_text_responses(foundation_case_id, step_number);
CREATE INDEX IF NOT EXISTS idx_case_ft_case_id ON case_free_text_responses(foundation_case_id);

-- Enable RLS (Row Level Security)
ALTER TABLE case_free_text_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated read access" ON case_free_text_responses;
DROP POLICY IF EXISTS "Allow service role full access" ON case_free_text_responses;

-- RLS Policy: Allow authenticated users to read, service role to write
CREATE POLICY "Allow authenticated read access" ON case_free_text_responses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service role full access" ON case_free_text_responses
  FOR ALL TO service_role USING (true);

-- Add helpful comments
COMMENT ON TABLE case_free_text_responses IS 'Free text responses from users with GPT-generated feedback and ideal answers';
COMMENT ON COLUMN case_free_text_responses.step_number IS 'Case processing step: 1=Problemverständnis, 2=Strukturierung, 3=Analyse, 4=Synthetisieren, 5=Empfehlung';
COMMENT ON COLUMN case_free_text_responses.gpt_feedback IS 'JSON containing: score (0-10), feedback (string), strengths (array), improvements (array), ideal_answer (string)';

-- Success message
SELECT 'case_free_text_responses table created successfully!' as result;
