-- =====================================================
-- VERIFY ADMIN STATUS FOR DEBUGGING
-- =====================================================
-- Check if the admin role is correctly set

-- Step 1: Check user_profiles for the specific ID
SELECT 
  'user_profiles for ID 6fe76262-ade3-41fc-96c5-3d5fffef88a1:' as info,
  id,
  email,
  role,
  first_name,
  last_name,
  updated_at
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 2: Check auth.users for the same ID
SELECT 
  'auth.users for same ID:' as info,
  id,
  email,
  created_at
FROM auth.users 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 3: Show all admin users
SELECT 
  'All admin users:' as info,
  id,
  email,
  role,
  created_at
FROM user_profiles 
WHERE role = 'admin'
ORDER BY created_at;
