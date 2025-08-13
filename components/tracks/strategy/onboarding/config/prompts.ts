import { CasePromptConfiguration } from '@/shared/case-engine/types/case-engine.types';

// Strategy-specific prompts for case generation and assessment
export const strategyPrompts: CasePromptConfiguration = {
  caseGeneration: `
    Erstelle einen Strategieberatungs-Case mit folgenden Elementen:
    
    STRUKTUR:
    - Unternehmenssituation und Kontext
    - Strategische Herausforderung oder Problemstellung
    - Relevante quantitative Daten und Kennzahlen
    - Markt- und Wettbewerbsumfeld
    - Stakeholder und deren Interessen
    
    ANFORDERUNGEN:
    - Der Case soll die 5-Schritte-Strategiemethodik anwenden können:
      1. Problemverständnis & Zielklärung
      2. Strukturierung & Hypothesenbildung
      3. Analyse & Zahlenarbeit
      4. Synthetisieren & Optionen bewerten
      5. Empfehlung & Executive Summary
    
    - Realistische Geschäftssituation
    - Quantifizierbare Elemente für Analyse
    - Mehrere mögliche Lösungsansätze
    - Klare Erfolgskriterien
  `,

  assessment: `
    Bewerte die Strategieberatungs-Antwort nach folgenden Kriterien:
    
    1. STRUKTURIERUNG (25%)
       - Anwendung des MECE-Prinzips (Mutually Exclusive, Collectively Exhaustive)
       - Logische Gliederung der Problemstellung
       - Systematische Herangehensweise
    
    2. HYPOTHESENBILDUNG (20%)
       - Entwicklung relevanter und testbarer Hypothesen
       - Priorisierung der wichtigsten Hypothesen
       - Ableitung aus der Problemstellung
    
    3. QUANTITATIVE ANALYSE (25%)
       - Korrekte Interpretation von Zahlen und Daten
       - Angemessene Berechnungen und Schätzungen
       - Verwendung relevanter Kennzahlen
    
    4. EMPFEHLUNGSQUALITÄT (20%)
       - Klarheit und Präzision der Empfehlung
       - Begründung basierend auf Analyse
       - Umsetzbarkeit und Realitätsbezug
    
    5. KOMMUNIKATION (10%)
       - Verständlichkeit der Argumentation
       - Executive Summary Qualität
       - Stakeholder-gerechte Aufbereitung
  `,

  feedback: `
    Gib konstruktives Feedback mit folgender Struktur:
    
    STÄRKEN:
    - Was wurde besonders gut gemacht?
    - Welche Ansätze waren zielführend?
    
    VERBESSERUNGSPOTENTIAL:
    - Konkrete Bereiche für Weiterentwicklung
    - Spezifische Methoden oder Frameworks
    
    NÄCHSTE SCHRITTE:
    - Empfehlungen für das weitere Lernen
    - Relevante Übungen oder Vertiefungen
    
    Verwende einen ermutigenden, aber ehrlichen Ton. Fokussiere auf Lernfortschritt.
  `,

  contextPrompts: {
    retail:
      'Einzelhandel und E-Commerce Kontext mit Fokus auf Kundenverhalten und Omnichannel-Strategien',
    technology:
      'Technologie-Unternehmen mit Fokus auf Innovation, Skalierung und digitale Transformation',
    manufacturing: 'Produktionsunternehmen mit Fokus auf Effizienz, Supply Chain und Industrie 4.0',
    consulting:
      'Beratungsunternehmen mit Fokus auf Wachstum, Spezialisierung und Marktpositionierung',
    startup: 'Startup-Umfeld mit Fokus auf Geschäftsmodell, Finanzierung und Skalierung',
  },
};

// Strategy-specific case templates
export const strategyCaseTemplates = [
  {
    id: 'market_entry',
    name: 'Markteintritt',
    structure:
      'Unternehmen X möchte in Markt Y eintreten. Analysiere die Situation und entwickle eine Empfehlung.',
    variables: ['company', 'market', 'product', 'competition', 'resources'],
    difficulty: 'intermediate' as const,
  },
  {
    id: 'cost_reduction',
    name: 'Kostenoptimierung',
    structure:
      'Unternehmen X hat Kostendruck und muss Einsparungen realisieren. Entwickle einen Ansatz.',
    variables: ['company', 'cost_structure', 'revenue', 'constraints', 'timeline'],
    difficulty: 'beginner' as const,
  },
  {
    id: 'growth_strategy',
    name: 'Wachstumsstrategie',
    structure:
      'Unternehmen X möchte wachsen und sucht nach den besten Optionen. Analysiere und empfehle.',
    variables: ['company', 'current_position', 'market_opportunities', 'capabilities', 'resources'],
    difficulty: 'advanced' as const,
  },
];
