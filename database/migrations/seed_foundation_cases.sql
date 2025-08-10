-- =====================================================
-- FOUNDATION CASES SEED DATA
-- =====================================================
-- Importiert alle 12 Foundation Cases in die Datenbank
-- 
-- VORAUSSETZUNG: 001_foundation_track_setup.sql bereits ausgeführt
-- AUSFÜHRUNG: In Supabase SQL Editor ausführen
-- =====================================================

BEGIN;

-- =====================================================
-- FOUNDATION CASES INSERT
-- =====================================================

-- Case 1: Profit Tree
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-01',
  'Profit Tree Analyse - TechFlow Solutions',
  'foundation',
  'Leistung & Wirtschaftlichkeit',
  'Profit Tree',
  1,
  15,
  'multiple_choice_with_hypotheses',
  -- Content wird aus case-01-profit-tree.json geladen
  '{}',
  ARRAY[
    'Profit Tree Methodik verstehen und anwenden',
    'Strukturierte Problemdiagnose durchführen',
    'Gewinn-Komponenten systematisch analysieren',
    'Datenbasierte Hypothesen entwickeln'
  ]
);

-- Case 2: MECE-Prinzip
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-02',
  'MECE-Prinzip - GlobalTech Optimierung',
  'foundation',
  'Leistung & Wirtschaftlichkeit',
  'MECE-Prinzip',
  2,
  20,
  'multiple_choice_with_hypotheses',
  '{}',
  ARRAY[
    'MECE-Prinzip verstehen und anwenden',
    'Strukturierte Problemzerlegung durchführen',
    'Optimierungsansätze systematisch entwickeln',
    'Vollständigkeit und Überschneidungsfreiheit sicherstellen'
  ]
);

-- Case 3: Turnaround
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-03',
  'Turnaround-Strategie - MediCorp Restrukturierung',
  'foundation',
  'Leistung & Wirtschaftlichkeit',
  'Turnaround-Management',
  3,
  25,
  'multiple_choice_with_hypotheses',
  '{}',
  ARRAY[
    'Turnaround-Strategien verstehen und bewerten',
    'Krisenanalyse strukturiert durchführen',
    'Restrukturierungsmaßnahmen priorisieren',
    'Stakeholder-Management in Krisensituationen'
  ]
);

-- Case 4: Wachstum
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-04',
  'Wachstumsstrategie - EcoEnergy Expansion',
  'foundation',
  'Wachstum & Markt',
  'Ansoff Matrix',
  4,
  30,
  'multiple_choice_with_hypotheses',
  '{}',
  ARRAY[
    'Ansoff Matrix verstehen und anwenden',
    'Wachstumsoptionen systematisch bewerten',
    'Markt- und Produktstrategien entwickeln',
    'Risiko-Rendite-Profile verschiedener Wachstumspfade'
  ]
);

-- Case 5: Markteintritt
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-05',
  'Markteintritt - FinTech Deutschland',
  'foundation',
  'Wachstum & Markt',
  'Market Entry Framework',
  5,
  35,
  'structured_mbb',
  '{}',
  ARRAY[
    'Market Entry Frameworks verstehen',
    'Marktattraktivität systematisch bewerten',
    'Eintrittsstrategie strukturiert entwickeln',
    'Competitive Landscape analysieren',
    'Go-to-Market Strategie definieren'
  ]
);

-- Case 6: Customer Journey
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-06',
  'Customer Journey Optimierung - RetailMax',
  'foundation',
  'Wachstum & Markt',
  'Customer Journey Mapping',
  6,
  40,
  'structured_mbb',
  '{}',
  ARRAY[
    'Customer Journey Mapping verstehen',
    'Touchpoint-Analyse durchführen',
    'Pain Points systematisch identifizieren',
    'CX-Optimierungsmaßnahmen entwickeln',
    'ROI von CX-Investitionen bewerten'
  ]
);

-- Case 7: Strategische Entscheidung
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-07',
  'Strategische Entscheidung - AutoTech Zukunft',
  'foundation',
  'Strategie & Priorisierung',
  'Strategic Decision Framework',
  7,
  45,
  'structured_mbb',
  '{}',
  ARRAY[
    'Strategic Decision Frameworks anwenden',
    'Multi-Kriterien-Bewertung durchführen',
    'Szenario-Analyse entwickeln',
    'Strategische Optionen bewerten',
    'Implementierungsplanung strukturieren'
  ]
);

-- Case 8: Portfolio
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-08',
  'Portfolio-Optimierung - IndustrialGroup',
  'foundation',
  'Strategie & Priorisierung',
  'BCG Matrix',
  8,
  50,
  'structured_mbb',
  '{}',
  ARRAY[
    'BCG Matrix verstehen und anwenden',
    'Portfolio-Analyse durchführen',
    'Ressourcenallokation optimieren',
    'Synergien zwischen Business Units identifizieren',
    'Portfolio-Strategie entwickeln'
  ]
);

