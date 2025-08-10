-- =====================================================
-- DATABASE DEBUG: CONTENT MODULES TABLE VERIFICATION
-- Check if case_content_modules table exists and has correct structure
-- =====================================================

-- 1. Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'case_content_modules';

-- 2. Show table structure (if exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'case_content_modules'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Show all content module records (if table exists)
SELECT 
    id,
    foundation_case_id,
    step_number,
    title,
    content,
    generation_prompt,
    generated_by_gpt,
    created_at,
    updated_at
FROM case_content_modules
ORDER BY created_at DESC
LIMIT 10;

-- 4. Count total records
SELECT COUNT(*) as total_content_modules FROM case_content_modules;
