-- =====================================================
-- USER TRACKING MIGRATION FOR NAVAA.AI
-- =====================================================
-- Fügt User-Tracking-Felder zur user_profiles Tabelle hinzu
-- Ausführung: Kopiere diesen Code in Supabase SQL Editor und führe ihn aus

-- SCHRITT 1: Fehlende Spalten hinzufügen
-- =====================================================

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS first_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_activity_track VARCHAR(50),
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- SCHRITT 2: Performance-Indizes erstellen
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_login_tracking 
ON user_profiles(login_count, last_login_at);

CREATE INDEX IF NOT EXISTS idx_user_profiles_activity_tracking 
ON user_profiles(last_activity_track, last_activity_at);

-- SCHRITT 3: Bestehende User mit Default-Werten aktualisieren
-- =====================================================

UPDATE user_profiles 
SET 
  login_count = COALESCE(login_count, 1),
  first_login_at = COALESCE(first_login_at, created_at),
  last_login_at = COALESCE(last_login_at, updated_at),
  onboarding_completed = COALESCE(onboarding_completed, FALSE)
WHERE login_count IS NULL OR onboarding_completed IS NULL;

-- SCHRITT 4: Helper-Funktion für User Welcome Status
-- =====================================================
-- Erst alte Funktion löschen, dann neu erstellen (wegen Return-Type-Konflikt)

DROP FUNCTION IF EXISTS get_user_welcome_status(UUID);

CREATE OR REPLACE FUNCTION get_user_welcome_status(user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user_id', up.id,
    'is_first_time', COALESCE(up.login_count, 0) <= 1,
    'login_count', COALESCE(up.login_count, 0),
    'onboarding_completed', COALESCE(up.onboarding_completed, false),
    'last_activity_track', up.last_activity_track,
    'last_activity_at', up.last_activity_at,
    'first_login_at', up.first_login_at,
    'last_login_at', up.last_login_at
  ) INTO result
  FROM user_profiles up
  WHERE up.id = user_id;
  
  RETURN COALESCE(result, json_build_object(
    'user_id', user_id,
    'is_first_time', true,
    'login_count', 0,
    'onboarding_completed', false,
    'last_activity_track', null,
    'last_activity_at', null,
    'first_login_at', null,
    'last_login_at', null
  ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SCHRITT 5: Login-Tracking Trigger-Funktion
-- =====================================================

CREATE OR REPLACE FUNCTION update_user_login_tracking()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    login_count = COALESCE(login_count, 0) + 1,
    last_login_at = NOW(),
    first_login_at = CASE 
      WHEN first_login_at IS NULL THEN NOW() 
      ELSE first_login_at 
    END,
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SCHRITT 6: Trigger für automatisches Login-Tracking
-- =====================================================
-- Hinweis: Dieser Trigger wird bei jedem Login ausgelöst
-- Falls bereits ein Login-Trigger existiert, kann dieser Schritt übersprungen werden

-- CREATE TRIGGER trigger_update_user_login_tracking
--   AFTER UPDATE ON auth.users
--   FOR EACH ROW
--   WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
--   EXECUTE FUNCTION update_user_login_tracking();

-- VERIFIKATION: Prüfe ob Migration erfolgreich war
-- =====================================================

-- Prüfe Spalten
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('login_count', 'first_login_at', 'last_login_at', 'last_activity_track', 'last_activity_at', 'onboarding_completed')
ORDER BY column_name;

-- Prüfe Sample User Data
SELECT id, login_count, onboarding_completed, first_login_at, last_login_at, created_at
FROM user_profiles 
LIMIT 3;

-- Test Helper-Funktion (ersetze UUID mit deiner User-ID)
-- SELECT get_user_welcome_status('deine-user-id-hier');

-- =====================================================
-- MIGRATION ABGESCHLOSSEN
-- =====================================================
-- Nach erfolgreicher Ausführung sollten alle User-Tracking-Felder vorhanden sein
-- und das Dashboard-Routing korrekt funktionieren.
