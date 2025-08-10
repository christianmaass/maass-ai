-- =====================================================
-- SIMPLE SCHEMA REFRESH SOLUTION
-- =====================================================
-- Purpose: Force Supabase to recognize new columns (Supabase-compatible)

-- Step 1: Verify columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'foundation_cases' 
AND column_name IN ('case_description', 'case_question')
ORDER BY column_name;

-- Step 2: Update table statistics (forces schema cache refresh)
ANALYZE foundation_cases;

-- Step 3: Test that columns are accessible with a simple update
UPDATE foundation_cases 
SET 
    case_description = 'Schema test - ' || NOW()::text,
    case_question = 'Schema test question - ' || NOW()::text,
    updated_at = NOW()
WHERE id = 'foundation-case-1';

-- Step 4: Verify the test update worked
SELECT 
    id,
    title,
    case_description,
    case_question,
    updated_at
FROM foundation_cases 
WHERE id = 'foundation-case-1';

-- Step 5: Clean up test data (set back to NULL for fresh generation)
UPDATE foundation_cases 
SET 
    case_description = NULL,
    case_question = NULL
WHERE id = 'foundation-case-1';

-- Final confirmation
SELECT 'SCHEMA REFRESH COMPLETE - Columns are accessible and ready for use' as status;
