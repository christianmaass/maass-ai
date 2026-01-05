'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import type { DecisionSuiteV1AggregatedResult } from '@/lib/decisionSuite/types';
import { deriveDecisionSuiteCopy } from '@/lib/decisionSuite/copy';

/**
 * Einfache Client-seitige Sprachdetektion
 *
 * Vereinfachte Version für Client-Komponenten.
 * Gibt "DE" oder "EN" zurück basierend auf dem Input-Text.
 */
function detectLanguageClient(text: string): 'DE' | 'EN' {
  // Deutsche Indikatoren
  const germanIndicators = [
    /\b(?:sollen|müssen|wollen|können|sollte|müsste|würde|könnte)\b/i,
    /\b(?:oder|zwischen|für|mit|von|zu|auf|bei|über|unter)\b/i,
    /\b(?:Entscheidung|Option|Ziel|Annahme|wählen|entscheiden)\b/i,
    /\b(?:wir|uns|unser|unserer|unseren|unserem)\b/i,
  ];

  // Englische Indikatoren
  const englishIndicators = [
    /\b(?:should|must|will|would|can|could|shall|may)\b/i,
    /\b(?:or|between|for|with|from|to|on|at|over|under)\b/i,
    /\b(?:decision|option|goal|objective|assumption|choose|decide)\b/i,
    /\b(?:we|our|us|ours)\b/i,
  ];

  let germanScore = 0;
  let englishScore = 0;

  for (const pattern of germanIndicators) {
    const matches = text.match(pattern);
    if (matches) {
      germanScore += matches.length;
    }
  }

  for (const pattern of englishIndicators) {
    const matches = text.match(pattern);
    if (matches) {
      englishScore += matches.length;
    }
  }

  return germanScore > englishScore ? 'DE' : 'EN';
}

interface DecisionSuiteV1ResultProps {
  /**
   * Aggregiertes Decision Suite v1 Result vom Backend
   */
  aggregatedResult: DecisionSuiteV1AggregatedResult;

  /**
   * Originaler Input-Text für Sprachdetektion
   */
  inputText: string;
}

/**
 * Decision Suite v1 Result Component
 *
 * Rendert Decision Suite v1 Ergebnisse mit konsistentem Layout:
 * - Badge: hint_label
 * - Main line: result_line
 * - Focus question: focus_question (nur wenn vorhanden)
 *
 * Zeigt KEINE internen Felder (signals, patterns_detected, primary_pattern, hint_intensity).
 */
export function DecisionSuiteV1Result({ aggregatedResult, inputText }: DecisionSuiteV1ResultProps) {
  // Detektiere Sprache aus Input-Text
  const language = detectLanguageClient(inputText);

  // Leite UI-Copy deterministisch ab
  const copy = deriveDecisionSuiteCopy(aggregatedResult, language);

  // Badge-Farbe basierend auf hint_band
  const getBadgeVariant = () => {
    switch (aggregatedResult.hint_band) {
      case 'NO_HINT':
        return 'bg-green-100 text-green-800';
      case 'CLARIFICATION_NEEDED':
        return 'bg-blue-100 text-blue-800';
      case 'STRUCTURALLY_UNCLEAR':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Result</CardTitle>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeVariant()}`}
          >
            {copy.hint_label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main result line */}
        <p className="text-navaa-gray-700 text-base leading-relaxed">{copy.result_line}</p>

        {/* Focus question (only if present) */}
        {copy.focus_question && (
          <div className="pt-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Focus</div>
              <p className="text-sm text-navaa-gray-700 leading-relaxed">{copy.focus_question}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
