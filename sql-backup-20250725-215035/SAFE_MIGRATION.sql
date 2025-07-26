-- ============================================================================
-- STRIPE TARIFF SYSTEM - SICHERE DATENBANK-MIGRATION
-- ============================================================================
-- Diese Version löscht KEINE bestehenden Daten!
-- Kopiere diesen gesamten Code und führe ihn in der Supabase SQL-Konsole aus
-- ============================================================================

-- 1. TARIFF PLANS TABELLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tariff_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE, -- 'Free', 'Plus', 'Business', 'Bildungsträger'
  display_name VARCHAR(100) NOT NULL, -- Anzeigename
  price_cents INTEGER DEFAULT 0, -- Preis in Cent (0 für Free)
  price_currency VARCHAR(3) DEFAULT 'EUR',
  billing_interval VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly', 'one-time'
  cases_per_week INTEGER DEFAULT 5, -- Anzahl Cases pro Woche
  cases_per_month INTEGER DEFAULT 20, -- Anzahl Cases pro Monat
  features JSONB DEFAULT '{}', -- Zusätzliche Features als JSON
  is_active BOOLEAN DEFAULT true,
  stripe_price_id VARCHAR(100), -- Stripe Price ID für Zahlungen
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USER SUBSCRIPTIONS TABELLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- Referenz zu auth.users
  tariff_plan_id UUID REFERENCES tariff_plans(id),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'pending'
  stripe_subscription_id VARCHAR(100), -- Stripe Subscription ID
  stripe_customer_id VARCHAR(100), -- Stripe Customer ID
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraint nur hinzufügen, wenn sie nicht existiert
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_subscriptions_user_id_key'
    ) THEN
        ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 3. USER USAGE TRACKING TABELLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_start DATE NOT NULL, -- Wochenstart (Montag)
  month_start DATE NOT NULL, -- Monatsstart (1. des Monats)
  cases_used_week INTEGER DEFAULT 0,
  cases_used_month INTEGER DEFAULT 0,
  last_case_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraints nur hinzufügen, wenn sie nicht existieren
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_usage_user_id_week_start_key'
    ) THEN
        ALTER TABLE user_usage ADD CONSTRAINT user_usage_user_id_week_start_key UNIQUE (user_id, week_start);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_usage_user_id_month_start_key'
    ) THEN
        ALTER TABLE user_usage ADD CONSTRAINT user_usage_user_id_month_start_key UNIQUE (user_id, month_start);
    END IF;
END $$;

-- 4. INDIZES FÜR PERFORMANCE (nur erstellen wenn nicht vorhanden)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_week ON user_usage(week_start);
CREATE INDEX IF NOT EXISTS idx_user_usage_month ON user_usage(month_start);

-- 5. ROW LEVEL SECURITY (RLS) AKTIVIEREN
-- ============================================================================
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tariff_plans ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES (sicher erstellen)
-- ============================================================================
-- Policies nur erstellen, wenn sie nicht existieren
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_subscriptions' AND policyname = 'Users can view own subscription'
    ) THEN
        CREATE POLICY "Users can view own subscription" ON user_subscriptions
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_usage' AND policyname = 'Users can view own usage'
    ) THEN
        CREATE POLICY "Users can view own usage" ON user_usage
          FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_subscriptions' AND policyname = 'Service role can manage subscriptions'
    ) THEN
        CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions
          FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_usage' AND policyname = 'Service role can manage usage'
    ) THEN
        CREATE POLICY "Service role can manage usage" ON user_usage
          FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tariff_plans' AND policyname = 'Anyone can view active tariff plans'
    ) THEN
        CREATE POLICY "Anyone can view active tariff plans" ON tariff_plans
          FOR SELECT USING (is_active = true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tariff_plans' AND policyname = 'Service role can manage tariff plans'
    ) THEN
        CREATE POLICY "Service role can manage tariff plans" ON tariff_plans
          FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

