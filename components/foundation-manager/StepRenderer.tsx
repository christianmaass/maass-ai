import React from 'react';
import { FoundationCase } from './hooks/useFoundationCases';
import { CaseModuleConfiguration } from '../../types/module-configuration.types';
import ConditionalModuleRenderer from '../ConditionalModuleRenderer';
import { useAuth } from '../../contexts/AuthContext';

interface StepConfig {
  title: string;
  learning_forms: string[];
  input_type: 'text' | 'speech' | 'both';
  ai_enabled: boolean;
  skip: boolean;
}

interface StepRendererProps {
  selectedCase: FoundationCase | null;
  moduleConfiguration: CaseModuleConfiguration;
  currentStep: number;
  onStepChange: (step: number) => void;
  getStepState: (stepNumber: number, moduleType: string) => any;
  updateStepState: (stepNumber: number, moduleType: string, data: any) => void;
}

const DEFAULT_5_STEPS: StepConfig[] = [
  {
    title: 'Problemverständnis & Zielklärung',
    learning_forms: ['multiple_choice', 'free_text'],
    input_type: 'both',
    ai_enabled: true,
    skip: false,
  },
  {
    title: 'Strukturierung & Hypothesenbildung',
    learning_forms: ['content_module', 'multiple_choice', 'free_text'],
    input_type: 'both',
    ai_enabled: true,
    skip: false,
  },
  {
    title: 'Analyse & Zahlenarbeit',
    learning_forms: ['simple_text_input'],
    input_type: 'text',
    ai_enabled: false,
    skip: false,
  },
  {
    title: 'Synthetisieren & Optionen bewerten',
    learning_forms: ['simple_text_input', 'decision_matrix'],
    input_type: 'text',
    ai_enabled: false,
    skip: false,
  },
  {
    title: 'Empfehlung & Executive Summary',
    learning_forms: ['simple_text_input', 'voice_input'],
    input_type: 'both',
    ai_enabled: true,
    skip: false,
  },
];

