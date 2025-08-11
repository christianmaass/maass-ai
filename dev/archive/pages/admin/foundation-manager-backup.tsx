import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ModuleConfigurationPanel from '../../components/ModuleConfigurationPanel';

// Extracted Components
import CaseSelector from '../../components/foundation-manager/CaseSelector';
import CaseEditor from '../../components/foundation-manager/CaseEditor';
import StepRenderer from '../../components/foundation-manager/StepRenderer';

// Extracted Hooks
import { useFoundationCases } from '../../components/foundation-manager/hooks/useFoundationCases';
import { useCaseGeneration } from '../../components/foundation-manager/hooks/useCaseGeneration';
import { useModuleState } from '../../components/foundation-manager/hooks/useModuleState';

const FoundationManager: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'cases' | 'editor' | 'steps'>('cases');

  // Custom Hooks
  const {
    cases,
    selectedCase,
    loading: casesLoading,
    error: casesError,
    selectCase,
    refreshCases,
    updateCase,
  } = useFoundationCases();

  const { generationState, generateCaseContent, clearGenerationState } = useCaseGeneration();

  const {
    moduleConfiguration,
    configPanelOpen,
    loading: moduleLoading,
    error: moduleError,
    updateModuleConfiguration,
    toggleConfigPanel,
    resetModuleState,
    updateStepState,
    getStepState,
  } = useModuleState(selectedCase?.id || null);

  // Handle case selection
  const handleCaseSelect = (caseId: string) => {
    selectCase(caseId);
    clearGenerationState();
    resetModuleState();
    setActiveTab('editor');
  };

  // Handle case generation
  const handleGenerateContent = async (userDescription: string) => {
    if (!selectedCase) return { success: false, error: 'No case selected' };

    const result = await generateCaseContent(selectedCase, userDescription);

    if (result.success && result.description && result.question) {
      // Auto-update the case in database
      await updateCase(selectedCase.id, {
        case_description: result.description,
        case_question: result.question,
      });
    }

    return result;
  };

  // Authentication check
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Zugriff verweigert</h2>
          <p className="text-gray-600">
            Du musst angemeldet sein, um den Foundation Manager zu verwenden.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Foundation Manager</h1>
              <p className="text-sm text-gray-500">
                Verwalte und erstelle Foundation Learning Cases
              </p>
            </div>

            {selectedCase && (
              <div className="text-sm text-gray-600">
                Ausgewählt: <span className="font-medium">{selectedCase.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('cases')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cases'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Cases verwalten
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              disabled={!selectedCase}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'editor' && selectedCase
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed'
              }`}
            >
              ✏️ Case bearbeiten
            </button>

            <button
              onClick={() => setActiveTab('steps')}
              disabled={!selectedCase}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'steps' && selectedCase
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed'
              }`}
            >
              🎯 Learning Steps
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'cases' && (
              <CaseSelector
                cases={cases}
                selectedCase={selectedCase}
                loading={casesLoading}
                error={casesError}
                onSelectCase={handleCaseSelect}
                onRefresh={refreshCases}
              />
            )}

            {activeTab === 'editor' && (
              <CaseEditor
                selectedCase={selectedCase}
                generationState={generationState}
                onGenerateContent={handleGenerateContent}
                onUpdateCase={updateCase}
                onToggleConfigPanel={toggleConfigPanel}
              />
            )}

            {activeTab === 'steps' && (
              <StepRenderer
                selectedCase={selectedCase}
                moduleConfiguration={moduleConfiguration}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                getStepState={getStepState}
                updateStepState={updateStepState}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Übersicht</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gesamt Cases:</span>
                    <span className="font-medium">{cases.length}</span>
                  </div>
                  {selectedCase && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Schwierigkeit:</span>
                        <span className="font-medium">{selectedCase.difficulty}/12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Dauer:</span>
                        <span className="font-medium">{selectedCase.estimated_duration} Min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Aktueller Schritt:</span>
                        <span className="font-medium">{currentStep}/5</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Aktionen</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('cases')}
                    className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    📋 Cases anzeigen
                  </button>

                  {selectedCase && (
                    <>
                      <button
                        onClick={() => setActiveTab('editor')}
                        className="w-full px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        ✏️ Case bearbeiten
                      </button>

                      <button
                        onClick={() => setActiveTab('steps')}
                        className="w-full px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      >
                        🎯 Steps bearbeiten
                      </button>

                      <button
                        onClick={toggleConfigPanel}
                        className="w-full px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                      >
                        ⚙️ Module konfigurieren
                      </button>
                    </>
                  )}

                  <button
                    onClick={refreshCases}
                    className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    🔄 Aktualisieren
                  </button>
                </div>
              </div>

              {/* Status Indicators */}
              {(casesError || moduleError || generationState.error) && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-red-600 mb-4">⚠️ Fehler</h3>
                  <div className="space-y-2 text-sm">
                    {casesError && <div className="text-red-600">Cases: {casesError}</div>}
                    {moduleError && <div className="text-red-600">Module: {moduleError}</div>}
                    {generationState.error && (
                      <div className="text-red-600">Generation: {generationState.error}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Module Configuration Panel */}
      {configPanelOpen && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Module konfigurieren: {selectedCase.title}
                </h2>
                <button onClick={toggleConfigPanel} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <ModuleConfigurationPanel
                caseId={selectedCase.id}
                initialConfiguration={moduleConfiguration}
                onSave={async (config) => {
                  const success = await updateModuleConfiguration(config);
                  if (success) {
                    toggleConfigPanel();
                  }
                  // onSave is typed to return Promise<void>
                  return;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundationManager;
