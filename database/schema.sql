-- =====================================================
-- DEFINITIVE CLEAN SCHEMA FOR NAVAA.AI
-- =====================================================
-- This file replaces all 45+ fragmented SQL files
-- Run this ONCE in Supabase SQL Editor to get a clean, working database
-- 
-- WHAT THIS DOES:
-- 1. Drops ALL existing tables (clean slate)
-- 2. Creates complete schema with proper relationships
-- 3. Sets up correct RLS policies without conflicts
-- 4. Inserts essential seed data
-- 5. Creates proper indexes for performance
--
-- BACKUP WARNING: This will DELETE all existing data!
-- Export your data first if you need to keep it.
-- =====================================================

-- =====================================================
-- STEP 1: CLEAN SLATE - DROP ALL EXISTING TABLES
-- =====================================================

-- Drop tables in reverse dependency order to avoid FK conflicts
DROP TABLE IF EXISTS user_usage CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS user_responses CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS cases CASCADE;
DROP TABLE IF EXISTS case_types CASCADE;
DROP TABLE IF EXISTS tariff_plans CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop any remaining policies and functions (safe with IF EXISTS)
-- Note: These will error if tables don't exist, but that's fine - we're cleaning up
DO $$ 
BEGIN
  -- Drop policies only if tables exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_responses') THEN
    DROP POLICY IF EXISTS "Users can view own responses" ON user_responses;
    DROP POLICY IF EXISTS "Users can insert own responses" ON user_responses;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assessments') THEN
    DROP POLICY IF EXISTS "Users can view own assessments" ON assessments;
    DROP POLICY IF EXISTS "Users can insert own assessments" ON assessments;
    DROP POLICY IF EXISTS "Service role can create assessments" ON assessments;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_progress') THEN
    DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
    DROP POLICY IF EXISTS "Service role can manage progress" ON user_progress;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_subscriptions') THEN
    DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
    DROP POLICY IF EXISTS "Service role can manage subscriptions" ON user_subscriptions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_usage') THEN
    DROP POLICY IF EXISTS "Users can view own usage" ON user_usage;
    DROP POLICY IF EXISTS "Service role can manage usage" ON user_usage;
  END IF;
END $$;

-- =====================================================
-- STEP 2: CREATE CORE TABLES
-- =====================================================

-- 1. USER PROFILES (Business data separate from auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'test_user')),
  expires_at TIMESTAMP WITH TIME ZONE, -- For test users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TARIFF PLANS (Pricing tiers)
CREATE TABLE tariff_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  price_cents INTEGER DEFAULT 0,
  price_currency VARCHAR(3) DEFAULT 'EUR',
  billing_interval VARCHAR(20) DEFAULT 'monthly',
  cases_per_week INTEGER DEFAULT 5,
  cases_per_month INTEGER DEFAULT 20,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  stripe_price_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. USER SUBSCRIPTIONS (User's current tariff)
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tariff_plan_id UUID REFERENCES tariff_plans(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  stripe_subscription_id VARCHAR(100),
  stripe_customer_id VARCHAR(100),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 4. USER USAGE TRACKING (Case limits enforcement)
CREATE TABLE user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  month_start DATE NOT NULL,
  cases_used_week INTEGER DEFAULT 0,
  cases_used_month INTEGER DEFAULT 0,
  last_case_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start),
  UNIQUE(user_id, month_start)
);

-- =====================================================
-- STEP 3: CREATE CASE SYSTEM TABLES
-- =====================================================

-- 5. CASE TYPES (Categories of business cases)
CREATE TABLE case_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  framework_hints TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CASES (Generated business cases)
CREATE TABLE cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_type_id UUID REFERENCES case_types(id),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  context TEXT,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  estimated_time_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. USER RESPONSES (User's answers to cases)
CREATE TABLE user_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id),
  response_text TEXT NOT NULL,
  time_spent_seconds INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ASSESSMENTS (AI feedback on responses)
