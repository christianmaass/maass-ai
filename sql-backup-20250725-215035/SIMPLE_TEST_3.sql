-- EINFACHER TEST 3: Trigger existiert?
SELECT 
    'Automatischer Trigger' as test,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created')
        THEN 'EXISTIERT'
        ELSE 'FEHLT'
    END as status;
