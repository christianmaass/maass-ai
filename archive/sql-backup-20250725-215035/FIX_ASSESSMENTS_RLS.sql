-- FIX: Assessments 400 Error
-- Problem: assessments hat RLS=false aber möglicherweise aktive Policies
-- Lösung: Alle assessments Policies löschen und RLS korrekt konfigurieren

-- 1. ALLE POLICIES FÜR ASSESSMENTS LÖSCHEN
DROP POLICY IF EXISTS "Users can view own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can insert own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can update own assessments" ON assessments;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON assessments;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON assessments;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON assessments;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON assessments;
DROP POLICY IF EXISTS "assessments_policy" ON assessments;

-- 2. RLS KOMPLETT DEAKTIVIEREN (da es false sein soll)
ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;

-- 3. PERMISSIONS SICHERSTELLEN
GRANT ALL ON assessments TO authenticated;
GRANT ALL ON assessments TO anon;

-- 4. VERIFICATION: Zeige alle aktiven Policies (sollte leer sein)
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

-- 5. RLS STATUS PRÜFEN (sollte false sein)
SELECT 
  schemaname, 
  tablename, 
  rowsecurity
FROM pg_tables 
WHERE tablename = 'assessments';

-- 6. TEST QUERY
-- SELECT * FROM assessments LIMIT 1;