CREATE TABLE assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id),
  user_response_id UUID REFERENCES user_responses(id),
  scores JSONB NOT NULL,
  feedback TEXT NOT NULL,
  total_score DECIMAL(3,1),
  improvement_areas TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. USER PROGRESS (Learning progress tracking)
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_cases INTEGER DEFAULT 0,
  average_score DECIMAL(3,1) DEFAULT 0,
  strong_areas TEXT[],
  weak_areas TEXT[],
  last_case_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_expires_at ON user_profiles(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX idx_user_usage_week ON user_usage(week_start);
CREATE INDEX idx_user_usage_month ON user_usage(month_start);
CREATE INDEX idx_cases_type ON cases(case_type_id);
CREATE INDEX idx_cases_difficulty ON cases(difficulty);
CREATE INDEX idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX idx_user_responses_case_id ON user_responses(case_id);
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_case_id ON assessments(case_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- =====================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Public tables (no RLS needed)
-- tariff_plans, case_types, cases are public read-only

-- =====================================================
-- STEP 6: CREATE RLS POLICIES
-- =====================================================

-- User Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User Subscriptions: Users can only see their own subscription
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- User Usage: Users can only see their own usage
CREATE POLICY "Users can view own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage usage" ON user_usage
  FOR ALL USING (auth.role() = 'service_role');

-- User Responses: Users can only see/create their own responses
CREATE POLICY "Users can view own responses" ON user_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses" ON user_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Assessments: Users can only see their own assessments
CREATE POLICY "Users can view own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can create assessments" ON assessments
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- User Progress: Users can only see their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage progress" ON user_progress
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- STEP 7: CREATE TRIGGERS FOR AUTOMATION
-- =====================================================

-- Function to automatically create user_profile when user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to automatically assign Free tariff to new users
CREATE OR REPLACE FUNCTION public.assign_free_tariff()
RETURNS TRIGGER AS $$
DECLARE
  free_tariff_id UUID;
BEGIN
  -- Get Free tariff ID
  SELECT id INTO free_tariff_id FROM tariff_plans WHERE name = 'Free' LIMIT 1;
  
  IF free_tariff_id IS NOT NULL THEN
    INSERT INTO user_subscriptions (user_id, tariff_plan_id, status)
    VALUES (NEW.id, free_tariff_id, 'active');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to assign Free tariff after profile creation
DROP TRIGGER IF EXISTS on_user_profile_created ON user_profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_free_tariff();

-- =====================================================
-- STEP 8: INSERT SEED DATA
-- =====================================================

-- Insert Tariff Plans
INSERT INTO tariff_plans (name, display_name, price_cents, cases_per_week, cases_per_month, features) VALUES
('Free', 'Free Plan', 0, 2, 8, '{"support": "community", "features": ["basic_cases", "basic_feedback"]}'),
('Plus', 'Plus Plan', 1999, 10, 40, '{"support": "email", "features": ["advanced_cases", "detailed_feedback", "progress_tracking"]}'),
('Business', 'Business Plan', 4999, 25, 100, '{"support": "priority", "features": ["all_cases", "expert_feedback", "team_analytics", "custom_cases"]}'),
('Bildungsträger', 'Bildungsträger Plan', 9999, 50, 200, '{"support": "dedicated", "features": ["unlimited_cases", "institutional_analytics", "bulk_management", "custom_branding"]}');

-- Insert Case Types
INSERT INTO case_types (name, description, framework_hints, difficulty_level) VALUES
('Market Entry', 'Markteintrittsstrategie für neue Märkte', 'Porter 5 Forces, Market Sizing, Go-to-Market Strategy', 3),
('Profitability', 'Gewinnsteigerung und Kostenoptimierung', 'Cost Structure Analysis, Revenue Optimization, Profit Tree', 2),
('Growth Strategy', 'Wachstumsstrategien für etablierte Unternehmen', 'Ansoff Matrix, Blue Ocean Strategy, Platform Strategy', 4),
('M&A', 'Merger & Acquisition Bewertung', 'Synergy Analysis, Due Diligence, Integration Planning', 5),
('Digital Transformation', 'Digitalisierungsstrategien', 'Digital Maturity Assessment, Technology Roadmap, Change Management', 4),
('Operations', 'Operative Effizienzsteigerung', 'Process Optimization, Lean Management, Supply Chain', 2),
('Pricing Strategy', 'Preisstrategien und -optimierung', 'Price Elasticity, Value-Based Pricing, Competitive Pricing', 3),
('Innovation', 'Innovationsmanagement und R&D', 'Innovation Funnel, Design Thinking, Technology Scouting', 3),
('Turnaround', 'Restrukturierung und Sanierung', 'Financial Restructuring, Operational Turnaround, Stakeholder Management', 5),
('Sustainability', 'Nachhaltigkeitsstrategien', 'ESG Framework, Circular Economy, Impact Measurement', 3);

-- Insert Sample Cases
INSERT INTO cases (case_type_id, title, description, difficulty, estimated_time_minutes) 
SELECT 
  ct.id,
  ct.name || ' Case: ' || ct.description,
  'Ein führendes Unternehmen steht vor strategischen Herausforderungen im Bereich ' || ct.name || '. Analysieren Sie die Situation und entwickeln Sie eine Lösungsstrategie.',
  ct.difficulty_level,
  30 + (ct.difficulty_level * 10)
FROM case_types ct;

-- =====================================================
-- STEP 9: GRANT PERMISSIONS
-- =====================================================

-- Grant read access to public tables
GRANT SELECT ON tariff_plans TO authenticated, anon;
GRANT SELECT ON case_types TO authenticated, anon;
GRANT SELECT ON cases TO authenticated, anon;

-- Grant appropriate access to user tables
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_subscriptions TO authenticated, service_role;
GRANT ALL ON user_usage TO authenticated, service_role;
GRANT ALL ON user_responses TO authenticated;
GRANT ALL ON assessments TO authenticated, service_role;
GRANT ALL ON user_progress TO authenticated, service_role;

-- Grant sequence usage
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- =====================================================
-- STEP 10: VERIFICATION QUERIES
-- =====================================================

-- Check that all tables exist
SELECT 
  schemaname,
  tablename,
  tableowner,
  hasindexes,
  hasrules,
  hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'user_profiles', 'tariff_plans', 'user_subscriptions', 'user_usage',
    'case_types', 'cases', 'user_responses', 'assessments', 'user_progress'
  )
ORDER BY tablename;

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'user_profiles', 'user_subscriptions', 'user_usage',
    'user_responses', 'assessments', 'user_progress'
  )
ORDER BY tablename;

-- Check seed data
SELECT 'tariff_plans' as table_name, count(*) as row_count FROM tariff_plans
UNION ALL
SELECT 'case_types' as table_name, count(*) as row_count FROM case_types
UNION ALL
SELECT 'cases' as table_name, count(*) as row_count FROM cases;

-- =====================================================
-- EXECUTION COMPLETE!
-- =====================================================
-- 
-- Your database is now clean and ready!
-- 
-- NEXT STEPS:
-- 1. Test user registration
-- 2. Test case generation
-- 3. Test assessment creation
-- 4. Verify all API endpoints work
-- 
-- All 45+ fragmented SQL files are now replaced by this single schema.
-- =====================================================
