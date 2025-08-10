import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

// Types
interface FoundationCase {
  id: string;
  title: string;
  cluster: string;
  case_type: string;
  difficulty: number;
  learning_objectives: string[];
  case_description?: string;
  estimated_duration?: number;
}

const FoundationCasesPage: React.FC = () => {
  const [cases, setCases] = useState<FoundationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // moved below loadFoundationCases to avoid TDZ

  const loadFoundationCases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/get-foundation-cases', {
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      });

      console.log('API Response Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response Data:', data);

      if (data.success) {
        setCases(data.cases || []);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error loading foundation cases:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadFoundationCases();
    }
  }, [user?.id, loadFoundationCases]);

  const handleCaseSelect = (caseId: string) => {
    router.push(`/foundation-cases/${caseId}`);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-100 text-green-800';
    if (difficulty <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 3) return 'Einfach';
    if (difficulty <= 6) return 'Mittel';
    return 'Schwer';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009e82] mx-auto mb-4"></div>
          <p className="text-gray-600">Foundation Cases werden geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600">Fehler beim Laden: {error}</p>
          <button
            onClick={loadFoundationCases}
            className="mt-4 px-4 py-2 bg-[#009e82] text-white rounded-lg hover:bg-[#007a66]"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navaa-bg-primary">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Image
              src="/assets/navaa-logo.png"
              alt="navaa"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
            <span className="ml-3 text-lg font-semibold text-gray-900">Foundation Cases</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Foundation Cases</h1>
          <p className="text-gray-600">
            Wählen Sie einen Fall aus, um mit der strukturierten Bearbeitung zu beginnen.
          </p>
        </div>

        {/* Cases Grid */}
        {cases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Keine Foundation Cases verfügbar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((foundationCase) => (
              <div
                key={foundationCase.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCaseSelect(foundationCase.id)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {foundationCase.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(foundationCase.difficulty)}`}
                    >
                      {getDifficultyLabel(foundationCase.difficulty)}
                    </span>
                  </div>

                  {/* Cluster & Type */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Cluster:</span> {foundationCase.cluster}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Typ:</span> {foundationCase.case_type}
                    </p>
                  </div>

                  {/* Description */}
                  {foundationCase.case_description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {foundationCase.case_description}
                    </p>
                  )}

                  {/* Learning Objectives */}
                  {foundationCase.learning_objectives &&
                    foundationCase.learning_objectives.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">LERNZIELE:</p>
                        <div className="flex flex-wrap gap-1">
                          {foundationCase.learning_objectives
                            .slice(0, 3)
                            .map((objective, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded"
                              >
                                {objective}
                              </span>
                            ))}
                          {foundationCase.learning_objectives.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-xs text-gray-500 rounded">
                              +{foundationCase.learning_objectives.length - 3} weitere
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Duration */}
                  {foundationCase.estimated_duration && (
                    <p className="text-xs text-gray-500 mb-4">
                      ⏱️ ca. {foundationCase.estimated_duration} Min.
                    </p>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-[#009e82] text-white py-2 px-4 rounded-lg hover:bg-[#007a66] transition-colors">
                    Fall bearbeiten
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundationCasesPage;
