-- =====================================================
-- STABLE RLS SOLUTION FOR FOUNDATION_CASES
-- =====================================================
-- Purpose: Production-ready RLS policies for foundation_cases table
-- This is the STABLE, SECURE solution for production use

-- Step 1: Enable RLS (if not already enabled)
ALTER TABLE foundation_cases ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to read foundation_cases" ON foundation_cases;
DROP POLICY IF EXISTS "Allow authenticated users to update foundation_cases" ON foundation_cases;
DROP POLICY IF EXISTS "Allow service role full access to foundation_cases" ON foundation_cases;

-- Step 3: Create production-ready RLS policies

-- Policy 1: Allow all authenticated users to READ foundation_cases
-- Foundation cases are educational content, safe to read for all users
CREATE POLICY "foundation_cases_read_policy" 
ON foundation_cases FOR SELECT 
TO authenticated 
USING (true);

-- Policy 2: Allow only ADMIN users to UPDATE foundation_cases
-- Only admins should be able to generate/update case descriptions
CREATE POLICY "foundation_cases_update_admin_only" 
ON foundation_cases FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

-- Policy 3: Allow service role full access (for API operations)
-- This ensures API endpoints work correctly
CREATE POLICY "foundation_cases_service_role_access" 
ON foundation_cases FOR ALL 
TO service_role 
USING (true);

-- Step 4: Verify the setup
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'foundation_cases';

-- Step 5: List all policies
SELECT 
  policyname, 
  cmd as operation,
  roles,
  qual as condition
FROM pg_policies 
WHERE tablename = 'foundation_cases'
ORDER BY policyname;

-- Step 6: Test the setup
SELECT COUNT(*) as total_foundation_cases FROM foundation_cases;