-- 7. TRIGGER FUNKTION FÜR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger nur erstellen, wenn sie nicht existieren
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_tariff_plans_updated_at'
    ) THEN
        CREATE TRIGGER update_tariff_plans_updated_at 
          BEFORE UPDATE ON tariff_plans 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_subscriptions_updated_at'
    ) THEN
        CREATE TRIGGER update_user_subscriptions_updated_at 
          BEFORE UPDATE ON user_subscriptions 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_usage_updated_at'
    ) THEN
        CREATE TRIGGER update_user_usage_updated_at 
          BEFORE UPDATE ON user_usage 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 8. TARIFF PLANS DATEN EINFÜGEN (nur wenn nicht vorhanden)
-- ============================================================================
-- Tariff Plans nur einfügen, wenn die Tabelle leer ist
INSERT INTO tariff_plans (name, display_name, price_cents, cases_per_week, cases_per_month, features) 
SELECT 'Free', 'Free', 0, 5, 20, '{
  "basic_assessment": true,
  "community_support": true,
  "standard_templates": true,
  "email_support": true
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM tariff_plans WHERE name = 'Free');

INSERT INTO tariff_plans (name, display_name, price_cents, cases_per_week, cases_per_month, features) 
SELECT 'Plus', 'Plus', 990, 25, 100, '{
  "advanced_assessment": true,
  "priority_support": true,
  "premium_templates": true,
  "progress_analytics": true,
  "export_results": true
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM tariff_plans WHERE name = 'Plus');

INSERT INTO tariff_plans (name, display_name, price_cents, cases_per_week, cases_per_month, features) 
SELECT 'Business', 'Business', -1, -1, -1, '{
  "unlimited_cases": true,
  "team_management": true,
  "custom_branding": true,
  "api_access": true,
  "dedicated_support": true,
  "custom_templates": true,
  "advanced_analytics": true
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM tariff_plans WHERE name = 'Business');

INSERT INTO tariff_plans (name, display_name, price_cents, cases_per_week, cases_per_month, features) 
SELECT 'Bildungsträger', 'Bildungsträger', -1, -1, -1, '{
  "education_discount": true,
  "class_management": true,
  "curriculum_integration": true,
  "progress_reports": true,
  "trainer_support": true,
  "bulk_accounts": true,
  "custom_content": true
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM tariff_plans WHERE name = 'Bildungsträger');

-- 9. AUTOMATISCHE FREE-TARIF ZUWEISUNG FÜR NEUE USER
-- ============================================================================
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
  )
  ON CONFLICT (user_id) DO NOTHING; -- Verhindert Duplikate
  
  -- User Progress initialisieren (falls Tabelle existiert)
  INSERT INTO user_progress (user_id, completed_cases, average_score)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger nur erstellen, wenn er nicht existiert
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION handle_new_user();
    END IF;
END $$;

-- 10. USAGE TRACKING FUNKTION
-- ============================================================================
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
  WHERE user_usage.week_start != current_week_start;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. USER TARIFF INFO VIEW
-- ============================================================================
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

-- 12. BESTEHENDE USER MIT FREE-TARIF VERSORGEN (sicher)
-- ============================================================================
-- Alle bestehenden User bekommen den Free-Tarif zugewiesen (nur wenn sie noch keinen haben)
INSERT INTO user_subscriptions (user_id, tariff_plan_id, status, current_period_start, current_period_end)
SELECT 
  u.id,
  tp.id,
  'active',
  NOW(),
  NOW() + INTERVAL '1 year'
FROM auth.users u
CROSS JOIN tariff_plans tp
WHERE tp.name = 'Free'
AND NOT EXISTS (
  SELECT 1 FROM user_subscriptions us WHERE us.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- SICHERE MIGRATION ABGESCHLOSSEN!
-- ============================================================================
-- Diese Migration löscht KEINE bestehenden Daten und kann sicher ausgeführt werden.
-- Alle bestehenden User erhalten automatisch den Free-Tarif.
-- ============================================================================
