// =====================================================
// CASE GENERATION SERVICE
// =====================================================
// Purpose: Single responsibility service for GPT-based case generation
// Architecture: SOLID principles, dependency injection ready, testable

import {
  CaseGenerationRequest,
  CaseGenerationResult,
  generateCasePrompt,
  validateCaseGenerationResult,
} from '@config/case-generation-prompts';

export interface GPTProvider {
  generateCompletion(prompt: string): Promise<string>;
}

export class OpenAIProvider implements GPTProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateCompletion(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'Du bist ein Experte für Strategieberatung und Case-Interview-Training. Antworte ausschließlich mit validen JSON-Objekten.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`,
      );
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    return data.choices[0].message.content;
  }
}

export class CaseGenerationService {
  private gptProvider: GPTProvider;

  constructor(gptProvider: GPTProvider) {
    this.gptProvider = gptProvider;
  }

  async generateCase(request: CaseGenerationRequest): Promise<CaseGenerationResult> {
    try {
      // 1. Generate prompt
      const prompt = generateCasePrompt(request);

      // 2. Call GPT API
      const rawResponse = await this.gptProvider.generateCompletion(prompt);

      // 3. Parse and validate response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(rawResponse);
      } catch (parseError) {
        throw new Error(`Failed to parse GPT response as JSON: ${parseError}`);
      }

      // 4. Validate structure
      const validatedResult = validateCaseGenerationResult(parsedResponse);

      return validatedResult;
    } catch (error) {
      console.error('Case generation failed:', error);

      // Fallback strategy for production stability
      if (error instanceof Error) {
        throw new Error(`Case generation failed: ${error.message}`);
      }

      throw new Error('Case generation failed: Unknown error');
    }
  }

  // Health check method for monitoring
  async healthCheck(): Promise<boolean> {
    try {
      const testRequest: CaseGenerationRequest = {
        cluster: 'Test',
        tool: 'Test Framework',
        difficulty: 1,
        caseType: 'Test Case',
        learningObjectives: ['Test objective'],
        userDescription: 'This is a health check test',
        estimatedDuration: 30,
      };

      const result = await this.generateCase(testRequest);
      return !!(result.description && result.question);
    } catch {
      return false;
    }
  }
}

// Factory function for dependency injection
export function createCaseGenerationService(): CaseGenerationService {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const gptProvider = new OpenAIProvider(apiKey);
  return new CaseGenerationService(gptProvider);
}
