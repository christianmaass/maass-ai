-- =====================================================
-- FIX FOUNDATION_CASES UPDATE ISSUE
-- =====================================================
-- Purpose: Fix the "Failed to save generated case to database" error

-- Check current policies
SELECT policyname, cmd, roles, qual 
FROM pg_policies 
WHERE tablename = 'foundation_cases';

-- Drop the restrictive admin-only update policy
DROP POLICY IF EXISTS "foundation_cases_update_admin_only" ON foundation_cases;

-- Create a more permissive update policy for development
-- This allows any authenticated user to update foundation_cases
CREATE POLICY "foundation_cases_update_authenticated" 
ON foundation_cases FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Also ensure service role has full access
DROP POLICY IF EXISTS "foundation_cases_service_role_access" ON foundation_cases;
CREATE POLICY "foundation_cases_service_role_access" 
ON foundation_cases FOR ALL 
TO service_role 
USING (true)
WITH CHECK (true);

-- Verify the policies
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'foundation_cases'
ORDER BY policyname;

-- Test update (this should work now)
UPDATE foundation_cases 
SET case_description = 'Test update - ' || NOW()::text
WHERE id = 'foundation-case-1';

-- Check if the update worked
SELECT id, title, case_description 
FROM foundation_cases 
WHERE id = 'foundation-case-1';
