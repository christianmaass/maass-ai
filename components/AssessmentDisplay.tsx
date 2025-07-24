import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../supabaseClient';

interface AssessmentData {
  id: string;
  scores: {
    problemstrukturierung: number;
    analytik: number;
    strategie: number;
    empfehlung: number;
    kommunikation: number;
  };
  feedback: string;
  total_score: number;
  improvement_areas: string[];
}

interface AssessmentDisplayProps {
  assessmentId: string | null;
  onNewCase?: () => void;
}

const AssessmentDisplay: React.FC<AssessmentDisplayProps> = ({ assessmentId, onNewCase }) => {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assessmentId) {
      loadAssessment(assessmentId);
    }
  }, [assessmentId]);

  const loadAssessment = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      const { data, error: dbError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (dbError) {
        throw new Error(dbError.message);
      }

      setAssessment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  if (!assessmentId) {
    return (
      <div className="w-full bg-white rounded-xl shadow p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Bereit für deine Bewertung</h3>
        <p className="text-gray-500">Reiche deine Antwort ein, um eine detaillierte Bewertung zu erhalten.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow p-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-xl shadow p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Fehler:</strong> {error}
        </div>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  const criteriaLabels = {
    problemstrukturierung: 'Problemstrukturierung',
    analytik: 'Analytische Exzellenz',
    strategie: 'Strategisches Denken',
    empfehlung: 'Empfehlung & Entscheidung',
    kommunikation: 'Kommunikation'
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '🌟';
    if (score >= 8) return '🎯';
    if (score >= 7) return '👍';
    if (score >= 6) return '👌';
    if (score >= 5) return '📈';
    return '💪';
  };

  return (
    <div className="w-full bg-white rounded-xl shadow p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Deine Bewertung {getScoreEmoji(assessment.total_score)}
        </h2>
        <div className="text-3xl font-bold text-orange-600">
          {assessment.total_score}/10
        </div>
        <p className="text-gray-600 mt-2">
          {assessment.total_score >= 8 ? 'Exzellente Leistung!' : 
           assessment.total_score >= 6 ? 'Solide Arbeit!' : 
           'Guter Ansatz - mit Verbesserungspotential!'}
        </p>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(assessment.scores).map(([key, score]) => (
          <div key={key} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700 text-sm">
                {criteriaLabels[key as keyof typeof criteriaLabels]}
              </h4>
              <span className={`px-2 py-1 rounded-full text-sm font-bold ${getScoreColor(score)}`}>
                {score}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${score * 10}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Detailliertes Feedback</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {assessment.feedback}
          </div>
        </div>
      </div>

      {/* Improvement Areas */}
      {assessment.improvement_areas && assessment.improvement_areas.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Verbesserungsbereiche</h3>
          <div className="flex flex-wrap gap-2">
            {assessment.improvement_areas.map((area, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onNewCase}
          className="px-8 py-3 bg-[#ff8200] text-white font-bold rounded-xl shadow hover:bg-[#ff9900] transition-colors"
        >
          Nächster Case
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
        >
          Bewertung speichern
        </button>
      </div>
    </div>
  );
};

export default AssessmentDisplay;
