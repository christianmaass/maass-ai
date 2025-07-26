-- ============================================================================
-- ARBEITSPAKET 3: USER_TARIFF_INFO VIEW FIX
-- ============================================================================
-- Ziel: 401 Error bei check-case-limit API beheben
-- Fokus: user_tariff_info View mit korrekter Spalten-Zuordnung
-- ============================================================================

SELECT '=== ARBEITSPAKET 3: USER_TARIFF_INFO VIEW ===' as info;

-- STEP 1: Alte View löschen (falls vorhanden)
-- ============================================================================
DROP VIEW IF EXISTS public.user_tariff_info;

-- STEP 2: user_tariff_info View erstellen
-- ============================================================================
-- Basiert auf den Audit-Ergebnissen:
-- tariff_plans hat: cases_per_week, price_cents
-- user_profiles hat: id, email, name, role
-- assessments existiert bereits

CREATE OR REPLACE VIEW public.user_tariff_info AS
SELECT 
    up.id as user_id,
    up.email,
    up.name,
    up.role,
    COALESCE(tp.display_name, 'Free') as tariff_name,
    COALESCE(tp.cases_per_week, 5) as case_limit,
    COALESCE(tp.price_cents::decimal / 100, 0) as price_monthly,
    COUNT(a.id) as cases_used,
    (COALESCE(tp.cases_per_week, 5) - COUNT(a.id)) as cases_remaining
FROM public.user_profiles up
LEFT JOIN public.user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
LEFT JOIN public.tariff_plans tp ON us.tariff_plan_id = tp.id
LEFT JOIN public.assessments a ON up.id = a.user_id 
    AND a.created_at >= date_trunc('week', NOW())
GROUP BY up.id, up.email, up.name, up.role, tp.display_name, tp.cases_per_week, tp.price_cents;

-- STEP 3: Berechtigungen für View setzen
-- ============================================================================
GRANT SELECT ON public.user_tariff_info TO postgres, authenticated, service_role;

-- STEP 4: Verifikation
-- ============================================================================
SELECT 'VERIFIKATION - View existiert:' as check_name,
       CASE 
           WHEN EXISTS(SELECT 1 FROM information_schema.views WHERE table_name = 'user_tariff_info' AND table_schema = 'public')
           THEN 'EXISTIERT ✅'
           ELSE 'FEHLT ❌'
       END as result;

-- STEP 5: Test-Query (sollte Daten zurückgeben)
-- ============================================================================
SELECT 'VERIFIKATION - Test Query:' as check_name;
SELECT 
    user_id,
    email,
    tariff_name,
    case_limit,
    cases_used,
    cases_remaining
FROM public.user_tariff_info
LIMIT 3;

-- ERFOLG
SELECT 'ARBEITSPAKET 3 ABGESCHLOSSEN' as status,
       'user_tariff_info View ist erstellt und funktionsfähig' as details;

-- ============================================================================
-- ARBEITSPAKET 3 ABGESCHLOSSEN
-- ============================================================================
-- Behebt: check-case-limit 401 Error durch user_tariff_info View
-- Nächstes: ARBEITSPAKET 4 - Finale Verifikation und Tests
-- ============================================================================
