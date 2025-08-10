-- =====================================================
-- ADD CASE_QUESTION FIELD TO FOUNDATION_CASES
-- =====================================================
-- Migration: 002_add_case_question_field
-- Purpose: Add case_question field to store generated questions
-- Date: 2025-01-31

-- Add case_question field to foundation_cases table
ALTER TABLE foundation_cases 
ADD COLUMN IF NOT EXISTS case_question TEXT;

-- Add case_description field if it doesn't exist (for completeness)
ALTER TABLE foundation_cases 
ADD COLUMN IF NOT EXISTS case_description TEXT;

-- Add index for performance on case_description and case_question searches
CREATE INDEX IF NOT EXISTS idx_foundation_cases_case_description 
ON foundation_cases USING gin(to_tsvector('english', case_description));

CREATE INDEX IF NOT EXISTS idx_foundation_cases_case_question 
ON foundation_cases USING gin(to_tsvector('english', case_question));

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'foundation_cases' 
AND column_name IN ('case_description', 'case_question');
