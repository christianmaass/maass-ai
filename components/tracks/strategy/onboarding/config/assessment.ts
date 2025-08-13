import {
  AssessmentCriterion,
  DifficultyProgression,
} from '@/shared/case-engine/types/case-engine.types';

// Strategy-specific assessment criteria
export const strategyAssessmentCriteria: AssessmentCriterion[] = [
  {
    id: 'structuring',
    name: 'Strukturierung',
    description: 'MECE-Prinzip, logische Gliederung, systematische Herangehensweise',
    weight: 0.25,
    maxScore: 100,
  },
  {
    id: 'hypothesis_formation',
    name: 'Hypothesenbildung',
    description: 'Entwicklung relevanter und testbarer Hypothesen, Priorisierung',
    weight: 0.2,
    maxScore: 100,
  },
  {
    id: 'quantitative_analysis',
    name: 'Quantitative Analyse',
    description: 'Korrekte Interpretation von Daten, angemessene Berechnungen',
    weight: 0.25,
    maxScore: 100,
  },
  {
    id: 'recommendation_quality',
    name: 'Empfehlungsqualität',
    description: 'Klarheit, Begründung, Umsetzbarkeit der Empfehlung',
    weight: 0.2,
    maxScore: 100,
  },
  {
    id: 'communication',
    name: 'Kommunikation',
    description: 'Verständlichkeit, Executive Summary, stakeholder-gerechte Aufbereitung',
    weight: 0.1,
    maxScore: 100,
  },
];

// Difficulty progression for strategy track
export const strategyDifficultyProgression: DifficultyProgression = {
  beginner: {
    caseCount: 3,
    focusAreas: [
      'Grundlegende Problemstrukturierung',
      'Einfache Kostenanalyse',
      'Klare Empfehlungsformulierung',
    ],
  },
  intermediate: {
    caseCount: 4,
    focusAreas: [
      'MECE-Frameworks anwenden',
      'Hypothesenbasierte Analyse',
      'Stakeholder-Management',
      'Quantitative Modellierung',
    ],
  },
  advanced: {
    caseCount: 3,
    focusAreas: [
      'Komplexe Strategieentwicklung',
      'Multi-Kriterien-Entscheidungen',
      'Change Management Aspekte',
      'Risikobewertung und Szenarien',
    ],
  },
};

// Strategy-specific scoring rubrics
export const strategyScoringRubrics = {
  structuring: {
    excellent: {
      score: 90 - 100,
      description: 'Perfekte MECE-Struktur, logische Hierarchie, vollständige Problemzerlegung',
    },
    good: {
      score: 70 - 89,
      description: 'Gute Strukturierung mit kleineren Lücken, größtenteils MECE',
    },
    satisfactory: {
      score: 50 - 69,
      description: 'Grundlegende Struktur erkennbar, aber Überschneidungen oder Lücken',
    },
    needs_improvement: {
      score: 0 - 49,
      description: 'Unstrukturierte Herangehensweise, fehlende logische Gliederung',
    },
  },

  hypothesis_formation: {
    excellent: {
      score: 90 - 100,
      description: 'Relevante, testbare Hypothesen mit klarer Priorisierung',
    },
    good: {
      score: 70 - 89,
      description: 'Gute Hypothesen, aber Priorisierung oder Testbarkeit verbesserbar',
    },
    satisfactory: {
      score: 50 - 69,
      description: 'Grundlegende Hypothesen vorhanden, aber wenig spezifisch',
    },
    needs_improvement: {
      score: 0 - 49,
      description: 'Keine klaren Hypothesen oder irrelevante Annahmen',
    },
  },

  quantitative_analysis: {
    excellent: {
      score: 90 - 100,
      description: 'Korrekte Berechnungen, sinnvolle Schätzungen, relevante Kennzahlen',
    },
    good: {
      score: 70 - 89,
      description: 'Größtenteils korrekte Analyse mit kleineren Fehlern',
    },
    satisfactory: {
      score: 50 - 69,
      description: 'Grundlegende quantitative Arbeit, aber methodische Schwächen',
    },
    needs_improvement: {
      score: 0 - 49,
      description: 'Fehlerhafte Berechnungen oder fehlende quantitative Analyse',
    },
  },
};

// Learning objectives for each difficulty level
export const strategyLearningObjectives = {
  beginner: [
    'Probleme strukturiert angehen',
    'Grundlegende Frameworks anwenden',
    'Einfache Berechnungen durchführen',
    'Klare Empfehlungen formulieren',
  ],
  intermediate: [
    'MECE-Prinzip beherrschen',
    'Hypothesenbasiert arbeiten',
    'Stakeholder berücksichtigen',
    'Quantitative Modelle nutzen',
  ],
  advanced: [
    'Komplexe Strategien entwickeln',
    'Risiken und Szenarien bewerten',
    'Change Management integrieren',
    'Executive-Level Kommunikation',
  ],
};
