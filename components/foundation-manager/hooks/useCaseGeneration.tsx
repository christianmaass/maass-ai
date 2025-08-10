import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FoundationCase } from './useFoundationCases';

interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  lastGenerated: {
    description?: string;
    question?: string;
  } | null;
}

interface UseCaseGenerationReturn {
  generationState: GenerationState;
  generateCaseContent: (
    selectedCase: FoundationCase,
    userDescription: string,
  ) => Promise<{ success: boolean; description?: string; question?: string; error?: string }>;
  clearGenerationState: () => void;
}

export const useCaseGeneration = (): UseCaseGenerationReturn => {
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    lastGenerated: null,
  });
  const { user } = useAuth();

  const generateCaseContent = async (
    selectedCase: FoundationCase,
    userDescription: string,
  ): Promise<{ success: boolean; description?: string; question?: string; error?: string }> => {
    try {
      setGenerationState((prev) => ({
        ...prev,
        isGenerating: true,
        error: null,
      }));

      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!selectedCase) {
        throw new Error('No case selected for generation');
      }

      if (!userDescription.trim()) {
        throw new Error('User description is required for generation');
      }

      const response = await fetch('/api/admin/generate-case-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`, // TODO: Get proper access token
        },
        body: JSON.stringify({
          caseId: selectedCase.id,
          userDescription: userDescription.trim(),
          caseData: {
            title: selectedCase.title,
            cluster: selectedCase.cluster,
            case_type: selectedCase.case_type,
            difficulty: selectedCase.difficulty,
            learning_objectives: selectedCase.learning_objectives,
            tool: selectedCase.tool,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate content`);
      }

      const result = await response.json();

      if (result.success && result.description && result.question) {
        const generatedContent = {
          description: result.description,
          question: result.question,
        };

        setGenerationState((prev) => ({
          ...prev,
          isGenerating: false,
          lastGenerated: generatedContent,
          error: null,
        }));

        return {
          success: true,
          description: result.description,
          question: result.question,
        };
      } else {
        throw new Error(result.error || 'Generation failed - no content returned');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during generation';

      setGenerationState((prev) => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
        lastGenerated: null,
      }));

      console.error('Error generating case content:', err);

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const clearGenerationState = () => {
    setGenerationState({
      isGenerating: false,
      error: null,
      lastGenerated: null,
    });
  };

  return {
    generationState,
    generateCaseContent,
    clearGenerationState,
  };
};

export type { GenerationState, UseCaseGenerationReturn };
