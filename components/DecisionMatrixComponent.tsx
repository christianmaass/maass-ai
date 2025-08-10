import React, { useState, useEffect } from 'react';

interface DecisionOption {
  id: string;
  name: string;
  marge: string;
  umsetzbarkeit: string;
  zeit: string;
  risiken: string;
}

interface Decision {
  id?: string;
  selected_option: string;
  reasoning: string;
  decision_matrix?: {
    options: DecisionOption[];
  };
  created_at?: string;
  updated_at?: string;
}

interface DecisionMatrixComponentProps {
  caseId: string;
  stepNumber: number;
  stepName: string;
  title?: string;
  options: DecisionOption[];
  existingDecision?: Decision;
  onSave: (
    caseId: string,
    stepNumber: number,
    selectedOption: string,
    reasoning: string,
    decisionMatrix: any,
  ) => Promise<void>;
  isSaving?: boolean;
}

export default function DecisionMatrixComponent({
  caseId,
  stepNumber,
  stepName,
  title = 'Strukturierte Entscheidungsvorbereitung',
  options,
  existingDecision,
  onSave,
  isSaving = false,
}: DecisionMatrixComponentProps) {
  const [selectedOption, setSelectedOption] = useState(existingDecision?.selected_option || '');
  const [reasoning, setReasoning] = useState(existingDecision?.reasoning || '');
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when existingDecision changes
  useEffect(() => {
    if (existingDecision) {
      setSelectedOption(existingDecision.selected_option || '');
      setReasoning(existingDecision.reasoning || '');
      setHasChanges(false);
    }
  }, [existingDecision]);

  // Track changes
  useEffect(() => {
    const optionChanged = selectedOption !== (existingDecision?.selected_option || '');
    const reasoningChanged = reasoning !== (existingDecision?.reasoning || '');
    setHasChanges(optionChanged || reasoningChanged);
  }, [selectedOption, reasoning, existingDecision]);

  const handleSave = async () => {
    if (!selectedOption || !reasoning.trim()) {
      alert('Bitte wählen Sie eine Option und geben Sie eine Begründung ein.');
      return;
    }

    try {
      await onSave(caseId, stepNumber, selectedOption, reasoning.trim(), { options });
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving decision:', error);
      alert('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    }
  };

  const handleReset = () => {
    setSelectedOption(existingDecision?.selected_option || '');
    setReasoning(existingDecision?.reasoning || '');
    setHasChanges(false);
  };

  const getOptionColor = (optionId: string) => {
    if (selectedOption === optionId) {
      return 'bg-blue-50 border-blue-300 ring-2 ring-blue-500';
    }
    return 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-25';
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          🎯 {title} - Schritt {stepNumber}: {stepName}
        </h3>
        {existingDecision && (
          <span className="text-sm text-gray-500">
            Gespeichert:{' '}
            {new Date(
              existingDecision.updated_at || existingDecision.created_at || '',
            ).toLocaleString('de-DE')}
          </span>
        )}
      </div>

      {/* Decision Matrix Table */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">📊 Wählen Sie die beste Option:</h4>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  Option
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  Wirkung auf Marge
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  Umsetzbarkeit
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  Zeit bis Wirkung
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  Risiken
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                  Auswahl
                </th>
              </tr>
            </thead>
            <tbody>
              {options.map((option) => (
                <tr
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 ${getOptionColor(option.id)}`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {option.id}: {option.name}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        option.marge === 'Hoch'
                          ? 'bg-green-100 text-green-800'
                          : option.marge === 'Mittel'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {option.marge}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        option.umsetzbarkeit === 'Hoch'
                          ? 'bg-green-100 text-green-800'
                          : option.umsetzbarkeit === 'Mittel'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {option.umsetzbarkeit}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        option.zeit === 'Sofort' || option.zeit === 'Kurzfristig'
                          ? 'bg-green-100 text-green-800'
                          : option.zeit === 'Mittelfristig'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {option.zeit}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                    {option.risiken}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <input
                      type="radio"
                      name={`decision-${stepNumber}`}
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={isSaving}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Option Display */}
      {selectedOption && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-blue-600 mr-2">✅</span>
            <span className="font-medium text-blue-800">
              Gewählte Option: {selectedOption} -{' '}
              {options.find((opt) => opt.id === selectedOption)?.name}
            </span>
          </div>
        </div>
      )}

      {/* Reasoning Input */}
      <div className="mb-4">
        <label
          htmlFor={`reasoning-${stepNumber}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          💭 Begründung für Ihre Entscheidung:
        </label>
        <textarea
          id={`reasoning-${stepNumber}`}
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="Erklären Sie, warum Sie diese Option gewählt haben. Beziehen Sie sich dabei auf Ihre vorherigen Analysen aus den anderen Schritten..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          disabled={isSaving}
        />
        <div className="text-right text-sm text-gray-500 mt-1">{reasoning.length} Zeichen</div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={!hasChanges || !selectedOption || !reasoning.trim() || isSaving}
          className={`px-4 py-2 rounded-md font-medium ${
            hasChanges && selectedOption && reasoning.trim() && !isSaving
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSaving ? '💾 Speichert...' : '💾 Entscheidung speichern'}
        </button>

        {hasChanges && (
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium"
          >
            ↩️ Zurücksetzen
          </button>
        )}
      </div>

      {/* Status Display */}
      {existingDecision && !hasChanges && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            <span className="text-sm text-green-700">
              Entscheidung gespeichert: Option {existingDecision.selected_option}
            </span>
          </div>
        </div>
      )}

      {hasChanges && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="text-sm text-yellow-700">Ungespeicherte Änderungen</span>
          </div>
        </div>
      )}
    </div>
  );
}
