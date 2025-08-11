/**
 * CASE WORKFLOW COMPONENT
 * Migrated to navaa Auth Guidelines (WP-B1)
 *
 * COMPLIANCE:
 * - Uses useAuth() hook (MANDATORY)
 * - JWT token management via getAccessToken()
 * - Standardized error handling
 * - No direct supabase.auth calls
 *
 * @version 2.0.0 (WP-B1 Migration)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabaseClient } from '../../supabaseClient';

// Shared Types - Centralized for consistency
export interface CaseData {
  id: string;
  title: string;
  description: string;
  case_type: {
    name: string;
    difficulty_level: number;
  };
}

export interface CaseLimitInfo {
  canGenerateCase: boolean;
  casesUsed: number;
  caseLimit: number;
  tariffName: string;
  message?: string;
}

export type WorkflowView = 'start' | 'case' | 'response' | 'assessment';

// Props Interface for the unified workflow
interface CaseWorkflowProps {
  // Optional callbacks for parent components
  onViewChange?: (view: WorkflowView) => void;
  onCaseGenerated?: (caseData: CaseData) => void;
  onResponseSubmitted?: (responseId: string) => void;
  onAssessmentCompleted?: (assessmentId: string) => void;

  // Optional initial state
  initialView?: WorkflowView;
  initialCase?: CaseData | null;

  // Layout customization
  className?: string;
  showProgress?: boolean;
}

const CaseWorkflow: React.FC<CaseWorkflowProps> = ({
  onViewChange,
  onCaseGenerated,
  onResponseSubmitted,
  onAssessmentCompleted,
  initialView = 'start',
  initialCase = null,
  className = '',
  showProgress = true,
}) => {
  // =============================================================================
  // NAVAA AUTH INTEGRATION (WP-B1 Migration)
  // =============================================================================

  const { user, getAccessToken, session, isAuthenticated } = useAuth();

  // State Management - Centralized
  const [currentView, setCurrentView] = useState<WorkflowView>(initialView);
  const [currentCase, setCurrentCase] = useState<CaseData | null>(initialCase);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Case Limit State
  const [caseLimitInfo, setCaseLimitInfo] = useState<CaseLimitInfo | null>(null);
  const [limitLoading, setLimitLoading] = useState(true);

  // Load case limit info on component mount

  // Notify parent of view changes
  useEffect(() => {
    onViewChange?.(currentView);
  }, [currentView, onViewChange]);

  const fetchCaseLimitInfo = useCallback(async () => {
    try {
      setLimitLoading(true);

      // Use navaa Auth Guidelines - check authentication via useAuth hook
      if (!isAuthenticated() || !user) {
        console.error('User not authenticated');
        setCaseLimitInfo({
          canGenerateCase: false,
          casesUsed: 0,
          caseLimit: 0,
          tariffName: 'Not authenticated',
          message: 'Please log in to check case limits',
        });
        return;
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token');
        return;
      }

      const response = await fetch('/api/check-case-limit', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCaseLimitInfo(data);
      } else {
        throw new Error(`Failed to fetch case limit info: ${response.status}`);
      }
    } catch (err: any) {
      console.error('Error fetching case limit info:', err);
      setCaseLimitInfo({
        canGenerateCase: false,
        casesUsed: 0,
        caseLimit: 0,
        tariffName: 'Error',
        message: err?.message || 'Unknown error while fetching case limits',
      });
    } finally {
      setLimitLoading(false);
    }
  }, [getAccessToken, isAuthenticated, user]);

  // Load case limit info on component mount
  useEffect(() => {
    fetchCaseLimitInfo();
  }, [fetchCaseLimitInfo]);

  const generateCase = async (retryCount = 0) => {
    if (!caseLimitInfo?.canGenerateCase) {
      setError('Case-Limit erreicht. Bitte upgrade dein Abo.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use navaa Auth Guidelines - check authentication via useAuth hook
      if (!isAuthenticated() || !user) {
        throw new Error('Keine aktive Session. Bitte logge dich erneut ein.');
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Authentication failed - please log in again');
      }

      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 seconds timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Generate case API error:', response.status, errorText);

        if (response.status === 429) {
          throw new Error('Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.');
        } else if (response.status === 401) {
          throw new Error('Authentifizierung fehlgeschlagen. Bitte logge dich erneut ein.');
        } else if (response.status >= 500) {
          throw new Error('Server-Fehler. Bitte versuche es später erneut.');
        } else {
          throw new Error(`Fehler beim Generieren des Cases (${response.status})`);
        }
      }

      const caseData = await response.json();

      // Validate case data
      if (!caseData || !caseData.id || !caseData.title) {
        throw new Error('Ungültige Case-Daten erhalten');
      }

      setCurrentCase(caseData);
      setCurrentView('case');
      onCaseGenerated?.(caseData);

      // Refresh case limit info
      await fetchCaseLimitInfo();

      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error('Generate case error:', err);

      // Retry logic for network errors (narrow err safely)
      const isAbort = typeof (err as any)?.name === 'string' && (err as any).name === 'AbortError';
      if (retryCount < 2 && (err instanceof TypeError || isAbort)) {
        console.log(`Retrying case generation (attempt ${retryCount + 1})`);
        setTimeout(() => generateCase(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : 'Unbekannter Fehler beim Generieren des Cases';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async (response: string) => {
    if (!currentCase || !response.trim()) {
      setError('Bitte gib eine Antwort ein');
      return;
    }

    // Validate response length
    if (response.trim().length < 50) {
      setError('Deine Antwort sollte mindestens 50 Zeichen lang sein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use navaa Auth Guidelines - check authentication via useAuth hook
      if (!isAuthenticated() || !user) {
        throw new Error('Benutzer nicht authentifiziert');
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Authentication failed - please log in again');
      }

      // Calculate actual time spent (would need to track start time properly)
      const timeSpent = Math.floor(Math.random() * 300 + 180); // Mock: 3-8 minutes

      // Use API endpoint with JWT token (navaa Guidelines)
      const response_api = await fetch('/api/submit-response', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          case_id: currentCase.id,
          response_text: response.trim(),
          time_spent_seconds: timeSpent,
        }),
      });

      if (!response_api.ok) {
        const errorText = await response_api.text();
        console.error('Submit response API error:', response_api.status, errorText);
        throw new Error(`Fehler beim Speichern: ${errorText}`);
      }

      const data = await response_api.json();

      setAssessmentId(data.id);
      setCurrentView('assessment');
      onResponseSubmitted?.(data.id);

      // Clear any previous errors
      setError(null);
    } catch (error) {
      console.error('Submit response error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unbekannter Fehler beim Speichern der Antwort';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetWorkflow = () => {
    setCurrentCase(null);
    setAssessmentId(null);
    setCurrentView('start');
    setError(null);
    fetchCaseLimitInfo();
  };

  // Progress indicator
  const getProgressStep = () => {
    switch (currentView) {
      case 'start':
        return 1;
      case 'case':
        return 2;
      case 'response':
        return 3;
      case 'assessment':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className={`case-workflow ${className}`}>
      {/* Progress Indicator */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Schritt {getProgressStep()} von 4</span>
            <span>
              {currentView === 'start' && 'Case auswählen'}
              {currentView === 'case' && 'Case lesen'}
              {currentView === 'response' && 'Antwort eingeben'}
              {currentView === 'assessment' && 'Assessment erhalten'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00bfae] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getProgressStep() / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* View Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {currentView === 'start' && (
          <CaseStartView
            caseLimitInfo={caseLimitInfo}
            limitLoading={limitLoading}
            loading={loading}
            onGenerateCase={generateCase}
          />
        )}

        {currentView === 'case' && (
          <CaseDisplayView
            caseData={currentCase}
            loading={loading}
            onStartResponse={() => setCurrentView('response')}
          />
        )}

        {currentView === 'response' && (
          <ResponseInputView
            caseData={currentCase}
            loading={loading}
            onSubmitResponse={submitResponse}
            onBack={() => setCurrentView('case')}
          />
        )}

        {currentView === 'assessment' && (
          <AssessmentView
            assessmentId={assessmentId}
            onNewCase={resetWorkflow}
            onAssessmentCompleted={onAssessmentCompleted}
          />
        )}
      </div>
    </div>
  );
};

