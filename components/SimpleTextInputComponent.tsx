import React, { useState, useEffect } from 'react';

interface TextInput {
  id?: string;
  user_input: string;
  explanation?: string;
  created_at?: string;
  updated_at?: string;
}

interface SimpleTextInputComponentProps {
  caseId: string;
  stepNumber: number;
  stepName: string;
  placeholder?: string;
  explanationPlaceholder?: string;
  existingInput?: TextInput;
  onSave: (
    caseId: string,
    stepNumber: number,
    input: string,
    explanation?: string,
  ) => Promise<void>;
  isSaving?: boolean;
}

export default function SimpleTextInputComponent({
  caseId,
  stepNumber,
  stepName,
  placeholder = 'Geben Sie Ihre Analyse ein...',
  explanationPlaceholder = 'Optionale Erklärung oder Notizen...',
  existingInput,
  onSave,
  isSaving = false,
}: SimpleTextInputComponentProps) {
  const [userInput, setUserInput] = useState(existingInput?.user_input || '');
  const [explanation, setExplanation] = useState(existingInput?.explanation || '');
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when existingInput changes
  useEffect(() => {
    if (existingInput) {
      setUserInput(existingInput.user_input || '');
      setExplanation(existingInput.explanation || '');
      setHasChanges(false);
    }
  }, [existingInput]);

  // Track changes
  useEffect(() => {
    const inputChanged = userInput !== (existingInput?.user_input || '');
    const explanationChanged = explanation !== (existingInput?.explanation || '');
    setHasChanges(inputChanged || explanationChanged);
  }, [userInput, explanation, existingInput]);

  const handleSave = async () => {
    if (!userInput.trim()) {
      alert('Bitte geben Sie einen Text ein.');
      return;
    }

    try {
      await onSave(caseId, stepNumber, userInput.trim(), explanation.trim() || undefined);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving text input:', error);
      alert('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    }
  };

  const handleReset = () => {
    setUserInput(existingInput?.user_input || '');
    setExplanation(existingInput?.explanation || '');
    setHasChanges(false);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📝 Texteingabe - Schritt {stepNumber}: {stepName}
        </h3>
        {existingInput && (
          <span className="text-sm text-gray-500">
            Gespeichert:{' '}
            {new Date(existingInput.updated_at || existingInput.created_at || '').toLocaleString(
              'de-DE',
            )}
          </span>
        )}
      </div>

      {/* Main Text Input */}
      <div className="mb-4">
        <label
          htmlFor={`text-input-${stepNumber}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Ihre Eingabe:
        </label>
        <textarea
          id={`text-input-${stepNumber}`}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          disabled={isSaving}
        />
        <div className="text-right text-sm text-gray-500 mt-1">{userInput.length} Zeichen</div>
      </div>

      {/* Optional Explanation */}
      <div className="mb-4">
        <label
          htmlFor={`explanation-${stepNumber}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Erklärung/Notizen (optional):
        </label>
        <textarea
          id={`explanation-${stepNumber}`}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder={explanationPlaceholder}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          disabled={isSaving}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={!hasChanges || !userInput.trim() || isSaving}
          className={`px-4 py-2 rounded-md font-medium ${
            hasChanges && userInput.trim() && !isSaving
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSaving ? '💾 Speichert...' : '💾 Speichern'}
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
      {existingInput && !hasChanges && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            <span className="text-sm text-green-700">
              Eingabe gespeichert
              {existingInput.explanation && ' (mit Erklärung)'}
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
