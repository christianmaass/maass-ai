-- =====================================================
-- CREATE MISSING USER_TARIFF_INFO VIEW
-- =====================================================
-- This view is required by the API endpoints for tariff and usage checking
-- Run this in Supabase SQL Editor to restore full functionality

-- Create the user_tariff_info view that combines user subscription and usage data
CREATE OR REPLACE VIEW user_tariff_info AS
SELECT 
  up.id as user_id,
  up.email,
  up.first_name,
  up.last_name,
  up.role,
  
  -- Tariff information
  tp.name as tariff_name,
  tp.display_name as tariff_display_name,
  tp.cases_per_week,
  tp.cases_per_month,
  tp.price_cents,
  tp.features,
  
  -- Subscription information
  us.status as subscription_status,
  us.current_period_start,
  us.current_period_end,
  us.stripe_subscription_id,
  us.stripe_customer_id,
  
  -- Usage information (current week/month)
  COALESCE(uu.cases_used_week, 0) as cases_used_this_week,
  COALESCE(uu.cases_used_month, 0) as cases_used_this_month,
  uu.week_start,
  uu.month_start,
  uu.last_case_at,
  
  -- Progress information
  COALESCE(prog.completed_cases, 0) as total_completed_cases,
  COALESCE(prog.average_score, 0.0) as average_score,
  prog.strong_areas,
  prog.weak_areas,
  prog.last_case_at as last_progress_update

FROM user_profiles up
LEFT JOIN user_subscriptions us ON up.id = us.user_id
LEFT JOIN tariff_plans tp ON us.tariff_plan_id = tp.id
LEFT JOIN user_usage uu ON up.id = uu.user_id 
  AND uu.week_start = DATE_TRUNC('week', CURRENT_DATE)
  AND uu.month_start = DATE_TRUNC('month', CURRENT_DATE)
LEFT JOIN user_progress prog ON up.id = prog.user_id;

-- Grant permissions to the view
GRANT SELECT ON user_tariff_info TO authenticated, service_role;

-- Test the view with our test user
SELECT 
  user_id,
  email,
  tariff_name,
  cases_per_week,
  cases_per_month,
  cases_used_this_week,
  cases_used_this_month,
  subscription_status
FROM user_tariff_info 
WHERE user_id = '6fe76262-ade3-41fc-96c5-3d5fffef88a1';

-- =====================================================
-- VIEW CREATED SUCCESSFULLY!
-- =====================================================
-- This view provides all the data needed by:
-- - /api/check-case-limit
-- - /api/generate-case
-- - Any other API that needs user tariff/usage info
-- =====================================================