const StepRenderer: React.FC<StepRendererProps> = ({
  selectedCase,
  moduleConfiguration,
  currentStep,
  onStepChange,
  getStepState,
  updateStepState,
}) => {
  const { user } = useAuth();
  if (!selectedCase) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📚</div>
          <h3 className="text-gray-600 font-medium">Kein Case ausgewählt</h3>
          <p className="text-gray-500 text-sm mt-1">
            Wähle einen Case aus, um die Learning-Steps zu bearbeiten.
          </p>
        </div>
      </div>
    );
  }

  const stepConfig = DEFAULT_5_STEPS[currentStep - 1];
  const stepModuleConfig =
    moduleConfiguration[`step${currentStep}` as keyof CaseModuleConfiguration];

  if (!stepConfig || !stepModuleConfig) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-800">
            ⚠️ Schritt {currentStep} ist nicht konfiguriert oder ungültig.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Step Navigation */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Learning Steps</h2>
          <div className="text-sm text-gray-500">
            Schritt {currentStep} von {DEFAULT_5_STEPS.length}
          </div>
        </div>

        {/* Step Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {DEFAULT_5_STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = false; // TODO: Add completion logic

            return (
              <button
                key={stepNumber}
                onClick={() => onStepChange(stepNumber)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {isCompleted ? '✓' : stepNumber}
                  </span>
                  <span className="hidden md:inline">{step.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Schritt {currentStep}: {stepConfig.title}
          </h3>
          <p className="text-gray-600 text-sm">
            Bearbeite die konfigurierten Module für diesen Learning-Step.
          </p>
        </div>

        {/* Debug Information - Temporarily removed for cleaner UI */}
        {false && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-600">
              {JSON.stringify(
                {
                  stepModuleConfig,
                  currentStep,
                  caseId: selectedCase?.id ?? '',
                },
                null,
                2,
              )}
            </pre>
          </div>
        )}

        {/* Module Renderer */}
        <div className="space-y-6">
          <ConditionalModuleRenderer
            stepConfig={stepModuleConfig}
            caseId={selectedCase?.id ?? ''}
            stepNumber={currentStep}
            stepName={stepConfig.title}
            // Multiple Choice Props
            multipleChoiceProps={{
              questions: getStepState(currentStep, 'multipleChoice') || [],
              onGenerate: async (caseId: string, stepNumber: number) => {
                // TODO: Implement MC generation
                console.log('Generate MC for', caseId, stepNumber);
              },
              onQuestionUpdate: (questions: any[]) => {
                updateStepState(currentStep, 'multipleChoice', questions);
              },
              isGenerating: false,
            }}
            // Free Text Props
            freeTextProps={{
              existingResponse: getStepState(currentStep, 'freeText'),
              prompt: `Formulieren Sie eine fundierte Hypothese für ${selectedCase?.title || 'diesen Fall'} in Schritt ${currentStep}.`,
              onSubmit: async (
                caseId: string,
                stepNumber: number,
                userResponse: string,
                promptText: string,
              ) => {
                try {
                  const response = await fetch('/api/admin/evaluate-free-text', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${user?.id}`,
                    },
                    body: JSON.stringify({
                      caseId,
                      stepNumber,
                      userResponse,
                      promptText,
                    }),
                  });

                  if (!response.ok) {
                    throw new Error(`Free text evaluation failed: ${response.status}`);
                  }

                  const result = await response.json();
                  if (result.success && result.feedback) {
                    // Update state with response and feedback
                    const responseWithFeedback = {
                      user_response: userResponse,
                      gpt_feedback: result.feedback,
                      id: result.responseId,
                    };
                    updateStepState(currentStep, 'freeText', responseWithFeedback);
                    console.log(
                      `Free text evaluated for step ${stepNumber}:`,
                      result.feedback.score,
                    );
                  } else {
                    throw new Error(result.error || 'Free text evaluation failed');
                  }
                } catch (error) {
                  console.error('Error evaluating free text:', error);
                  alert('Fehler beim Bewerten der Antwort. Bitte versuche es erneut.');
                }
              },
              isEvaluating: false,
            }}
            // Content Module Props
            contentModuleProps={{
              existingContent: getStepState(currentStep, 'contentModule'),
              onGenerate: async (caseId: string, stepNumber: number, prompt: string) => {
                try {
                  const response = await fetch('/api/admin/generate-content-module', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${user?.id}`,
                    },
                    body: JSON.stringify({
                      caseId,
                      stepNumber,
                      generationPrompt: prompt,
                    }),
                  });

                  if (!response.ok) {
                    throw new Error(`Content generation failed: ${response.status}`);
                  }

                  const result = await response.json();
                  if (result.success && result.content) {
                    // Update state with generated content
                    updateStepState(currentStep, 'contentModule', result.content);
                    console.log(`Generated content for step ${stepNumber}:`, result.content.title);
                  } else {
                    throw new Error(result.error || 'Content generation failed');
                  }
                } catch (error) {
                  console.error('Error generating content:', error);
                  alert('Fehler beim Generieren des Contents. Bitte versuche es erneut.');
                }
              },
              onSave: async (content: any) => {
                updateStepState(currentStep, 'contentModule', content);
              },
              isGenerating: false,
            }}
            // Text Input Props
            textInputProps={{
              existingInput: getStepState(currentStep, 'textInput')?.[0] || null,
              onSave: async (
                caseId: string,
                stepNumber: number,
                userInput: string,
                explanation?: string,
              ) => {
                // Save to database via API
                try {
                  const response = await fetch('/api/admin/save-text-input', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${user?.id}`,
                    },
                    body: JSON.stringify({
                      caseId,
                      stepNumber,
                      userInput,
                      explanation,
                    }),
                  });

                  if (response.ok) {
                    // Update local state after successful DB save
                    updateStepState(stepNumber, 'textInput', { userInput, explanation });
                    console.log(`Text input saved for case ${caseId}, step ${stepNumber}`);
                  } else {
                    console.error('Failed to save text input:', response.status);
                  }
                } catch (error) {
                  console.error('Error saving text input:', error);
                }
              },
              isSaving: false,
              placeholder: `Ihre Eingabe für ${stepConfig.title}`,
              explanationPlaceholder: 'Optionale Erklärung...',
            }}
            // Decision Matrix Props
            decisionMatrixProps={{
              existingDecision: getStepState(currentStep, 'decision'),
              onSave: async (
                caseId: string,
                stepNumber: number,
                selectedOption: string,
                reasoning: string,
                decisionMatrix?: any,
              ) => {
                // Save to database via API
                try {
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

                  if (response.ok) {
                    // Update local state after successful DB save
                    updateStepState(stepNumber, 'decision', {
                      selectedOption,
                      reasoning,
                      decisionMatrix,
                    });
                    console.log(`Decision saved for case ${caseId}, step ${stepNumber}`);
                  } else {
                    console.error('Failed to save decision:', response.status);
                  }
                } catch (error) {
                  console.error('Error saving decision:', error);
                }
              },
              isSaving: false,
            }}
            // Voice Input Props
            voiceInputProps={{
              existingInput: getStepState(currentStep, 'voiceInput'),
              onSave: async (
                caseId: string,
                stepNumber: number,
                voiceTranscript: string,
                textFallback?: string,
                inputMethod?: 'text' | 'voice',
                audioDuration?: number,
              ) => {
                // Save to database via API
                try {
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

                  if (response.ok) {
                    // Update local state after successful DB save
                    updateStepState(stepNumber, 'voiceInput', {
                      voiceTranscript,
                      textFallback,
                      inputMethod,
                      audioDuration,
                    });
                    console.log(`Voice input saved for case ${caseId}, step ${stepNumber}`);
                  } else {
                    console.error('Failed to save voice input:', response.status);
                  }
                } catch (error) {
                  console.error('Error saving voice input:', error);
                }
              },
              isSaving: false,
              placeholder: `Spracheingabe für ${stepConfig.title}`,
            }}
          />
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => onStepChange(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            ← Vorheriger Schritt
          </button>

          <div className="text-sm text-gray-500">
            {currentStep} / {DEFAULT_5_STEPS.length}
          </div>

          <button
            onClick={() => onStepChange(Math.min(DEFAULT_5_STEPS.length, currentStep + 1))}
            disabled={currentStep === DEFAULT_5_STEPS.length}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Nächster Schritt →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepRenderer;
