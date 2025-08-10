// =====================================================
// UNIFIED MODULE INTERFACE - ADAPTER PATTERN
// SOLID: Interface Segregation + Adapter Pattern
// Löst TypeScript-Konflikte ohne bestehende Components zu brechen
// =====================================================

/**
 * Unified data structure for all module responses
 * SOLID: Single Responsibility - One interface for all module data
 */
export interface UnifiedModuleData {
  // Common fields
  id?: string;
  caseId: string;
  stepNumber: number;
  moduleType: string;
  created_at?: string;
  updated_at?: string;

  // Module-specific data (flexible)
  data: {
    // Multiple Choice
    selectedAnswers?: string[];

    // Content Module
    title?: string;
    content?: string;
    image_url?: string;
    generation_prompt?: string;

    // Free Text
    user_response?: string;
    prompt?: string;

    // Text Input
    user_input?: string;
    explanation?: string;

    // Decision Matrix
    selected_option?: string;
    reasoning?: string;
    decision_matrix?: any;

    // Voice Input
    voice_transcript?: string;
    text_fallback?: string;
    input_method?: 'voice' | 'text';
    audio_duration?: number;
  };
}

/**
 * Unified callback interface for all modules
 * SOLID: Dependency Inversion - All modules depend on this abstraction
 */
export interface UnifiedModuleCallbacks {
  onSave: (data: UnifiedModuleData) => Promise<void>;
  onGenerate?: (caseId: string, stepNumber: number, prompt: string) => Promise<void>;
  onRequestFeedback?: (caseId: string, stepNumber: number) => Promise<void>;
}

/**
 * Unified props interface for all module adapters
 * SOLID: Interface Segregation - Clean, focused interface
 */
export interface UnifiedModuleProps {
  caseId: string;
  stepNumber: number;
  stepName: string;
  moduleType: string;
  existingData?: UnifiedModuleData;
  callbacks: UnifiedModuleCallbacks;
  isLoading?: boolean;
  isGenerating?: boolean;
}

/**
 * Adapter factory for creating module-specific adapters
 * SOLID: Factory Pattern + Adapter Pattern
 */
export interface ModuleAdapter<TProps = any, TData = any> {
  /**
   * Converts unified props to component-specific props
   */
  adaptProps: (unifiedProps: UnifiedModuleProps) => TProps;

  /**
   * Converts component-specific data to unified data
   */
  adaptData: (componentData: TData, caseId: string, stepNumber: number) => UnifiedModuleData;

  /**
   * Converts unified data to component-specific data
   */
  extractData: (unifiedData: UnifiedModuleData) => TData | undefined;
}

/**
 * Registry for all module adapters
 * SOLID: Open/Closed Principle - Easy to extend with new modules
 */
export interface ModuleAdapterRegistry {
  multiple_choice: ModuleAdapter;
  content_module: ModuleAdapter;
  free_text: ModuleAdapter;
  text_input: ModuleAdapter;
  decision_matrix: ModuleAdapter;
  voice_input: ModuleAdapter;
}

/**
 * Utility type for module type safety
 */
export type ModuleTypeName = keyof ModuleAdapterRegistry;

/**
 * Default data factory for each module type
 * SOLID: Factory Pattern
 */
export const createDefaultModuleData = (
  caseId: string,
  stepNumber: number,
  moduleType: ModuleTypeName,
): UnifiedModuleData => ({
  caseId,
  stepNumber,
  moduleType,
  data: {},
});

/**
 * Validation utility for unified module data
 * SOLID: Single Responsibility
 */
export const validateModuleData = (data: UnifiedModuleData): boolean => {
  return !!(data.caseId && data.stepNumber && data.moduleType && data.data);
};
