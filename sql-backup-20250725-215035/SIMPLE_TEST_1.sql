-- EINFACHER TEST 1: user_profiles RLS Status
SELECT 
    'user_profiles RLS Status' as test,
    CASE 
        WHEN relrowsecurity THEN 'AKTIVIERT'
        ELSE 'DEAKTIVIERT'
    END as status
FROM pg_class 
WHERE relname = 'user_profiles' 
AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
