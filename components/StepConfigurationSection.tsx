// =====================================================
// STEP CONFIGURATION SECTION COMPONENT
// SOLID: Single Responsibility - Only handles one step's module configuration
// =====================================================

import React from 'react';
import { StepConfigurationProps, ModuleConfigKey } from '../types/module-configuration.types';

// Module display names and descriptions for better UX
const MODULE_INFO: Record<ModuleConfigKey, { name: string; description: string; icon: string }> = {
  multiple_choice: {
    name: 'Multiple Choice',
    description: '3 MC-Fragen mit GPT-Generierung',
    icon: '📝',
  },
  content_module: {
    name: 'Content Modul',
    description: 'Framework-Einführung mit Bildern',
    icon: '📚',
  },
  free_text: {
    name: 'Freitext + Feedback',
    description: 'Freitext-Eingabe mit GPT-Bewertung',
    icon: '💭',
  },
  text_input: {
    name: 'Einfache Texteingabe',
    description: 'Texteingabe mit Erklärung',
    icon: '✍️',
  },
  decision_matrix: {
    name: 'Entscheidungsmatrix',
    description: 'Strukturierte Entscheidungsfindung',
    icon: '🎯',
  },
  voice_input: {
    name: 'Spracheingabe',
    description: 'Voice-to-Text mit GPT-Assessment',
    icon: '🎤',
  },
};

// Step titles for better UX
const STEP_TITLES: Record<number, string> = {
  1: 'Problemverständnis & Zielklärung',
  2: 'Strukturierung & Hypothesenbildung',
  3: 'Analyse & Zahlenarbeit',
  4: 'Synthetisieren & Optionen bewerten',
  5: 'Empfehlung & Executive Summary',
};

/**
 * StepConfigurationSection Component
 * SOLID: Single Responsibility - Manages configuration for one step only
 * SOLID: Open/Closed - Can be extended with new modules without modification
 */
export default function StepConfigurationSection({
  stepNumber,
  stepConfig,
  onModuleToggle,
}: StepConfigurationProps) {
  // Count enabled modules for visual feedback
  const enabledModulesCount = Object.values(stepConfig).filter(Boolean).length;

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-md font-semibold text-gray-800">
          Schritt {stepNumber}: {STEP_TITLES[stepNumber]}
        </h4>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {enabledModulesCount} Module aktiv
        </span>
      </div>

      {/* Module Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(MODULE_INFO).map(([moduleKey, moduleInfo]) => {
          const typedModuleKey = moduleKey as ModuleConfigKey;
          const isEnabled = stepConfig[typedModuleKey];

          return (
            <div
              key={moduleKey}
              className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                isEnabled
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => onModuleToggle(typedModuleKey)}
            >
              {/* Module Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{moduleInfo.icon}</span>
                  <span className="font-medium text-sm text-gray-800">{moduleInfo.name}</span>
                </div>

                {/* Toggle Checkbox */}
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => onModuleToggle(typedModuleKey)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()} // Prevent double toggle
                />
              </div>

              {/* Module Description */}
              <p className="text-xs text-gray-600 leading-relaxed">{moduleInfo.description}</p>
            </div>
          );
        })}
      </div>

      {/* Warning for no modules selected */}
      {enabledModulesCount === 0 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="text-sm text-yellow-700">
              Mindestens ein Modul sollte für diesen Schritt aktiviert sein.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
