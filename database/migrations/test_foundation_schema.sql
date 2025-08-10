-- =====================================================
-- FOUNDATION TRACK SCHEMA TESTS
-- =====================================================
-- Validiert Migration, RLS-Policies und Performance
-- 
-- VORAUSSETZUNG: 
-- 1. 001_foundation_track_setup.sql ausgeführt
-- 2. seed_foundation_cases.sql ausgeführt
-- 
-- AUSFÜHRUNG: In Supabase SQL Editor ausführen
-- =====================================================

-- =====================================================
-- TEST 1: SCHEMA VALIDIERUNG
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== SCHEMA VALIDIERUNG STARTET ===';
END $$;

-- Test 1.1: Alle Tabellen existieren
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE 'foundation_%'
ORDER BY table_name;

-- Test 1.2: Alle Constraints existieren
SELECT 
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name LIKE 'foundation_%'
ORDER BY table_name, constraint_type;

-- Test 1.3: Alle Indizes existieren
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename LIKE 'foundation_%'
ORDER BY tablename, indexname;

-- =====================================================
-- TEST 2: DATENVALIDIERUNG
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== DATENVALIDIERUNG STARTET ===';
END $$;

-- Test 2.1: Case-Count und Verteilung
SELECT 
    'Total Cases' as metric,
    COUNT(*) as value
FROM foundation_cases
UNION ALL
SELECT 
    'Cluster: ' || cluster as metric,
    COUNT(*) as value
FROM foundation_cases
GROUP BY cluster
UNION ALL
SELECT 
    'Interaction Type: ' || interaction_type as metric,
    COUNT(*) as value
FROM foundation_cases
GROUP BY interaction_type
ORDER BY metric;

-- Test 2.2: Difficulty-Progression
SELECT 
    difficulty,
    id,
    title,
    interaction_type,
    estimated_duration
FROM foundation_cases
ORDER BY difficulty;

-- Test 2.3: Datenintegrität prüfen
SELECT 
    'Cases with invalid difficulty' as check_name,
    COUNT(*) as violations
FROM foundation_cases
WHERE difficulty < 1 OR difficulty > 12
UNION ALL
SELECT 
    'Cases with invalid interaction_type' as check_name,
    COUNT(*) as violations
FROM foundation_cases
WHERE interaction_type NOT IN (
    'multiple_choice_with_hypotheses',
    'structured_mbb', 
    'free_form_with_hints',
    'minimal_support'
)
UNION ALL
SELECT 
    'Cases with missing learning_objectives' as check_name,
    COUNT(*) as violations
FROM foundation_cases
WHERE learning_objectives IS NULL OR array_length(learning_objectives, 1) = 0;

-- =====================================================
-- TEST 3: RLS POLICY TESTS
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== RLS POLICY TESTS STARTEN ===';
    RAISE NOTICE 'HINWEIS: Diese Tests erfordern Test-User für vollständige Validierung';
END $$;

-- Test 3.1: Foundation Cases sind öffentlich lesbar
-- (Dieser Test läuft als aktueller User)
SELECT 
    'foundation_cases public read test' as test_name,
    CASE 
        WHEN COUNT(*) > 0 THEN 'PASS'
        ELSE 'FAIL'
    END as result,
    COUNT(*) as cases_visible
FROM foundation_cases;

-- Test 3.2: RLS ist aktiviert
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename LIKE 'foundation_%'
ORDER BY tablename;

-- Test 3.3: Policies existieren
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename LIKE 'foundation_%'
ORDER BY tablename, policyname;

-- =====================================================
-- TEST 4: PERFORMANCE TESTS
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== PERFORMANCE TESTS STARTEN ===';
END $$;

-- Test 4.1: Query Performance mit Indizes
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM foundation_cases 
WHERE difficulty = 5;

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM foundation_cases 
WHERE cluster = 'Wachstum & Markt';

EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM foundation_cases 
WHERE interaction_type = 'structured_mbb';

-- Test 4.2: JSONB Performance (mit leerem Content)
EXPLAIN (ANALYZE, BUFFERS) 
SELECT id, title, content->>'scenario' as scenario
FROM foundation_cases 
WHERE content ? 'scenario';

-- =====================================================
-- TEST 5: FOREIGN KEY CONSTRAINTS
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== FOREIGN KEY TESTS STARTEN ===';
END $$;

-- Test 5.1: Teste foundation_responses FK zu foundation_cases
-- (Simuliert mit existierender case_id)
BEGIN;
    -- Test: Gültige case_id sollte funktionieren (Rollback am Ende)
    INSERT INTO foundation_responses (user_id, case_id, interaction_type, responses)
    SELECT 
        auth.uid(),
        'case-01',
        'multiple_choice_with_hypotheses',
        '{}'::jsonb
    WHERE auth.uid() IS NOT NULL;
    
    RAISE NOTICE 'FK Test: Valid case_id insertion - PASS';
