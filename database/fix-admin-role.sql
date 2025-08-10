-- =====================================================
-- FIX ADMIN ROLE FOR CHRISTIAN
-- =====================================================
-- Set christian@thomann.de as admin (correct email address)

-- Update the correct user to admin role
UPDATE user_profiles 
SET role = 'admin'
WHERE email = 'christian@thomann.de';

-- Verify the change
SELECT 
  'Admin Users after fix:' as info,
  email,
  role,
  created_at
FROM user_profiles 
WHERE role = 'admin';

-- Show all users with their roles
SELECT 
  'All Users:' as info,
  email,
  role,
  created_at
FROM user_profiles 
ORDER BY created_at;
