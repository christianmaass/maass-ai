/**
 * RESPONSE HANDLER COMPONENT
 * Migrated to navaa Auth Guidelines (WP-B1)
 *
 * COMPLIANCE:
 * - Uses useAuth() hook (MANDATORY)
 * - JWT token management via getAccessToken()
 * - Secure foundation response submission with proper authentication
 * - No direct supabase.auth calls
 *
 * @version 2.0.0 (WP-B1 Migration)
 */

import React, { useState } from 'react';
import { FoundationCase, FoundationResponse } from '@project-types/foundation.types';
import { useAuth } from '@contexts/AuthContext';

interface ResponseHandlerProps {
  case: FoundationCase;
  onSubmit: (response: FoundationResponse) => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export default function ResponseHandler({
  case: foundationCase,
  onSubmit: _onSubmit,
  isSubmitting = false,
  disabled = false,
}: ResponseHandlerProps) {
  // =============================================================================
  // NAVAA AUTH INTEGRATION (WP-B1 Migration)
  // =============================================================================

  const { user, getAccessToken, isAuthenticated } = useAuth();

  const [response, setResponse] = useState<FoundationResponse>({
    case_id: foundationCase.id,
    response_data: {},
    interaction_type: foundationCase.interaction_type,
  });

  const [submitting, setSubmitting] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  // FoundationCase.content is not part of strict type; guard for runtime
  const content: any = (foundationCase as any)?.content || {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || isSubmitting || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      // Use navaa Auth Guidelines - check authentication
      if (!isAuthenticated() || !user) {
        console.error('User not authenticated for foundation response');
        throw new Error('Benutzer nicht authentifiziert. Bitte melden Sie sich an.');
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token for foundation response');
        throw new Error('Authentifizierungsfehler. Bitte erneut einloggen.');
      }

      const requestData = {
        case_id: foundationCase.id,
        response_data: response.response_data,
        interaction_type: foundationCase.interaction_type,
      };

      // Call the Foundation Track submit API
      const submitResponse = await fetch('/api/foundation/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
        },
        body: JSON.stringify(requestData),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.error || 'Fehler beim Einreichen der Antwort');
      }

      const result = await submitResponse.json();

      if (!result.success) {
        throw new Error(result.error || 'Unbekannter Fehler');
      }

      // Extract assessment from response
      const assessment = result.data.assessment;

