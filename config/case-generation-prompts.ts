// =====================================================
// CASE GENERATION PROMPT CONFIGURATION
// =====================================================
// Purpose: Centralized, typed prompt system for GPT case generation
// Architecture: SOLID principles, single responsibility, easy to extend

export interface CaseGenerationRequest {
  cluster: string;
  tool: string;
  difficulty: number;
  caseType: string;
  learningObjectives: string[];
  userDescription: string;
  estimatedDuration: number;
}

export interface CaseGenerationResult {
  description: string;
  question: string;
}

// Base prompt template with placeholders
const BASE_PROMPT = `Du bist ein Experte für Strategieberatung und Case-Interview-Training mit 15+ Jahren Erfahrung bei McKinsey, BCG und Bain.

AUFGABE: Erstelle eine professionelle Case-Beschreibung und eine korrespondierende Frage basierend auf den folgenden Parametern:

CASE-PARAMETER:
- Cluster: {cluster}
- Tool/Framework: {tool}
- Schwierigkeitsgrad: {difficulty}/12
- Case-Typ: {caseType}
- Geschätzte Dauer: {estimatedDuration} Minuten
- Learning Objectives: {learningObjectives}

USER-BESCHREIBUNG:
{userDescription}

SCHWIERIGKEITSGRAD-KONTEXT:
{difficultyContext}

WICHTIGE EINSCHRÄNKUNGEN FÜR DIE CASE-BESCHREIBUNG:
- Beschreibe NUR die Geschäftssituation und das Problem
- Erwähne KEINE Lösungsmethoden, Frameworks oder Analyseansätze
- Gib KEINE Hinweise darauf, wie das Problem gelöst werden soll
- Erwähne NICHT das Tool/Framework ({tool}) in der Beschreibung
- Fokussiere dich ausschließlich auf die Problemdarstellung
- Der Kandidat soll selbst herausfinden, welche Methodik anzuwenden ist

AUSGABE-FORMAT:
Antworte ausschließlich mit einem JSON-Objekt in folgendem Format:
{
  "description": "Reine Problemdarstellung ohne Lösungshinweise (200-400 Wörter)",
  "question": "Offene Frage die zur Problemlösung auffordert (1-2 Sätze)"
}

QUALITÄTSANFORDERUNGEN:
- Realistische Business-Situation
- Klare, messbare Problemstellung ohne Lösungshinweise
- Angemessene Komplexität für Schwierigkeitsgrad
- Problemorientiert, nicht lösungsorientiert
- Professionelle Sprache auf Consulting-Niveau`;

// Difficulty-specific contexts
const DIFFICULTY_CONTEXTS = {
  beginner: 'Fokus auf Grundlagen und klare Strukturen. Wenige Variablen, eindeutige Lösungswege.',
  intermediate:
    'Mittlere Komplexität mit mehreren Einflussfaktoren. Erfordert strukturiertes Denken.',
  advanced: 'Hohe Komplexität mit Ambiguität. Multiple Lösungsansätze möglich.',
  expert: 'Expertenebene mit komplexen Trade-offs und strategischen Implikationen.',
};

// Tool-context for internal use (not exposed in prompt)
// This helps ensure the problem is suitable for the intended tool without revealing it
const TOOL_CONTEXTS = {
  'Profit Tree & P&L': 'Profitabilitätsproblem mit Umsatz- und Kostenaspekten',
  'MECE-Prinzip': 'Problem das strukturierte Kategorisierung erfordert',
  'BCG Matrix': 'Portfolio- oder Multi-Business-Problem',
  "Porter's Five Forces": 'Branchenattraktivitäts- oder Wettbewerbsproblem',
  'Value Chain Analysis': 'Operatives Effizienz- oder Wertschöpfungsproblem',
  'Break-Even Analysis': 'Quantitatives Kosten-Nutzen-Problem',
  'Market Sizing': 'Marktpotential- oder Größenschätzungsproblem',
  'Customer Segmentation': 'Kundenorientiertes Segmentierungsproblem',
};

// Difficulty mapping function
function getDifficultyContext(difficulty: number): string {
  if (difficulty <= 3) return DIFFICULTY_CONTEXTS.beginner;
  if (difficulty <= 6) return DIFFICULTY_CONTEXTS.intermediate;
  if (difficulty <= 9) return DIFFICULTY_CONTEXTS.advanced;
  return DIFFICULTY_CONTEXTS.expert;
}

// Main prompt generation function
export function generateCasePrompt(request: CaseGenerationRequest): string {
  const difficultyContext = getDifficultyContext(request.difficulty);

  // Internal context to ensure problem fits the tool (not revealed to GPT)
  const toolContext =
    TOOL_CONTEXTS[request.tool as keyof typeof TOOL_CONTEXTS] || 'Allgemeines Business-Problem';

  // Add internal instruction to create problems suitable for the tool
  const enhancedDifficultyContext = `${difficultyContext} 
Erstelle ein ${toolContext}, ohne das spezifische Tool oder die Lösungsmethodik zu erwähnen.`;

  return BASE_PROMPT.replace('{cluster}', request.cluster)
    .replace('{tool}', request.tool)
    .replace('{difficulty}', request.difficulty.toString())
    .replace('{caseType}', request.caseType)
    .replace('{estimatedDuration}', request.estimatedDuration.toString())
    .replace('{learningObjectives}', request.learningObjectives.join(', '))
    .replace('{userDescription}', request.userDescription)
    .replace('{difficultyContext}', enhancedDifficultyContext);
}

// Validation function for GPT response
export function validateCaseGenerationResult(response: any): CaseGenerationResult {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format: Expected JSON object');
  }

  if (!response.description || typeof response.description !== 'string') {
    throw new Error('Invalid response: Missing or invalid description field');
  }

  if (!response.question || typeof response.question !== 'string') {
    throw new Error('Invalid response: Missing or invalid question field');
  }

  if (response.description.length < 100) {
    throw new Error('Description too short: Minimum 100 characters required');
  }

  if (response.question.length < 20) {
    throw new Error('Question too short: Minimum 20 characters required');
  }

  return {
    description: response.description.trim(),
    question: response.question.trim(),
  };
}
