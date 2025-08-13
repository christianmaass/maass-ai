import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';
import ConditionalModuleRenderer from '@components/ConditionalModuleRenderer';

// Types
interface FoundationCase {
  id: string;
  title: string;
  cluster: string;
  case_type: string;
  difficulty: number;
  learning_objectives: string[];
  case_description?: string;
  case_question?: string;
  estimated_duration?: number;
}

interface StepModuleConfig {
  multiple_choice: boolean;
  content_module: boolean;
  free_text: boolean;
  text_input: boolean;
  decision_matrix: boolean;
  voice_input: boolean;
}

interface FoundationStepProps {
  stepNumber: number;
  stepName: string;
  foundationCase: FoundationCase;
  stepConfig: StepModuleConfig;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  isLastStep: boolean;
}

const FoundationStep: React.FC<FoundationStepProps> = ({
  stepNumber,
  stepName,
  foundationCase,
  stepConfig,
  onNext,
  onBack,
  onComplete,
  isLastStep,
}) => {
  const [moduleStates, setModuleStates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // moved below loader functions to avoid TDZ

  const loadMultipleChoice = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/get-multiple-choice?caseId=${foundationCase.id}&stepNumber=${stepNumber}`,
        {
          headers: { Authorization: `Bearer ${user?.id}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        updateModuleState('multipleChoice', data.questions || []);
      }
    } catch (err) {
      console.error('Error loading multiple choice:', err);
    }
  }, [foundationCase.id, stepNumber, user?.id]);

  const loadContentModule = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/get-content-module?caseId=${foundationCase.id}&stepNumber=${stepNumber}`,
        {
          headers: { Authorization: `Bearer ${user?.id}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        updateModuleState('contentModule', data.content);
      }
    } catch (err) {
      console.error('Error loading content module:', err);
    }
  }, [foundationCase.id, stepNumber, user?.id]);

  const loadFreeText = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/get-free-text?caseId=${foundationCase.id}&stepNumber=${stepNumber}`,
        {
          headers: { Authorization: `Bearer ${user?.id}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        updateModuleState('freeText', data.response);
      }
    } catch (err) {
      console.error('Error loading free text:', err);
    }
  }, [foundationCase.id, stepNumber, user?.id]);

  const loadTextInput = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/get-text-input?caseId=${foundationCase.id}&stepNumber=${stepNumber}`,
        {
          headers: { Authorization: `Bearer ${user?.id}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        updateModuleState('textInput', data.input);
      }
    } catch (err) {
      console.error('Error loading text input:', err);
    }
  }, [foundationCase.id, stepNumber, user?.id]);

  const loadDecisionMatrix = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/get-decision?caseId=${foundationCase.id}&stepNumber=${stepNumber}`,
        {
          headers: { Authorization: `Bearer ${user?.id}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        updateModuleState('decisionMatrix', data.decision);
      }
    } catch (err) {
      console.error('Error loading decision matrix:', err);
    }
  }, [foundationCase.id, stepNumber, user?.id]);

  const loadVoiceInput = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/admin/get-voice-input?caseId=${foundationCase.id}&stepNumber=${stepNumber}`,
        {
          headers: { Authorization: `Bearer ${user?.id}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        updateModuleState('voiceInput', data.input);
      }
    } catch (err) {
      console.error('Error loading voice input:', err);
    }
  }, [foundationCase.id, stepNumber, user?.id]);

  const loadModuleData = useCallback(async () => {
    try {
      setLoading(true);

      const promises: Promise<void>[] = [];

      if (stepConfig.multiple_choice) promises.push(loadMultipleChoice());
      if (stepConfig.content_module) promises.push(loadContentModule());
      if (stepConfig.free_text) promises.push(loadFreeText());
      if (stepConfig.text_input) promises.push(loadTextInput());
      if (stepConfig.decision_matrix) promises.push(loadDecisionMatrix());
      if (stepConfig.voice_input) promises.push(loadVoiceInput());

      await Promise.all(promises);
    } catch (err) {
      console.error('Error loading module data:', err);
    } finally {
      setLoading(false);
    }
  }, [
    stepConfig,
    loadMultipleChoice,
    loadContentModule,
    loadFreeText,
    loadTextInput,
    loadDecisionMatrix,
    loadVoiceInput,
  ]);

  useEffect(() => {
    if (user?.id && foundationCase?.id) {
      loadModuleData();
    }
  }, [user?.id, foundationCase?.id, stepNumber, loadModuleData]);

  const updateModuleState = (moduleType: string, data: any) => {
    setModuleStates((prev) => ({
      ...prev,
      [moduleType]: data,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bfae] mx-auto mb-4"></div>
          <p className="text-gray-600">Schritt-Inhalte werden geladen...</p>
        </div>
      </div>
    );
  }

  // Null-safety check for stepConfig
  if (!stepConfig) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600">Schritt-Konfiguration konnte nicht geladen werden.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Schritt {stepNumber}: {stepName}
        </h1>
        <p className="text-gray-600">
          Bearbeiten Sie diesen Schritt des Foundation Learning Prozesses
        </p>
      </div>

      {/* Module Content */}
      <div className="space-y-8">
        <ConditionalModuleRenderer
          stepNumber={stepNumber}
          stepConfig={stepConfig}
          caseId={foundationCase.id}
          stepName={stepName}
          // Multiple Choice Props
          multipleChoiceProps={
            stepConfig.multiple_choice
              ? {
                  questions: moduleStates.multipleChoice || [],
                  onGenerate: async (caseId: string, stepNumber: number) => {
                    const response = await fetch('/api/admin/generate-multiple-choice', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.id}`,
                      },
                      body: JSON.stringify({ caseId, stepNumber }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      updateModuleState('multipleChoice', data.questions);
                    }
                  },
                  onQuestionUpdate: (questions: any[]) => {
                    updateModuleState('multipleChoice', questions);
                  },
                  isGenerating: false,
                }
              : undefined
          }
          // Content Module Props
          contentModuleProps={
            stepConfig.content_module
              ? {
                  existingContent: moduleStates.contentModule,
                  onGenerate: async (caseId: string, stepNumber: number, prompt: string) => {
                    const response = await fetch('/api/admin/generate-content-module', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.id}`,
                      },
                      body: JSON.stringify({ caseId, stepNumber, prompt }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      updateModuleState('contentModule', data.content);
                    }
                  },
                  isGenerating: false,
                }
              : undefined
          }
          // Free Text Props
          freeTextProps={
            stepConfig.free_text
              ? {
                  existingResponse: moduleStates.freeText,
                  prompt: `Formulieren Sie eine fundierte Hypothese für ${foundationCase.title} in Schritt ${stepNumber}.`,
                  onSubmit: async (
                    caseId: string,
                    stepNumber: number,
                    userResponse: string,
                    promptText: string,
                  ) => {
                    const response = await fetch('/api/admin/evaluate-free-text', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.id}`,
                      },
                      body: JSON.stringify({ caseId, stepNumber, userResponse, promptText }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      updateModuleState('freeText', {
                        user_response: userResponse,
                        gpt_feedback: data.feedback,
                        id: data.responseId,
                      });
                    }
                  },
                  isEvaluating: false,
                }
              : undefined
          }
          // Text Input Props
          textInputProps={
            stepConfig.text_input
              ? {
                  existingInput: moduleStates.textInput,
                  onSave: async (
                    caseId: string,
                    stepNumber: number,
                    userInput: string,
                    explanation?: string,
                  ) => {
                    const response = await fetch('/api/admin/save-text-input', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.id}`,
                      },
                      body: JSON.stringify({ caseId, stepNumber, userInput, explanation }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      updateModuleState('textInput', data.input);
                    }
                  },
                  isSaving: false,
                }
              : undefined
          }
          // Decision Matrix Props
          decisionMatrixProps={
            stepConfig.decision_matrix
              ? {
                  existingDecision: moduleStates.decisionMatrix,
                  onSave: async (
                    caseId: string,
                    stepNumber: number,
                    selectedOption: string,
                    reasoning: string,
                    decisionMatrix: any,
                  ) => {
                    const response = await fetch('/api/admin/save-decision', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.id}`,
                      },
                      body: JSON.stringify({
                        caseId,
                        stepNumber,
                        selectedOption,
                        reasoning,
                        decisionMatrix,
                      }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      updateModuleState('decisionMatrix', data.decision);
                    }
                  },
                  isSaving: false,
                }
              : undefined
          }
          // Voice Input Props
          voiceInputProps={
            stepConfig.voice_input
              ? {
                  existingInput: moduleStates.voiceInput,
                  onSave: async (
                    caseId: string,
                    stepNumber: number,
                    voiceTranscript: string,
                    textFallback?: string,
                    inputMethod?: 'text' | 'voice',
                    audioDuration?: number,
                  ) => {
                    const response = await fetch('/api/admin/save-voice-input', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.id}`,
                      },
                      body: JSON.stringify({
                        caseId,
                        stepNumber,
                        voiceTranscript,
                        textFallback,
                        inputMethod,
                        audioDuration,
                      }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      updateModuleState('voiceInput', data.input);
                    }
                  },
                  isSaving: false,
                }
              : undefined
          }
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8 border-t">
        <button
          onClick={onBack}
          disabled={stepNumber === 1}
          className={`px-6 py-2 rounded-lg font-medium ${
            stepNumber === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ← Zurück
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2 bg-[#009e82] text-white rounded-lg font-medium hover:bg-[#007a66]"
        >
          {isLastStep ? 'Abschließen' : 'Weiter →'}
        </button>
      </div>
    </div>
  );
};

export default FoundationStep;
