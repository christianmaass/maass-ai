-- =====================================================
-- MODULE CONFIGURATION MIGRATION
-- Adds step_modules column to foundation_cases for modular configuration
-- =====================================================

-- Add step_modules column with default configuration
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS step_modules JSONB DEFAULT '{
  "step1": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": false, "decision_matrix": false, "voice_input": false},
  "step2": {"multiple_choice": true, "content_module": true, "free_text": true, "text_input": false, "decision_matrix": false, "voice_input": false},
  "step3": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": false, "voice_input": false},
  "step4": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": true, "voice_input": false},
  "step5": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": false, "voice_input": true}
}'::jsonb;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_foundation_cases_step_modules ON foundation_cases USING GIN (step_modules);

-- Update existing cases with default configuration if step_modules is null
UPDATE foundation_cases 
SET step_modules = '{
  "step1": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": false, "decision_matrix": false, "voice_input": false},
  "step2": {"multiple_choice": true, "content_module": true, "free_text": true, "text_input": false, "decision_matrix": false, "voice_input": false},
  "step3": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": false, "voice_input": false},
  "step4": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": true, "voice_input": false},
  "step5": {"multiple_choice": true, "content_module": false, "free_text": false, "text_input": true, "decision_matrix": false, "voice_input": true}
}'::jsonb
WHERE step_modules IS NULL;

-- Verify the migration
SELECT id, title, step_modules FROM foundation_cases LIMIT 3;

-- Test query to ensure JSONB operations work
SELECT 
  id, 
  title,
  step_modules->'step1'->>'multiple_choice' as step1_mc,
  step_modules->'step2'->>'content_module' as step2_content
FROM foundation_cases 
LIMIT 2;

COMMIT;
