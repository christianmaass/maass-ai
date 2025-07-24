import React from 'react';
import { CaseData } from './Describtion_Case_Start';

interface CaseDisplayProps {
  caseData: CaseData | null;
  loading?: boolean;
}

const CaseDisplay: React.FC<CaseDisplayProps> = ({ caseData, loading }) => {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow p-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="w-full bg-white rounded-xl shadow p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Bereit für deinen ersten Case?</h3>
        <p className="text-gray-500">Klicke auf "Start Case" um zu beginnen.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow p-8">
      {/* Case Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {caseData.case_type.name}
          </span>
          <span className="text-sm text-gray-500">
            Schwierigkeit: {caseData.case_type.difficulty_level}/5
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {caseData.title}
        </h2>
      </div>

      {/* Case Content */}
      <div className="prose prose-gray max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {caseData.description}
        </div>
      </div>

      {/* Case Instructions */}
      <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              <strong>Deine Aufgabe:</strong> Analysiere den Fall strukturiert und entwickle eine klare Empfehlung. 
              Nutze bewährte Consulting-Frameworks und quantifiziere wo möglich.
            </p>
          </div>
        </div>
      </div>

      {/* Timer (optional - for future implementation) */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          💡 Tipp: Nimm dir 20-30 Minuten Zeit für eine strukturierte Antwort
        </p>
      </div>
    </div>
  );
};

export default CaseDisplay;
