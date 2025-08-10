// =====================================================
// MODULE ADAPTERS - TYPESCRIPT CONFLICT RESOLUTION
// SOLID: Adapter Pattern - Bridges incompatible interfaces
// =====================================================

import {
  ModuleAdapter,
  UnifiedModuleProps,
  UnifiedModuleData,
  ModuleAdapterRegistry,
} from '../types/unified-module.types';

// Import existing component types
import { ContentModuleComponentProps } from '../components/ContentModuleComponent';
import { FreeTextWithFeedbackProps } from '../components/FreeTextWithFeedbackComponent';
import { DecisionMatrixComponentProps } from '../components/DecisionMatrixComponent';

/**
 * Content Module Adapter
 * SOLID: Adapter Pattern - Resolves ContentModule interface conflicts
 */
export const contentModuleAdapter: ModuleAdapter = {
  adaptProps: (unifiedProps: UnifiedModuleProps): ContentModuleComponentProps => {
    const existingContent = unifiedProps.existingData
      ? {
          id: unifiedProps.existingData.id,
          title: unifiedProps.existingData.data.title || '',
          content: unifiedProps.existingData.data.content || '',
          image_url: unifiedProps.existingData.data.image_url,
          generation_prompt: unifiedProps.existingData.data.generation_prompt,
          generated_by_gpt: true,
        }
      : undefined;

    return {
      caseId: unifiedProps.caseId,
      stepNumber: unifiedProps.stepNumber,
      stepName: unifiedProps.stepName,
      existingContent,
      onGenerate: unifiedProps.callbacks.onGenerate || (async () => {}),
      onSave: async (content) => {
        const unifiedData: UnifiedModuleData = {
          caseId: unifiedProps.caseId,
          stepNumber: unifiedProps.stepNumber,
          moduleType: 'content_module',
          data: {
            title: content.title,
            content: content.content,
            image_url: content.image_url,
            generation_prompt: content.generation_prompt,
          },
        };
        await unifiedProps.callbacks.onSave(unifiedData);
      },
      isGenerating: unifiedProps.isGenerating,
    };
  },

  adaptData: (componentData: any, caseId: string, stepNumber: number): UnifiedModuleData => ({
    caseId,
    stepNumber,
    moduleType: 'content_module',
    data: {
      title: componentData.title,
      content: componentData.content,
      image_url: componentData.image_url,
      generation_prompt: componentData.generation_prompt,
    },
  }),

  extractData: (unifiedData: UnifiedModuleData) => {
    if (unifiedData.moduleType !== 'content_module') return undefined;
    return {
      id: unifiedData.id,
      title: unifiedData.data.title || '',
      content: unifiedData.data.content || '',
      image_url: unifiedData.data.image_url,
      generation_prompt: unifiedData.data.generation_prompt,
      generated_by_gpt: true,
    };
  },
};

/**
 * Free Text Adapter
 * SOLID: Adapter Pattern - Resolves FreeText interface conflicts
 */
export const freeTextAdapter: ModuleAdapter = {
  adaptProps: (unifiedProps: UnifiedModuleProps): FreeTextWithFeedbackProps => {
    const existingResponse = unifiedProps.existingData
      ? {
          id: unifiedProps.existingData.id,
          user_response: unifiedProps.existingData.data.user_response || '',
          gpt_feedback: undefined, // Will be loaded separately
        }
      : undefined;

    return {
      caseId: unifiedProps.caseId,
      stepNumber: unifiedProps.stepNumber,
      stepName: unifiedProps.stepName,
      prompt:
        unifiedProps.existingData?.data.prompt || `Ihre Antwort für ${unifiedProps.stepName}...`,
      existingResponse,
      onSubmit: async (caseId, stepNumber, userResponse, promptText) => {
        const unifiedData: UnifiedModuleData = {
          caseId,
          stepNumber,
          moduleType: 'free_text',
          data: {
            user_response: userResponse,
            prompt: promptText,
          },
        };
        await unifiedProps.callbacks.onSave(unifiedData);
      },
      isEvaluating: unifiedProps.isLoading,
    };
  },

  adaptData: (componentData: any, caseId: string, stepNumber: number): UnifiedModuleData => ({
    caseId,
    stepNumber,
    moduleType: 'free_text',
    data: {
      user_response: componentData.user_response,
      prompt: componentData.prompt,
    },
  }),

  extractData: (unifiedData: UnifiedModuleData) => {
    if (unifiedData.moduleType !== 'free_text') return undefined;
    return {
      id: unifiedData.id,
      user_response: unifiedData.data.user_response || '',
      prompt: unifiedData.data.prompt,
    };
  },
};

