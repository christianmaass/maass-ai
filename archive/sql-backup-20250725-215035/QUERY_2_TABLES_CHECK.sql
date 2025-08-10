-- QUERY 2: Welche Tabellen existieren?
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'assessments', 'user_subscriptions', 'tariff_plans')
ORDER BY table_name;
