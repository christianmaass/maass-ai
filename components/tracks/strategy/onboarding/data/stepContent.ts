// Centralized content for all onboarding steps
// This file contains all texts, cases, and feedback for easy maintenance

import { StepContent } from '../types/onboarding.types';

export const stepContentData: Record<number, StepContent> = {
  1: {
    title: 'Problemverständnis & Zielklärung',
    icon: '🎯',
    miniCase: 'Ein Industriekunde meldet sinkende Gewinne – was könnte sein Ziel sein?',
    options: [
      {
        id: 'a',
        text: 'Neue Zielgruppe erschließen',
        correct: false,
      },
      {
        id: 'b',
        text: 'Kostenstruktur verbessern',
        correct: true,
      },
      {
        id: 'c',
        text: 'Markenimage erhöhen',
        correct: false,
      },
    ],
    feedback: {
      correct:
        'Richtig! Bei sinkenden Gewinnen ist die Kostenoptimierung meist der direkteste Hebel. Der Kunde hat wahrscheinlich bereits Umsatzprobleme identifiziert und sucht nach Wegen, die Profitabilität zu steigern.',
      incorrect:
        'Kostenstruktur ist hier der Schlüssel, weil sinkende Gewinne oft bedeuten, dass die Kosten schneller steigen als die Umsätze. Neue Zielgruppen oder Markenimage sind langfristige Strategien, aber bei akuten Gewinnproblemen braucht es schnelle, messbare Verbesserungen.',
    },
    learningPoint:
      "Kernziel des Kunden präzise erfassen, Falltyp klassifizieren und klärende Rückfragen formulieren ('Verstehe ich richtig, dass...?')",
  },

  2: {
    title: 'Strukturierung & Hypothesenbildung',
    icon: '🏗️',
    miniCase:
      'Du weißt jetzt: Der Industriekunde will seine Kostenstruktur verbessern. Wie gehst du strukturiert vor?',
    options: [
      {
        id: 'a',
        text: 'Alle Kostenpositionen einzeln durchgehen und prüfen',
        correct: false,
      },
      {
        id: 'b',
        text: 'Hypothese: "Die größten Kostentreiber sind Personal und Material"',
        correct: true,
      },
      {
        id: 'c',
        text: 'Benchmarks der Konkurrenz recherchieren',
        correct: false,
      },
    ],
    feedback: {
      correct:
        'Richtig! Eine klare, testbare Hypothese strukturiert deine Analyse. Statt alles zu prüfen, fokussierst du auf die wahrscheinlich größten Hebel. Das spart Zeit und macht deine Argumentation nachvollziehbar.',
      incorrect:
        'Eine strukturierte Hypothese ist der Schlüssel! Statt alle Kosten durchzugehen oder Benchmarks zu sammeln, bildest du eine testbare Vermutung über die größten Kostentreiber. Das gibt deiner Analyse Richtung und Fokus.',
    },
    learningPoint:
      'Top-down-Zerlegung des Problems (MECE-Denken), Bildung klar testbarer Hypothesen und Auswahl passender Frameworks (Profit-Tree, SWOT etc.)',
  },

  3: {
    title: 'Analyse & Zahlenarbeit',
    icon: '📊',
    miniCase:
      'Deine Hypothese: Personal (60%) und Material (25%) sind die größten Kostentreiber. Welchen Hebel priorisierst du?',
    options: [
      {
        id: 'personal',
        text: 'Personalkosten optimieren (60% der Gesamtkosten)',
        correct: true,
      },
      {
        id: 'material',
        text: 'Materialkosten senken (25% der Gesamtkosten)',
        correct: false,
      },
      {
        id: 'overhead',
        text: 'Overhead reduzieren (10% der Gesamtkosten)',
        correct: false,
      },
    ],
    feedback: {
      correct:
        'Richtig! Bei 60% Anteil hat Personal den größten Leverage-Effekt. Selbst kleine prozentuale Verbesserungen (5-10%) haben massive Auswirkungen auf das Gesamtergebnis.',
      incorrect:
        'Personal ist der größte Hebel! Bei 60% Kostenanteil wirken sich selbst kleine Verbesserungen überproportional aus. Material (25%) oder Overhead (10%) haben deutlich weniger Impact-Potenzial.',
    },
    learningPoint:
      'Treiberbaum aufbauen, die 1-2 Hebel mit größtem Impact priorisieren und Begründung liefern (größter Anteil, hoher Leverage)',
  },

  4: {
    title: 'Synthetisieren & Optionen bewerten',
    icon: '⚖️',
    miniCase:
      'Du hast Personal als größten Hebel identifiziert (6% Gesamtersparnis möglich). Welche Maßnahme empfiehlst du?',
    options: [
      {
        id: 'layoffs',
        text: 'Sofortige Personalreduktion um 10%',
        correct: false,
      },
      {
        id: 'efficiency',
        text: 'Effizienzsteigerung durch Prozessoptimierung',
        correct: true,
      },
      {
        id: 'outsourcing',
        text: 'Komplettes Outsourcing der Produktion',
        correct: false,
      },
    ],
    feedback: {
      correct:
        'Richtig! Effizienzsteigerung ist nachhaltiger und risikoärmer. Du behältst Know-how, verbesserst Prozesse und erzielst langfristige Kostensenkungen ohne Qualitätsverlust oder Mitarbeiter-Demotivation.',
      incorrect:
        'Effizienzsteigerung ist der ausgewogenste Ansatz! Personalreduktion ist kurzfristig, aber riskant (Know-how-Verlust, Demotivation). Outsourcing ist radikal und schwer umkehrbar. Prozessoptimierung bietet nachhaltigen Impact.',
    },
    learningPoint:
      'Handlungsoptionen systematisch bündeln, vergleichende Bewertung (Trade-off, Risiko, Umsetzbarkeit) und Priorisierung von Quick Wins vs. strategische Initiativen',
  },

  5: {
    title: 'Empfehlung & Executive Summary',
    icon: '🎯',
    miniCase:
      'Du hast Effizienzsteigerung als beste Option identifiziert. Wie formulierst du deine Empfehlung?',
    options: [
      {
        id: 'detailed',
        text: 'Wir sollten verschiedene Prozessoptimierungsmaßnahmen evaluieren und dann schrittweise implementieren, um die Effizienz zu steigern.',
        correct: false,
      },
      {
        id: 'executive',
        text: 'Ich empfehle Prozessoptimierung im Personalbereich, weil sie 6% Kostensenkung bei niedrigem Risiko ermöglicht.',
        correct: true,
      },
      {
        id: 'vague',
        text: 'Die Analyse zeigt, dass Effizienzsteigerungen grundsätzlich sinnvoll sind und implementiert werden sollten.',
        correct: false,
      },
    ],
    feedback: {
      correct:
        "Perfekt! Eine starke Empfehlung folgt der Formel: 'Ich empfehle X, weil Y → führt zu Z'. Klar, prägnant, mit Begründung und quantifiziertem Nutzen. Keine Umschweife, sondern direkte Handlungsempfehlung.",
      incorrect:
        "Eine Executive-Empfehlung muss prägnant und klar sein! Vermeide 'sollten evaluieren' oder vage Aussagen. Nutze die Formel: 'Ich empfehle X, weil Y → führt zu Z'. Konkret, quantifiziert, handlungsorientiert.",
    },
    learningPoint:
      "Prägnante Empfehlungsformel: 'Ich empfehle X, weil Y → führt zu Z', Fokus auf Wirkung und Umsetzungspfad, Vermeidung von 'Berater-Bla-Bla'",
  },
};

