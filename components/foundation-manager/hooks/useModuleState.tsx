import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { CaseModuleConfiguration, createDefaultConfiguration } from '@project-types/module-configuration.types';

interface ModuleStateData {
  [stepNumber: number]: {
    [moduleType: string]: any;
    multipleChoice?: any[];
    freeText?: any;
    contentModule?: any;
    textInput?: any;
    decision?: any;
    voiceInput?: any;
  };
}

interface UseModuleStateReturn {
  moduleConfiguration: CaseModuleConfiguration;
  moduleState: ModuleStateData;
  configPanelOpen: boolean;
  loading: boolean;
  error: string | null;

  // Configuration management
  updateModuleConfiguration: (config: CaseModuleConfiguration) => Promise<boolean>;
  toggleConfigPanel: () => void;
  resetModuleState: () => void;

  // State management for specific modules
  updateStepState: (stepNumber: number, moduleType: string, data: any) => void;
  getStepState: (stepNumber: number, moduleType: string) => any;
}

export const useModuleState = (caseId: string | null): UseModuleStateReturn => {
  const [moduleConfiguration, setModuleConfiguration] = useState<CaseModuleConfiguration>(
    createDefaultConfiguration(),
  );
  const [moduleState, setModuleState] = useState<ModuleStateData>({});
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Update state for a specific step and module type
  const updateStepState = useCallback((stepNumber: number, moduleType: string, data: any) => {
    setModuleState((prev) => ({
      ...prev,
      [stepNumber]: {
        ...prev[stepNumber],
        [moduleType]: data,
      },
    }));
  }, []);

  // Get state for a specific step and module type
  const getStepState = useCallback(
    (stepNumber: number, moduleType: string): any => {
      return moduleState[stepNumber]?.[moduleType] || null;
    },
    [moduleState],
  );

  // Load MC questions for a specific case and step
  const loadMCQuestions = useCallback(
    async (selectedCaseId: string, stepNumber: number) => {
      try {
        const response = await fetch(
          `/api/admin/get-multiple-choice?caseId=${selectedCaseId}&stepNumber=${stepNumber}`,
          {
            headers: {
              Authorization: `Bearer ${user?.id}`, // TODO: Get proper access token
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to load MC questions: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.questions) {
          // Update module state with loaded questions
          updateStepState(stepNumber, 'multipleChoice', data.questions);
          console.log(`[MC Load] Loaded ${data.questions.length} questions for step ${stepNumber}`);
        }
      } catch (error) {
        console.error(`[MC Load] Error loading questions for step ${stepNumber}:`, error);
      }
    },
    [user?.id, updateStepState],
  );

  // Load MC questions for all steps of a case
  const _loadAllMCQuestions = async (selectedCaseId: string) => {
    const promises: Promise<void>[] = [];
    for (let step = 1; step <= 5; step++) {
      promises.push(loadMCQuestions(selectedCaseId, step));
    }
    await Promise.all(promises);
  };

  // Load content modules for a specific case and step
  const loadContentModules = useCallback(
    async (selectedCaseId: string, stepNumber: number) => {
      try {
        const response = await fetch(
          `/api/admin/get-content-module?caseId=${selectedCaseId}&stepNumber=${stepNumber}`,
          {
            headers: {
              Authorization: `Bearer ${user?.id}`,
            },
          },
        );

        if (!response.ok) {
          console.error(`Failed to load content modules for step ${stepNumber}:`, response.status);
          return;
        }

        const result = await response.json();
        if (result.success && result.contentModules) {
          updateStepState(stepNumber, 'contentModule', result.contentModules);
          console.log(`Loaded ${result.count} content modules for step ${stepNumber}`);
        }
      } catch (error) {
        console.error(`Error loading content modules for step ${stepNumber}:`, error);
      }
    },
    [user?.id, updateStepState],
  );

  // Load text inputs for a specific case and step
  const loadTextInputs = useCallback(
    async (selectedCaseId: string, stepNumber: number) => {
      try {
        const response = await fetch(
          `/api/admin/get-text-input?caseId=${selectedCaseId}&stepNumber=${stepNumber}`,
          {
            headers: {
              Authorization: `Bearer ${user?.id}`,
            },
          },
        );

        if (!response.ok) {
          console.error(`Failed to load text inputs for step ${stepNumber}:`, response.status);
          return;
        }

        const result = await response.json();
        if (result.success && result.textInputs) {
          updateStepState(stepNumber, 'textInput', result.textInputs);
          console.log(`Loaded ${result.count} text inputs for step ${stepNumber}`);
        }
      } catch (error) {
        console.error(`Error loading text inputs for step ${stepNumber}:`, error);
      }
    },
    [user?.id, updateStepState],
  );

  // Load voice inputs for a specific case and step
  const loadVoiceInputs = useCallback(
    async (selectedCaseId: string, stepNumber: number) => {
      try {
        const response = await fetch(
          `/api/admin/get-voice-input?caseId=${selectedCaseId}&stepNumber=${stepNumber}`,
          {
            headers: {
              Authorization: `Bearer ${user?.id}`,
            },
          },
        );

        if (!response.ok) {
          console.error(`Failed to load voice inputs for step ${stepNumber}:`, response.status);
          return;
        }

        const result = await response.json();
        if (result.success && result.voiceInputs) {
          updateStepState(stepNumber, 'voiceInput', result.voiceInputs);
          console.log(`Loaded ${result.count} voice inputs for step ${stepNumber}`);
        }
      } catch (error) {
        console.error(`Error loading voice inputs for step ${stepNumber}:`, error);
      }
    },
    [user?.id, updateStepState],
  );

  // Load decision matrix for a specific case and step
  const loadDecisionMatrix = useCallback(
    async (selectedCaseId: string, stepNumber: number) => {
      try {
        const response = await fetch(
          `/api/admin/get-decision?caseId=${selectedCaseId}&stepNumber=${stepNumber}`,
          {
            headers: {
              Authorization: `Bearer ${user?.id}`,
            },
          },
        );

        if (response.status === 404) {
          // 404 is normal - no decision exists yet for this step
          console.log(`No decision found for case ${selectedCaseId}, step ${stepNumber} (normal)`);
          updateStepState(stepNumber, 'decision', null);
          return;
        }

        if (!response.ok) {
          console.error(`Failed to load decision matrix for step ${stepNumber}:`, response.status);
          return;
        }

        const result = await response.json();
        if (result.data) {
          updateStepState(stepNumber, 'decision', result.data);
          console.log(`Loaded decision matrix for step ${stepNumber}`);
        } else {
          updateStepState(stepNumber, 'decision', null);
          console.log(`No decision data for step ${stepNumber}`);
        }
      } catch (error) {
        console.error(`Error loading decision matrix for step ${stepNumber}:`, error);
      }
    },
    [user?.id, updateStepState],
  );

  // Load all content for all steps of a case
  const loadAllContent = useCallback(
    async (selectedCaseId: string) => {
      const promises: Promise<void>[] = [];
      for (let step = 1; step <= 5; step++) {
        promises.push(
          loadMCQuestions(selectedCaseId, step),
          loadContentModules(selectedCaseId, step),
          loadTextInputs(selectedCaseId, step),
          loadVoiceInputs(selectedCaseId, step),
          loadDecisionMatrix(selectedCaseId, step),
        );
      }
      await Promise.all(promises);
    },
    [loadMCQuestions, loadContentModules, loadTextInputs, loadVoiceInputs, loadDecisionMatrix],
  );

  // Load module configuration for the selected case
  const loadModuleConfiguration = useCallback(
    async (selectedCaseId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/get-module-config?caseId=${selectedCaseId}`, {
          headers: {
            Authorization: `Bearer ${user?.id}`, // TODO: Get proper access token
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load module configuration: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.configuration) {
          setModuleConfiguration(result.configuration);

          // After loading configuration, load ALL content for this case
          await loadAllContent(selectedCaseId);
        } else {
          // Use default configuration if none exists
          setModuleConfiguration(createDefaultConfiguration());
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error loading module configuration';
        setError(errorMessage);
        console.error('Error loading module configuration:', err);
        setModuleConfiguration(createDefaultConfiguration());
      } finally {
        setLoading(false);
      }
    },
    [user?.id, loadAllContent],
  );

  // Update module configuration in database
  const updateModuleConfiguration = async (config: CaseModuleConfiguration): Promise<boolean> => {
    try {
      if (!caseId || !user) {
        throw new Error('Case ID and authentication required');
      }

      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/save-module-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`, // TODO: Get proper access token
        },
        body: JSON.stringify({
          caseId,
          configuration: config,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update module configuration: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setModuleConfiguration(config);
        return true;
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error updating configuration';
      setError(errorMessage);
      console.error('Error updating module configuration:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle configuration panel
  const toggleConfigPanel = () => {
    setConfigPanelOpen((prev) => !prev);
  };

  // Reset all module state (called when case changes)
  const resetModuleState = () => {
    setModuleState({});
    setError(null);
  };

  // Load configuration when case changes
  useEffect(() => {
    if (caseId) {
      loadModuleConfiguration(caseId);
      resetModuleState(); // Reset state when case changes
    } else {
      setModuleConfiguration(createDefaultConfiguration());
      resetModuleState();
    }
  }, [caseId, user?.id, loadModuleConfiguration]);

  return {
    moduleConfiguration,
    moduleState,
    configPanelOpen,
    loading,
    error,
    updateModuleConfiguration,
    toggleConfigPanel,
    resetModuleState,
    updateStepState,
    getStepState,
  };
};

export type { ModuleStateData, UseModuleStateReturn };