      // Handle assessment data
      console.log('Assessment:', assessment);
    } catch (error) {
      console.error('Submit error:', error);
      setError(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setSubmitting(false);
    }
  };

  const updateResponseData = (key: string, value: any) => {
    setResponse((prev) => ({
      ...prev,
      response_data: {
        ...prev.response_data,
        [key]: value,
      },
    }));
  };

  const renderMultipleChoiceInput = () => {
    const mcQuestions = content.multiple_choice_questions || [];

    if (mcQuestions.length === 0) {
      return <div className="text-gray-500">Keine Multiple Choice Fragen verfügbar.</div>;
    }

    const getOptionStyle = (mcQuestion: any, option: any) => {
      const baseStyle =
        'w-full p-4 text-left border-2 rounded-lg transition-all duration-200 cursor-pointer';
      const isSelected = response.response_data[`mc_${mcQuestion.id}`] === option.id;
      const hasAnswered = response.response_data[`mc_${mcQuestion.id}`] !== undefined;

      if (!hasAnswered) {
        return `${baseStyle} border-gray-200 hover:border-[#00bfae] hover:bg-gray-50`;
      }

      // After answering - show correct/incorrect states
      if (option.correct) {
        return `${baseStyle} border-green-500 bg-green-50 text-green-800`;
      }

      if (isSelected && !option.correct) {
        return `${baseStyle} border-red-500 bg-red-50 text-red-800`;
      }

      return `${baseStyle} border-gray-200 bg-gray-50 text-gray-500`;
    };

    const getOptionIcon = (mcQuestion: any, option: any) => {
      const hasAnswered = response.response_data[`mc_${mcQuestion.id}`] !== undefined;
      const isSelected = response.response_data[`mc_${mcQuestion.id}`] === option.id;

      if (!hasAnswered) {
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
      }

      if (option.correct) {
        return (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
            ✓
          </div>
        );
      }

      if (isSelected && !option.correct) {
        return (
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
            ✗
          </div>
        );
      }

      return <div className="w-5 h-5 border-2 border-gray-300 rounded-full bg-gray-100" />;
    };

    return (
      <div className="space-y-8">
        <h3 className="font-semibold text-gray-900 text-lg">
          Schritt 1: Beantworten Sie die Multiple Choice Fragen
        </h3>

        {/* Render all MC questions */}
        {mcQuestions.map((mcQuestion: any, questionIndex: number) => {
          const hasAnswered = response.response_data[`mc_${mcQuestion.id}`] !== undefined;
          const selectedOption = mcQuestion.options.find(
            (opt: any) => opt.id === response.response_data[`mc_${mcQuestion.id}`],
          );

          return (
            <div key={mcQuestion.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4 text-base">
                {questionIndex + 1}. {mcQuestion.question}
              </h4>
              <div className="space-y-3">
                {mcQuestion.options.map((option: any) => (
                  <button
                    key={option.id}
                    onClick={() => updateResponseData(`mc_${mcQuestion.id}`, option.id)}
                    disabled={disabled || hasAnswered}
                    className={getOptionStyle(mcQuestion, option)}
                  >
                    <div className="flex items-center space-x-3">
                      {getOptionIcon(mcQuestion, option)}
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                          {option.id.toUpperCase()}
                        </span>
                        <span className="text-gray-700 font-medium text-left">{option.text}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Immediate Feedback after answering */}
              {hasAnswered && selectedOption && (
                <div
                  className={`mt-4 p-4 rounded-lg border ${
                    selectedOption.correct
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      selectedOption.correct ? 'text-green-800' : 'text-blue-800'
                    }`}
                  >
                    {selectedOption.correct ? '✓ Richtig!' : 'Nicht ganz richtig.'}
                  </div>
                  <p
                    className={`text-sm ${
                      selectedOption.correct ? 'text-green-700' : 'text-blue-700'
                    }`}
                  >
                    {selectedOption.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Step 2: Hypothesis formulation */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">
            Schritt 2: Formulieren Sie Ihre Hypothesen
          </h3>
          <p className="text-gray-600 mb-4">
            Basierend auf Ihren Antworten, formulieren Sie nun Ihre eigenen Hypothesen zur
            Problemlösung:
          </p>
          <textarea
            value={response.response_data.hypothesis || ''}
            onChange={(e) => updateResponseData('hypothesis', e.target.value)}
            placeholder="Formulieren Sie hier Ihre Hypothesen zur Problemanalyse und Lösungsfindung..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bfae] focus:border-[#00bfae] resize-none"
            rows={6}
            disabled={disabled}
          />
        </div>
      </div>
    );
  };

  const renderStructuredInput = () => {
    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-gray-900">Strukturierte Analyse:</h3>

        {/* Problem Definition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1. Problemdefinition
          </label>
          <textarea
            value={response.response_data.problem_definition || ''}
            onChange={(e) => updateResponseData('problem_definition', e.target.value)}
            placeholder="Definieren Sie das Kernproblem..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            disabled={disabled}
          />
        </div>

        {/* Framework Application */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            2. Framework-Anwendung
          </label>
          <textarea
            value={response.response_data.framework_application || ''}
            onChange={(e) => updateResponseData('framework_application', e.target.value)}
            placeholder="Wenden Sie das relevante Framework an..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
            disabled={disabled}
          />
        </div>

        {/* Recommendations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">3. Empfehlungen</label>
          <textarea
            value={response.response_data.recommendations || ''}
            onChange={(e) => updateResponseData('recommendations', e.target.value)}
            placeholder="Formulieren Sie konkrete Handlungsempfehlungen..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            disabled={disabled}
          />
        </div>
      </div>
    );
  };

  const renderFreeFormInput = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Ihre Analyse:</h3>
        <textarea
          value={response.response_data.free_form_response || ''}
          onChange={(e) => updateResponseData('free_form_response', e.target.value)}
          placeholder="Entwickeln Sie Ihre Lösung frei. Nutzen Sie die Hinweise als Orientierung..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={8}
          disabled={disabled}
        />
        <div className="text-sm text-gray-500">
          Tipp: Strukturieren Sie Ihre Antwort logisch und begründen Sie Ihre Überlegungen.
        </div>
      </div>
    );
  };

  const renderMinimalSupportInput = () => {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Ihre Lösung:</h3>
        <textarea
          value={response.response_data.minimal_response || ''}
          onChange={(e) => updateResponseData('minimal_response', e.target.value)}
          placeholder="Entwickeln Sie Ihre Lösung eigenständig..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={6}
          disabled={disabled}
        />
      </div>
    );
  };

  const renderInputByType = () => {
    switch (foundationCase.interaction_type) {
      case 'multiple_choice_with_hypotheses':
        return renderMultipleChoiceInput();
      case 'structured_mbb':
        return renderStructuredInput();
      case 'free_form_with_hints':
        return renderFreeFormInput();
      case 'minimal_support':
        return renderMinimalSupportInput();
      default:
        return renderFreeFormInput();
    }
  };

  const isResponseValid = () => {
    const data = response.response_data;

    switch (foundationCase.interaction_type) {
      case 'multiple_choice_with_hypotheses': {
        const mcQuestions = content.multiple_choice_questions || [];
        const allMcQuestionsAnswered = mcQuestions.every(
          (mcQuestion: any) => data[`mc_${mcQuestion.id}`] !== undefined,
        );
        return allMcQuestionsAnswered && data.hypothesis?.trim();
      }
      case 'structured_mbb':
        return (
          data.problem_definition?.trim() &&
          data.framework_application?.trim() &&
          data.recommendations?.trim()
        );
      case 'free_form_with_hints':
        return data.free_form_response?.trim();
      case 'minimal_support':
        return data.minimal_response?.trim();
      default:
        return false;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Ihre Antwort</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {renderInputByType()}

        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Interaktionstyp: {foundationCase.interaction_type}
          </div>

          <button
            type="submit"
            disabled={disabled || isSubmitting || submitting || !isResponseValid()}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors
              ${
                disabled || isSubmitting || submitting || !isResponseValid()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }
            `}
          >
            {submitting ? 'Wird eingereicht...' : 'Antwort einreichen'}
          </button>
        </div>
      </form>
    </div>
  );
}
