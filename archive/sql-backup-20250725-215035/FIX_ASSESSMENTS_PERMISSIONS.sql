-- FIX: Assessments Permissions Problem
-- Root Cause: authenticated and anon roles have NO SELECT permission
-- Solution: Grant proper permissions to assessments table

-- 1. GRANT ALL PERMISSIONS TO AUTHENTICATED ROLE
GRANT ALL ON assessments TO authenticated;

-- 2. GRANT READ PERMISSIONS TO ANON ROLE (for public access if needed)
GRANT SELECT ON assessments TO anon;

-- 3. ENSURE USAGE ON SCHEMA
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- 4. VERIFICATION: Check permissions after fix
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'assessments'
ORDER BY grantee, privilege_type;

-- 5. TEST QUERY AS AUTHENTICATED USER
-- This should now work without 400 error
-- SELECT COUNT(*) FROM assessments;
