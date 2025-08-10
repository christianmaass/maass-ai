-- =====================================================
-- SET ADMIN ROLE FOR CHRISTIAN@CHRISTIANMAASS.COM
-- =====================================================
-- User already exists, just need to set admin role

-- Step 1: Check current role of christian@christianmaass.com
SELECT 
  'Current role of christian@christianmaass.com:' as info,
  email,
  role,
  created_at
FROM user_profiles 
WHERE email = 'christian@christianmaass.com';

-- Step 2: Set christian@christianmaass.com as admin
UPDATE user_profiles 
SET role = 'admin'
WHERE email = 'christian@christianmaass.com';

-- Step 3: Verify the change
SELECT 
  'Admin Users after update:' as info,
  email,
  role,
  created_at
FROM user_profiles 
WHERE role = 'admin'
ORDER BY created_at;

-- Step 4: Show all users with their roles
SELECT 
  'All Users with roles:' as info,
  email,
  role,
  created_at
FROM user_profiles 
ORDER BY created_at;
