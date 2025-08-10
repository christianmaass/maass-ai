-- =====================================================
-- CHECK RLS POLICIES - Find if Row Level Security blocks access
-- =====================================================

-- Step 1: Check if RLS is enabled on user_profiles
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  forcerowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- Step 2: Show all RLS policies on user_profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Step 3: Test direct access to the profile (bypassing RLS if needed)
-- This should work even with RLS issues
SELECT 'Direct profile access:' as info, id, email, role 
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 4: Test with explicit user context (simulating API call)
-- This might reveal RLS blocking
SET LOCAL role authenticated;
SELECT 'With authenticated role:' as info, id, email, role 
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';
RESET role;
