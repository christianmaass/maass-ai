-- CHECK: Assessments Schema und Query Problem
-- Problem: GET /assessments?select=score&user_id=eq.[id] returns 400 Bad Request
-- Mögliche Ursachen: Falsche Spalte, fehlende Tabelle, RLS Problem

-- 1. Prüfe ob assessments Tabelle existiert
SELECT 
  table_name, 
  table_type, 
  table_schema
FROM information_schema.tables 
WHERE table_name = 'assessments';

-- 2. Prüfe Spalten der assessments Tabelle
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'assessments'
ORDER BY ordinal_position;

-- 3. Prüfe RLS Status für assessments
SELECT 
  schemaname, 
  tablename, 
  rowsecurity
FROM pg_tables 
WHERE tablename = 'assessments';

-- 4. Prüfe RLS Policies für assessments
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

-- 5. Prüfe ob user_id Spalte existiert (das ist wahrscheinlich das Problem)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'assessments' 
AND column_name = 'user_id';

-- 6. Zeige alle Spalten die 'user' enthalten
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'assessments' 
AND column_name LIKE '%user%';

-- 7. Test Query (um den genauen Fehler zu sehen)
-- SELECT score FROM assessments WHERE user_id = auth.uid() LIMIT 1;
