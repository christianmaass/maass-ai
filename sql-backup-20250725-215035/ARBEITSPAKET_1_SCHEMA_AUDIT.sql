-- ============================================================================
-- ARBEITSPAKET 1: SCHEMA-AUDIT
-- ============================================================================
-- Ziel: Verstehen was wirklich in der Datenbank existiert
-- Keine Änderungen - nur Informationen sammeln
-- ============================================================================

SELECT '=== ARBEITSPAKET 1: SCHEMA-AUDIT ===' as info;

-- 1. PRÜFEN: Ist user_profiles eine Tabelle oder View?
-- ============================================================================
SELECT 'user_profiles Struktur:' as check_name,
       CASE 
           WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') 
           THEN 'TABLE ✅'
           WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'user_profiles' AND table_schema = 'public')
           THEN 'VIEW ⚠️'
           ELSE 'EXISTIERT NICHT ❌'
       END as result;

-- 2. SPALTEN von user_profiles auflisten
-- ============================================================================
SELECT 'user_profiles Spalten:' as check_name;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. CONSTRAINTS prüfen
-- ============================================================================
SELECT 'user_profiles Constraints:' as check_name;
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public';

-- 4. RLS-STATUS prüfen
-- ============================================================================
SELECT 'RLS Status:' as check_name,
       CASE 
           WHEN relrowsecurity THEN 'AKTIVIERT ✅'
           ELSE 'DEAKTIVIERT ❌'
       END as result
FROM pg_class 
WHERE relname = 'user_profiles' 
AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 5. BESTEHENDE POLICIES auflisten
-- ============================================================================
SELECT 'RLS Policies:' as check_name;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_profiles' 
AND schemaname = 'public';

-- 6. TRIGGER prüfen
-- ============================================================================
SELECT 'Trigger Status:' as check_name;
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth';

-- 7. ANDERE RELEVANTE TABELLEN prüfen
-- ============================================================================
SELECT 'Andere Tabellen:' as check_name;
SELECT 
    table_name,
    CASE 
        WHEN table_type = 'BASE TABLE' THEN 'TABLE'
        WHEN table_type = 'VIEW' THEN 'VIEW'
        ELSE table_type
    END as type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('assessments', 'user_subscriptions', 'tariff_plans')
ORDER BY table_name;

-- 8. TARIFF_PLANS SPALTEN prüfen (für View-Mapping)
-- ============================================================================
SELECT 'tariff_plans Spalten:' as check_name;
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'tariff_plans' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 9. VIEWS prüfen
-- ============================================================================
SELECT 'Bestehende Views:' as check_name;
SELECT 
    table_name as view_name
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name LIKE '%tariff%' OR table_name LIKE '%user%'
ORDER BY table_name;

-- 10. BENUTZER-ANZAHL prüfen
-- ============================================================================
SELECT 'Anzahl User in auth.users:' as check_name,
       COUNT(*) as anzahl
FROM auth.users;

-- Wenn user_profiles existiert, auch dort zählen
SELECT 'Anzahl User in user_profiles:' as check_name,
       CASE 
           WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public')
           THEN (SELECT COUNT(*)::text FROM public.user_profiles)
           ELSE 'Tabelle existiert nicht'
       END as anzahl;

-- ============================================================================
-- AUDIT ABGESCHLOSSEN
-- ============================================================================
SELECT 'ARBEITSPAKET 1 ABGESCHLOSSEN' as status,
       'Führe die Ergebnisse aus und teile sie mit dem Entwickler' as next_step;
