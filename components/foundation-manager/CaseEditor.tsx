import React, { useState, useEffect } from 'react';
import { FoundationCase } from './hooks/useFoundationCases';
import { GenerationState } from './hooks/useCaseGeneration';

interface CaseEditorProps {
  selectedCase: FoundationCase | null;
  generationState: GenerationState;
  onGenerateContent: (
    userDescription: string,
  ) => Promise<{ success: boolean; description?: string; question?: string; error?: string }>;
  onUpdateCase: (caseId: string, updates: Partial<FoundationCase>) => Promise<boolean>;
  onToggleConfigPanel: () => void;
}

const CaseEditor: React.FC<CaseEditorProps> = ({
  selectedCase,
  generationState,
  onGenerateContent,
  onUpdateCase,
  onToggleConfigPanel,
}) => {
  const [userDescription, setUserDescription] = useState('');
  const [editableTitle, setEditableTitle] = useState('');
  const [editableDescription, setEditableDescription] = useState('');
  const [editableQuestion, setEditableQuestion] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Update local state when selectedCase changes
  useEffect(() => {
    if (selectedCase) {
      setEditableTitle(selectedCase.title || '');
      setEditableDescription(selectedCase.case_description || '');
      setEditableQuestion(selectedCase.case_question || '');
      setUserDescription('');
      setIsEditing(false);
      setSaveStatus('idle');
    }
  }, [selectedCase]);

  // Handle case generation
  const handleGenerate = async () => {
    if (!selectedCase || !userDescription.trim()) return;

    const result = await onGenerateContent(userDescription.trim());

    if (result.success && result.description && result.question) {
      // Update local editable state with generated content
      setEditableDescription(result.description);
      setEditableQuestion(result.question);
      setIsEditing(true);
    }
  };

  // Handle saving changes
  const handleSave = async () => {
    if (!selectedCase) return;

    setSaveStatus('saving');

    const updates: Partial<FoundationCase> = {};

    if (editableTitle !== selectedCase.title) {
      updates.title = editableTitle;
    }
    if (editableDescription !== selectedCase.case_description) {
      updates.case_description = editableDescription;
    }
    if (editableQuestion !== selectedCase.case_question) {
      updates.case_question = editableQuestion;
    }

    if (Object.keys(updates).length === 0) {
      setSaveStatus('idle');
      setIsEditing(false);
      return;
    }

    const success = await onUpdateCase(selectedCase.id, updates);

    if (success) {
      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    if (selectedCase) {
      setEditableTitle(selectedCase.title || '');
      setEditableDescription(selectedCase.case_description || '');
      setEditableQuestion(selectedCase.case_question || '');
    }
    setIsEditing(false);
    setSaveStatus('idle');
  };

  if (!selectedCase) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📝</div>
          <h3 className="text-gray-600 font-medium">Kein Case ausgewählt</h3>
          <p className="text-gray-500 text-sm mt-1">
            Wähle einen Foundation Case aus der Liste aus, um ihn zu bearbeiten.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Case Editor</h2>
            <p className="text-sm text-gray-500 mt-1">
              Bearbeite und generiere Inhalte für den ausgewählten Case
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleConfigPanel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              ⚙️ Module konfigurieren
            </button>
            {saveStatus === 'success' && (
              <div className="flex items-center text-green-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Gespeichert
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Case Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Cluster:</span>
              <div className="font-medium text-gray-900">{selectedCase.cluster}</div>
            </div>
            <div>
              <span className="text-gray-500">Tool:</span>
              <div className="font-medium text-gray-900">{selectedCase.tool}</div>
            </div>
            <div>
              <span className="text-gray-500">Schwierigkeit:</span>
              <div className="font-medium text-gray-900">{selectedCase.difficulty}/12</div>
            </div>
            <div>
              <span className="text-gray-500">Typ:</span>
              <div className="font-medium text-gray-900">
                {selectedCase.case_type || 'Nicht definiert'}
              </div>
            </div>
          </div>

          {selectedCase.learning_objectives && selectedCase.learning_objectives.length > 0 && (
            <div className="mt-4">
              <span className="text-gray-500 text-sm">Lernziele:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedCase.learning_objectives.map((objective, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {objective}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Title Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Case Titel</label>
          <input
            type="text"
            value={editableTitle}
            onChange={(e) => {
              setEditableTitle(e.target.value);
              setIsEditing(true);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Case Titel eingeben..."
          />
        </div>

        {/* Content Generation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beschreibung für GPT-Generierung
          </label>
          <textarea
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Beschreibe den gewünschten Case-Inhalt für die GPT-Generierung..."
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              GPT generiert basierend auf dieser Beschreibung Case-Beschreibung und Frage.
            </p>
            <button
              onClick={handleGenerate}
              disabled={!userDescription.trim() || generationState.isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              {generationState.isGenerating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generiere...
                </div>
              ) : (
                '🤖 Case generieren'
              )}
            </button>
          </div>

          {generationState.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{generationState.error}</p>
            </div>
          )}
        </div>

        {/* Case Description Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Case Beschreibung</label>
          <textarea
            value={editableDescription}
            onChange={(e) => {
              setEditableDescription(e.target.value);
              setIsEditing(true);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            placeholder="Case Beschreibung (wird von GPT generiert oder manuell eingegeben)..."
          />
        </div>

        {/* Case Question Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Case Frage</label>
          <textarea
            value={editableQuestion}
            onChange={(e) => {
              setEditableQuestion(e.target.value);
              setIsEditing(true);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Case Frage (wird von GPT generiert oder manuell eingegeben)..."
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {saveStatus === 'saving' ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Speichere...
                </div>
              ) : (
                'Änderungen speichern'
              )}
            </button>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              Fehler beim Speichern der Änderungen. Bitte versuche es erneut.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseEditor;
