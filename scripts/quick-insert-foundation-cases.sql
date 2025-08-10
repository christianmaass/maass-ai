-- =====================================================
-- QUICK INSERT FOUNDATION CASES
-- =====================================================
-- Run this in Supabase SQL Editor to insert the cases

-- Ensure columns exist
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_description TEXT;
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_question TEXT;

-- Insert Foundation Cases (matching the IDs from your table)
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES 
('foundation-case-1', 'Gewinnrückgang bei der TechCorp GmbH', 'foundation', 'Leistung & Wirtschaftlichkeit', 'Profit Tree', 1, 45, 'multiple_choice_with_hypotheses', '{}', ARRAY['Profit Tree Analyse', 'Umsatz- und Kostenstruktur verstehen']),
('foundation-case-2', 'Markteintritt Strategie', 'foundation', 'Wachstum & Markt', 'Market Entry Framework', 3, 50, 'structured_mbb', '{}', ARRAY['Markteintrittsstrategie', 'Internationale Expansion']),
('foundation-case-3', 'Portfolio Optimierung', 'foundation', 'Strategie & Priorisierung', 'BCG Matrix', 5, 60, 'free_form_with_hints', '{}', ARRAY['Portfolio Management', 'BCG Matrix Anwendung'])
ON CONFLICT (id) DO NOTHING;

-- Check if insert worked
SELECT id, title, case_description IS NULL as needs_description FROM foundation_cases;