/**
 * Decision Matrix Adapter
 * SOLID: Adapter Pattern - Resolves DecisionMatrix interface conflicts
 */
export const decisionMatrixAdapter: ModuleAdapter = {
  adaptProps: (unifiedProps: UnifiedModuleProps): DecisionMatrixComponentProps => {
    // Default decision options - can be made configurable later
    const defaultOptions = [
      {
        id: 'A',
        name: 'Preiserhöhung',
        marge: 'Hoch',
        umsetzbarkeit: 'Mittel',
        zeit: 'Kurzfristig',
        risiken: 'Kundenabwanderung möglich',
      },
      {
        id: 'B',
        name: 'R&D-Kürzung',
        marge: 'Mittel',
        umsetzbarkeit: 'Hoch',
        zeit: 'Sofort',
        risiken: 'Innovation bremst',
      },
      {
        id: 'C',
        name: 'Neue Linie',
        marge: 'Hoch',
        umsetzbarkeit: 'Gering',
        zeit: 'Langfristig',
        risiken: 'Hoher CAPEX, unsicher',
      },
    ];

    const existingDecision = unifiedProps.existingData
      ? {
          id: unifiedProps.existingData.id,
          selected_option: unifiedProps.existingData.data.selected_option || '',
          reasoning: unifiedProps.existingData.data.reasoning || '',
          decision_matrix: unifiedProps.existingData.data.decision_matrix,
        }
      : undefined;

    return {
      caseId: unifiedProps.caseId,
      stepNumber: unifiedProps.stepNumber,
      stepName: unifiedProps.stepName,
      title: `Entscheidungsmatrix - ${unifiedProps.stepName}`,
      options: defaultOptions, // FIXED: Required options property
      existingDecision,
      onSave: async (caseId, stepNumber, selectedOption, reasoning, decisionMatrix) => {
        const unifiedData: UnifiedModuleData = {
          caseId,
          stepNumber,
          moduleType: 'decision_matrix',
          data: {
            selected_option: selectedOption,
            reasoning,
            decision_matrix: decisionMatrix,
          },
        };
        await unifiedProps.callbacks.onSave(unifiedData);
      },
      isSaving: unifiedProps.isLoading,
    };
  },

  adaptData: (componentData: any, caseId: string, stepNumber: number): UnifiedModuleData => ({
    caseId,
    stepNumber,
    moduleType: 'decision_matrix',
    data: {
      selected_option: componentData.selected_option,
      reasoning: componentData.reasoning,
      decision_matrix: componentData.decision_matrix,
    },
  }),

  extractData: (unifiedData: UnifiedModuleData) => {
    if (unifiedData.moduleType !== 'decision_matrix') return undefined;
    return {
      id: unifiedData.id,
      selected_option: unifiedData.data.selected_option || '',
      reasoning: unifiedData.data.reasoning || '',
      decision_matrix: unifiedData.data.decision_matrix,
    };
  },
};

/**
 * Simple Text Input Adapter
 * SOLID: Adapter Pattern - Handles SimpleTextInputComponent
 */
export const textInputAdapter: ModuleAdapter = {
  adaptProps: (unifiedProps: UnifiedModuleProps) => {
    const existingInput = unifiedProps.existingData
      ? {
          user_input: unifiedProps.existingData.data.user_input || '',
          explanation: unifiedProps.existingData.data.explanation || '',
        }
      : undefined;

    return {
      caseId: unifiedProps.caseId,
      stepNumber: unifiedProps.stepNumber,
      stepName: unifiedProps.stepName,
      placeholder: `Ihre Eingabe für ${unifiedProps.stepName}...`,
      explanationPlaceholder: 'Erklärung oder Begründung...',
      existingInput,
      onSave: async (
        caseId: string,
        stepNumber: number,
        userInput: string,
        explanation?: string,
      ) => {
        const unifiedData: UnifiedModuleData = {
          caseId,
          stepNumber,
          moduleType: 'text_input',
          data: {
            user_input: userInput,
            explanation,
          },
        };
        await unifiedProps.callbacks.onSave(unifiedData);
      },
      isSaving: unifiedProps.isLoading,
    };
  },

  adaptData: (componentData: any, caseId: string, stepNumber: number): UnifiedModuleData => ({
    caseId,
    stepNumber,
    moduleType: 'text_input',
    data: {
      user_input: componentData.user_input,
      explanation: componentData.explanation,
    },
  }),

  extractData: (unifiedData: UnifiedModuleData) => {
    if (unifiedData.moduleType !== 'text_input') return undefined;
    return {
      user_input: unifiedData.data.user_input || '',
      explanation: unifiedData.data.explanation || '',
    };
  },
};

/**
 * Voice Input Adapter
 * SOLID: Adapter Pattern - Handles VoiceInputComponent
 */
