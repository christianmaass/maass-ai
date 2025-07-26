import React, { useState, useEffect } from 'react';
import { CaseData } from '../types/case.types';
import { getSupabaseClient } from '../supabaseClient';

interface CasesListProps {
  onCaseSelect?: (caseData: CaseData) => void;
  currentCaseId?: string | null;
  className?: string;
}

interface CaseHistoryItem {
  id: string;
  case_data: CaseData;
  status: 'completed' | 'in_progress' | 'new';
  score?: number;
  created_at: string;
  updated_at: string;
}

const CasesList: React.FC<CasesListProps> = ({
  onCaseSelect,
  currentCaseId,
  className = ''
}) => {
  const [caseHistory, setCaseHistory] = useState<CaseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCaseHistory();
  }, []);

  const getMockCaseHistory = (): CaseHistoryItem[] => [
    {
      id: '1',
      case_data: {
        id: '1',
        title: 'Markteintrittsstrategie für E-Commerce',
        description: 'Ein mittelständisches Unternehmen möchte in den E-Commerce-Markt einsteigen...',
        case_type: {
          name: 'Strategieberatung',
          difficulty_level: 3
        }
      },
      status: 'completed',
      score: 8.5,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T11:30:00Z'
    },
    {
      id: '2',
      case_data: {
        id: '2',
        title: 'Kostenoptimierung in der Produktion',
        description: 'Ein Automobilzulieferer steht unter Kostendruck und muss seine Produktionskosten senken...',
        case_type: {
          name: 'Operations',
          difficulty_level: 2
        }
      },
      status: 'completed',
      score: 7.2,
      created_at: '2024-01-12T14:00:00Z',
      updated_at: '2024-01-12T15:45:00Z'
    },
    {
      id: '3',
      case_data: {
        id: '3',
        title: 'Digitale Transformation im Einzelhandel',
        description: 'Eine traditionelle Einzelhandelskette muss sich digital transformieren...',
        case_type: {
          name: 'Digital Strategy',
          difficulty_level: 4
        }
      },
      status: 'in_progress',
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-10T09:00:00Z'
    }
  ];

  const loadCaseHistory = async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Benutzer nicht authentifiziert');
      }

      // Query user responses with case data
      const { data: responses, error: responsesError } = await supabase
        .from('user_responses')
        .select(`
          id,
          case_id,
          response_text,
          time_spent_seconds,
          submitted_at,
          cases (
            id,
            title,
            description,
            case_types (
              name,
              difficulty_level
            )
          ),
          assessments (
            id,
            scores,
            feedback
          )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(20);

      if (responsesError) {
        console.error('Error fetching responses:', responsesError);
        // Fall back to mock data if query fails
        setCaseHistory(getMockCaseHistory());
        return;
      }

      // Transform the data to match our interface
      const caseHistory: CaseHistoryItem[] = (responses || []).map((response: any) => {
        const hasAssessment = response.assessments && response.assessments.length > 0;
        const assessment = hasAssessment ? response.assessments[0] : null;
        const caseData = response.cases;
        const caseType = caseData?.case_types;
        
        return {
          id: response.id,
          case_data: {
            id: caseData?.id || response.case_id,
            title: caseData?.title || 'Unbekannter Case',
            description: caseData?.description || 'Keine Beschreibung verfügbar',
            case_type: {
              name: caseType?.name || 'Unbekannt',
              difficulty_level: caseType?.difficulty_level || 1
            }
          },
          status: hasAssessment ? 'completed' : 'in_progress',
          score: assessment?.scores || undefined,
          created_at: response.submitted_at,
          updated_at: response.submitted_at
        };
      });

      // If no real data, show mock data for demo purposes
      if (caseHistory.length === 0) {
        setCaseHistory(getMockCaseHistory());
      } else {
        setCaseHistory(caseHistory);
      }
    } catch (error) {
      console.error('Error loading case history:', error);
      setError(error instanceof Error ? error.message : 'Fehler beim Laden der Cases');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      case 5: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusInfo = (status: string, score?: number) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Abgeschlossen',
          color: 'bg-green-100 text-green-800',
          icon: '✅',
          extra: score ? `Score: ${score}/10` : ''
        };
      case 'in_progress':
        return {
          label: 'In Bearbeitung',
          color: 'bg-yellow-100 text-yellow-800',
          icon: '⏳',
          extra: ''
        };
      case 'new':
        return {
          label: 'Neu',
          color: 'bg-blue-100 text-blue-800',
          icon: '🆕',
          extra: ''
        };
      default:
        return {
          label: 'Unbekannt',
          color: 'bg-gray-100 text-gray-800',
          icon: '❓',
          extra: ''
        };
    }
  };

  if (loading) {
    return (
      <div className={`cases-list ${className}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`cases-list ${className}`}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center text-red-600">
            <div className="text-4xl mb-2">⚠️</div>
            <p>{error}</p>
            <button
              onClick={loadCaseHistory}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cases-list ${className}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Deine Cases
            </h2>
            <span className="text-sm text-gray-500">
              {caseHistory.length} Cases insgesamt
            </span>
          </div>
        </div>

        {/* Cases List */}
        <div className="divide-y divide-gray-200">
          {caseHistory.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Noch keine Cases bearbeitet
              </h3>
              <p className="text-gray-600">
                Starte deinen ersten Business Case, um hier deine Fortschritte zu sehen.
              </p>
            </div>
          ) : (
            caseHistory.map((item) => {
              const statusInfo = getStatusInfo(item.status, item.score);
              const isSelected = currentCaseId === item.case_data.id;
              
              return (
                <div
                  key={item.id}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#00bfae] bg-opacity-5 border-l-4 border-[#00bfae]' : ''
                  }`}
                  onClick={() => onCaseSelect?.(item.case_data)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Case Title */}
                      <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">
                        {item.case_data.title}
                      </h3>
                      
                      {/* Case Description Preview */}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.case_data.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                      
                      {/* Meta Information */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📅 {formatDate(item.created_at)}</span>
                        <span>📂 {item.case_data.case_type.name}</span>
                        {statusInfo.extra && <span>📊 {statusInfo.extra}</span>}
                      </div>
                    </div>
                    
                    {/* Right Side - Status & Difficulty */}
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <span className="mr-1">{statusInfo.icon}</span>
                        {statusInfo.label}
                      </span>
                      
                      {/* Difficulty Badge */}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.case_data.case_type.difficulty_level)}`}>
                        Level {item.case_data.case_type.difficulty_level}
                      </span>
                    </div>
                  </div>
                  
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-[#00bfae] border-opacity-20">
                      <div className="flex items-center text-sm text-[#00bfae]">
                        <span className="mr-2">👆</span>
                        Aktuell ausgewählter Case
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer */}
        {caseHistory.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
            <button
              onClick={loadCaseHistory}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              🔄 Aktualisieren
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CasesList;
