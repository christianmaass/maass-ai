-- =====================================================
-- QUICK ADMIN FIX - Set christian@christianmaass.com as admin
-- =====================================================

-- First, check current status
SELECT 'Current user_profiles:' as info, id, email, role FROM user_profiles WHERE email LIKE '%christian%';

-- Update the user with ID 6fe76262-ade3-41fc-96c5-3d5fffef88a1 to be admin
UPDATE user_profiles 
SET 
  email = 'christian@christianmaass.com',
  role = 'admin',
  updated_at = NOW()
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Verify the change
SELECT 'After update:' as info, id, email, role FROM user_profiles WHERE role = 'admin';
