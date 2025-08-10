-- =====================================================
-- DATABASE DEBUG: TEXT INPUT DATA VERIFICATION
-- Check what's actually stored in case_text_inputs table
-- =====================================================

-- 1. Show ALL text input records
SELECT 
    id,
    foundation_case_id,
    step_number,
    user_id,
    user_input,
    explanation,
    created_at,
    updated_at
FROM case_text_inputs
ORDER BY created_at DESC;

-- 3. Show records specifically for foundation-case-1, step 1
SELECT 
    id,
    foundation_case_id,
    step_number,
    user_id,
    user_input,
    explanation,
    created_at,
    updated_at
FROM case_text_inputs
WHERE foundation_case_id = 'foundation-case-1' 
  AND step_number = 1
ORDER BY created_at DESC;

-- 4. Count total records
SELECT COUNT(*) as total_records FROM case_text_inputs;

-- 5. Count records by case and step
SELECT 
    foundation_case_id,
    step_number,
    COUNT(*) as record_count
FROM case_text_inputs
GROUP BY foundation_case_id, step_number
ORDER BY foundation_case_id, step_number;

-- 6. Show user_profiles to verify user_id values
SELECT id, email, created_at FROM user_profiles ORDER BY created_at DESC LIMIT 5;
