import React, { useState } from 'react';
import Image from 'next/image';

// REUSING same patterns as other components
interface ContentModule {
  id?: string;
  title: string;
  content: string;
  image_url?: string;
  generation_prompt?: string;
  generated_by_gpt?: boolean;
}

interface ContentModuleComponentProps {
  caseId: string;
  stepNumber: number;
  stepName: string;
  existingContent?: ContentModule;
  onGenerate: (caseId: string, stepNumber: number, prompt: string) => Promise<void>;
  onSave?: (content: ContentModule) => Promise<void>;
  isGenerating?: boolean;
}

export default function ContentModuleComponent({
  caseId,
  stepNumber,
  stepName,
  existingContent,
  onGenerate,
  onSave,
  isGenerating = false,
}: ContentModuleComponentProps) {
  // REUSING same state patterns as other components
  const [isEditing, setIsEditing] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [editedContent, setEditedContent] = useState<ContentModule | null>(null);
  const [showGenerationInput, setShowGenerationInput] = useState(!existingContent);

  const handleStartEdit = () => {
    setEditedContent({
      title: existingContent?.title || 'Framework-Einleitung',
      content: existingContent?.content || '',
      image_url: existingContent?.image_url || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedContent && onSave) {
      await onSave(editedContent);
    }
    setIsEditing(false);
    setEditedContent(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(null);
  };

  const handleGenerate = async () => {
    if (!generationPrompt.trim()) return;

    await onGenerate(caseId, stepNumber, generationPrompt.trim());
    setGenerationPrompt('');
    setShowGenerationInput(false);
  };

  const updateEditedContent = (field: keyof ContentModule, value: string) => {
    if (editedContent) {
      setEditedContent({
        ...editedContent,
        [field]: value,
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📖 Framework-Einleitung - Schritt {stepNumber}: {stepName}
        </h3>
        <div className="flex space-x-2">
          {existingContent && !isEditing && (
            <button
              onClick={handleStartEdit}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded"
            >
              ✏️ Bearbeiten
            </button>
          )}
          <button
            onClick={() => setShowGenerationInput(!showGenerationInput)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
          >
            {showGenerationInput ? '❌ Abbrechen' : '🤖 Generieren'}
          </button>
        </div>
      </div>

      {/* Generation Input */}
      {showGenerationInput && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-medium text-blue-900 mb-2">
            💭 Was soll generiert werden?
          </label>
          <textarea
            value={generationPrompt}
            onChange={(e) => setGenerationPrompt(e.target.value)}
            className="w-full h-20 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            placeholder="z.B. 'Erkläre das MECE-Prinzip für Consulting Cases' oder 'Einführung in Profit Trees mit Beispiel'"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleGenerate}
              disabled={!generationPrompt.trim() || isGenerating}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isGenerating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : !generationPrompt.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isGenerating ? '🤖 Generiere...' : '🚀 Content generieren'}
            </button>
          </div>
        </div>
      )}

      {/* Content Display/Edit */}
      {existingContent && (
        <div>
          {isEditing && editedContent ? (
            // Edit Mode - REUSING same patterns as other edit components
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titel:</label>
                <input
                  type="text"
                  value={editedContent.title}
                  onChange={(e) => updateEditedContent('title', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (Markdown unterstützt):
                </label>
                <textarea
                  value={editedContent.content}
                  onChange={(e) => updateEditedContent('content', e.target.value)}
                  className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bild-URL (optional):
                </label>
                <input
                  type="url"
                  value={editedContent.image_url || ''}
                  onChange={(e) => updateEditedContent('image_url', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.png"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  💾 Speichern
                </button>
              </div>
            </div>
          ) : (
            // Display Mode
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {existingContent.title || 'Framework-Einleitung'}
              </h4>

              {existingContent.image_url && (
                <div className="mb-4">
                  <Image
                    src={existingContent.image_url}
                    alt={existingContent.title || 'Framework Bild'}
                    width={800}
                    height={450}
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                    unoptimized
                  />
                </div>
              )}

              <div
                className="prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: (existingContent.content || '')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>'),
                }}
              />

              {existingContent.generated_by_gpt && (
                <div className="mt-3 text-xs text-gray-500 flex items-center">
                  <span className="mr-1">🤖</span>
                  Von GPT generiert
                  {existingContent.generation_prompt && (
                    <span className="ml-2 italic">
                      &quot;{existingContent.generation_prompt}&quot;
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* No Content State */}
      {!existingContent && !showGenerationInput && (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">Noch keine Framework-Einleitung für diesen Schritt.</p>
          <p className="text-sm">
            Klicken Sie auf &quot;🤖 Generieren&quot; um Content zu erstellen.
          </p>
        </div>
      )}
    </div>
  );
}