// Sub-components for each view - Memoized for performance
const CaseStartView: React.FC<{
  caseLimitInfo: CaseLimitInfo | null;
  limitLoading: boolean;
  loading: boolean;
  onGenerateCase: () => void;
}> = React.memo(({ caseLimitInfo, limitLoading, loading, onGenerateCase }) => (
  <div className="text-center">
    <div className="text-4xl mb-4">🎯</div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Bereit für einen neuen Business Case?</h2>
    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
      Teste deine strategischen Denkfähigkeiten mit realistischen Business-Situationen und erhalte
      strukturiertes Feedback zu deinem Lösungsansatz.
    </p>

    {limitLoading ? (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-4 mx-auto w-48"></div>
        <div className="h-10 bg-gray-200 rounded mx-auto w-32"></div>
      </div>
    ) : caseLimitInfo ? (
      <>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
          <p className="text-sm text-gray-600">
            <strong>{caseLimitInfo.tariffName}</strong> - {caseLimitInfo.casesUsed} von{' '}
            {caseLimitInfo.caseLimit} Cases verwendet
          </p>
        </div>

        <button
          onClick={onGenerateCase}
          disabled={!caseLimitInfo.canGenerateCase || loading}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            caseLimitInfo.canGenerateCase && !loading
              ? 'bg-[#00bfae] text-white hover:bg-[#009688]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Generiere Case...' : '🚀 Neuen Case starten'}
        </button>

        {!caseLimitInfo.canGenerateCase && (
          <p className="text-red-600 text-sm mt-2">
            {caseLimitInfo.message || 'Case-Limit erreicht'}
          </p>
        )}
      </>
    ) : null}
  </div>
));

