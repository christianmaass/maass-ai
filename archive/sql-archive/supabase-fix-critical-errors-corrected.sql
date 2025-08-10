-- CRITICAL BACKEND ERRORS FIX - CORRECTED FOR EXISTING SCHEMA
-- Fixes 3 critical issues: user_profiles 500, check-case-limit 401, assessments 400
-- Works with existing tariff_plans schema (cases_per_week, not case_limit)

-- 1. FIX USER_PROFILES SCHEMA (500 Error)
-- Add missing columns that AuthContext expects
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add role constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_profiles_role_check' 
        AND table_name = 'user_profiles'
    ) THEN
        ALTER TABLE public.user_profiles 
        ADD CONSTRAINT user_profiles_role_check 
        CHECK (role IN ('admin', 'user', 'test_user'));
    END IF;
END $$;

-- 2. CREATE ASSESSMENTS TABLE (400 Error Fix)
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    case_id UUID,
    score INTEGER CHECK (score >= 0 AND score <= 10),
    feedback TEXT,
    response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on assessments
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policy for assessments
DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessments;
CREATE POLICY "Users can view own assessments" 
ON public.assessments FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own assessments" ON public.assessments;
CREATE POLICY "Users can insert own assessments" 
ON public.assessments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. ENSURE USER_SUBSCRIPTIONS TABLE EXISTS (401 Error Fix)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tariff_plan_id UUID,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE USER_TARIFF_INFO VIEW (Works with existing tariff_plans schema)
-- This view uses the correct column names from your existing schema
CREATE OR REPLACE VIEW public.user_tariff_info AS
SELECT 
    up.id as user_id,
    up.email,
    up.name,
    up.role,
    COALESCE(tp.display_name, 'Free') as tariff_name,
    COALESCE(tp.cases_per_week, 5) as case_limit, -- Map cases_per_week to case_limit
    COALESCE(tp.price_cents::decimal / 100, 0) as price_monthly, -- Convert cents to euros
    COUNT(a.id) as cases_used,
    (COALESCE(tp.cases_per_week, 5) - COUNT(a.id)) as cases_remaining
FROM public.user_profiles up
LEFT JOIN public.user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
LEFT JOIN public.tariff_plans tp ON us.tariff_plan_id = tp.id
LEFT JOIN public.assessments a ON up.id = a.user_id 
    AND a.created_at >= date_trunc('week', NOW())
GROUP BY up.id, up.email, up.name, up.role, tp.display_name, tp.cases_per_week, tp.price_cents;

-- 5. ENSURE PROPER RLS ON EXISTING TABLES
-- Enable RLS on user_subscriptions if not already enabled
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view own subscriptions" 
ON public.user_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Ensure tariff_plans RLS (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tariff_plans' AND table_schema = 'public') THEN
        ALTER TABLE public.tariff_plans ENABLE ROW LEVEL SECURITY;
        
        -- Drop and recreate policy to ensure it exists
        DROP POLICY IF EXISTS "Anyone can view tariff plans" ON public.tariff_plans;
        CREATE POLICY "Anyone can view tariff plans" 
        ON public.tariff_plans FOR SELECT 
        USING (true);
    END IF;
END $$;

-- 6. UPDATE EXISTING USER_PROFILES WITH PROPER DATA
-- Set name from email for existing users where name is null
UPDATE public.user_profiles 
SET name = COALESCE(name, split_part(email, '@', 1))
WHERE name IS NULL OR name = '';

-- 7. ENSURE PROPER INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- 8. VERIFY SETUP
SELECT 'VERIFICATION: user_profiles columns' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'VERIFICATION: assessments table exists' as info;
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'assessments' 
    AND table_schema = 'public'
) as table_exists;

SELECT 'VERIFICATION: user_tariff_info view exists' as info;
SELECT EXISTS (
    SELECT 1 FROM information_schema.views 
    WHERE table_name = 'user_tariff_info' 
    AND table_schema = 'public'
) as view_exists;

SELECT 'VERIFICATION: tariff_plans schema' as info;
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'tariff_plans' 
AND table_schema = 'public'
AND column_name IN ('cases_per_week', 'cases_per_month', 'price_cents', 'display_name')
ORDER BY column_name;

-- 9. FINAL SUCCESS MESSAGE
SELECT 'SUCCESS: All critical backend errors should now be fixed!' as status,
       'user_profiles extended, assessments created, user_tariff_info view ready' as details;
