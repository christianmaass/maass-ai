-- User Profile für bestehenden User erstellen
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

-- Verifikation
SELECT 'Profile erstellt für:' as info, email, role, name 
FROM public.user_profiles 
WHERE id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';
