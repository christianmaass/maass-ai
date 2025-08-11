import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FoundationLayout from '@components/foundation/FoundationLayout';
import CaseCard from '@components/foundation/CaseCard';
import type { FoundationCase } from '@project-types/foundation.types';

export default function AppFoundationPage() {
  const router = useRouter();
  const [cases, setCases] = useState<FoundationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/foundation/cases');
        if (!response.ok) {
          if (response.status === 401) {
            setError('Bitte loggen Sie sich ein, um auf die Foundation Cases zuzugreifen');
          } else {
            setError('Fehler beim Laden der Cases');
          }
          return;
        }
        const data = await response.json();
        const apiCases = data.data?.cases || [];
        setCases(apiCases);
      } catch (err) {
        console.error('Error loading cases:', err);
        setError('Netzwerkfehler beim Laden der Cases');
      } finally {
        setLoading(false);
      }
    };
    loadCases();
  }, []);

  const casesByCluster = cases.reduce(
    (acc, case_) => {
      if (!acc[case_.cluster]) {
        acc[case_.cluster] = [];
      }
      acc[case_.cluster].push(case_);
      return acc;
    },
    {} as Record<string, FoundationCase[]>,
  );

  const clusters = Object.keys(casesByCluster);

  const handleCaseClick = (caseId: string) => {
    router.push(`/app/foundation/case/${caseId}`);
  };

  const getClusterDescription = (cluster: string) => {
    const descriptions: Record<string, string> = {
      'Leistung & Wirtschaftlichkeit': 'Problemdiagnose, Optimierung und Turnaround-Strategien',
      'Wachstum & Markt': 'Wachstumsstrategien, Markteintritt und Customer Journey',
      'Strategie & Priorisierung':
        'Strategische Entscheidungen, Portfolio-Management und Due Diligence',
      'Organisation & Transformation': 'Change Management, Leadership und digitale Transformation',
    };
    return descriptions[cluster] || '';
  };

  const getClusterColor = (cluster: string) => {
    const colors: Record<string, string> = {
      'Leistung & Wirtschaftlichkeit': 'border-blue-200 bg-blue-50',
      'Wachstum & Markt': 'border-green-200 bg-green-50',
      'Strategie & Priorisierung': 'border-purple-200 bg-purple-50',
      'Organisation & Transformation': 'border-orange-200 bg-orange-50',
    };
    return colors[cluster] || 'border-gray-200 bg-gray-50';
  };

  return (
    <FoundationLayout
      title="Foundation Track"
      subtitle="12 geführte Praxis-Cases für Consulting-Grundlagen"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cases werden geladen...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-gray-600">Fehler beim Laden: {error}</p>
          <button
            onClick={() => location.reload()}
            className="mt-4 px-4 py-2 bg-[#009e82] text-white rounded-lg hover:bg-[#007a66]"
          >
            Erneut versuchen
          </button>
        </div>
      ) : (
        <>
          {/* Cluster Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCluster(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCluster === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Alle Cluster
              </button>
              {clusters.map((cluster) => (
                <button
                  key={cluster}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCluster === cluster
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cluster}
                </button>
              ))}
            </div>
          </div>

          {/* Cases by Cluster */}
          <div className="space-y-8">
            {clusters
              .filter((cluster) => !selectedCluster || cluster === selectedCluster)
              .map((cluster) => (
                <div
                  key={cluster}
                  className={`rounded-lg border-2 p-6 ${getClusterColor(cluster)}`}
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{cluster}</h3>
                    <p className="text-sm text-gray-600">{getClusterDescription(cluster)}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      {casesByCluster[cluster].length} Cases •
                      {casesByCluster[cluster].reduce(
                        (sum, c) => sum + (c.estimated_duration as number),
                        0,
                      )}{' '}
                      Min gesamt
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {casesByCluster[cluster]
                      .sort((a, b) => a.difficulty - b.difficulty)
                      .map((case_, index) => (
                        <CaseCard
                          key={case_.id}
                          case={case_}
                          isCompleted={false}
                          isLocked={index > 0}
                          onClick={() => handleCaseClick(case_.id)}
                        />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </FoundationLayout>
  );
}
