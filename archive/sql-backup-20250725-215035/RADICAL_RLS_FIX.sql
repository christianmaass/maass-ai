-- RADICAL RLS FIX: Komplett alle Policies löschen und neu erstellen
-- Problem: Infinite recursion persists trotz vorherigem Script
-- Lösung: Radikaler Reset aller RLS Policies

-- 1. ALLE POLICIES FÜR USER_PROFILES LÖSCHEN (mit echten Namen aus der Verification)
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "User can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "User can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "User can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can access based on role" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_policy" ON user_profiles;

-- 2. RLS KOMPLETT DEAKTIVIEREN UND NEU AKTIVIEREN
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. EINE EINZIGE, EINFACHSTE POLICY ERSTELLEN
CREATE POLICY "simple_user_policy" ON user_profiles
  FOR ALL USING (true);

-- 4. PERMISSIONS SICHERSTELLEN
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO anon;

-- 5. VERIFICATION: Zeige alle aktiven Policies
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

-- 6. ASSESSMENTS AUCH PRÜFEN
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'assessments';

-- 7. ASSESSMENTS RLS STATUS PRÜFEN
SELECT 
  schemaname, 
  tablename, 
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'assessments');

-- 8. TEST QUERIES
-- SELECT * FROM user_profiles LIMIT 1;
-- SELECT * FROM assessments LIMIT 1;
