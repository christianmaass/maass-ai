-- =====================================================
-- FIX ID CONFLICT FOR christian@christianmaass.com
-- =====================================================
-- The ID 6fe76262-ade3-41fc-96c5-3d5fffef88a1 is already assigned to info@navaa.ai
-- We need to create a new entry with a new ID for christian@christianmaass.com

-- Step 1: Show the current conflict
SELECT 
  'Current ID conflict:' as info,
  id,
  email,
  role
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- Step 2: Insert christian@christianmaass.com with a new UUID
INSERT INTO user_profiles (id, email, first_name, last_name, role, created_at)
VALUES (
  gen_random_uuid(),  -- Generate new UUID
  'christian@christianmaass.com',
  'Christian',
  'Maass',
  'admin',  -- Set as admin directly
  NOW()
);

-- Step 3: Get the new ID for subscription creation
DO $$
DECLARE
  new_user_id UUID;
  free_tariff_id UUID;
BEGIN
  -- Get the new user ID
  SELECT id INTO new_user_id 
  FROM user_profiles 
  WHERE email = 'christian@christianmaass.com';
  
  -- Get Free tariff ID
  SELECT id INTO free_tariff_id 
  FROM tariff_plans 
  WHERE name = 'Free';
  
  -- Create subscription
  INSERT INTO user_subscriptions (user_id, tariff_plan_id, status)
  VALUES (new_user_id, free_tariff_id, 'active');
END $$;

-- Step 4: Verify christian@christianmaass.com is now created as admin
SELECT 
  'christian@christianmaass.com created successfully:' as info,
  id,
  email,
  role,
  created_at
FROM user_profiles 
WHERE email = 'christian@christianmaass.com';

-- Step 5: Show all admin users
SELECT 
  'All admin users:' as info,
  email,
  role,
  created_at
FROM user_profiles 
WHERE role = 'admin'
ORDER BY created_at;
