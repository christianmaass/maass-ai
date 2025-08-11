import React, { useState, useCallback } from 'react';
import {
  CaseEngineProps,
  GeneratedCase,
  CaseResponse,
  CaseAssessment,
} from './types/case-engine.types';

const CaseEngine: React.FC<CaseEngineProps> = ({
  trackConfig,
  onCaseGenerated,
  onResponseSubmitted,
  onAssessmentComplete,
  userId,
}) => {
  const [currentCase, setCurrentCase] = useState<GeneratedCase | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCase = useCallback(
    async (
      difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
      caseType?: string,
    ) => {
      setIsGenerating(true);
      setError(null);

      try {
        // This would integrate with the existing case generation API
        // For now, this is a placeholder structure
        const response = await fetch('/api/generate-case', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trackType: trackConfig.trackType,
            difficulty,
            caseType,
            prompts: trackConfig.prompts,
          }),
        });

        if (!response.ok) {
          throw new Error('Case generation failed');
        }

        const generatedCase: GeneratedCase = await response.json();
        setCurrentCase(generatedCase);
        onCaseGenerated?.(generatedCase);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsGenerating(false);
      }
    },
    [trackConfig, onCaseGenerated],
  );

  const assessResponse = useCallback(
    async (response: CaseResponse) => {
      if (!currentCase) return;

      setIsAssessing(true);
      setError(null);

      try {
        // This would integrate with the existing assessment API
        const assessmentResponse = await fetch('/api/assess-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            case: currentCase,
            response,
            assessmentCriteria: trackConfig.assessmentCriteria,
            prompts: trackConfig.prompts,
          }),
        });

        if (!assessmentResponse.ok) {
          throw new Error('Assessment failed');
        }

        const assessment: CaseAssessment = await assessmentResponse.json();
        onAssessmentComplete?.(assessment);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Assessment error');
      } finally {
        setIsAssessing(false);
      }
    },
    [currentCase, onAssessmentComplete, trackConfig.assessmentCriteria, trackConfig.prompts],
  );

  const submitResponse = useCallback(
    async (responses: Record<string, string>) => {
      if (!currentCase || !userId) return;

      const caseResponse: CaseResponse = {
        caseId: currentCase.id,
        userId,
        responses,
        submittedAt: new Date(),
        timeSpent: 0, // This would be tracked in a real implementation
      };

      onResponseSubmitted?.(caseResponse);

      // Trigger assessment
      await assessResponse(caseResponse);
    },
    [currentCase, userId, onResponseSubmitted, assessResponse],
  );

  return (
    <div className="case-engine">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!currentCase && (
        <div className="text-center py-8">
          <button
            onClick={() => generateCase()}
            disabled={isGenerating}
            className="px-6 py-3 bg-[#00bfae] text-white rounded-lg hover:bg-[#009688] disabled:opacity-50"
          >
            {isGenerating ? 'Generiere Case...' : 'Neuen Case generieren'}
          </button>
        </div>
      )}

      {currentCase && (
        <div className="case-display">
          <h2 className="text-2xl font-bold mb-4">{currentCase.title}</h2>
          <div className="case-content mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{currentCase.content}</p>
          </div>

          {/* Case questions would be rendered here */}
          <div className="case-questions">
            {currentCase.questions.map((question) => (
              <div key={question.id} className="mb-6">
                <h3 className="font-semibold mb-2">{question.question}</h3>
                {/* Question input components would go here */}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentCase(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Neuer Case
            </button>
            <button
              onClick={() => submitResponse({})} // This would collect actual responses
              disabled={isAssessing}
              className="px-6 py-3 bg-[#009e82] text-white rounded-lg hover:bg-[#007a66] disabled:opacity-50"
            >
              {isAssessing ? 'Bewerte...' : 'Antwort einreichen'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseEngine;
