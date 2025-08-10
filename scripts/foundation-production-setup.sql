-- FOUNDATION TRACK - PRODUCTION SETUP (CORRECTED)
-- This script loads the REAL 12 Foundation Track cases as defined yesterday
-- Based on JSON files in /content/foundation-cases/

-- Step 1: Clean existing data
DELETE FROM foundation_cases;

-- Step 2: Insert REAL Foundation Case 1 - TechCorp Profit Tree
INSERT INTO foundation_cases (
  id,
  title,
  category,
  cluster,
  tool,
  difficulty,
  estimated_duration,
  interaction_type,
  learning_objectives,
  content,
  created_at,
  updated_at
) VALUES (
  'foundation-case-1',
  'TechCorp Gewinnrückgang analysieren',
  'foundation',
  'Leistung & Wirtschaftlichkeit',
  'Profit Tree',
  1,
  15,
  'multiple_choice_with_hypotheses',
  ARRAY['Profit Tree Methodik verstehen und anwenden', 'Strukturierte Problemdiagnose durchführen', 'Gewinn-Komponenten systematisch analysieren', 'MECE-Prinzip bei Hypothesenentwicklung'],
  '{
    "introduction": "Ein Profit Tree ist ein strukturiertes Framework zur systematischen Analyse von Gewinnveränderungen. Es zerlegt den Gewinn in seine Grundkomponenten: Gewinn = Umsatz - Kosten",
    "situation": "TechCorp ist ein mittelständisches Software-Unternehmen mit 200 Mitarbeitern, das ERP-Lösungen für kleine und mittlere Unternehmen entwickelt. In den letzten 12 Monaten ist jedoch ein besorgniserregender Trend zu beobachten: Obwohl der Umsatz stabil geblieben ist (€15 Mio.), ist der Gewinn um 35% von €3 Mio. auf €1,95 Mio. gesunken.",
    "question": "Warum ist der Gewinn von TechCorp um 35% gesunken, obwohl der Umsatz stabil geblieben ist?",
    "context": [
      "Umsatz 2023: €15 Mio. (stabil zu 2022)",
      "Gewinn 2022: €3 Mio. (20% Marge)",
      "Gewinn 2023: €1,95 Mio. (13% Marge)",
      "Mitarbeiteranzahl: von 180 auf 200 gestiegen",
      "Hauptprodukt: ERP-Software für KMU"
    ],
    "multiple_choice_questions": [
      {
        "id": "mc1",
        "question": "Welche Hauptkomponenten gehören in einen Profit Tree?",
        "options": [
          {"id": "a", "text": "Umsatz und Kosten", "correct": true, "explanation": "Richtig! Der Gewinn ergibt sich aus Umsatz minus Kosten. Diese beiden Hauptkategorien bilden die erste Ebene des Profit Trees."},
          {"id": "b", "text": "Kunden, Produkte und Märkte", "correct": false, "explanation": "Das sind wichtige Business-Faktoren, aber nicht die Grundstruktur eines Profit Trees."},
          {"id": "c", "text": "Fixkosten und variable Kosten", "correct": false, "explanation": "Das ist nur ein Teil des Profit Trees - nämlich die Aufschlüsselung der Kosten. Du vergisst die Umsatzseite."},
          {"id": "d", "text": "Anzahl Kunden und Preis pro Kunde", "correct": false, "explanation": "Das ist die Aufschlüsselung der Umsatzseite, aber du vergisst die Kostenseite."}
        ]
      },
      {
        "id": "mc2", 
        "question": "TechCorp hat stabilen Umsatz, aber sinkenden Gewinn. Was ist die wahrscheinlichste Ursache?",
        "options": [
          {"id": "a", "text": "Die Kosten sind gestiegen", "correct": true, "explanation": "Exzellent! Wenn Umsatz = Gewinn + Kosten, und der Umsatz stabil ist, aber der Gewinn sinkt, dann müssen die Kosten gestiegen sein."},
          {"id": "b", "text": "Die Kundenzahl ist gesunken", "correct": false, "explanation": "Sinkende Kundenzahl würde zu sinkendem Umsatz führen. Da der Umsatz stabil ist, ist das nicht die Ursache."},
          {"id": "c", "text": "Die Preise sind gesunken", "correct": false, "explanation": "Sinkende Preise würden zu sinkendem Umsatz führen. Da der Umsatz stabil ist, können die Preise nicht die Hauptursache sein."},
          {"id": "d", "text": "Der Markt ist geschrumpft", "correct": false, "explanation": "Ein schrumpfender Markt würde sich normalerweise in sinkendem Umsatz zeigen."}
        ]
      },
      {
        "id": "mc3",
        "question": "Welche Kostenkategorien sollten wir bei TechCorp prioritär analysieren?",
        "options": [
          {"id": "a", "text": "Nur die Personalkosten, da 20 neue Mitarbeiter eingestellt wurden", "correct": false, "explanation": "Personalkosten sind wichtig, aber eine vollständige Analyse sollte alle Kostenkategorien betrachten."},
          {"id": "b", "text": "Personalkosten, IT-Infrastruktur, Marketing und sonstige Betriebskosten", "correct": true, "explanation": "Richtig! Eine systematische MECE-Analyse betrachtet alle relevanten Kostenkategorien für ein Software-Unternehmen."},
          {"id": "c", "text": "Nur fixe und variable Kosten", "correct": false, "explanation": "Bei einem Software-Unternehmen sind die meisten Kosten fix. Diese Kategorisierung ist zu eng."},
          {"id": "d", "text": "Nur externe Kosten wie Beratung und Software-Lizenzen", "correct": false, "explanation": "Externe Kosten sind nur ein Teil des Gesamtbilds. Die größten Kostenpositionen sind wahrscheinlich interne Kosten."}
        ]
      },
      {
        "id": "mc4",
        "question": "Was ist der Hauptunterschied zwischen einem Profit Tree und einer P&L?",
        "options": [
          {"id": "a", "text": "Ein Profit Tree ist detaillierter als eine P&L", "correct": false, "explanation": "Nicht ganz richtig. Eine P&L kann sehr detailliert sein. Der Unterschied liegt nicht im Detailgrad."},
          {"id": "b", "text": "Ein Profit Tree ist ein analytisches Framework, eine P&L ist ein Reporting-Dokument", "correct": true, "explanation": "Exzellent! Ein Profit Tree ist ein Analyse-Tool zur Problemlösung, während eine P&L primär der Berichterstattung dient."},
          {"id": "c", "text": "Ein Profit Tree zeigt nur Zukunftsdaten, eine P&L nur Vergangenheitsdaten", "correct": false, "explanation": "Das ist nicht korrekt. Beide können sowohl historische als auch prognostizierte Daten enthalten."},
          {"id": "d", "text": "Es gibt keinen Unterschied, das sind nur verschiedene Namen", "correct": false, "explanation": "Das ist falsch. Obwohl beide mit Gewinn und Kosten arbeiten, haben sie völlig unterschiedliche Zwecke."}
        ]
      }
    ],
    "hypothesis_prompts": [
      {
        "id": "h1",
        "prompt": "Basierend auf den Informationen (stabiler Umsatz, sinkender Gewinn), formuliere deine Haupthypothese: Warum ist der Gewinn von TechCorp gesunken?",
        "ideal_answer": "Die Kosten von TechCorp sind überproportional gestiegen, während der Umsatz stabil geblieben ist, was zu einem Rückgang der Gewinnmarge von 20% auf 13% geführt hat."
      },
      {
        "id": "h2",
        "prompt": "Welche 3 spezifischen Kostenkategorien könnten für den Anstieg verantwortlich sein? Begründe jede Hypothese kurz.",
        "ideal_answer": "1. Personalkosten: 20 neue Mitarbeiter (+11% Headcount) führen zu höheren Gehältern und Nebenkosten. 2. IT-Infrastruktur: Mehr Mitarbeiter benötigen zusätzliche Hardware, Software-Lizenzen und Cloud-Kapazitäten. 3. Büro- und Betriebskosten: Größeres Team benötigt mehr Bürofläche, höhere Nebenkosten."
      },
      {
        "id": "h3", 
        "prompt": "Welche deiner 3 Hypothesen würdest du zuerst testen und warum? Welche konkreten Daten würdest du anfordern?",
        "ideal_answer": "Priorität 1: Personalkosten - größter Kostenfaktor bei Software-Unternehmen und direkter Bezug zu +20 Mitarbeitern. Daten: Gehaltsabrechnungen 2022 vs 2023, Einstellungsdaten, Durchschnittsgehälter neue vs bestehende MA."
      }
    ]
  }'::jsonb,
  NOW(),
  NOW()
);

-- Verification: Check if Case 1 was inserted correctly
SELECT 
    id,
    title,
    cluster,
    difficulty,
    interaction_type,
    CASE 
        WHEN content IS NOT NULL AND content != '{}' THEN 'Content OK'
        ELSE 'Content fehlt'
    END as content_status
FROM foundation_cases 
WHERE id = 'foundation-case-1';

-- Note: This script currently contains only Case 1 (TechCorp Profit Tree)
-- The remaining 11 cases need to be added based on their respective JSON definitions
-- This ensures we load the CORRECT cases from yesterday, not placeholder cases
