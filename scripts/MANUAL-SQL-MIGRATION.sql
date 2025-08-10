-- =====================================================
-- MANUAL SQL MIGRATION - EXECUTE IN SUPABASE SQL EDITOR
-- =====================================================
-- Diese Befehle müssen manuell in der Supabase SQL Editor ausgeführt werden
-- da die API keine ALTER TABLE Operationen unterstützt.
-- =====================================================

-- Step 1: Add columns to foundation_cases table
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_type TEXT;
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS framework_hints TEXT;

-- Step 2: Update all foundation cases with case_type and framework_hints

-- === AUTOMATIC MATCHES (8 Cases) ===

-- 1. TechCorp Gewinnrückgang → Profitability
UPDATE foundation_cases SET 
  case_type = 'Profitability', 
  framework_hints = 'Cost Structure Analysis, Revenue Optimization, Profit Tree' 
WHERE id = 'foundation-case-1';

-- 2. RetailMax Umsatzanalyse → Growth Strategy
UPDATE foundation_cases SET 
  case_type = 'Growth Strategy', 
  framework_hints = 'Ansoff Matrix, Blue Ocean Strategy, Platform Strategy' 
WHERE id = 'foundation-case-2';

-- 3. StartupTech Markteintrittsstrategie → Market Entry
UPDATE foundation_cases SET 
  case_type = 'Market Entry', 
  framework_hints = 'Porter 5 Forces, Market Sizing, Go-to-Market Strategy' 
WHERE id = 'foundation-case-3';

-- 4. GlobalCorp Kostenoptimierung → Operations
UPDATE foundation_cases SET 
  case_type = 'Operations', 
  framework_hints = 'Process Optimization, Lean Management, Supply Chain' 
WHERE id = 'foundation-case-4';

-- 8. TechGiant M&A Bewertung → M&A
UPDATE foundation_cases SET 
  case_type = 'M&A', 
  framework_hints = 'Synergy Analysis, Due Diligence, Integration Planning' 
WHERE id = 'foundation-case-8';

-- 9. EnergyFuture Digitalisierung → Digital Transformation
UPDATE foundation_cases SET 
  case_type = 'Digital Transformation', 
  framework_hints = 'Digital Maturity Assessment, Technology Roadmap, Change' 
WHERE id = 'foundation-case-9';

-- 10. ConsumerBrand Pricing-Strategie → Pricing Strategy
UPDATE foundation_cases SET 
  case_type = 'Pricing Strategy', 
  framework_hints = 'Price Elasticity, Value-Based Pricing, Competitive Pricing' 
WHERE id = 'foundation-case-10';

-- 12. GlobalBank Restrukturierung → Restructuring
UPDATE foundation_cases SET 
  case_type = 'Restructuring', 
  framework_hints = 'Financial Restructuring, Operational Turnaround, Stakeholder' 
WHERE id = 'foundation-case-12';

-- === MANUAL ASSIGNMENTS (4 Cases) ===

-- 5. FinanceFirst Wettbewerbsanalyse → Market Entry (Porter 5 Forces)
UPDATE foundation_cases SET 
  case_type = 'Market Entry', 
  framework_hints = 'Porter 5 Forces, Competitive Landscape Analysis, Market Attractiveness Assessment' 
WHERE id = 'foundation-case-5';

-- 6. MedDevice Produktlaunch → Market Entry (Go-to-Market)
UPDATE foundation_cases SET 
  case_type = 'Market Entry', 
  framework_hints = 'Go-to-Market Strategy, Product Launch Framework, Market Penetration' 
WHERE id = 'foundation-case-6';

-- 7. LogisticsPro Effizienzsteigerung → Operations (Process Optimization)
UPDATE foundation_cases SET 
  case_type = 'Operations', 
  framework_hints = 'Process Optimization, Operational Excellence, Efficiency Improvement' 
WHERE id = 'foundation-case-7';

-- 11. HealthTech Skalierungsstrategie → Growth Strategy (Scaling)
UPDATE foundation_cases SET 
  case_type = 'Growth Strategy', 
  framework_hints = 'Scaling Framework, Business Model Scalability, Growth Strategy Implementation' 
WHERE id = 'foundation-case-11';

-- Step 3: Verify the migration
SELECT 
  id, 
  title, 
  case_type, 
  LEFT(framework_hints, 60) || '...' as framework_hints_preview 
FROM foundation_cases 
ORDER BY difficulty;

-- Expected Result: All 12 foundation cases should have case_type and framework_hints populated
