-- =====================================================
-- COMPLETE DIAGNOSIS - Find the exact problem
-- =====================================================

-- Step 1: Show ALL users in auth.users
SELECT 'ALL auth.users:' as info, id, email, created_at FROM auth.users ORDER BY created_at;

-- Step 2: Show ALL users in user_profiles  
SELECT 'ALL user_profiles:' as info, id, email, role, created_at FROM user_profiles ORDER BY created_at;

-- Step 3: Check specifically for the session ID
SELECT 'Session ID in auth.users:' as info, id, email FROM auth.users WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';
SELECT 'Session ID in user_profiles:' as info, id, email, role FROM user_profiles WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 4: Check for christian email in both tables
SELECT 'Christian in auth.users:' as info, id, email FROM auth.users WHERE email LIKE '%christian%';
SELECT 'Christian in user_profiles:' as info, id, email, role FROM user_profiles WHERE email LIKE '%christian%';

-- Step 5: Show any ID mismatches
SELECT 
  'ID Mismatches:' as info,
  COALESCE(au.email, up.email) as email,
  au.id as auth_id,
  up.id as profile_id,
  up.role
FROM auth.users au 
FULL OUTER JOIN user_profiles up ON au.id = up.id
WHERE au.id IS NULL OR up.id IS NULL;
