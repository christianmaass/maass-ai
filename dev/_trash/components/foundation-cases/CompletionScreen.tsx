import React from 'react';

// Types
interface FoundationCase {
  id: string;
  title: string;
  cluster: string;
  case_type: string;
  difficulty: number;
  learning_objectives: string[];
  case_description?: string;
  case_question?: string;
  estimated_duration?: number;
}

interface CompletionScreenProps {
  foundationCase: FoundationCase;
  onRestart: () => void;
  onBackToCases: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  foundationCase,
  onRestart,
  onBackToCases,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
      {/* Success Icon */}
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Congratulations */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Herzlichen Glückwunsch!</h1>

      <p className="text-lg text-gray-600 mb-6">
        Sie haben den Foundation Case erfolgreich abgeschlossen.
      </p>

      {/* Case Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{foundationCase.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Cluster:</span>
            <p className="text-gray-600">{foundationCase.cluster}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Typ:</span>
            <p className="text-gray-600">{foundationCase.case_type}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Schwierigkeit:</span>
            <p className="text-gray-600">{foundationCase.difficulty}/10</p>
          </div>
          {foundationCase.estimated_duration && (
            <div>
              <span className="font-medium text-gray-700">Dauer:</span>
              <p className="text-gray-600">ca. {foundationCase.estimated_duration} Min.</p>
            </div>
          )}
        </div>

        {/* Learning Objectives */}
        {foundationCase.learning_objectives && foundationCase.learning_objectives.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Erreichte Lernziele:</h3>
            <div className="flex flex-wrap gap-2">
              {foundationCase.learning_objectives.map((objective, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  ✓ {objective}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Steps Completed */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-4">Abgeschlossene Schritte:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-blue-800">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium mr-3">
              1
            </span>
            Problemverständnis & Zielklärung
          </div>
          <div className="flex items-center text-blue-800">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium mr-3">
              2
            </span>
            Strukturierung & Hypothesenbildung
          </div>
          <div className="flex items-center text-blue-800">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium mr-3">
              3
            </span>
            Analyse & Zahlenarbeit
          </div>
          <div className="flex items-center text-blue-800">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium mr-3">
              4
            </span>
            Synthetisieren & Optionen bewerten
          </div>
          <div className="flex items-center text-blue-800">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium mr-3">
              5
            </span>
            Empfehlung & Executive Summary
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Wie möchten Sie fortfahren?</h3>
        <p className="text-gray-600 text-sm mb-6">
          Sie können diesen Fall erneut bearbeiten oder zu anderen Foundation Cases wechseln.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Fall erneut bearbeiten
        </button>

        <button
          onClick={onBackToCases}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Weitere Foundation Cases
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Foundation Learning Process • navaa Consulting Training
        </p>
      </div>
    </div>
  );
};

export default CompletionScreen;
