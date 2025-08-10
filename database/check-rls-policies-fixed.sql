-- =====================================================
-- CHECK RLS POLICIES - Find if Row Level Security blocks access (FIXED)
-- =====================================================

-- Step 1: Check if RLS is enabled on user_profiles (corrected for Supabase)
SELECT 
  schemaname,
  tablename,
  rowsecurity
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

-- Step 3: Test direct access to the profile
SELECT 'Direct profile access:' as info, id, email, role 
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 4: Check current user context
SELECT 'Current user context:' as info, current_user, session_user;

-- Step 5: Test if we can access with service role context
-- (This simulates what the API should be doing)
SELECT 'Service role test:' as info, count(*) as profile_count
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';
