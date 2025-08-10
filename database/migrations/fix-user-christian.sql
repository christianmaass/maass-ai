-- =====================================================
-- USER REPARATUR FÜR CHRISTIAN@CHRISTIANMAASS.COM
-- =====================================================
-- Repariert die fehlenden last_activity_track und last_activity_at Felder
-- Ausführung: Kopiere diesen Code in Supabase SQL Editor und führe ihn aus

-- SCHRITT 1: Fehlende Felder für deinen User reparieren
-- =====================================================

UPDATE user_profiles 
SET 
  last_activity_track = COALESCE(last_activity_track, 'Onboarding'),
  last_activity_at = COALESCE(last_activity_at, updated_at, created_at)
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1'
  AND (last_activity_track IS NULL OR last_activity_at IS NULL);

-- SCHRITT 2: Verifikation - Prüfe ob Reparatur erfolgreich war
-- =====================================================

SELECT 
  id,
  email,
  login_count,
  onboarding_completed,
  first_login_at,
  last_login_at,
  last_activity_track,
  last_activity_at,
  created_at,
  updated_at
FROM user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- ERWARTETE AUSGABE NACH REPARATUR:
-- =====================================================
-- id: 6fe76262-ade3-41fc-96c5-3d5fffef88a1
-- email: christian@christianmaass.com
-- login_count: 1
-- onboarding_completed: false
-- first_login_at: 2025-07-25T19:23:07.809737+00
-- last_login_at: 2025-07-25T19:23:07.809737+00
-- last_activity_track: "Onboarding" (NEU!)
-- last_activity_at: 2025-08-05T18:26:46.14+00 (NEU!)

-- SCHRITT 3: VOLLSTÄNDIGE MIGRATIONS-VERIFIKATION
-- =====================================================
-- Prüfe ob Migration grundsätzlich erfolgreich war und Problem nicht bei anderen Usern auftritt

-- 3.1: Prüfe Schema-Struktur (alle Spalten vorhanden?)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('login_count', 'first_login_at', 'last_login_at', 'last_activity_track', 'last_activity_at', 'onboarding_completed')
ORDER BY column_name;

-- 3.2: Prüfe alle User - wie viele haben NULL-Werte?
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN login_count IS NULL THEN 1 END) as missing_login_count,
  COUNT(CASE WHEN onboarding_completed IS NULL THEN 1 END) as missing_onboarding_completed,
  COUNT(CASE WHEN first_login_at IS NULL THEN 1 END) as missing_first_login_at,
  COUNT(CASE WHEN last_login_at IS NULL THEN 1 END) as missing_last_login_at,
  COUNT(CASE WHEN last_activity_track IS NULL THEN 1 END) as missing_last_activity_track,
  COUNT(CASE WHEN last_activity_at IS NULL THEN 1 END) as missing_last_activity_at
FROM user_profiles;

-- 3.3: Zeige User mit NULL-Werten (falls vorhanden)
SELECT 
  id,
  email,
  login_count,
  onboarding_completed,
  first_login_at,
  last_login_at,
  last_activity_track,
  last_activity_at,
  created_at
FROM user_profiles 
WHERE login_count IS NULL 
   OR onboarding_completed IS NULL 
   OR first_login_at IS NULL 
   OR last_login_at IS NULL 
   OR last_activity_track IS NULL 
   OR last_activity_at IS NULL
ORDER BY created_at;

-- 3.4: Prüfe ob Helper-Funktion existiert
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'get_user_welcome_status';

-- SCHRITT 4: REPARATUR ALLER BETROFFENEN USER (falls nötig)
-- =====================================================
-- Führe diesen Block nur aus, wenn Schritt 3.2 zeigt, dass andere User betroffen sind

-- UPDATE user_profiles 
-- SET 
--   login_count = COALESCE(login_count, 1),
--   onboarding_completed = COALESCE(onboarding_completed, FALSE),
--   first_login_at = COALESCE(first_login_at, created_at),
--   last_login_at = COALESCE(last_login_at, updated_at, created_at),
--   last_activity_track = COALESCE(last_activity_track, 'Onboarding'),
--   last_activity_at = COALESCE(last_activity_at, updated_at, created_at)
-- WHERE login_count IS NULL 
--    OR onboarding_completed IS NULL 
--    OR first_login_at IS NULL 
--    OR last_login_at IS NULL 
--    OR last_activity_track IS NULL 
--    OR last_activity_at IS NULL;

-- SCHRITT 5: FINALE VERIFIKATION
-- =====================================================
-- Nach allen Reparaturen: Prüfe dass keine NULL-Werte mehr existieren

-- SELECT 
--   COUNT(*) as total_users,
--   COUNT(CASE WHEN login_count IS NULL THEN 1 END) as missing_login_count,
--   COUNT(CASE WHEN onboarding_completed IS NULL THEN 1 END) as missing_onboarding_completed,
--   COUNT(CASE WHEN last_activity_track IS NULL THEN 1 END) as missing_last_activity_track,
--   COUNT(CASE WHEN last_activity_at IS NULL THEN 1 END) as missing_last_activity_at
-- FROM user_profiles;

-- Erwartung: Alle Counts sollten 0 sein
