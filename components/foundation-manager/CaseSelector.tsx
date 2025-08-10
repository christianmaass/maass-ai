import React from 'react';
import { FoundationCase } from './hooks/useFoundationCases';

interface CaseSelectorProps {
  cases: FoundationCase[];
  selectedCase: FoundationCase | null;
  loading: boolean;
  error: string | null;
  onSelectCase: (caseId: string) => void;
  onRefresh: () => Promise<void>;
}

// Helper function to get difficulty level description
const getDifficultyInfo = (difficulty: number) => {
  if (difficulty <= 3)
    return { level: 'Einsteiger', color: 'text-green-600', bgColor: 'bg-green-50' };
  if (difficulty <= 6)
    return { level: 'Fortgeschritten', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  if (difficulty <= 9)
    return { level: 'Experte', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  return { level: 'Meister', color: 'text-red-600', bgColor: 'bg-red-50' };
};

const CaseSelector: React.FC<CaseSelectorProps> = ({
  cases,
  selectedCase,
  loading,
  error,
  onSelectCase,
  onRefresh,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cases werden geladen...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Fehler beim Laden der Cases</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={onRefresh}
                className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Foundation Cases</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{cases.length} Cases verfügbar</span>
            <button
              onClick={onRefresh}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              🔄 Aktualisieren
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {cases.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <h3 className="text-gray-600 font-medium">Keine Cases gefunden</h3>
            <p className="text-gray-500 text-sm mt-1">
              Es sind noch keine Foundation Cases in der Datenbank vorhanden.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {cases.map((foundationCase) => {
              const difficultyInfo = getDifficultyInfo(foundationCase.difficulty);
              const isSelected = selectedCase?.id === foundationCase.id;

              return (
                <div
                  key={foundationCase.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => onSelectCase(foundationCase.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3
                          className={`font-medium ${
                            isSelected ? 'text-blue-900' : 'text-gray-900'
                          }`}
                        >
                          {foundationCase.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyInfo.color} ${difficultyInfo.bgColor}`}
                        >
                          {difficultyInfo.level} ({foundationCase.difficulty})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Cluster:</span>
                          <span
                            className={`ml-2 font-medium ${
                              isSelected ? 'text-blue-800' : 'text-gray-700'
                            }`}
                          >
                            {foundationCase.cluster}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Tool:</span>
                          <span
                            className={`ml-2 font-medium ${
                              isSelected ? 'text-blue-800' : 'text-gray-700'
                            }`}
                          >
                            {foundationCase.tool}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Typ:</span>
                          <span
                            className={`ml-2 font-medium ${
                              isSelected ? 'text-blue-800' : 'text-gray-700'
                            }`}
                          >
                            {foundationCase.case_type || 'Nicht definiert'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dauer:</span>
                          <span
                            className={`ml-2 font-medium ${
                              isSelected ? 'text-blue-800' : 'text-gray-700'
                            }`}
                          >
                            {foundationCase.estimated_duration} Min
                          </span>
                        </div>
                      </div>

                      {foundationCase.learning_objectives &&
                        foundationCase.learning_objectives.length > 0 && (
                          <div className="mt-3">
                            <span className="text-gray-500 text-sm">Lernziele:</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {foundationCase.learning_objectives
                                .slice(0, 3)
                                .map((objective, index) => (
                                  <span
                                    key={index}
                                    className={`px-2 py-1 text-xs rounded ${
                                      isSelected
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {objective}
                                  </span>
                                ))}
                              {foundationCase.learning_objectives.length > 3 && (
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    isSelected
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  +{foundationCase.learning_objectives.length - 3} weitere
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Case Status Indicators */}
                      <div className="mt-3 flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              foundationCase.case_description ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          ></div>
                          <span className="text-gray-500">Beschreibung</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              foundationCase.case_question ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          ></div>
                          <span className="text-gray-500">Frage</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="ml-4 text-blue-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseSelector;