-- Case 9: Due Diligence
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-09',
  'Due Diligence - CloudSoft Akquisition',
  'foundation',
  'Strategie & Priorisierung',
  'Due Diligence Framework',
  9,
  55,
  'free_form_with_hints',
  '{}',
  ARRAY[
    'Due Diligence Prozess verstehen',
    'Risikobewertung strukturiert durchführen',
    'Synergien quantifizieren',
    'Deal-Struktur optimieren',
    'Integration Planning vorbereiten'
  ]
);

-- Case 10: PMI
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-10',
  'Post-Merger Integration - TechMerge',
  'foundation',
  'Organisation & Transformation',
  'PMI Framework',
  10,
  55,
  'free_form_with_hints',
  '{}',
  ARRAY[
    'PMI-Strategien verstehen und entwickeln',
    'Integrationsphasen strukturiert planen',
    'Change Management in M&A-Kontexten',
    'Synergien realisieren und messen',
    'Kulturelle Integration managen'
  ]
);

-- Case 11: Leadership
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-11',
  'Leadership Challenge - GlobalCorp Transformation',
  'foundation',
  'Organisation & Transformation',
  'Leadership Framework',
  11,
  60,
  'free_form_with_hints',
  '{}',
  ARRAY[
    'Leadership in Transformationsprozessen',
    'Stakeholder-Management auf C-Level',
    'Change Communication entwickeln',
    'Widerstand überwinden und Akzeptanz schaffen',
    'Transformationserfolg messen und steuern'
  ]
);

-- Case 12: Digitalisierung
INSERT INTO foundation_cases (
  id, title, category, cluster, tool, difficulty, estimated_duration, 
  interaction_type, content, learning_objectives
) VALUES (
  'case-12',
  'Digitalisierungsstrategie - TraditionalBank',
  'foundation',
  'Organisation & Transformation',
  'Digital Transformation Framework',
  12,
  60,
  'minimal_support',
  '{}',
  ARRAY[
    'Digital Transformation Strategien entwickeln',
    'Technology Roadmap erstellen',
    'Digital Operating Model designen',
    'Legacy-System Migration planen',
    'Digital Culture Transformation'
  ]
);

-- =====================================================
-- VALIDIERUNG
-- =====================================================

-- Prüfe dass alle 12 Cases eingefügt wurden
DO $$
DECLARE
    case_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO case_count FROM foundation_cases;
    
    IF case_count != 12 THEN
        RAISE EXCEPTION 'Expected 12 foundation cases, but found %', case_count;
    END IF;
    
    -- Prüfe dass alle Cluster vertreten sind
    IF NOT EXISTS (SELECT 1 FROM foundation_cases WHERE cluster = 'Leistung & Wirtschaftlichkeit') THEN
        RAISE EXCEPTION 'Missing cases for cluster: Leistung & Wirtschaftlichkeit';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM foundation_cases WHERE cluster = 'Wachstum & Markt') THEN
        RAISE EXCEPTION 'Missing cases for cluster: Wachstum & Markt';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM foundation_cases WHERE cluster = 'Strategie & Priorisierung') THEN
        RAISE EXCEPTION 'Missing cases for cluster: Strategie & Priorisierung';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM foundation_cases WHERE cluster = 'Organisation & Transformation') THEN
        RAISE EXCEPTION 'Missing cases for cluster: Organisation & Transformation';
    END IF;
    
    -- Prüfe dass alle Interaction Types vertreten sind
    IF NOT EXISTS (SELECT 1 FROM foundation_cases WHERE interaction_type = 'multiple_choice_with_hypotheses') THEN
        RAISE EXCEPTION 'Missing cases for interaction_type: multiple_choice_with_hypotheses';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM foundation_cases WHERE interaction_type = 'structured_mbb') THEN
        RAISE EXCEPTION 'Missing cases for interaction_type: structured_mbb';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM foundation_cases WHERE interaction_type = 'free_form_with_hints') THEN
        RAISE EXCEPTION 'Missing cases for interaction_type: free_form_with_hints';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM foundation_cases WHERE interaction_type = 'minimal_support') THEN
        RAISE EXCEPTION 'Missing cases for interaction_type: minimal_support';
    END IF;
    
    RAISE NOTICE 'Foundation Cases seed data completed successfully!';
    RAISE NOTICE 'Inserted % cases across all clusters and interaction types', case_count;
END $$;

COMMIT;

-- =====================================================
-- SEED DATA COMPLETED
-- =====================================================
-- 
-- ÜBERSICHT:
-- ✅ 12 Foundation Cases eingefügt
-- ✅ 4 Cluster abgedeckt (je 3 Cases)
-- ✅ 4 Interaction Types abgedeckt
-- ✅ Didaktische Progression: Difficulty 1-12
-- ✅ Zeitschätzung: 15-60 Minuten
-- 
-- NÄCHSTE SCHRITTE:
-- 1. Content aus JSON-Dateien in JSONB-Felder laden
-- 2. RLS-Tests durchführen
-- 3. Performance-Tests mit EXPLAIN ANALYZE
-- 
-- HINWEIS: Content-Felder sind aktuell leer ({})
-- Diese werden in separatem Script aus JSON-Dateien geladen
-- =====================================================
