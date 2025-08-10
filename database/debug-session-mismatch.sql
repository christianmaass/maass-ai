-- =====================================================
-- DEBUG SESSION MISMATCH - Check auth.users vs user_profiles
-- =====================================================

-- Check all users in auth.users with christian email
SELECT 
  'auth.users with christian email:' as info,
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email LIKE '%christian%'
ORDER BY created_at;

-- Check all users in user_profiles with christian email  
SELECT 
  'user_profiles with christian email:' as info,
  id,
  email,
  role,
  created_at
FROM user_profiles 
WHERE email LIKE '%christian%'
ORDER BY created_at;

-- Check if there's a mismatch between auth.users and user_profiles IDs
SELECT 
  'ID mismatch check:' as info,
  au.id as auth_id,
  au.email as auth_email,
  up.id as profile_id,
  up.email as profile_email,
  up.role as profile_role
FROM auth.users au
FULL OUTER JOIN user_profiles up ON au.id = up.id
WHERE au.email LIKE '%christian%' OR up.email LIKE '%christian%';
