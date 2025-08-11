/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ Foundation Cases - Case workflow and progress tracking
 * ✅ API Integration - Foundation case API with user progress
 * ✅ Loading States - Robust loading and error handling
 * ✅ User Experience - Clear case navigation and completion
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProgressIndicator from '../tracks/strategy/onboarding/ProgressIndicator';
import FoundationStep from './FoundationStep';
import CompletionScreen from './CompletionScreen';

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

interface FoundationCaseContainerProps {
  foundationCase: FoundationCase;
  onBackToCases: () => void;
}

// Step names for Foundation Learning Process
const STEP_NAMES = {
  1: 'Problemverständnis & Zielklärung',
  2: 'Strukturierung & Hypothesenbildung',
  3: 'Analyse & Zahlenarbeit',
  4: 'Synthetisieren & Optionen bewerten',
  5: 'Empfehlung & Executive Summary',
};

const FoundationCaseContainer: React.FC<FoundationCaseContainerProps> = ({
  foundationCase,
  onBackToCases,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [stepConfigs, setStepConfigs] = useState<Record<number, StepModuleConfig>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const totalSteps = 5;

  // moved below loadStepConfigurations to avoid TDZ

  const loadStepConfigurations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/get-module-config?caseId=${foundationCase.id}`, {
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load step configurations');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (data.success && data.configuration) {
        // Convert CaseModuleConfiguration to stepConfigs format
        const stepConfigs = {
          1: data.configuration.step1,
          2: data.configuration.step2,
          3: data.configuration.step3,
          4: data.configuration.step4,
          5: data.configuration.step5,
        };
        console.log('Converted stepConfigs:', stepConfigs); // Debug log
        setStepConfigs(stepConfigs);
      } else {
        console.warn('Failed to load step configs:', data.error);
        // Use default configuration if loading fails
        setStepConfigs(createDefaultStepConfigs());
      }
    } catch (err) {
      console.error('Error loading step configurations:', err);
      // Use default configuration if loading fails
      setStepConfigs(createDefaultStepConfigs());
    } finally {
      setLoading(false);
    }
  }, [foundationCase?.id, user?.id]);

  useEffect(() => {
    if (user?.id && foundationCase?.id) {
      loadStepConfigurations();
    }
  }, [user?.id, foundationCase?.id, loadStepConfigurations]);

  const createDefaultStepConfigs = (): Record<number, StepModuleConfig> => {
    return {
      1: {
        multiple_choice: true,
        content_module: false,
        free_text: false,
        text_input: false,
        decision_matrix: false,
        voice_input: false,
      },
      2: {
        multiple_choice: true,
        content_module: true,
        free_text: true,
        text_input: false,
        decision_matrix: false,
        voice_input: false,
      },
      3: {
        multiple_choice: false,
        content_module: false,
        free_text: false,
        text_input: true,
        decision_matrix: false,
        voice_input: false,
      },
      4: {
        multiple_choice: false,
        content_module: false,
        free_text: false,
        text_input: true,
        decision_matrix: true,
        voice_input: false,
      },
      5: {
        multiple_choice: false,
        content_module: false,
        free_text: false,
        text_input: true,
        decision_matrix: false,
        voice_input: true,
      },
    };
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setIsCompleted(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bfae] mx-auto mb-4"></div>
            <p className="text-gray-600">Schritt-Konfiguration wird geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <CompletionScreen
          foundationCase={foundationCase}
          onRestart={handleRestart}
          onBackToCases={onBackToCases}
        />
      </div>
    );
  }

  const currentStepConfig = stepConfigs[currentStep] || {
    multiple_choice: false,
    content_module: false,
    free_text: false,
    text_input: false,
    decision_matrix: false,
    voice_input: false,
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header mit Progress */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <div className="text-sm text-gray-600">
          Schritt {currentStep} von {totalSteps}
        </div>
      </div>

      {/* Case Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">{foundationCase.title}</h2>
        {foundationCase.case_description && (
          <p className="text-blue-800 text-sm mb-2">{foundationCase.case_description}</p>
        )}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">
            {foundationCase.cluster}
          </span>
          <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">
            {foundationCase.case_type}
          </span>
          <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">
            Schwierigkeit: {foundationCase.difficulty}/10
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 min-h-[500px]">
        <FoundationStep
          stepNumber={currentStep}
          stepName={STEP_NAMES[currentStep as keyof typeof STEP_NAMES]}
          foundationCase={foundationCase}
          stepConfig={currentStepConfig}
          onNext={handleNext}
          onBack={handleBack}
          onComplete={handleComplete}
          isLastStep={currentStep === totalSteps}
        />
      </div>
    </div>
  );
};

export default FoundationCaseContainer;
