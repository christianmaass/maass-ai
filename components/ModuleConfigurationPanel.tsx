// =====================================================
// MODULE CONFIGURATION PANEL COMPONENT
// SOLID: Single Responsibility - Only handles module configuration UI
// =====================================================

import React, { useState, useEffect } from 'react';
import StepConfigurationSection from './StepConfigurationSection';
import {
  CaseModuleConfiguration,
  StepModuleConfig,
  StepConfigKey,
  ModuleConfigKey,
  validateConfiguration,
  createDefaultConfiguration,
} from '../types/module-configuration.types';

interface ModuleConfigurationPanelProps {
  caseId: string;
  initialConfiguration: CaseModuleConfiguration;
  onSave: (config: CaseModuleConfiguration) => Promise<void>;
}

/**
 * ModuleConfigurationPanel Component
 * SOLID: Single Responsibility - Manages the entire module configuration UI
 * SOLID: Dependency Inversion - Depends on abstractions (props), not concretions
 */
export default function ModuleConfigurationPanel({
  caseId,
  initialConfiguration,
  onSave,
}: ModuleConfigurationPanelProps) {
  // State management with null/undefined safety
  const [config, setConfig] = useState<CaseModuleConfiguration>(
    initialConfiguration || createDefaultConfiguration(),
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset state when initialConfiguration changes
  useEffect(() => {
    setConfig(initialConfiguration || createDefaultConfiguration());
    setHasChanges(false);
    setValidationError(null);
  }, [initialConfiguration]);

  /**
   * Handle module toggle for a specific step
   * SOLID: Single Responsibility - Only handles module toggling logic
   */
  const handleModuleToggle = (step: StepConfigKey, module: ModuleConfigKey) => {
    const newConfig = {
      ...config,
      [step]: {
        ...config[step],
        [module]: !config[step][module],
      },
    };

    // Validate the new configuration
    if (!validateConfiguration(newConfig)) {
      setValidationError('Ungültige Konfiguration detected');
      return;
    }

    setConfig(newConfig);
    setHasChanges(true);
    setValidationError(null);
  };

  /**
   * Handle save operation with error handling
   * SOLID: Single Responsibility - Only handles save logic
   */
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setValidationError(null);

      // Final validation before save
      if (!validateConfiguration(config)) {
        throw new Error('Konfiguration ist ungültig');
      }

      await onSave(config);
      setHasChanges(false);
    } catch (error: any) {
      console.error('Failed to save configuration:', error);
      setValidationError(error.message || 'Fehler beim Speichern der Konfiguration');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Reset configuration to initial state
   */
  const handleReset = () => {
    setConfig(initialConfiguration);
    setHasChanges(false);
    setValidationError(null);
  };

  // Calculate total enabled modules for overview
  const totalEnabledModules = config
    ? Object.values(config).reduce((total, stepConfig) => {
        return total + Object.values(stepConfig || {}).filter(Boolean).length;
      }, 0)
    : 0;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">🎛️ Modul-Konfiguration</h3>
          <p className="text-sm text-gray-600 mt-1">
            Bestimmen Sie, welche Module in jedem Schritt verfügbar sein sollen
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Gesamt aktive Module</div>
          <div className="text-2xl font-bold text-blue-600">{totalEnabledModules}</div>
        </div>
      </div>

      {/* Configuration Sections for each step */}
      <div className="space-y-4">
        {Object.entries(config).map(([stepKey, stepConfig]) => {
          const stepNumber = parseInt(stepKey.replace('step', ''));

          return (
            <StepConfigurationSection
              key={stepKey}
              stepNumber={stepNumber}
              stepConfig={stepConfig}
              onModuleToggle={(module) => handleModuleToggle(stepKey as StepConfigKey, module)}
            />
          );
        })}
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">❌</span>
            <span className="text-sm text-red-700">{validationError}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving || !!validationError}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              hasChanges && !isSaving && !validationError
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? '💾 Speichert...' : '💾 Konfiguration speichern'}
          </button>

          <button
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              hasChanges && !isSaving
                ? 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🔄 Zurücksetzen
          </button>
        </div>

        {/* Status Indicator */}
        {hasChanges && !isSaving && (
          <div className="flex items-center text-sm text-yellow-600">
            <span className="mr-2">⚠️</span>
            Ungespeicherte Änderungen
          </div>
        )}

        {isSaving && (
          <div className="flex items-center text-sm text-blue-600">
            <span className="mr-2">⏳</span>
            Speichert Konfiguration...
          </div>
        )}
      </div>
    </div>
  );
}
