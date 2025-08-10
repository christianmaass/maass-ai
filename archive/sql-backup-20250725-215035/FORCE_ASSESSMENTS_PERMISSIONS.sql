-- FORCE ASSESSMENTS PERMISSIONS FIX
-- Problem: Permissions keep getting reset
-- Solution: Force grant permissions with explicit roles

-- 1. REVOKE ALL FIRST (clean slate)
REVOKE ALL ON assessments FROM authenticated;
REVOKE ALL ON assessments FROM anon;
REVOKE ALL ON assessments FROM service_role;

-- 2. GRANT EXPLICIT PERMISSIONS TO AUTHENTICATED
GRANT SELECT ON assessments TO authenticated;
GRANT INSERT ON assessments TO authenticated;
GRANT UPDATE ON assessments TO authenticated;
GRANT DELETE ON assessments TO authenticated;

-- 3. GRANT READ PERMISSIONS TO ANON
GRANT SELECT ON assessments TO anon;

-- 4. GRANT ALL TO SERVICE_ROLE (important for API)
GRANT ALL ON assessments TO service_role;

-- 5. ENSURE SCHEMA USAGE
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO service_role;

-- 6. IMMEDIATE VERIFICATION
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'assessments'
AND grantee IN ('authenticated', 'anon', 'service_role')
ORDER BY grantee, privilege_type;

-- 7. ALSO CHECK TABLE STRUCTURE (the missing piece)
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'assessments' 
ORDER BY ordinal_position;

-- 8. CHECK IF user_response_id EXISTS
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.columns 
  WHERE table_name = 'assessments' 
  AND column_name = 'user_response_id'
) as user_response_id_exists;

-- 9. CHECK IF user_id EXISTS  
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.columns 
  WHERE table_name = 'assessments' 
  AND column_name = 'user_id'
) as user_id_exists;