// Additional content for UI elements
export const uiContent = {
  skipButton: {
    text: 'Onboarding überspringen',
    confirmTitle: 'Onboarding überspringen?',
    confirmMessage:
      'Du verpasst eine kurze Einführung in den navaa-Denkprozess. Du kannst das Onboarding jederzeit später nachholen.',
    confirmButton: 'Ja, überspringen',
    cancelButton: 'Abbrechen',
  },

  navigation: {
    backButton: '← Zurück',
    nextButton: 'Weiter →',
    completeButton: 'Onboarding abschließen',
  },

  completion: {
    title: 'Super – du hast den navaa-Denkprozess kennengelernt!',
    subtitle:
      'In echten Fällen wirst du diesen Ablauf Schritt für Schritt anwenden – mit KI-Feedback, passgenauen Cases und klaren Empfehlungen.',
    readyMessage: '→ Du bist bereit für deinen ersten echten Fall!',
    motivationText: 'Denke daran: Top-Berater und Strategen zeichnet folgendes aus:',
    successFactors: [
      {
        icon: '🏗️',
        title: 'Strukturierung',
        description: 'Denken in Kategorien und Teilblöcken',
      },
      {
        icon: '🎯',
        title: 'Fokus',
        description: 'Konzentration auf 2–3 wirkungsstarke Hebel',
      },
      {
        icon: '💰',
        title: 'Wirtschaftliches Denken',
        description: 'Was hat Business-Impact, nicht nur Excel-Logik',
      },
      {
        icon: '💡',
        title: 'Klarheit',
        description: '"Ich glaube, die größten Hebel sind A und B, weil..."',
      },
    ],
    finalMessage: '🌟 Genau das werden wir lernen und trainieren!',
    ctaRestart: '🔄 Onboarding wiederholen',
    ctaStart: '🚀 Jetzt echten Fall starten',
    tips: [
      {
        icon: '💡',
        title: 'Tipp:',
        text: 'In echten Cases bekommst du individuelles KI-Feedback zu jedem Schritt',
      },
      {
        icon: '🎯',
        title: 'Ziel:',
        text: 'Strategisches Denken wird zu deiner zweiten Natur',
      },
    ],
  },
};

// Accessibility labels
export const a11yLabels = {
  progressIndicator: 'Fortschrittsanzeige',
  stepIcon: 'Schritt-Symbol',
  multipleChoice: 'Antwortmöglichkeiten',
  feedbackBox: 'Feedback und Erklärung',
  navigationButtons: 'Navigation zwischen Schritten',
  skipButton: 'Onboarding überspringen',
  completionScreen: 'Onboarding abgeschlossen',
};
