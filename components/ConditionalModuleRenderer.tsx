// =====================================================
// CONDITIONAL MODULE RENDERER COMPONENT
// SOLID: Open/Closed Principle - Open for extension, closed for modification
// SIMPLIFIED: Uses existing component interfaces without modification
// =====================================================

import React from 'react';
import { StepModuleConfig } from '@project-types/module-configuration.types';

// Import all existing module components
import MultipleChoiceComponent from './MultipleChoiceComponent';
import FreeTextWithFeedbackComponent from './FreeTextWithFeedbackComponent';
import ContentModuleComponent from './ContentModuleComponent';
import SimpleTextInputComponent from './SimpleTextInputComponent';
import DecisionMatrixComponent from './DecisionMatrixComponent';
import VoiceInputComponent from './VoiceInputComponent';

interface ConditionalModuleRendererProps {
  stepNumber: number;
  stepConfig: StepModuleConfig;
  caseId: string;
  stepName: string;

  // Props for each module type - passed through conditionally
  multipleChoiceProps?: {
    questions: any[];
    onGenerate: (caseId: string, stepNumber: number) => Promise<void>;
    onQuestionUpdate: (questions: any[]) => void;
    isGenerating: boolean;
  };

  contentModuleProps?: {
    existingContent: any;
    onGenerate: (caseId: string, stepNumber: number, prompt: string) => Promise<void>;
    onSave?: (content: any) => Promise<void>;
    isGenerating: boolean;
  };

  freeTextProps?: {
    existingResponse: any;
    prompt: string;
    onSubmit: (
      caseId: string,
      stepNumber: number,
      userResponse: string,
      promptText: string,
    ) => Promise<void>;
    isEvaluating: boolean;
  };

  textInputProps?: {
    existingInput: any;
    onSave: (
      caseId: string,
      stepNumber: number,
      userInput: string,
      explanation?: string,
    ) => Promise<void>;
    isSaving: boolean;
    placeholder?: string;
    explanationPlaceholder?: string;
  };

  decisionMatrixProps?: {
    existingDecision: any;
    onSave: (
      caseId: string,
      stepNumber: number,
      selectedOption: string,
      reasoning: string,
      decisionMatrix?: any,
    ) => Promise<void>;
    isSaving: boolean;
  };

  voiceInputProps?: {
    existingInput: any;
    onSave: (
      caseId: string,
      stepNumber: number,
      voiceTranscript: string,
      textFallback?: string,
      inputMethod?: 'voice' | 'text',
      audioDuration?: number,
    ) => Promise<void>;
    isSaving: boolean;
    placeholder?: string;
  };
}

/**
 * ConditionalModuleRenderer Component
 * SOLID: Open/Closed Principle - Can add new modules without changing existing code
 * SOLID: Single Responsibility - Only handles conditional rendering of modules
 * SOLID: Dependency Inversion - Depends on module interfaces, not implementations
 */
export default function ConditionalModuleRenderer({
  stepNumber,
  stepConfig,
  caseId,
  stepName,
  multipleChoiceProps,
  contentModuleProps,
  freeTextProps,
  textInputProps,
  decisionMatrixProps,
  voiceInputProps,
}: ConditionalModuleRendererProps) {
  return (
    <div className="space-y-6">
      {/* Debug Information for Module Rendering - Temporarily enabled for debugging */}
      {true && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-700 mb-2">
            ConditionalModuleRenderer Debug:
          </h4>
          <pre className="text-xs text-blue-600">
            {JSON.stringify(
              {
                stepConfig,
                hasMultipleChoiceProps: !!multipleChoiceProps,
                multipleChoicePropsKeys: multipleChoiceProps
                  ? Object.keys(multipleChoiceProps)
                  : null,
                shouldRenderMC: stepConfig.multiple_choice && multipleChoiceProps,
              },
              null,
              2,
            )}
          </pre>
        </div>
      )}

      {/* Multiple Choice Module */}
      {stepConfig.multiple_choice && multipleChoiceProps && (
        <MultipleChoiceComponent
          caseId={caseId}
          stepNumber={stepNumber}
          stepName={stepName}
          questions={multipleChoiceProps.questions}
          onGenerate={multipleChoiceProps.onGenerate}
          onQuestionUpdate={multipleChoiceProps.onQuestionUpdate}
          isGenerating={multipleChoiceProps.isGenerating}
        />
      )}

      {/* Debug: Show when MC should render but doesn't */}
      {stepConfig.multiple_choice && !multipleChoiceProps && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">
            ⚠️ Multiple Choice ist aktiviert, aber multipleChoiceProps ist null/undefined!
          </div>
        </div>
      )}

      {/* Content Module */}
      {stepConfig.content_module && contentModuleProps && (
        <ContentModuleComponent
          caseId={caseId}
          stepNumber={stepNumber}
          stepName={stepName}
          existingContent={contentModuleProps.existingContent}
          onGenerate={contentModuleProps.onGenerate}
          onSave={contentModuleProps.onSave}
          isGenerating={contentModuleProps.isGenerating}
        />
      )}

      {/* Free Text with Feedback */}
      {stepConfig.free_text && freeTextProps && (
        <FreeTextWithFeedbackComponent
          caseId={caseId}
          stepNumber={stepNumber}
          stepName={stepName}
          prompt={freeTextProps.prompt}
          existingResponse={freeTextProps.existingResponse}
          onSubmit={freeTextProps.onSubmit}
          isEvaluating={freeTextProps.isEvaluating}
        />
      )}

      {/* Simple Text Input */}
      {stepConfig.text_input && textInputProps && (
        <SimpleTextInputComponent
          caseId={caseId}
          stepNumber={stepNumber}
          stepName={stepName}
          placeholder={textInputProps.placeholder || `Ihre Eingabe für ${stepName}...`}
          explanationPlaceholder={
            textInputProps.explanationPlaceholder || 'Erklärung oder Begründung...'
          }
          existingInput={textInputProps.existingInput}
          onSave={textInputProps.onSave}
          isSaving={textInputProps.isSaving}
        />
      )}

      {/* Decision Matrix */}
      {stepConfig.decision_matrix && decisionMatrixProps && (
        <DecisionMatrixComponent
          caseId={caseId}
          stepNumber={stepNumber}
          stepName={stepName}
          title={`Entscheidungsmatrix - ${stepName}`}
          options={[
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
          ]}
          existingDecision={decisionMatrixProps.existingDecision}
          onSave={decisionMatrixProps.onSave}
          isSaving={decisionMatrixProps.isSaving}
        />
      )}

      {/* Voice Input */}
      {stepConfig.voice_input && voiceInputProps && (
        <VoiceInputComponent
          caseId={caseId}
          stepNumber={stepNumber}
          stepName={stepName}
          placeholder={
            voiceInputProps.placeholder || `Sprechen Sie Ihre Antwort für ${stepName} ein...`
          }
          existingInput={voiceInputProps.existingInput}
          onSave={voiceInputProps.onSave}
          isSaving={voiceInputProps.isSaving}
        />
      )}

      {/* No modules enabled warning */}
      {!Object.values(stepConfig).some(Boolean) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Keine Module für Schritt {stepNumber} aktiviert
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                Aktivieren Sie mindestens ein Modul in der Konfiguration, um Inhalte für diesen
                Schritt anzuzeigen.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
