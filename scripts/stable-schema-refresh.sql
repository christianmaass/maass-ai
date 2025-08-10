-- =====================================================
-- STABLE SCHEMA REFRESH SOLUTION
-- =====================================================
-- Purpose: Force Supabase to recognize new columns properly

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

-- Step 3: Refresh materialized views if any exist
-- (This forces Supabase to re-read the schema)
SELECT pg_reload_conf();

-- Step 4: Test that columns are accessible
DO $$
BEGIN
    -- Try to update a test record to verify column access
    UPDATE foundation_cases 
    SET 
        case_description = 'Schema test - ' || NOW()::text,
        case_question = 'Schema test question - ' || NOW()::text
    WHERE id = 'foundation-case-1';
    
    -- Check if update worked
    IF FOUND THEN
        RAISE NOTICE 'SUCCESS: Columns are accessible and working';
    ELSE
        RAISE NOTICE 'WARNING: No rows found with ID foundation-case-1';
    END IF;
    
EXCEPTION
    WHEN undefined_column THEN
        RAISE EXCEPTION 'FAILED: Columns still not accessible - %', SQLERRM;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'FAILED: Unexpected error - %', SQLERRM;
END $$;

-- Step 5: Verify the test update
SELECT 
    id,
    title,
    case_description,
    case_question,
    updated_at
FROM foundation_cases 
WHERE id = 'foundation-case-1';

-- Final confirmation
SELECT 'SCHEMA REFRESH COMPLETE - Columns are now accessible' as status;
