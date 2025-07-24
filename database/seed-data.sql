-- Standard Case Types für MBB Training
-- Führe diese SQL-Befehle nach dem Schema aus

INSERT INTO case_types (name, description, framework_hints, difficulty_level) VALUES 
(
  'Market Sizing', 
  'Schätze die Größe eines Marktes oder Marktsegments',
  'Top-down vs. Bottom-up Ansatz, Segmentierung, Annahmen validieren',
  2
),
(
  'Profitability', 
  'Analysiere warum Gewinne sinken und entwickle Lösungen',
  'Profit = Revenue - Costs, Revenue-Treiber, Kostenstruktur, Benchmarking',
  3
),
(
  'Growth Strategy', 
  'Entwickle Wachstumsstrategien für ein Unternehmen',
  'Ansoff-Matrix, Marktpenetration, Produktentwicklung, Diversifikation',
  4
),
(
  'Market Entry', 
  'Bewerte Markteintrittsstrategien in neue Märkte',
  'Marktattraktivität, Wettbewerbsanalyse, Entry-Modi, Timing',
  4
),
(
  'Pricing', 
  'Optimiere Preisstrategien für Produkte/Services',
  'Cost-plus, Value-based, Competition-based Pricing, Preiselastizität',
  3
),
(
  'M&A', 
  'Bewerte Fusionen und Übernahmen',
  'Synergien, Due Diligence, Bewertungsmethoden, Integration',
  5
),
(
  'New Product Launch', 
  'Entwickle Go-to-Market Strategien für neue Produkte',
  '4P Marketing Mix, Zielgruppe, Kanäle, Launch-Timeline',
  3
),
(
  'Cost Reduction', 
  'Identifiziere Kostensenkungspotentiale',
  'Kostenstruktur-Analyse, Benchmarking, Quick Wins vs. strukturelle Maßnahmen',
  2
),
(
  'Digital Transformation', 
  'Digitalisierungsstrategien für traditionelle Unternehmen',
  'Digital Maturity, Technology Stack, Change Management, ROI',
  4
),
(
  'Turnaround', 
  'Sanierungsstrategien für Unternehmen in der Krise',
  'Ursachenanalyse, Cash Flow, Stakeholder Management, Quick Wins',
  5
);

-- Beispiel-Cases für jeden Typ (vereinfacht)
INSERT INTO cases (case_type_id, title, description, difficulty, estimated_time_minutes) VALUES 
(
  (SELECT id FROM case_types WHERE name = 'Market Sizing'),
  'E-Scooter Markt Deutschland',
  'Ein Mobility-Startup möchte den deutschen E-Scooter-Markt erschließen. Schätze die Marktgröße und das Potenzial.',
  2,
  20
),
(
  (SELECT id FROM case_types WHERE name = 'Profitability'),
  'Sinkende Gewinne Einzelhandel',
  'Eine deutsche Einzelhandelskette verzeichnet seit 2 Jahren sinkende Gewinne. Analysiere die Ursachen und entwickle Lösungsansätze.',
  3,
  30
),
(
  (SELECT id FROM case_types WHERE name = 'Growth Strategy'),
  'SaaS Expansion Europa',
  'Ein US-amerikanisches SaaS-Unternehmen will nach Europa expandieren. Entwickle eine Wachstumsstrategie.',
  4,
  35
);
