-- QUERY 3: tariff_plans Spalten prüfen
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'tariff_plans' AND table_schema = 'public'
ORDER BY ordinal_position;
