-- FIX: RLS Infinite Recursion für user_profiles
-- Problem: Existing policy causes infinite recursion
-- Lösung: Drop all policies and create simple, non-recursive policy

-- 1. Alle bestehenden Policies löschen
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON user_profiles;

-- 2. RLS aktivieren (falls nicht aktiv)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Eine einzige, einfache Policy erstellen
CREATE POLICY "user_profiles_policy" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- 4. Permissions sicherstellen
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO anon;

-- 5. Verification
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 6. Test Query (sollte funktionieren)
-- SELECT * FROM user_profiles WHERE id = auth.uid();
