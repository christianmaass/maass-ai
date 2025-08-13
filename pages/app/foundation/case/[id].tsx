import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FoundationLayout from '@components/foundation/FoundationLayout';
import CaseContent from '@components/foundation/CaseContent';
import ResponseHandler from '@components/foundation/ResponseHandler';
import type {
  FoundationCase,
  FoundationResponse,
  FoundationAssessment,
} from '@project-types/foundation.types';

export default function AppFoundationCaseDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [foundationCase, setFoundationCase] = useState<FoundationCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<FoundationAssessment | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadCase = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/foundation/cases/${id}`);
        if (!response.ok) {
          if (response.status === 401) {
            setError('Bitte loggen Sie sich ein, um auf diesen Case zuzugreifen');
          } else if (response.status === 404) {
            setError('Case nicht gefunden');
          } else {
            setError('Fehler beim Laden des Cases');
          }
          return;
        }

        const data = await response.json();
        const apiCase = data.data?.case;
        if (apiCase) {
          setFoundationCase(apiCase);
        } else {
          setError('Case-Daten konnten nicht geladen werden');
        }
      } catch (err) {
        console.error('Error loading case:', err);
        setError('Netzwerkfehler beim Laden des Cases');
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [id]);

  const handleBack = () => {
    router.push('/app/foundation');
  };

  const handleResponseSubmit = async (_response: FoundationResponse) => {
    if (!foundationCase) return;

    setIsSubmitting(true);

    try {
      // Mock API call - will be replaced in AP3.3.3
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAssessment: FoundationAssessment = {
        id: 'assessment-' + Date.now(),
        case_id: foundationCase.id,
        response_id: 'response-' + Date.now(),
        overall_score: Math.floor(Math.random() * 40) + 60,
        dimension_scores: {
          problem_understanding: Math.floor(Math.random() * 30) + 70,
          analytical_approach: Math.floor(Math.random() * 30) + 70,
          recommendation_quality: Math.floor(Math.random() * 30) + 70,
          communication: Math.floor(Math.random() * 30) + 70,
        },
        feedback:
          'Ihre Antwort zeigt ein solides Verständnis der Problemstellung. Die gewählte Lösung ist nachvollziehbar begründet. Für zukünftige Cases empfehlen wir, mehr quantitative Daten in die Analyse einzubeziehen.',
        created_at: new Date().toISOString(),
      };

      setAssessment(mockAssessment);
    } catch {
      setError('Fehler beim Einreichen der Antwort');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <FoundationLayout title="Case wird geladen..." showBackButton onBack={handleBack}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Case wird geladen...</span>
        </div>
      </FoundationLayout>
    );
  }

  if (error || !foundationCase) {
    return (
      <FoundationLayout title="Fehler" showBackButton onBack={handleBack}>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Case nicht gefunden</h3>
          <p className="text-gray-600 mb-4">{error || 'Der angeforderte Case existiert nicht.'}</p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </FoundationLayout>
    );
  }

  return (
    <FoundationLayout
      title={foundationCase.title}
      subtitle={`${foundationCase.cluster} • Schwierigkeit ${foundationCase.difficulty}/12`}
      showBackButton
      onBack={handleBack}
    >
      <div className="space-y-8">
        <CaseContent case={foundationCase} />
        {!assessment ? (
          <ResponseHandler
            case={foundationCase}
            onSubmit={handleResponseSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🎉 Assessment abgeschlossen!
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-green-600">
                  {assessment.overall_score}/100
                </div>
                <div className="text-gray-600">Gesamtbewertung</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Feedback</h3>
                <p className="text-green-800 text-sm">{assessment.feedback}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleBack}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Zurück zur Übersicht
                </button>
                <button
                  onClick={() => alert('Nächster Case - wird in AP3.4 implementiert')}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  Nächster Case
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FoundationLayout>
  );
}
