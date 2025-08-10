-- Initial Tariff Plans Data
-- Führe diese SQL-Befehle nach dem tariff-schema.sql aus

-- Tariff Plans einfügen
INSERT INTO tariff_plans (name, display_name, price_cents, cases_per_week, cases_per_month, features) VALUES
('Free', 'Free', 0, 5, 20, '{
  "basic_assessment": true,
  "community_support": true,
  "standard_templates": true,
  "email_support": true
}'),

('Plus', 'Plus', 990, 25, 100, '{
  "advanced_assessment": true,
  "priority_support": true,
  "premium_templates": true,
  "progress_analytics": true,
  "export_results": true
}'),

('Business', 'Business', -1, -1, -1, '{
  "unlimited_cases": true,
  "team_management": true,
  "custom_branding": true,
  "api_access": true,
  "dedicated_support": true,
  "custom_templates": true,
  "advanced_analytics": true
}'),

('Bildungsträger', 'Bildungsträger', -1, -1, -1, '{
  "education_discount": true,
  "class_management": true,
  "curriculum_integration": true,
  "progress_reports": true,
  "trainer_support": true,
  "bulk_accounts": true,
  "custom_content": true
}');

-- Alle neuen User bekommen automatisch den Free-Tarif
-- Diese Funktion wird bei der User-Registrierung ausgeführt
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Free Plan ID holen
  SELECT id INTO free_plan_id FROM tariff_plans WHERE name = 'Free' LIMIT 1;
  
  -- User Subscription für Free Plan erstellen
  INSERT INTO user_subscriptions (user_id, tariff_plan_id, status, current_period_start, current_period_end)
  VALUES (
    NEW.id, 
    free_plan_id, 
    'active',
    NOW(),
    NOW() + INTERVAL '1 year' -- Free Plan läuft 1 Jahr
  );
  
  -- User Progress initialisieren
  INSERT INTO user_progress (user_id, completed_cases, average_score)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für neue User erstellen
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Funktion zum Aktualisieren der Usage-Statistiken
CREATE OR REPLACE FUNCTION update_user_usage(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  current_week_start DATE;
  current_month_start DATE;
BEGIN
  -- Aktuelle Woche (Montag) und Monat berechnen
  current_week_start := DATE_TRUNC('week', CURRENT_DATE)::DATE;
  current_month_start := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  
  -- Usage für aktuelle Woche aktualisieren/erstellen
  INSERT INTO user_usage (user_id, week_start, month_start, cases_used_week, cases_used_month, last_case_at)
  VALUES (p_user_id, current_week_start, current_month_start, 1, 1, NOW())
  ON CONFLICT (user_id, week_start) 
  DO UPDATE SET 
    cases_used_week = user_usage.cases_used_week + 1,
    last_case_at = NOW(),
    updated_at = NOW();
    
  -- Usage für aktuellen Monat aktualisieren/erstellen
  INSERT INTO user_usage (user_id, week_start, month_start, cases_used_week, cases_used_month, last_case_at)
  VALUES (p_user_id, current_week_start, current_month_start, 0, 1, NOW())
  ON CONFLICT (user_id, month_start) 
  DO UPDATE SET 
    cases_used_month = user_usage.cases_used_month + 1,
    last_case_at = NOW(),
    updated_at = NOW()
  WHERE user_usage.week_start != current_week_start; -- Nur wenn es nicht der gleiche Eintrag ist
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View für einfache Abfrage der User-Tarif-Informationen
CREATE OR REPLACE VIEW user_tariff_info AS
SELECT 
  u.id as user_id,
  u.email,
  tp.name as tariff_name,
  tp.display_name as tariff_display_name,
  tp.cases_per_week,
  tp.cases_per_month,
  tp.features,
  us.status as subscription_status,
  us.current_period_end,
  us.cancel_at_period_end,
  COALESCE(uw.cases_used_week, 0) as cases_used_this_week,
  COALESCE(um.cases_used_month, 0) as cases_used_this_month
FROM auth.users u
LEFT JOIN user_subscriptions us ON u.id = us.user_id
LEFT JOIN tariff_plans tp ON us.tariff_plan_id = tp.id
LEFT JOIN user_usage uw ON u.id = uw.user_id AND uw.week_start = DATE_TRUNC('week', CURRENT_DATE)::DATE
LEFT JOIN user_usage um ON u.id = um.user_id AND um.month_start = DATE_TRUNC('month', CURRENT_DATE)::DATE
WHERE us.status = 'active' OR us.status IS NULL;
