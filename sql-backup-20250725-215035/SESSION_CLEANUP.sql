-- ============================================================================
-- SESSION CLEANUP - Invalid Refresh Token beheben
-- ============================================================================

-- 1. Prüfen ob User existiert
SELECT 'User Check:' as info;
SELECT id, email, created_at 
FROM auth.users 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- 2. Prüfen ob user_profiles Eintrag existiert
SELECT 'Profile Check:' as info;
SELECT id, email, role, name 
FROM public.user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- 3. Falls Profile fehlt, erstellen
INSERT INTO public.user_profiles (id, email, name, first_name, last_name, role, created_at, updated_at)
SELECT 
    au.id, 
    au.email, 
    COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
    COALESCE(split_part(au.raw_user_meta_data->>'name', ' ', 1), 'User') as first_name,
    '' as last_name,
    'user' as role,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users au
WHERE au.id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1'
AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles up WHERE up.id = au.id
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- 4. Verifikation
SELECT 'Final Check:' as info;
SELECT 
    up.id,
    up.email,
    up.role,
    up.name,
    'Profile exists' as status
FROM public.user_profiles up
WHERE up.id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

SELECT 'SUCCESS: User Profile sollte jetzt existieren' as result;