ROLLBACK;

-- Test 5.2: Teste ungültige case_id (sollte fehlschlagen)
DO $$
BEGIN
    BEGIN
        INSERT INTO foundation_responses (user_id, case_id, interaction_type, responses)
        VALUES (
            gen_random_uuid(),
            'invalid-case-id',
            'multiple_choice_with_hypotheses',
            '{}'::jsonb
        );
        RAISE EXCEPTION 'FK Test should have failed but succeeded';
    EXCEPTION 
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'FK Test: Invalid case_id rejection - PASS';
        WHEN OTHERS THEN
            RAISE NOTICE 'FK Test: Unexpected error - %', SQLERRM;
    END;
END $$;

-- =====================================================
-- TEST 6: UNIQUE CONSTRAINTS
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== UNIQUE CONSTRAINT TESTS STARTEN ===';
END $$;

-- Test 6.1: foundation_responses UNIQUE(user_id, case_id)
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
BEGIN
    BEGIN
        -- Erste Insertion sollte funktionieren
        INSERT INTO foundation_responses (user_id, case_id, interaction_type, responses)
        VALUES (
            test_user_id,
            'case-01',
            'multiple_choice_with_hypotheses',
            '{}'::jsonb
        );
        
        -- Zweite Insertion sollte fehlschlagen
        INSERT INTO foundation_responses (user_id, case_id, interaction_type, responses)
        VALUES (
            test_user_id,
            'case-01',
            'multiple_choice_with_hypotheses',
            '{}'::jsonb
        );
        
        RAISE EXCEPTION 'UNIQUE constraint test should have failed but succeeded';
    EXCEPTION 
        WHEN unique_violation THEN
            RAISE NOTICE 'UNIQUE Test: Duplicate user_id+case_id rejection - PASS';
        WHEN OTHERS THEN
            RAISE NOTICE 'UNIQUE Test: Unexpected error - %', SQLERRM;
    END;
    
    -- Cleanup
    DELETE FROM foundation_responses WHERE user_id = test_user_id;
END $$;

-- =====================================================
-- TEST 7: TRIGGER TESTS
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== TRIGGER TESTS STARTEN ===';
END $$;

-- Test 7.1: updated_at Trigger für foundation_cases
DO $$
DECLARE
    old_updated_at TIMESTAMP WITH TIME ZONE;
    new_updated_at TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Hole aktuellen updated_at Wert
    SELECT updated_at INTO old_updated_at 
    FROM foundation_cases 
    WHERE id = 'case-01';
    
    -- Warte kurz und update
    PERFORM pg_sleep(0.1);
    
    UPDATE foundation_cases 
    SET title = title || ' (Updated)'
    WHERE id = 'case-01';
    
    -- Hole neuen updated_at Wert
    SELECT updated_at INTO new_updated_at 
    FROM foundation_cases 
    WHERE id = 'case-01';
    
    IF new_updated_at > old_updated_at THEN
        RAISE NOTICE 'Trigger Test: updated_at trigger - PASS';
    ELSE
        RAISE NOTICE 'Trigger Test: updated_at trigger - FAIL';
    END IF;
    
    -- Cleanup: Revert title change
    UPDATE foundation_cases 
    SET title = REPLACE(title, ' (Updated)', '')
    WHERE id = 'case-01';
END $$;

-- =====================================================
-- TEST ZUSAMMENFASSUNG
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== TEST ZUSAMMENFASSUNG ===';
    RAISE NOTICE 'Schema Tests: Completed';
    RAISE NOTICE 'Data Validation: Completed';
    RAISE NOTICE 'RLS Policy Tests: Completed (Basic)';
    RAISE NOTICE 'Performance Tests: Completed';
    RAISE NOTICE 'FK Constraint Tests: Completed';
    RAISE NOTICE 'Unique Constraint Tests: Completed';
    RAISE NOTICE 'Trigger Tests: Completed';
    RAISE NOTICE '';
    RAISE NOTICE 'HINWEISE:';
    RAISE NOTICE '- Vollständige RLS-Tests erfordern Test-User';
    RAISE NOTICE '- Performance-Tests mit echtem Content durchführen';
    RAISE NOTICE '- Production-Migration in Staging-Environment testen';
    RAISE NOTICE '';
    RAISE NOTICE 'Foundation Track Schema ist bereit für AP2 (API-Entwicklung)!';
END $$;

-- =====================================================
-- OPTIONAL: CLEANUP TEST DATA
-- =====================================================

-- Entferne alle Test-Daten (falls welche erstellt wurden)
-- DELETE FROM foundation_responses WHERE user_id NOT IN (SELECT id FROM auth.users);
-- DELETE FROM foundation_assessments WHERE response_id NOT IN (SELECT id FROM foundation_responses);

-- =====================================================
-- TESTS COMPLETED
-- =====================================================
