-- PROFIL-DATENBANK-CHECK: Vorname/Nachname Speicherproblem
-- Prüft user_profiles Tabelle für christian@christianmaass.com

-- 1. SCHEMA PRÜFEN: Welche Spalten existieren?
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. AKTUELLE DATEN PRÜFEN: Was ist gespeichert?
SELECT 
    id,
    email,
    first_name,
    last_name,
    created_at,
    updated_at
FROM user_profiles 
WHERE email = 'christian@christianmaass.com';

-- 3. ALLE USER_PROFILES SPALTEN ANZEIGEN (für Vollständigkeit)
SELECT *
FROM user_profiles 
WHERE email = 'christian@christianmaass.com';

-- 4. SUPABASE AUTH USERS PRÜFEN (user_metadata)
SELECT 
    id,
    email,
    user_metadata,
    raw_user_meta_data,
    created_at,
    updated_at
FROM auth.users 
WHERE email = 'christian@christianmaass.com';
