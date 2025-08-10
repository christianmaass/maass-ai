-- =====================================================
-- ADD case_type AND framework_hints TO foundation_cases
-- =====================================================
-- Fügt case_type und framework_hints Spalten hinzu
-- und befüllt sie mit intelligenten Vorschlägen
-- =====================================================

BEGIN;

-- Add new columns to foundation_cases table
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS case_type TEXT;
ALTER TABLE foundation_cases ADD COLUMN IF NOT EXISTS framework_hints TEXT;

-- Update foundation_cases with suggested values
UPDATE foundation_cases SET 
  case_type = 'Profitability Analysis', 
  framework_hints = 'Strukturiere den Gewinn systematisch in Umsatz und Kosten. Beginne mit der Gewinnformel (Profit = Revenue - Costs) und zerlege jeden Bereich in seine Komponenten. Identifiziere die größten Hebel und priorisiere deine Analyse entsprechend.' 
WHERE id = 'foundation-case-1';

UPDATE foundation_cases SET 
  case_type = 'Revenue Growth', 
  framework_hints = 'Zerlege den Umsatz in seine Grundkomponenten (Anzahl Kunden × Preis pro Kunde oder Volumen × Preis). Analysiere jeden Treiber systematisch und identifiziere Wachstumshebel in allen Bereichen.' 
WHERE id = 'foundation-case-2';

UPDATE foundation_cases SET 
  case_type = 'Market Entry Strategy', 
  framework_hints = 'Bewerte systematisch: 1) Marktattraktivität (Größe, Wachstum, Profitabilität), 2) Wettbewerbsposition (Stärken, Differenzierung), 3) Eintrittsbarrieren und Risiken, 4) Go-to-Market Strategie. Nutze Frameworks wie Porter 5 Forces für die Wettbewerbsanalyse.' 
WHERE id = 'foundation-case-3';

UPDATE foundation_cases SET 
  case_type = 'Performance Improvement', 
  framework_hints = 'Nutze Cost Structure Analysis als strukturiertes Framework für die Leistungsanalyse. Identifiziere Leistungslücken, analysiere Ursachen systematisch und entwickle konkrete Verbesserungsmaßnahmen.' 
WHERE id = 'foundation-case-4';

UPDATE foundation_cases SET 
  case_type = 'Competitive Analysis', 
  framework_hints = 'Analysiere die fünf Wettbewerbskräfte systematisch: 1) Rivalität unter bestehenden Wettbewerbern, 2) Verhandlungsmacht der Lieferanten, 3) Verhandlungsmacht der Kunden, 4) Bedrohung durch Substitute, 5) Bedrohung durch neue Marktteilnehmer.' 
WHERE id = 'foundation-case-5';

UPDATE foundation_cases SET 
  case_type = 'Go-to-Market Strategy', 
  framework_hints = 'Entwickle eine strukturierte Go-to-Market Strategie: 1) Zielmarkt definieren, 2) Value Proposition entwickeln, 3) Vertriebskanäle auswählen, 4) Pricing-Strategie festlegen, 5) Launch-Plan erstellen. Berücksichtige Marktdynamiken und Wettbewerbsreaktionen.' 
WHERE id = 'foundation-case-6';

UPDATE foundation_cases SET 
  case_type = 'Process Optimization', 
  framework_hints = 'Analysiere Geschäftsprozesse systematisch: 1) Ist-Zustand dokumentieren, 2) Ineffizienzen identifizieren, 3) Verbesserungspotentiale bewerten, 4) Soll-Prozess designen, 5) Implementierungsplan entwickeln. Nutze Lean-Prinzipien und Best Practices.' 
WHERE id = 'foundation-case-7';

UPDATE foundation_cases SET 
  case_type = 'M&A Strategy', 
  framework_hints = 'Bewerte M&A-Opportunitäten strukturiert: 1) Strategische Rationale (Synergien, Marktposition), 2) Financial Due Diligence (Bewertung, ROI), 3) Operational Due Diligence (Integration, Risiken), 4) Deal-Struktur und Finanzierung, 5) Post-Merger Integration.' 
WHERE id = 'foundation-case-8';

UPDATE foundation_cases SET 
  case_type = 'Digital Transformation', 
  framework_hints = 'Strukturiere die digitale Transformation: 1) Digital Maturity Assessment, 2) Technology Roadmap, 3) Change Management, 4) Capability Building, 5) ROI und KPIs definieren. Berücksichtige organisatorische und kulturelle Aspekte.' 
WHERE id = 'foundation-case-9';

UPDATE foundation_cases SET 
  case_type = 'Pricing Strategy', 
  framework_hints = 'Entwickle eine datengetriebene Pricing-Strategie: 1) Kostenanalyse (Cost-Plus), 2) Wettbewerbsanalyse (Competition-Based), 3) Kundennutzen-Analyse (Value-Based), 4) Preissensitivität testen, 5) Pricing-Modell implementieren und optimieren.' 
WHERE id = 'foundation-case-10';

UPDATE foundation_cases SET 
  case_type = 'Scaling Strategy', 
  framework_hints = 'Plane systematische Skalierung: 1) Growth Drivers identifizieren, 2) Operational Scalability bewerten, 3) Resource Requirements planen, 4) Market Expansion Strategy, 5) Risk Management und Contingency Planning. Fokus auf nachhaltige Profitabilität.' 
WHERE id = 'foundation-case-11';

UPDATE foundation_cases SET 
  case_type = 'Restructuring Strategy', 
  framework_hints = 'Führe strukturierte Restrukturierung durch: 1) Performance-Analyse und Root Causes, 2) Turnaround-Optionen bewerten, 3) Cost Reduction und Revenue Enhancement, 4) Stakeholder Management, 5) Implementation Roadmap mit Quick Wins und langfristigen Maßnahmen.' 
WHERE id = 'foundation-case-12';

COMMIT;

-- Verify the updates
SELECT id, title, case_type, LEFT(framework_hints, 100) || '...' as framework_hints_preview 
FROM foundation_cases 
ORDER BY difficulty;
