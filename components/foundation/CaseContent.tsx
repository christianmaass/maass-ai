import React from 'react';
import { FoundationCase } from '../../types/foundation.types';

interface CaseContentProps {
  case: FoundationCase;
}

export default function CaseContent({ case: foundationCase }: CaseContentProps) {
  const renderContent = () => {
    // Content is not part of the strict FoundationCase type; guard for runtime usage
    const content: any = (foundationCase as any)?.content || {};

    return (
      <div className="space-y-6">
        {/* Case Introduction */}
        {content.introduction && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Einführung</h3>
            <p className="text-blue-800">{content.introduction}</p>
          </div>
        )}

        {/* Case Situation */}
        {content.situation && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Situation</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{content.situation}</p>
            </div>
          </div>
        )}

        {/* Case Question */}
        {content.question && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Aufgabenstellung</h3>
            <p className="text-gray-800 font-medium">{content.question}</p>
          </div>
        )}

        {/* Multiple Choice Questions are handled in ResponseHandler.tsx - removed duplicate display */}

        {/* Framework Guidance */}
        {content.framework_guidance && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Framework-Hinweise</h3>
            <p className="text-yellow-800">{content.framework_guidance}</p>
          </div>
        )}

        {/* Hints */}
        {content.hints && content.hints.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-3">Hilfestellungen</h3>
            <ul className="space-y-2">
              {content.hints.map((hint: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></span>
                  <p className="text-green-800 text-sm">{hint}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Context */}
        {content.context && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Zusätzliche Informationen</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">{content.context}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Case Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{foundationCase.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{foundationCase.cluster}</span>
              <span>•</span>
              <span>Schwierigkeit: {foundationCase.difficulty}/12</span>
              <span>•</span>
              <span>~{foundationCase.estimated_duration} Minuten</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {foundationCase.interaction_type}
          </div>
        </div>
      </div>

      {/* Case Content */}
      <div className="p-6">{renderContent()}</div>
    </div>
  );
}
