-- Tariff System Database Schema
-- Führe diese SQL-Befehle in deiner Supabase-Konsole aus

-- 1. Tariff Plans Tabelle (Admin-konfigurierbare Tarife)
CREATE TABLE tariff_plans (
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

-- 2. User Subscriptions Tabelle
CREATE TABLE user_subscriptions (
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- Ein User kann nur ein aktives Abonnement haben
);

-- 3. User Usage Tracking Tabelle
CREATE TABLE user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_start DATE NOT NULL, -- Wochenstart (Montag)
  month_start DATE NOT NULL, -- Monatsstart (1. des Monats)
  cases_used_week INTEGER DEFAULT 0,
  cases_used_month INTEGER DEFAULT 0,
  last_case_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start), -- Ein Eintrag pro User pro Woche
  UNIQUE(user_id, month_start) -- Ein Eintrag pro User pro Monat
);

-- Indizes für Performance
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX idx_user_usage_week ON user_usage(week_start);
CREATE INDEX idx_user_usage_month ON user_usage(month_start);

-- Row Level Security (RLS) aktivieren
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Service Role kann alles (für Admin-Funktionen)
CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage usage" ON user_usage
  FOR ALL USING (auth.role() = 'service_role');

-- Tariff Plans sind für alle lesbar (für Preisseite)
ALTER TABLE tariff_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active tariff plans" ON tariff_plans
  FOR SELECT USING (is_active = true);

-- Service Role kann Tariff Plans verwalten
CREATE POLICY "Service role can manage tariff plans" ON tariff_plans
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger für updated_at Felder
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tariff_plans_updated_at 
  BEFORE UPDATE ON tariff_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at 
  BEFORE UPDATE ON user_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_usage_updated_at 
  BEFORE UPDATE ON user_usage 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
