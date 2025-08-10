-- ADD STEP CONFIGURATION TO FOUNDATION CASES
-- This migration adds the step_configuration column and sets defaults

-- Step 1: Add the step_configuration column
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS step_configuration JSONB;

-- Step 2: Set default 5-step configuration for all existing cases
UPDATE foundation_cases 
SET step_configuration = '{
  "steps": [
    {
      "id": "step_1_problem",
      "title": "Problemverständnis & Zielklärung",
      "learning_forms": ["multiple_choice"],
      "input_type": "text",
      "ai_enabled": false,
      "skip": false
    },
    {
      "id": "step_2_hypothesis", 
      "title": "Hypothesenbildung",
      "learning_forms": ["framework"],
      "input_type": "text",
      "ai_enabled": false,
      "skip": false
    },
    {
      "id": "step_3_analysis",
      "title": "Analyse und Zahlenarbeit",
      "learning_forms": ["free_text"],
      "input_type": "both",
      "ai_enabled": false,
      "skip": false
    },
    {
      "id": "step_4_synthesis",
      "title": "Synthetisieren & Optionen bewerten",
      "learning_forms": ["tips_hints"],
      "input_type": "text",
      "ai_enabled": false,
      "skip": false
    },
    {
      "id": "step_5_recommendation",
      "title": "Empfehlung & Executive Summary",
      "learning_forms": ["gpt_response"],
      "input_type": "both",
      "ai_enabled": true,
      "skip": false
    }
  ]
}'::jsonb
WHERE step_configuration IS NULL;

-- Step 3: Verification
SELECT 
  id,
  title,
  step_configuration IS NOT NULL as has_step_config,
  jsonb_array_length(step_configuration->'steps') as num_steps
FROM foundation_cases
ORDER BY difficulty;

-- Step 4: Show sample step configuration
SELECT 
  id,
  title,
  jsonb_pretty(step_configuration) as step_config
FROM foundation_cases 
WHERE id = 'foundation-case-1';
