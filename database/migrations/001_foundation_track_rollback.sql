-- =====================================================
-- FOUNDATION TRACK ROLLBACK
-- =====================================================
-- Entfernt alle Foundation Track Änderungen sicher
-- 
-- VERWENDUNG: Bei Problemen mit der Migration
-- AUSFÜHRUNG: In Supabase SQL Editor ausführen
-- SICHERHEIT: Entfernt nur Foundation Track Tabellen
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: TRIGGER ENTFERNEN
-- =====================================================

-- Foundation Track Trigger entfernen
DROP TRIGGER IF EXISTS update_foundation_cases_updated_at ON foundation_cases;
DROP TRIGGER IF EXISTS update_foundation_progress_updated_at ON foundation_progress;

-- =====================================================
-- STEP 2: TABELLEN ENTFERNEN
-- =====================================================
-- Reihenfolge: Abhängige Tabellen zuerst (CASCADE für Sicherheit)

-- Foundation Assessments (abhängig von foundation_responses)
DROP TABLE IF EXISTS foundation_assessments CASCADE;

-- Foundation Responses (abhängig von foundation_cases)
DROP TABLE IF EXISTS foundation_responses CASCADE;

-- Foundation Progress (abhängig von foundation_cases via FK)
DROP TABLE IF EXISTS foundation_progress CASCADE;

-- Foundation Cases (Basis-Tabelle)
DROP TABLE IF EXISTS foundation_cases CASCADE;

-- =====================================================
-- STEP 3: INDIZES ENTFERNEN (falls noch vorhanden)
-- =====================================================

-- Indizes werden automatisch mit Tabellen entfernt,
-- aber für Vollständigkeit explizit aufgeführt
DROP INDEX IF EXISTS idx_foundation_cases_difficulty;
DROP INDEX IF EXISTS idx_foundation_cases_cluster;
DROP INDEX IF EXISTS idx_foundation_cases_interaction_type;
DROP INDEX IF EXISTS idx_foundation_responses_user_id;
DROP INDEX IF EXISTS idx_foundation_responses_case_id;
DROP INDEX IF EXISTS idx_foundation_responses_submitted_at;
DROP INDEX IF EXISTS idx_foundation_assessments_response_id;
DROP INDEX IF EXISTS idx_foundation_assessments_overall_score;
DROP INDEX IF EXISTS idx_foundation_progress_last_activity;
DROP INDEX IF EXISTS idx_foundation_progress_completion;

-- =====================================================
-- STEP 4: RLS POLICIES ENTFERNEN (falls noch vorhanden)
-- =====================================================

-- Policies werden automatisch mit Tabellen entfernt,
-- aber für Vollständigkeit explizit aufgeführt
DROP POLICY IF EXISTS "foundation_cases_select_authenticated" ON foundation_cases;
DROP POLICY IF EXISTS "foundation_cases_admin_crud" ON foundation_cases;
DROP POLICY IF EXISTS "foundation_responses_select_own" ON foundation_responses;
DROP POLICY IF EXISTS "foundation_responses_insert_own" ON foundation_responses;
DROP POLICY IF EXISTS "foundation_responses_admin_select" ON foundation_responses;
DROP POLICY IF EXISTS "foundation_assessments_select_own" ON foundation_assessments;
DROP POLICY IF EXISTS "foundation_assessments_service_insert" ON foundation_assessments;
DROP POLICY IF EXISTS "foundation_assessments_admin_select" ON foundation_assessments;
DROP POLICY IF EXISTS "foundation_progress_crud_own" ON foundation_progress;
DROP POLICY IF EXISTS "foundation_progress_service_update" ON foundation_progress;
DROP POLICY IF EXISTS "foundation_progress_admin_select" ON foundation_progress;

-- =====================================================
-- STEP 5: FUNKTIONEN PRÜFEN
-- =====================================================

-- VORSICHT: update_updated_at_column() wird möglicherweise 
-- von anderen Tabellen verwendet. Nicht automatisch entfernen!
-- 
-- Falls sicher, dass Funktion nur für Foundation Track verwendet wird:
-- DROP FUNCTION IF EXISTS update_updated_at_column();

-- =====================================================
-- STEP 6: VALIDIERUNG
-- =====================================================

-- Validiere dass alle Foundation Track Tabellen entfernt wurden
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'foundation_cases') THEN
        RAISE EXCEPTION 'foundation_cases table still exists after rollback';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'foundation_responses') THEN
        RAISE EXCEPTION 'foundation_responses table still exists after rollback';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'foundation_assessments') THEN
        RAISE EXCEPTION 'foundation_assessments table still exists after rollback';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'foundation_progress') THEN
        RAISE EXCEPTION 'foundation_progress table still exists after rollback';
    END IF;
    
    RAISE NOTICE 'Foundation Track rollback completed successfully!';
    RAISE NOTICE 'All Foundation Track tables and policies have been removed.';
    RAISE NOTICE 'Existing application tables remain unchanged.';
END $$;

COMMIT;

-- =====================================================
-- ROLLBACK COMPLETED
-- =====================================================
-- 
-- BESTÄTIGUNG:
-- - Alle Foundation Track Tabellen entfernt
-- - Alle Foundation Track Policies entfernt
-- - Alle Foundation Track Indizes entfernt
-- - Bestehende Tabellen unverändert
-- 
-- NÄCHSTE SCHRITTE:
-- - Prüfe dass bestehende App weiterhin funktioniert
-- - Bei Bedarf Migration erneut ausführen mit Korrekturen
-- =====================================================