export const voiceInputAdapter: ModuleAdapter = {
  adaptProps: (unifiedProps: UnifiedModuleProps) => {
    const existingInput = unifiedProps.existingData
      ? {
          voice_transcript: unifiedProps.existingData.data.voice_transcript || '',
          text_fallback: unifiedProps.existingData.data.text_fallback,
          input_method: (unifiedProps.existingData.data.input_method as 'voice' | 'text') || 'text',
          audio_duration: unifiedProps.existingData.data.audio_duration,
        }
      : undefined;

    return {
      caseId: unifiedProps.caseId,
      stepNumber: unifiedProps.stepNumber,
      stepName: unifiedProps.stepName,
      placeholder: `Sprechen Sie Ihre Antwort für ${unifiedProps.stepName} ein...`,
      existingInput,
      onSave: async (
        caseId: string,
        stepNumber: number,
        voiceTranscript: string,
        textFallback?: string,
        inputMethod?: 'voice' | 'text',
        audioDuration?: number,
      ) => {
        const unifiedData: UnifiedModuleData = {
          caseId,
          stepNumber,
          moduleType: 'voice_input',
          data: {
            voice_transcript: voiceTranscript,
            text_fallback: textFallback,
            input_method: inputMethod || 'text',
            audio_duration: audioDuration,
          },
        };
        await unifiedProps.callbacks.onSave(unifiedData);
      },
      isSaving: unifiedProps.isLoading,
    };
  },

  adaptData: (componentData: any, caseId: string, stepNumber: number): UnifiedModuleData => ({
    caseId,
    stepNumber,
    moduleType: 'voice_input',
    data: {
      voice_transcript: componentData.voice_transcript,
      text_fallback: componentData.text_fallback,
      input_method: componentData.input_method,
      audio_duration: componentData.audio_duration,
    },
  }),

  extractData: (unifiedData: UnifiedModuleData) => {
    if (unifiedData.moduleType !== 'voice_input') return undefined;
    return {
      voice_transcript: unifiedData.data.voice_transcript || '',
      text_fallback: unifiedData.data.text_fallback,
      input_method: (unifiedData.data.input_method as 'voice' | 'text') || 'text',
      audio_duration: unifiedData.data.audio_duration,
    };
  },
};

/**
 * Multiple Choice Adapter
 * SOLID: Adapter Pattern - Handles MultipleChoiceComponent
 */
export const multipleChoiceAdapter: ModuleAdapter = {
  adaptProps: (unifiedProps: UnifiedModuleProps) => {
    return {
      caseId: unifiedProps.caseId,
      stepNumber: unifiedProps.stepNumber,
      stepName: unifiedProps.stepName,
      questions: [], // Will be loaded from existing data
      onGenerate: unifiedProps.callbacks.onGenerate || (async () => {}),
      onQuestionUpdate: async (questions: any[]) => {
        const unifiedData: UnifiedModuleData = {
          caseId: unifiedProps.caseId,
          stepNumber: unifiedProps.stepNumber,
          moduleType: 'multiple_choice',
          data: {
            selectedAnswers: questions.map((q) => q.selectedAnswer).filter(Boolean),
          },
        };
        await unifiedProps.callbacks.onSave(unifiedData);
      },
      isGenerating: unifiedProps.isGenerating,
    };
  },

  adaptData: (componentData: any, caseId: string, stepNumber: number): UnifiedModuleData => ({
    caseId,
    stepNumber,
    moduleType: 'multiple_choice',
    data: {
      selectedAnswers: componentData.selectedAnswers || [],
    },
  }),

  extractData: (unifiedData: UnifiedModuleData) => {
    if (unifiedData.moduleType !== 'multiple_choice') return undefined;
    return {
      selectedAnswers: unifiedData.data.selectedAnswers || [],
    };
  },
};

/**
 * Module Adapter Registry
 * SOLID: Registry Pattern - Central registry for all adapters
 */
export const moduleAdapterRegistry: ModuleAdapterRegistry = {
  multiple_choice: multipleChoiceAdapter,
  content_module: contentModuleAdapter,
  free_text: freeTextAdapter,
  text_input: textInputAdapter,
  decision_matrix: decisionMatrixAdapter,
  voice_input: voiceInputAdapter,
};

/**
 * Utility function to get adapter by module type
 * SOLID: Factory Pattern
 */
export const getModuleAdapter = (moduleType: keyof ModuleAdapterRegistry): ModuleAdapter => {
  const adapter = moduleAdapterRegistry[moduleType];
  if (!adapter) {
    throw new Error(`No adapter found for module type: ${moduleType}`);
  }
  return adapter;
};