CaseStartView.displayName = 'CaseStartView';

const CaseDisplayView: React.FC<{
  caseData: CaseData | null;
  loading: boolean;
  onStartResponse: () => void;
}> = React.memo(({ caseData, loading, onStartResponse }) => {
  if (loading || !caseData) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{caseData.title}</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
          {caseData.case_type.name} - Level {caseData.case_type.difficulty_level}
        </span>
      </div>

      <div className="prose max-w-none mb-6">
        <div dangerouslySetInnerHTML={{ __html: caseData.description }} />
      </div>

      <div className="text-center">
        <button
          onClick={onStartResponse}
          className="bg-[#00bfae] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#009688] transition-colors"
        >
          💭 Antwort eingeben
        </button>
      </div>
    </div>
  );
});

CaseDisplayView.displayName = 'CaseDisplayView';

const ResponseInputView: React.FC<{
  caseData: CaseData | null;
  loading: boolean;
  onSubmitResponse: (response: string) => void;
  onBack: () => void;
}> = React.memo(({ caseData, loading, onSubmitResponse, onBack }) => {
  const [response, setResponse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitResponse(response);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Deine Lösung</h2>
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800 transition-colors">
          ← Zurück zum Case
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
            Wie würdest du diesen Case lösen? Beschreibe deinen Ansatz strukturiert:
          </label>
          <textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bfae] focus:border-transparent resize-none"
            placeholder="Beschreibe hier deinen Lösungsansatz..."
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={!response.trim() || loading}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              response.trim() && !loading
                ? 'bg-[#00bfae] text-white hover:bg-[#009688]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Sende Antwort...' : '📤 Antwort senden'}
          </button>
        </div>
      </form>
    </div>
  );
});

ResponseInputView.displayName = 'ResponseInputView';

const AssessmentView: React.FC<{
  assessmentId: string | null;
  onNewCase: () => void;
  onAssessmentCompleted?: (assessmentId: string) => void;
}> = React.memo(({ assessmentId, onNewCase, onAssessmentCompleted }) => {
  useEffect(() => {
    if (assessmentId) {
      onAssessmentCompleted?.(assessmentId);
    }
  }, [assessmentId, onAssessmentCompleted]);

  return (
    <div className="text-center">
      <div className="text-4xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Antwort erfolgreich eingereicht!</h2>
      <p className="text-gray-600 mb-6">
        Deine Antwort wird analysiert. Das Assessment wird in Kürze verfügbar sein.
      </p>

      <div className="space-y-3">
        <button
          onClick={onNewCase}
          className="bg-[#00bfae] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#009688] transition-colors"
        >
          🚀 Nächsten Case starten
        </button>
      </div>
    </div>
  );
});

AssessmentView.displayName = 'AssessmentView';

export default CaseWorkflow;
