import React, { useState } from 'react';

// Types
interface MCQuestion {
  id?: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  question_number: number;
}

interface MultipleChoiceComponentProps {
  caseId: string;
  stepNumber: number;
  stepName: string;
  questions: MCQuestion[];
  onGenerate: (caseId: string, stepNumber: number) => Promise<void>;
  onQuestionUpdate?: (questions: MCQuestion[]) => void;
  isGenerating?: boolean;
}

export default function MultipleChoiceComponent({
  caseId,
  stepNumber,
  stepName,
  questions,
  onGenerate,
  onQuestionUpdate,
  isGenerating = false,
}: MultipleChoiceComponentProps) {
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<MCQuestion | null>(null);

  const handleEdit = (question: MCQuestion) => {
    setEditingQuestion(question.question_number);
    setEditedQuestion({ ...question });
  };

  const handleSave = () => {
    if (editedQuestion && onQuestionUpdate) {
      const updatedQuestions = questions.map((q) =>
        q.question_number === editedQuestion.question_number ? editedQuestion : q,
      );
      onQuestionUpdate(updatedQuestions);
    }
    setEditingQuestion(null);
    setEditedQuestion(null);
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setEditedQuestion(null);
  };

  const updateEditedQuestion = (field: keyof MCQuestion, value: string) => {
    if (editedQuestion) {
      setEditedQuestion({
        ...editedQuestion,
        [field]: value,
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🔘 Multiple Choice - Schritt {stepNumber}: {stepName}
        </h3>
        <button
          onClick={() => onGenerate(caseId, stepNumber)}
          disabled={isGenerating}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isGenerating
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isGenerating ? '🤖 Generiere...' : '🤖 3 MC-Aufgaben generieren'}
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">Noch keine Multiple Choice Aufgaben für diesen Schritt.</p>
          <p className="text-sm">
            Klicken Sie auf &quot;3 MC-Aufgaben generieren&quot; um zu starten.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.question_number} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">Frage {question.question_number}</h4>
                <div className="flex space-x-2">
                  {editingQuestion === question.question_number ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        💾 Speichern
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-sm px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        ❌ Abbrechen
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(question)}
                      className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      ✏️ Bearbeiten
                    </button>
                  )}
                </div>
              </div>

              {editingQuestion === question.question_number && editedQuestion ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frage:</label>
                    <textarea
                      value={editedQuestion.question}
                      onChange={(e) => updateEditedQuestion('question', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {['option_a', 'option_b', 'option_c', 'option_d'].map((optionKey, index) => {
                      const letter = ['A', 'B', 'C', 'D'][index];
                      const isCorrect = editedQuestion.correct_answer === letter;

                      return (
                        <div key={optionKey}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Option {letter} {isCorrect && '✓ (Richtig)'}
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="radio"
                              name="correct_answer"
                              checked={isCorrect}
                              onChange={() =>
                                updateEditedQuestion(
                                  'correct_answer',
                                  letter as 'A' | 'B' | 'C' | 'D',
                                )
                              }
                              className="mt-2"
                            />
                            <input
                              type="text"
                              value={editedQuestion[optionKey as keyof MCQuestion] as string}
                              onChange={(e) =>
                                updateEditedQuestion(optionKey as keyof MCQuestion, e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Erklärung:
                    </label>
                    <textarea
                      value={editedQuestion.explanation}
                      onChange={(e) => updateEditedQuestion('explanation', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="space-y-3">
                  <p className="text-gray-900 font-medium">{question.question}</p>

                  <div className="grid grid-cols-1 gap-2">
                    {['A', 'B', 'C', 'D'].map((letter, _index) => {
                      const optionKey = `option_${letter.toLowerCase()}` as keyof MCQuestion;
                      const optionText = question[optionKey] as string;
                      const isCorrect = question.correct_answer === letter;

                      return (
                        <div
                          key={letter}
                          className={`p-2 rounded border ${
                            isCorrect
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className="font-medium">{letter}) </span>
                          {optionText}
                          {isCorrect && <span className="ml-2 text-green-600">✓</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Erklärung:</strong> {question.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
