-- EINFACHER TEST 2: user_tariff_info View existiert?
SELECT 
    'user_tariff_info View' as test,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.views WHERE table_name = 'user_tariff_info' AND table_schema = 'public')
        THEN 'EXISTIERT'
        ELSE 'FEHLT'
    END as status;
