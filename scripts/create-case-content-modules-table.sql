-- Create table for Content Modules (Framework introductions, explanations)
-- REUSING same patterns as other case tables

CREATE TABLE IF NOT EXISTS case_content_modules (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  foundation_case_id TEXT NOT NULL REFERENCES foundation_cases(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 5),
  
  -- Content
  title TEXT NOT NULL DEFAULT 'Framework-Einleitung',
  content TEXT NOT NULL,
  image_url TEXT, -- Optional image URL
  
  -- Generation metadata - REUSING same pattern as MC table
  generation_prompt TEXT, -- What user requested to generate
  generated_by_gpt BOOLEAN DEFAULT false,
  
  -- Timestamps - REUSING same pattern
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one content module per case + step
  UNIQUE(foundation_case_id, step_number)
);

-- REUSING same indexing pattern as other tables
CREATE INDEX IF NOT EXISTS idx_case_content_case_step ON case_content_modules(foundation_case_id, step_number);
CREATE INDEX IF NOT EXISTS idx_case_content_case_id ON case_content_modules(foundation_case_id);

-- REUSING same RLS pattern as other tables
ALTER TABLE case_content_modules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated read access" ON case_content_modules;
DROP POLICY IF EXISTS "Allow service role full access" ON case_content_modules;

-- REUSING exact same RLS policies as other tables
CREATE POLICY "Allow authenticated read access" ON case_content_modules
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service role full access" ON case_content_modules
  FOR ALL TO service_role USING (true);

-- Add helpful comments
COMMENT ON TABLE case_content_modules IS 'Content modules for framework introductions and explanations, displayed before exercises';
COMMENT ON COLUMN case_content_modules.step_number IS 'Case processing step: 1=Problemverständnis, 2=Strukturierung, 3=Analyse, 4=Synthetisieren, 5=Empfehlung';
COMMENT ON COLUMN case_content_modules.generation_prompt IS 'User prompt used to generate this content via GPT';

-- Success message
SELECT 'case_content_modules table created successfully!' as result;
