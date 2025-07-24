-- Prüfe welche Tabellen bereits existieren
-- Führe diese Befehle einzeln aus, um zu sehen was schon da ist

-- 1. Alle Tabellen anzeigen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Struktur der existierenden 'cases' Tabelle anzeigen
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'cases' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Prüfe ob andere Tabellen existieren
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'case_types') 
    THEN 'EXISTS' ELSE 'MISSING' END as case_types_status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_responses') 
    THEN 'EXISTS' ELSE 'MISSING' END as user_responses_status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessments') 
    THEN 'EXISTS' ELSE 'MISSING' END as assessments_status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_progress') 
    THEN 'EXISTS' ELSE 'MISSING' END as user_progress_status;
