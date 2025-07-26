-- Standard Case Types für MBB Training einfügen
-- Führe diese SQL-Befehle nach dem Erstellen der Tabellen aus

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
