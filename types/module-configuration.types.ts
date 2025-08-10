// =====================================================
// MODULE CONFIGURATION TYPES
// SOLID: Interface Segregation Principle - Clean, focused interfaces
// =====================================================

/**
 * Configuration for modules available in a single step
 * Each boolean represents whether a module is enabled for this step
 */
export interface StepModuleConfig {
  multiple_choice: boolean;
  content_module: boolean;
  free_text: boolean;
  text_input: boolean;
  decision_matrix: boolean;
  voice_input: boolean;
}

/**
 * Complete configuration for all 5 steps of a case
 * Maps step numbers to their respective module configurations
 */
export interface CaseModuleConfiguration {
  step1: StepModuleConfig;
  step2: StepModuleConfig;
  step3: StepModuleConfig;
  step4: StepModuleConfig;
  step5: StepModuleConfig;
}

/**
 * Props for the main module configuration panel component
 * SOLID: Dependency Inversion - Depends on abstractions, not concretions
 */
export interface ModuleConfigurationProps {
  caseId: string;
  configuration: CaseModuleConfiguration;
  onConfigurationChange: (config: CaseModuleConfiguration) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

/**
 * Props for individual step configuration sections
 * SOLID: Single Responsibility - Only handles one step's configuration
 */
export interface StepConfigurationProps {
  stepNumber: number;
  stepConfig: StepModuleConfig;
  onModuleToggle: (module: keyof StepModuleConfig) => void;
}

/**
 * Props for the conditional module renderer
 * SOLID: Open/Closed Principle - Open for extension, closed for modification
 */
export interface ConditionalModuleRendererProps {
  stepNumber: number;
  stepConfig: StepModuleConfig;
  caseId: string;
  // Props for each module type - passed through conditionally
  multipleChoiceProps?: any;
  contentModuleProps?: any;
  freeTextProps?: any;
  textInputProps?: any;
  decisionMatrixProps?: any;
  voiceInputProps?: any;
}

/**
 * Module type enumeration for type safety
 */
export enum ModuleType {
  MULTIPLE_CHOICE = 'multiple_choice',
  CONTENT_MODULE = 'content_module',
  FREE_TEXT = 'free_text',
  TEXT_INPUT = 'text_input',
  DECISION_MATRIX = 'decision_matrix',
  VOICE_INPUT = 'voice_input',
}

/**
 * Utility type for module configuration keys
 */
export type ModuleConfigKey = keyof StepModuleConfig;

/**
 * Utility type for step configuration keys
 */
export type StepConfigKey = keyof CaseModuleConfiguration;

/**
 * Default configuration factory
 * SOLID: Factory Pattern for creating default configurations
 */
export const createDefaultConfiguration = (): CaseModuleConfiguration => ({
  step1: {
    multiple_choice: true,
    content_module: false,
    free_text: false,
    text_input: false,
    decision_matrix: false,
    voice_input: false,
  },
  step2: {
    multiple_choice: true,
    content_module: true,
    free_text: true,
    text_input: false,
    decision_matrix: false,
    voice_input: false,
  },
  step3: {
    multiple_choice: true,
    content_module: false,
    free_text: false,
    text_input: true,
    decision_matrix: false,
    voice_input: false,
  },
  step4: {
    multiple_choice: true,
    content_module: false,
    free_text: false,
    text_input: true,
    decision_matrix: true,
    voice_input: false,
  },
  step5: {
    multiple_choice: true,
    content_module: false,
    free_text: false,
    text_input: true,
    decision_matrix: false,
    voice_input: true,
  },
});

/**
 * Validation utility for module configuration
 * SOLID: Single Responsibility - Only validates configuration
 */
export const validateConfiguration = (config: CaseModuleConfiguration): boolean => {
  const requiredSteps: StepConfigKey[] = ['step1', 'step2', 'step3', 'step4', 'step5'];
  const requiredModules: ModuleConfigKey[] = [
    'multiple_choice',
    'content_module',
    'free_text',
    'text_input',
    'decision_matrix',
    'voice_input',
  ];

  return requiredSteps.every((step) => {
    const stepConfig = config[step];
    return stepConfig && requiredModules.every((module) => typeof stepConfig[module] === 'boolean');
  });
};
