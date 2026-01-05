import 'server-only';

/**
 * Erkennt die dominante Sprache im Text
 *
 * Ignoriert Zahlen, Namen und Akronyme bei der Erkennung.
 * Gibt "de" für Deutsch oder "en" für Englisch zurück.
 *
 * @param text - Der zu analysierende Text
 * @returns "de" | "en" - Die erkannte Sprache
 */
export function detectLanguage(text: string): 'de' | 'en' {
  // Entferne Zahlen, Akronyme und häufige Namen
  const cleaned = text
    .replace(/\d+/g, '') // Zahlen entfernen
    .replace(/\b[A-Z]{2,}\b/g, '') // Akronyme entfernen (z.B. API, CRM, B2B)
    .replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, '') // Eigennamen entfernen
    .trim();

  if (!cleaned) {
    // Wenn nach Bereinigung nichts übrig bleibt, Fallback auf Englisch
    return 'en';
  }

  // Deutsche Wörter/Phrasen (häufige Entscheidungsbegriffe)
  const germanIndicators = [
    /\b(?:sollen|müssen|wollen|können|sollte|müsste|würde|könnte)\b/i,
    /\b(?:oder|zwischen|für|mit|von|zu|auf|bei|über|unter)\b/i,
    /\b(?:Entscheidung|Option|Ziel|Annahme|wählen|entscheiden)\b/i,
    /\b(?:wir|uns|unser|unserer|unseren|unserem)\b/i,
    /\b(?:ist|sind|war|waren|wird|werden|wäre|wären)\b/i,
  ];

  // Englische Wörter/Phrasen (häufige Entscheidungsbegriffe)
  const englishIndicators = [
    /\b(?:should|must|will|would|can|could|shall|may)\b/i,
    /\b(?:or|between|for|with|from|to|on|at|over|under)\b/i,
    /\b(?:decision|option|goal|objective|assumption|choose|decide)\b/i,
    /\b(?:we|our|us|ours)\b/i,
    /\b(?:is|are|was|were|will|would|be)\b/i,
  ];

  let germanScore = 0;
  let englishScore = 0;

  // Zähle deutsche Indikatoren
  for (const pattern of germanIndicators) {
    const matches = cleaned.match(pattern);
    if (matches) {
      germanScore += matches.length;
    }
  }

  // Zähle englische Indikatoren
  for (const pattern of englishIndicators) {
    const matches = cleaned.match(pattern);
    if (matches) {
      englishScore += matches.length;
    }
  }

  // Wenn beide Scores 0 sind, prüfe auf häufige deutsche/englische Wörter
  if (germanScore === 0 && englishScore === 0) {
    // Häufige deutsche Wörter
    const commonGerman = /\b(?:der|die|das|und|ist|sind|in|zu|auf|für)\b/i;
    const commonEnglish = /\b(?:the|and|is|are|in|to|on|for|of|a|an)\b/i;

    if (commonGerman.test(cleaned) && !commonEnglish.test(cleaned)) {
      return 'de';
    }
    if (commonEnglish.test(cleaned) && !commonGerman.test(cleaned)) {
      return 'en';
    }
  }

  // Entscheide basierend auf Score
  if (germanScore > englishScore) {
    return 'de';
  }
  if (englishScore > germanScore) {
    return 'en';
  }

  // Bei Gleichstand: Fallback auf Englisch
  return 'en';
}
