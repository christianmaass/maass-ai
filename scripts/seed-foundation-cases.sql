-- =====================================================
-- SEED FOUNDATION CASES DATA
-- =====================================================
-- Purpose: Insert the 12 Foundation Cases into the database
-- Run this in Supabase SQL Editor

-- First, ensure the table exists with all required columns
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_description TEXT;
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_question TEXT;

-- Clear existing data (if any)
DELETE FROM foundation_cases;

-- Insert the 12 Foundation Cases
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives, case_type, framework_hints
) VALUES 
-- Cluster 1: Leistung & Wirtschaftlichkeit
('case-01', 'Gewinnrückgang bei der TechCorp GmbH', 'foundation', 'Leistung & Wirtschaftlichkeit', 'Profit Tree', 1, 45, 'multiple_choice_with_hypotheses', '{}', ARRAY['Profit Tree Analyse', 'Umsatz- und Kostenstruktur verstehen'], 'Problemdiagnose', 'Strukturierte P&L-Analyse mit Profit Tree Framework'),

('case-02', 'Operative Effizienz bei ManufacturingPlus', 'foundation', 'Leistung & Wirtschaftlichkeit', 'Process Optimization', 4, 60, 'structured_mbb', '{}', ARRAY['Prozessoptimierung', 'Lean Management Prinzipien'], 'Optimierung', 'Value Stream Mapping und Waste Elimination'),

('case-03', 'Turnaround-Situation bei RetailChain AG', 'foundation', 'Leistung & Wirtschaftlichkeit', 'Turnaround Framework', 7, 75, 'free_form_with_hints', '{}', ARRAY['Turnaround Management', 'Krisenmanagement'], 'Turnaround', 'Quick Wins vs. langfristige Restructuring'),

-- Cluster 2: Wachstum & Markt  
('case-04', 'Markteintritt in den asiatischen Markt', 'foundation', 'Wachstum & Markt', 'Market Entry Framework', 3, 50, 'multiple_choice_with_hypotheses', '{}', ARRAY['Markteintrittsstrategie', 'Internationale Expansion'], 'Wachstum', 'Go-to-Market Strategien und Marktanalyse'),

('case-05', 'Neue Produktlinie für FoodTech Startup', 'foundation', 'Wachstum & Markt', 'Product Launch Framework', 6, 65, 'structured_mbb', '{}', ARRAY['Produktentwicklung', 'Go-to-Market'], 'Markteintritt', 'Customer Development und Product-Market-Fit'),

('case-06', 'Customer Journey Optimierung bei E-Commerce', 'foundation', 'Wachstum & Markt', 'Customer Journey Mapping', 9, 70, 'free_form_with_hints', '{}', ARRAY['Customer Experience', 'Conversion Optimierung'], 'Customer Journey', 'Touchpoint-Analyse und Experience Design'),

-- Cluster 3: Strategie & Priorisierung
('case-07', 'Strategische Neuausrichtung bei MedTech Corp', 'foundation', 'Strategie & Priorisierung', 'Strategy Framework', 5, 80, 'multiple_choice_with_hypotheses', '{}', ARRAY['Strategieentwicklung', 'Portfolio Management'], 'Strategische Entscheidung', 'Core Competencies und Strategic Options'),

('case-08', 'Portfolio-Bewertung bei Diversified Holdings', 'foundation', 'Strategie & Priorisierung', 'BCG Matrix', 8, 85, 'structured_mbb', '{}', ARRAY['Portfolio Management', 'BCG Matrix Anwendung'], 'Portfolio', 'Stars, Cash Cows, Question Marks, Dogs Analysis'),

('case-09', 'Due Diligence für Acquisition Target', 'foundation', 'Strategie & Priorisierung', 'Due Diligence Framework', 11, 90, 'free_form_with_hints', '{}', ARRAY['M&A Bewertung', 'Due Diligence'], 'Due Diligence', 'Financial, Strategic und Operational DD'),

-- Cluster 4: Organisation & Transformation
('case-10', 'Post-Merger Integration bei GlobalTech', 'foundation', 'Organisation & Transformation', 'PMI Framework', 10, 95, 'multiple_choice_with_hypotheses', '{}', ARRAY['Post-Merger Integration', 'Change Management'], 'PMI', 'Cultural Integration und Synergy Realization'),

('case-11', 'Leadership Development bei ScaleUp Inc', 'foundation', 'Organisation & Transformation', 'Leadership Framework', 2, 40, 'structured_mbb', '{}', ARRAY['Leadership Development', 'Organizational Design'], 'Leadership', 'Leadership Pipeline und Talent Management'),

('case-12', 'Digitale Transformation bei Traditional Bank', 'foundation', 'Organisation & Transformation', 'Digital Transformation', 12, 100, 'minimal_support', '{}', ARRAY['Digitale Transformation', 'Change Management'], 'Digitalisierung', 'Digital Strategy und Technology Roadmap');

-- Verify the data
SELECT 
  id, 
  title, 
  cluster, 
  difficulty, 
  tool,
  case_description IS NULL as needs_description,
  case_question IS NULL as needs_question
FROM foundation_cases 
ORDER BY difficulty;
