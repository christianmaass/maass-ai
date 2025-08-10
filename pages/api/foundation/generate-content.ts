/**
 * FOUNDATION GENERATE-CONTENT API
 * Migrated to navaa Auth Guidelines (WP-C1)
 *
 * COMPLIANCE:
 * - Uses withAuth() middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Secure foundation content generation with proper authentication
 * - OpenAI integration with authenticated user context
 *
 * @version 2.0.0 (WP-C1 Backend Migration)
 */

import { NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { withAuth, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';

// Initialize Supabase client with service role for API access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateContentRequest {
  case_id: string;
  step_index: number;
  step_title: string;
  learning_forms: string[];
  framework?: string;
  case_description: {
    introduction?: string;
    situation?: string;
    question?: string;
    context?: string[];
  };
}

interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

interface FrameworkTemplate {
  type: string;
  title: string;
  description: string;
  structure: any;
  instructions: string;
}

interface TipsAndHints {
  tips: string[];
  hints: string[];
  best_practices: string[];
}

// Main API handler with Auth Middleware (WP-C1 Migration)
async function foundationGenerateContentHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-C1 Migration)
  const userId = getUserId(req); // User already validated by withAuth() middleware

  try {
    const {
      case_id,
      step_index,
      step_title,
      learning_forms,
      framework,
      case_description,
    }: GenerateContentRequest = req.body;

    // Validate required fields
    if (!case_id || step_index === undefined || !step_title || !learning_forms) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let generatedContent: any = {};

    // Generate Multiple Choice Questions
    if (learning_forms.includes('multiple_choice')) {
      console.log('🎯 Generating Multiple Choice Questions...');
      const mcQuestions = await generateMultipleChoiceQuestions(
        step_title,
        case_description,
        framework,
      );
      generatedContent.multiple_choice_questions = mcQuestions;
    }

    // Generate Framework Templates
    if (learning_forms.includes('framework') && framework) {
      console.log('🔧 Generating Framework Template...');
      const frameworkTemplate = await generateFrameworkTemplate(
        framework,
        step_title,
        case_description,
      );
      generatedContent.framework_template = frameworkTemplate;
    }

    // Generate Tips and Hints
    if (learning_forms.includes('tips_hints')) {
      console.log('💡 Generating Tips and Hints...');
      const tipsAndHints = await generateTipsAndHints(step_title, case_description, framework);
      generatedContent.tips_and_hints = tipsAndHints;
    }

    // Update the case content in database - CLEAN STRUCTURE
    console.log('🔍 Fetching case with ID:', case_id);

    const { data: existingCase, error: fetchError } = await supabase
      .from('foundation_cases')
      .select('content, title, id')
      .eq('id', case_id)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching existing case:', fetchError);
      console.error('Case ID attempted:', case_id);

      // Check if case exists at all
      const { data: allCases } = await supabase
        .from('foundation_cases')
        .select('id, title')
        .limit(5);

      console.log(
        'Available cases:',
        allCases?.map((c) => c.id),
      );
      return res.status(404).json({
        error: `Case with ID '${case_id}' not found`,
        available_cases: allCases?.map((c) => c.id) || [],
      });
    }

    if (!existingCase) {
      console.error('❌ No case data returned for ID:', case_id);
      return res.status(404).json({ error: `Case '${case_id}' not found` });
    }

    console.log('✅ Successfully fetched case:', existingCase.title);

    // Create clean step-specific content structure
    const existingContent = existingCase.content || {};
    const stepContentKey = `step_${step_index}`;

    // Initialize step_content if it doesn't exist
    if (!existingContent.step_content) {
      existingContent.step_content = {};
    }

    // Store generated content for this specific step
    existingContent.step_content[stepContentKey] = {
      ...generatedContent,
      step_title: step_title,
      framework: framework,
      generated_at: new Date().toISOString(),
      learning_forms: learning_forms,
    };

    // For backwards compatibility, also update global MC questions if generated
    if (generatedContent.multiple_choice_questions) {
      existingContent.multiple_choice_questions = generatedContent.multiple_choice_questions;
    }

    const updatedContent = existingContent;

    // Save updated content to database
    const { error: updateError } = await supabase
      .from('foundation_cases')
      .update({ content: updatedContent })
      .eq('id', case_id);

    if (updateError) {
      console.error('Error updating case content:', updateError);
      return res.status(500).json({ error: 'Failed to update case content' });
    }

    console.log('✅ Content generation completed successfully');

    res.status(200).json({
      success: true,
      generated_content: generatedContent,
      message: 'Content erfolgreich generiert!',
    });
  } catch (error) {
    console.error('Error in content generation:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Export handler with Auth Middleware (WP-C1 Migration)
export default withAuth(foundationGenerateContentHandler);

async function generateMultipleChoiceQuestions(
  stepTitle: string,
  caseDescription: any,
  framework?: string,
): Promise<MultipleChoiceQuestion[]> {
  const prompt = `
Du bist ein Experte für Consulting Case Studies. Generiere 4 Multiple Choice Fragen für folgenden Step:

**Step:** ${stepTitle}
**Framework:** ${framework || 'Allgemein'}
**Case Situation:** ${caseDescription.situation || 'Nicht verfügbar'}
**Zentrale Frage:** ${caseDescription.question || 'Nicht verfügbar'}

Erstelle 4 Multiple Choice Fragen, die:
1. Relevant für den Step "${stepTitle}" sind
2. Das Framework "${framework}" berücksichtigen (falls vorhanden)
3. Auf der Case-Situation basieren
4. Verschiedene Schwierigkeitsgrade haben
5. Realistische Consulting-Szenarien abbilden

Jede Frage soll:
- 4 Antwortoptionen haben (A, B, C, D)
- Genau eine richtige Antwort
- Detaillierte Erklärungen für jede Option

Format als JSON Array mit dieser Struktur:
[
  {
    "id": "mc1",
    "question": "Frage hier...",
    "options": [
      {"id": "a", "text": "Option A", "correct": true, "explanation": "Erklärung warum richtig"},
      {"id": "b", "text": "Option B", "correct": false, "explanation": "Erklärung warum falsch"},
      {"id": "c", "text": "Option C", "correct": false, "explanation": "Erklärung warum falsch"},
      {"id": "d", "text": "Option D", "correct": false, "explanation": "Erklärung warum falsch"}
    ]
  }
]
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Du bist ein Experte für Consulting Case Studies und Multiple Choice Fragen. Antworte immer mit gültigem JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse JSON response
    const questions = JSON.parse(content);
    return questions;
  } catch (error) {
    console.error('Error generating MC questions:', error);
    // Return fallback questions
    return [
      {
        id: 'mc1',
        question: `Welcher Aspekt ist für "${stepTitle}" am wichtigsten?`,
        options: [
          {
            id: 'a',
            text: 'Strukturierte Herangehensweise',
            correct: true,
            explanation:
              'Eine strukturierte Herangehensweise ist fundamental für erfolgreiche Consulting-Arbeit.',
          },
          {
            id: 'b',
            text: 'Schnelle Lösungen',
            correct: false,
            explanation:
              'Schnelle Lösungen ohne Struktur führen oft zu oberflächlichen Ergebnissen.',
          },
          {
            id: 'c',
            text: 'Komplexe Analysen',
            correct: false,
            explanation: 'Komplexität um der Komplexität willen ist nicht zielführend.',
          },
          {
            id: 'd',
            text: 'Intuitive Entscheidungen',
            correct: false,
            explanation:
              'Intuition allein reicht in professionellen Consulting-Projekten nicht aus.',
          },
        ],
      },
    ];
  }
}

async function generateFrameworkTemplate(
  framework: string,
  stepTitle: string,
  caseDescription: any,
): Promise<FrameworkTemplate> {
  const frameworkDescriptions: Record<string, string> = {
    profit_tree: 'Profit Tree: Systematische Aufschlüsselung von Gewinn = Umsatz - Kosten',
    revenue_tree: 'Revenue Tree: Detaillierte Analyse von Umsatz = Anzahl Kunden × Preis pro Kunde',
    market_entry: 'Market Entry Framework: Strukturierte Markteintrittsstrategie',
    cost_structure: 'Cost Structure Analysis: Systematische Kostenoptimierung',
    porter_5_forces: 'Porter 5 Forces: Wettbewerbsanalyse der Branchenkräfte',
    go_to_market: 'Go-to-Market Strategy: Produktlaunch und Markterschließung',
    process_optimization: 'Process Optimization: Effizienzsteigerung in Geschäftsprozessen',
    ma_framework: 'M&A Framework: Akquisitions- und Fusionsbewertung',
    digital_transformation: 'Digital Transformation: Digitalisierungsstrategie',
    scaling_framework: 'Scaling Framework: Skalierungsstrategien für Wachstum',
    pricing_framework: 'Pricing Framework: Preisstrategie und -optimierung',
    restructuring_framework: 'Restructuring Framework: Unternehmensrestrukturierung',
  };

  const prompt = `
Erstelle ein detailliertes Framework-Template für:

**Framework:** ${frameworkDescriptions[framework] || framework}
**Step:** ${stepTitle}
**Case Situation:** ${caseDescription.situation || 'Nicht verfügbar'}
**Zentrale Frage:** ${caseDescription.question || 'Nicht verfügbar'}

Das Template soll:
1. Eine klare Struktur für das Framework bieten
2. Spezifisch für den Step "${stepTitle}" angepasst sein
3. Konkrete Arbeitsschritte enthalten
4. Auf der Case-Situation basieren
5. Praktische Anwendung ermöglichen

Format als JSON mit dieser Struktur:
{
  "type": "${framework}",
  "title": "Framework Titel",
  "description": "Kurze Beschreibung des Frameworks",
  "structure": {
    "main_categories": ["Kategorie 1", "Kategorie 2", "..."],
    "sub_elements": {
      "Kategorie 1": ["Element 1.1", "Element 1.2"],
      "Kategorie 2": ["Element 2.1", "Element 2.2"]
    }
  },
  "instructions": "Schritt-für-Schritt Anleitung zur Anwendung"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Du bist ein Experte für Consulting Frameworks. Antworte immer mit gültigem JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating framework template:', error);
    // Return fallback template
    return {
      type: framework,
      title: `${framework} Template`,
      description: `Strukturiertes Template für ${framework} im Kontext von ${stepTitle}`,
      structure: {
        main_categories: ['Analyse', 'Bewertung', 'Empfehlung'],
        sub_elements: {
          Analyse: ['Datensammlung', 'Strukturierung', 'Bewertung'],
          Bewertung: ['Kriterien definieren', 'Optionen bewerten', 'Risiken analysieren'],
          Empfehlung: ['Lösung formulieren', 'Umsetzungsplan', 'Next Steps'],
        },
      },
      instructions: `1. Beginne mit der Datensammlung\n2. Strukturiere die Informationen nach dem ${framework}\n3. Bewerte die Optionen systematisch\n4. Formuliere klare Empfehlungen`,
    };
  }
}

async function generateTipsAndHints(
  stepTitle: string,
  caseDescription: any,
  framework?: string,
): Promise<TipsAndHints> {
  const prompt = `
Generiere hilfreiche Tipps und Hinweise für:

**Step:** ${stepTitle}
**Framework:** ${framework || 'Allgemein'}
**Case Situation:** ${caseDescription.situation || 'Nicht verfügbar'}
**Zentrale Frage:** ${caseDescription.question || 'Nicht verfügbar'}

Erstelle:
1. 4-5 praktische Tipps für diesen Step
2. 3-4 konkrete Hinweise zur Herangehensweise
3. 3-4 Best Practices aus der Consulting-Praxis

Die Tipps sollen:
- Spezifisch für "${stepTitle}" sein
- Das Framework "${framework}" berücksichtigen (falls vorhanden)
- Auf der Case-Situation basieren
- Praktisch anwendbar sein
- Häufige Fehler vermeiden helfen

Format als JSON:
{
  "tips": ["Tipp 1", "Tipp 2", "..."],
  "hints": ["Hinweis 1", "Hinweis 2", "..."],
  "best_practices": ["Best Practice 1", "Best Practice 2", "..."]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein erfahrener Consulting-Coach. Antworte immer mit gültigem JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating tips and hints:', error);
    // Return fallback tips
    return {
      tips: [
        `Beginne ${stepTitle} mit einer klaren Struktur`,
        'Sammle alle relevanten Informationen systematisch',
        'Priorisiere die wichtigsten Aspekte',
        'Dokumentiere deine Gedankengänge',
        'Überprüfe deine Annahmen regelmäßig',
      ],
      hints: [
        'Verwende das MECE-Prinzip (Mutually Exclusive, Collectively Exhaustive)',
        'Stelle die richtigen Fragen zur richtigen Zeit',
        'Fokussiere auf die kritischen Erfolgsfaktoren',
        'Berücksichtige sowohl quantitative als auch qualitative Faktoren',
      ],
      best_practices: [
        'Strukturiere deine Analyse von oben nach unten',
        'Validiere deine Hypothesen mit Daten',
        'Kommuniziere deine Erkenntnisse klar und prägnant',
        'Denke immer an die praktische Umsetzbarkeit',
      ],
    };
  }
}
