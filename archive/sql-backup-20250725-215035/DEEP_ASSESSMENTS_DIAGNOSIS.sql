-- DEEP ASSESSMENTS DIAGNOSIS
-- Problem: 400 Bad Request persists after RLS fix
-- Need to check table structure, columns, constraints, data

-- 1. COMPLETE TABLE STRUCTURE
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'assessments' 
ORDER BY ordinal_position;

-- 2. CHECK IF user_response_id COLUMN EXISTS
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.columns 
  WHERE table_name = 'assessments' 
  AND column_name = 'user_response_id'
) as user_response_id_exists;

-- 3. CHECK IF user_id COLUMN EXISTS
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.columns 
  WHERE table_name = 'assessments' 
  AND column_name = 'user_id'
) as user_id_exists;

-- 4. TABLE CONSTRAINTS
SELECT 
  constraint_name,
  constraint_type,
  table_name
FROM information_schema.table_constraints 
WHERE table_name = 'assessments';

-- 5. FOREIGN KEY DETAILS
SELECT 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.key_column_usage kcu
JOIN information_schema.constraint_column_usage ccu
  ON kcu.constraint_name = ccu.constraint_name
WHERE kcu.table_name = 'assessments';

-- 6. SAMPLE DATA (first 3 rows)
SELECT * FROM assessments LIMIT 3;

-- 7. COUNT TOTAL ROWS
SELECT COUNT(*) as total_rows FROM assessments;

-- 8. CHECK FOR SPECIFIC USER_RESPONSE_ID
SELECT COUNT(*) as matching_rows 
FROM assessments 
WHERE user_response_id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- 9. ALTERNATIVE: CHECK user_id IF EXISTS
-- SELECT COUNT(*) as matching_rows_user_id 
-- FROM assessments 
-- WHERE user_id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- 10. TABLE PERMISSIONS
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'assessments';
