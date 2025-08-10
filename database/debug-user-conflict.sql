-- =====================================================
-- DEBUG USER CONFLICT
-- =====================================================
-- Find out why christian@christianmaass.com is not being inserted

-- Step 1: Check if the ID already exists in user_profiles (with different email)
SELECT 
  'User with same ID in user_profiles:' as info,
  id,
  email,
  role,
  created_at
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 2: Check if email already exists in user_profiles (with different ID)
SELECT 
  'User with same email in user_profiles:' as info,
  id,
  email,
  role,
  created_at
FROM user_profiles 
WHERE email = 'christian@christianmaass.com';

-- Step 3: Show all current users in user_profiles
SELECT 
  'All users in user_profiles:' as info,
  id,
  email,
  role,
  created_at
FROM user_profiles 
ORDER BY created_at;

-- Step 4: Show the specific auth.users entry
SELECT 
  'christian@christianmaass.com in auth.users:' as info,
  id,
  email,
  created_at,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'christian@christianmaass.com';
