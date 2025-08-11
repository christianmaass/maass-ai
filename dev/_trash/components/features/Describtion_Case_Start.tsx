/**
 * CASE START COMPONENT
 * Migrated to navaa Auth Guidelines (WP-B1)
 *
 * COMPLIANCE:
 * - Uses useAuth() hook (MANDATORY)
 * - JWT token management via getAccessToken()
 * - Secure case generation and limit checking with proper authentication
 * - No direct supabase.auth calls
 * - API-first approach for case type data
 *
 * @version 2.0.0 (WP-B1 Migration)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface CaseData {
  id: string;
  title: string;
  description: string;
  case_type: {
    name: string;
    difficulty_level: number;
  };
}

interface DescribtionCaseStartProps {
  onCaseGenerated?: (caseData: CaseData) => void;
}

const Describtion_Case_Start: React.FC<DescribtionCaseStartProps> = ({ onCaseGenerated }) => {
  // =============================================================================
  // NAVAA AUTH INTEGRATION (WP-B1 Migration)
  // =============================================================================

  const { user, getAccessToken, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseLimitInfo, setCaseLimitInfo] = useState<any>(null);
  const [limitLoading, setLimitLoading] = useState(true);

  // moved below fetchCaseLimitInfo to avoid TDZ

  const fetchCaseLimitInfo = useCallback(async () => {
    try {
      setLimitLoading(true);

      // Use navaa Auth Guidelines - check authentication
      if (!isAuthenticated() || !user) {
        console.error('User not authenticated for case limit check');
        return;
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token for case limit check');
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
        console.error('API call failed:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error fetching case limit info:', err);
    } finally {
      setLimitLoading(false);
    }
  }, [getAccessToken, isAuthenticated, user]);

  // Case-Limit-Informationen beim Laden der Komponente abrufen
  useEffect(() => {
    fetchCaseLimitInfo();
  }, [fetchCaseLimitInfo]);

  const handleStartCase = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use navaa Auth Guidelines - check authentication
      if (!isAuthenticated() || !user) {
        console.error('User not authenticated for case start');
        throw new Error('Benutzer nicht authentifiziert. Bitte melden Sie sich an.');
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token for case start');
        throw new Error('Authentifizierungsfehler. Bitte erneut einloggen.');
      }

      // Get case types via API instead of direct DB access (navaa Guidelines)
      const caseTypesResponse = await fetch('/api/case-types', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!caseTypesResponse.ok) {
        throw new Error('Failed to load case types');
      }

      const { caseTypes } = await caseTypesResponse.json();
      if (!caseTypes || caseTypes.length === 0) {
        throw new Error('No case types available');
      }

      const randomCaseType = caseTypes[Math.floor(Math.random() * caseTypes.length)];

      // Generate case via API
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
        },
        body: JSON.stringify({
          case_type_id: randomCaseType.id,
          user_id: user.id, // Use user from useAuth context
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Spezielle Behandlung für Case-Limit-Fehler
        if (data.code === 'LIMIT_REACHED') {
          setError(
            `Case-Limit erreicht! Du hast bereits ${data.details.casesUsedThisWeek}/${data.details.casesLimitWeek} Cases diese Woche erstellt.`,
          );
          // Limit-Info aktualisieren
          await fetchCaseLimitInfo();
        } else {
          throw new Error(data.error || 'Failed to generate case');
        }
        return;
      }

      // Notify parent component
      if (onCaseGenerated) {
        onCaseGenerated({
          id: data.case.id,
          title: data.case.title,
          description: data.case.description,
          case_type: data.case_type,
        });
      }

      // Limit-Info nach erfolgreichem Case aktualisieren
      await fetchCaseLimitInfo();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    window.open('/preise', '_blank');
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-2">Anleitung</h2>
      <p className="text-gray-700 mb-4">
        Klicke auf den Button &quot;Start Case&quot;, um deine nächste Aufgabe zu erhalten. navaa
        generiert einen Case zur Bearbeitung. Gebe deine Antwort in der Dialogbox auf der rechten
        Seite ein, um direktes Feedback zu erhalten.
      </p>

      {/* Case-Limit-Informationen */}
      {!limitLoading && caseLimitInfo && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-blue-900">
              Dein {caseLimitInfo.tariffName} Tarif
            </h3>
            {caseLimitInfo.tariffName === 'Free' && (
              <button
                onClick={handleUpgrade}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cases diese Woche:</span>
              <span
                className={
                  caseLimitInfo.casesUsedThisWeek >= caseLimitInfo.casesLimitWeek
                    ? 'text-red-600 font-semibold'
                    : 'text-gray-700'
                }
              >
                {caseLimitInfo.casesUsedThisWeek} /{' '}
                {caseLimitInfo.casesLimitWeek === -1 ? '∞' : caseLimitInfo.casesLimitWeek}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  caseLimitInfo.casesUsedThisWeek >= caseLimitInfo.casesLimitWeek
                    ? 'bg-red-500'
                    : caseLimitInfo.casesUsedThisWeek / caseLimitInfo.casesLimitWeek > 0.8
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                }`}
                style={{
                  width:
                    caseLimitInfo.casesLimitWeek === -1
                      ? '100%'
                      : `${Math.min((caseLimitInfo.casesUsedThisWeek / caseLimitInfo.casesLimitWeek) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">Zurücksetzung: {caseLimitInfo.resetDate}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upgrade-Prompt wenn Limit erreicht */}
      {caseLimitInfo && !caseLimitInfo.canCreateCase && (
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="text-sm font-semibold text-orange-900 mb-2">Case-Limit erreicht! 🚀</h4>
          <p className="text-sm text-orange-800 mb-3">
            Du hast dein wöchentliches Limit von {caseLimitInfo.casesLimitWeek} Cases erreicht.
            Upgrade auf Plus für 25 Cases pro Woche!
          </p>
          <button
            onClick={handleUpgrade}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            Jetzt upgraden
          </button>
        </div>
      )}

      <button
        onClick={handleStartCase}
        disabled={loading || (caseLimitInfo && !caseLimitInfo.canCreateCase)}
        className={`mt-4 inline-block px-8 py-3 font-bold rounded-xl shadow transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed ${
          caseLimitInfo && !caseLimitInfo.canCreateCase
            ? 'bg-gray-400 text-gray-600'
            : 'bg-[#ff8200] text-white hover:bg-[#ff9900]'
        }`}
      >
        {loading
          ? 'Generiere Case...'
          : caseLimitInfo && !caseLimitInfo.canCreateCase
            ? 'Limit erreicht - Upgrade erforderlich'
            : 'Start Case'}
      </button>
    </div>
  );
};

export default Describtion_Case_Start;
export type { CaseData };
