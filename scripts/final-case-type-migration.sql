-- =====================================================
-- FINAL CASE_TYPE AND FRAMEWORK_HINTS MIGRATION
-- =====================================================
-- Basiert auf intelligenter Analyse der case_types Tabelle
-- 8 automatische Matches + 4 manuelle Empfehlungen
-- =====================================================

BEGIN;

-- Add columns to foundation_cases table
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_type TEXT;
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS framework_hints TEXT;

-- ===== AUTOMATIC MATCHES (8 Cases) =====

-- 1. TechCorp Gewinnrückgang → Profitability (Perfect Match)
UPDATE foundation_cases SET 
  case_type = 'Profitability', 
  framework_hints = 'Cost Structure Analysis, Revenue Optimization, Profit Tree' 
WHERE id = 'foundation-case-1';

-- 2. RetailMax Umsatzanalyse → Growth Strategy
UPDATE foundation_cases SET 
  case_type = 'Growth Strategy', 
  framework_hints = 'Ansoff Matrix, Blue Ocean Strategy, Platform Strategy' 
WHERE id = 'foundation-case-2';

-- 3. StartupTech Markteintrittsstrategie → Market Entry (Perfect Match)
UPDATE foundation_cases SET 
  case_type = 'Market Entry', 
  framework_hints = 'Porter 5 Forces, Market Sizing, Go-to-Market Strategy' 
WHERE id = 'foundation-case-3';

-- 4. GlobalCorp Kostenoptimierung → Operations
UPDATE foundation_cases SET 
  case_type = 'Operations', 
  framework_hints = 'Process Optimization, Lean Management, Supply Chain' 
WHERE id = 'foundation-case-4';

-- 5. TechGiant M&A Bewertung → M&A (Perfect Match)
UPDATE foundation_cases SET 
  case_type = 'M&A', 
  framework_hints = 'Synergy Analysis, Due Diligence, Integration Planning' 
WHERE id = 'foundation-case-8';

-- 6. EnergyFuture Digitalisierung → Digital Transformation (Perfect Match)
UPDATE foundation_cases SET 
  case_type = 'Digital Transformation', 
  framework_hints = 'Digital Maturity Assessment, Technology Roadmap, Change' 
WHERE id = 'foundation-case-9';

-- 7. ConsumerBrand Pricing-Strategie → Pricing Strategy (Perfect Match)
UPDATE foundation_cases SET 
  case_type = 'Pricing Strategy', 
  framework_hints = 'Price Elasticity, Value-Based Pricing, Competitive Pricing' 
WHERE id = 'foundation-case-10';

-- 8. GlobalBank Restrukturierung → Restructuring (Perfect Match)
UPDATE foundation_cases SET 
  case_type = 'Restructuring', 
  framework_hints = 'Financial Restructuring, Operational Turnaround, Stakeholder' 
WHERE id = 'foundation-case-12';

-- ===== MANUAL ASSIGNMENTS (4 Cases) =====

-- 5. FinanceFirst Wettbewerbsanalyse (Porter 5 Forces) → Market Entry
-- Reason: Porter 5 Forces ist ein Kernbestandteil der Market Entry Analyse
UPDATE foundation_cases SET 
  case_type = 'Market Entry', 
  framework_hints = 'Porter 5 Forces, Competitive Landscape Analysis, Market Attractiveness Assessment' 
WHERE id = 'foundation-case-5';

-- 6. MedDevice Produktlaunch (Go-to-Market Strategy) → Market Entry  
-- Reason: Go-to-Market ist ein wesentlicher Teil der Market Entry Strategie
UPDATE foundation_cases SET 
  case_type = 'Market Entry', 
  framework_hints = 'Go-to-Market Strategy, Product Launch Framework, Market Penetration' 
WHERE id = 'foundation-case-6';

-- 7. LogisticsPro Effizienzsteigerung (Process Optimization) → Operations
-- Reason: Process Optimization ist ein Kernbestandteil der Operations
UPDATE foundation_cases SET 
  case_type = 'Operations', 
  framework_hints = 'Process Optimization, Operational Excellence, Efficiency Improvement' 
WHERE id = 'foundation-case-7';

-- 11. HealthTech Skalierungsstrategie (Scaling Framework) → Growth Strategy
-- Reason: Skalierung ist eine Form der Wachstumsstrategie
UPDATE foundation_cases SET 
  case_type = 'Growth Strategy', 
  framework_hints = 'Scaling Framework, Business Model Scalability, Growth Strategy Implementation' 
WHERE id = 'foundation-case-11';

COMMIT;

-- ===== VERIFICATION =====
SELECT 
  id, 
  title, 
  case_type, 
  LEFT(framework_hints, 60) || '...' as framework_hints_preview 
FROM foundation_cases 
ORDER BY difficulty;

-- ===== SUMMARY =====
-- Total Cases: 12
-- Automatic Matches: 8 (Perfect alignment with case_types table)
-- Manual Assignments: 4 (Intelligent recommendations)
-- Used Case Types: 8/10 (Sustainability and Innovation remain unused)
-- Coverage: 100% of Foundation Cases now have case_type and framework_hints
