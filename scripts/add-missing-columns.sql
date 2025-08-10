-- =====================================================
-- ADD MISSING COLUMNS TO FOUNDATION_CASES
-- =====================================================
-- Purpose: Add case_description and case_question columns to the actual database schema

-- Step 1: Check current schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'foundation_cases' 
ORDER BY ordinal_position;

-- Step 2: Add the missing columns
ALTER TABLE foundation_cases 
ADD COLUMN IF NOT EXISTS case_description TEXT;

ALTER TABLE foundation_cases 
ADD COLUMN IF NOT EXISTS case_question TEXT;

-- Step 3: Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'foundation_cases' 
AND column_name IN ('case_description', 'case_question')
ORDER BY column_name;

-- Step 4: Test that columns work with a simple update
UPDATE foundation_cases 
SET 
    case_description = 'Migration test - ' || NOW()::text,
    case_question = 'Migration test question - ' || NOW()::text
WHERE id = 'foundation-case-1';

-- Step 5: Verify the update worked
SELECT 
    id,
    title,
    case_description,
    case_question
FROM foundation_cases 
WHERE id = 'foundation-case-1';

-- Step 6: Clean up test data
UPDATE foundation_cases 
SET 
    case_description = NULL,
    case_question = NULL
WHERE id = 'foundation-case-1';

-- Final confirmation
SELECT 'MIGRATION COMPLETE - Columns added successfully' as status;
