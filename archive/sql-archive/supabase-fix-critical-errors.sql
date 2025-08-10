-- CRITICAL BACKEND ERRORS FIX
-- Fixes 3 critical issues: user_profiles 500, check-case-limit 401, assessments 400

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

-- 3. CREATE USER_TARIFF_INFO VIEW (401 Error Fix)
-- First ensure user_subscriptions table exists
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tariff_plan_id UUID,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tariff_plans table if not exists
CREATE TABLE IF NOT EXISTS public.tariff_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    case_limit INTEGER DEFAULT 5,
    price_monthly DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tariff plans
INSERT INTO public.tariff_plans (name, case_limit, price_monthly) 
VALUES 
    ('Free', 5, 0),
    ('Plus', 50, 19.99),
    ('Business', 200, 49.99),
    ('Bildungsträger', 1000, 99.99)
ON CONFLICT DO NOTHING;

-- Create user_tariff_info view
CREATE OR REPLACE VIEW public.user_tariff_info AS
SELECT 
    up.id as user_id,
    up.email,
    up.name,
    up.role,
    COALESCE(tp.name, 'Free') as tariff_name,
    COALESCE(tp.case_limit, 5) as case_limit,
    COALESCE(tp.price_monthly, 0) as price_monthly,
    COUNT(a.id) as cases_used,
    (COALESCE(tp.case_limit, 5) - COUNT(a.id)) as cases_remaining
FROM public.user_profiles up
LEFT JOIN public.user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
LEFT JOIN public.tariff_plans tp ON us.tariff_plan_id = tp.id
LEFT JOIN public.assessments a ON up.id = a.user_id 
    AND a.created_at >= date_trunc('week', NOW())
GROUP BY up.id, up.email, up.name, up.role, tp.name, tp.case_limit, tp.price_monthly;

-- Enable RLS on new tables
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariff_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view own subscriptions" 
ON public.user_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policy for tariff_plans (public read)
DROP POLICY IF EXISTS "Anyone can view tariff plans" ON public.tariff_plans;
CREATE POLICY "Anyone can view tariff plans" 
ON public.tariff_plans FOR SELECT 
USING (true);

-- 4. UPDATE EXISTING USER_PROFILES WITH PROPER DATA
-- Set name from email for existing users
UPDATE public.user_profiles 
SET name = COALESCE(name, email)
WHERE name IS NULL;

-- 5. ENSURE PROPER INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);

-- 6. VERIFY SETUP
SELECT 'user_profiles columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'assessments table exists:' as info;
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'assessments' 
    AND table_schema = 'public'
) as table_exists;

SELECT 'user_tariff_info view exists:' as info;
SELECT EXISTS (
    SELECT 1 FROM information_schema.views 
    WHERE table_name = 'user_tariff_info' 
    AND table_schema = 'public'
) as view_exists;
