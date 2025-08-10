-- ============================================================================
-- ARBEITSPAKET 2: USER_PROFILES RLS & TRIGGER FIX
-- ============================================================================
-- Ziel: 500 Error bei user_profiles beheben
-- Fokus: RLS-Policies und automatischer Trigger
-- ============================================================================

SELECT '=== ARBEITSPAKET 2: USER_PROFILES FIX ===' as info;

-- STEP 1: RLS aktivieren (falls nicht bereits aktiv)
-- ============================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- STEP 2: Alte Policies löschen (sicherheitshalber)
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

-- STEP 3: Neue RLS-Policies erstellen
-- ============================================================================

-- Policy 1: User können eigenes Profil lesen
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: User können eigenes Profil bearbeiten
CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id);

-- Policy 3: Authentifizierte User können Profile erstellen
CREATE POLICY "Enable insert for authenticated users only" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policy 4: Admins können alle Profile verwalten
CREATE POLICY "Admins can manage all profiles" 
ON public.user_profiles FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- STEP 4: Alte Trigger und Funktionen löschen
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_profile();
DROP FUNCTION IF EXISTS public.handle_new_user_registration();

-- STEP 5: Neue Trigger-Funktion erstellen
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    full_name TEXT;
    name_parts TEXT[];
    first_name_val TEXT;
    last_name_val TEXT;
BEGIN
    -- Name aus Metadaten oder Email extrahieren
    full_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name', 
        split_part(NEW.email, '@', 1)
    );
    
    -- Name in Vor- und Nachname aufteilen
    name_parts := string_to_array(trim(full_name), ' ');
    first_name_val := COALESCE(name_parts[1], 'User');
    
    -- Nachname behandeln
    IF array_length(name_parts, 1) > 1 THEN
        last_name_val := array_to_string(name_parts[2:], ' ');
    ELSE
        last_name_val := '';
    END IF;
    
    -- In user_profiles einfügen
    INSERT INTO public.user_profiles (
        id, email, full_name, name, first_name, last_name, role, created_at, updated_at
    )
    VALUES (
        NEW.id, NEW.email, full_name, full_name, first_name_val, last_name_val, 'user', NOW(), NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(user_profiles.full_name, EXCLUDED.full_name),
        name = COALESCE(user_profiles.name, EXCLUDED.name),
        first_name = COALESCE(user_profiles.first_name, EXCLUDED.first_name),
        last_name = COALESCE(user_profiles.last_name, EXCLUDED.last_name),
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        RAISE LOG 'Error in handle_new_user_registration: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- STEP 6: Trigger erstellen
-- ============================================================================
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user_registration();

-- STEP 7: Berechtigungen setzen
-- ============================================================================
GRANT ALL ON public.user_profiles TO postgres, authenticated, service_role;

-- STEP 8: Verifikation
-- ============================================================================
SELECT 'VERIFIKATION - RLS Status:' as check_name,
       CASE 
           WHEN relrowsecurity THEN 'AKTIVIERT ✅'
           ELSE 'DEAKTIVIERT ❌'
       END as result
FROM pg_class 
WHERE relname = 'user_profiles' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

SELECT 'VERIFIKATION - Policies:' as check_name,
       COUNT(*) as anzahl_policies
FROM pg_policies 
WHERE tablename = 'user_profiles' AND schemaname = 'public';

SELECT 'VERIFIKATION - Trigger:' as check_name,
       CASE 
           WHEN EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created')
           THEN 'EXISTIERT ✅'
           ELSE 'FEHLT ❌'
       END as result;

-- ERFOLG
SELECT 'ARBEITSPAKET 2 ABGESCHLOSSEN' as status,
       'user_profiles RLS und Trigger sind jetzt konfiguriert' as details;

-- ============================================================================
-- ARBEITSPAKET 2 ABGESCHLOSSEN
-- ============================================================================
-- Behebt: user_profiles 500 Error durch RLS-Policies und automatischen Trigger
-- Nächstes: ARBEITSPAKET 3 - user_tariff_info View für check-case-limit API
-- ============================================================================
