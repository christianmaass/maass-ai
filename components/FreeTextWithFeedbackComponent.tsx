import React, { useState } from 'react';

// Types - REUSING similar structure as MC component
interface GPTFeedback {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  ideal_answer: string;
}

interface FreeTextResponse {
  id?: string;
  user_response: string;
  gpt_feedback?: GPTFeedback;
  created_at?: string;
}

interface FreeTextWithFeedbackProps {
  caseId: string;
  stepNumber: number;
  stepName: string;
  prompt: string;
  existingResponse?: FreeTextResponse;
  onSubmit: (
    caseId: string,
    stepNumber: number,
    userResponse: string,
    promptText: string,
  ) => Promise<void>;
  isEvaluating?: boolean;
}

export default function FreeTextWithFeedbackComponent({
  caseId,
  stepNumber,
  stepName,
  prompt,
  existingResponse,
  onSubmit,
  isEvaluating = false,
}: FreeTextWithFeedbackProps) {
  const [userResponse, setUserResponse] = useState(existingResponse?.user_response || '');
  const [hasSubmitted, setHasSubmitted] = useState(!!existingResponse?.gpt_feedback);

  const handleSubmit = async () => {
    if (!userResponse.trim()) {
      return;
    }

    try {
      await onSubmit(caseId, stepNumber, userResponse.trim(), prompt);
      setHasSubmitted(true);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const handleReset = () => {
    setUserResponse('');
    setHasSubmitted(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 8) return '🎉';
    if (score >= 6) return '👍';
    if (score >= 4) return '🤔';
    return '💪';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📝 Freitext - Schritt {stepNumber}: {stepName}
        </h3>
        {hasSubmitted && (
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
          >
            🔄 Neue Antwort
          </button>
        )}
      </div>

      {/* Prompt/Question */}
      <div className="mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">💭 Aufgabe:</p>
          <p className="text-sm text-blue-800">{prompt}</p>
        </div>
      </div>

      {/* User Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ihre Antwort:</label>
        <textarea
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          disabled={hasSubmitted}
          className={`w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm ${
            hasSubmitted ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
          }`}
          placeholder="Formulieren Sie hier Ihre Hypothesen..."
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">{userResponse.length} Zeichen</p>
          {!hasSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={!userResponse.trim() || isEvaluating}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isEvaluating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : !userResponse.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEvaluating ? '🤖 Bewerte...' : '📤 Antwort einreichen & bewerten'}
            </button>
          )}
        </div>
      </div>

      {/* GPT Feedback */}
      {existingResponse?.gpt_feedback && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">🤖 GPT-Feedback</h4>

          {/* Score */}
          <div className="mb-4">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(existingResponse.gpt_feedback.score)}`}
            >
              <span className="mr-1">{getScoreEmoji(existingResponse.gpt_feedback.score)}</span>
              Bewertung: {existingResponse.gpt_feedback.score}/10 Punkte
            </div>
          </div>

          {/* General Feedback */}
          <div className="mb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-900">{existingResponse.gpt_feedback.feedback}</p>
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Strengths */}
            <div>
              <h5 className="text-sm font-medium text-green-700 mb-2">✅ Stärken:</h5>
              <ul className="space-y-1">
                {existingResponse.gpt_feedback.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-green-600 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h5 className="text-sm font-medium text-orange-700 mb-2">🔧 Verbesserungen:</h5>
              <ul className="space-y-1">
                {existingResponse.gpt_feedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-orange-600 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Ideal Answer */}
          <div>
            <h5 className="text-sm font-medium text-blue-700 mb-2">💡 Idealtypische Antwort:</h5>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 leading-relaxed">
                {existingResponse.gpt_feedback.ideal_answer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
