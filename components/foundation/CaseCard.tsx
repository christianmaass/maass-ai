import React from 'react';
import { FoundationCase } from '../../types/foundation.types';

interface CaseCardProps {
  case: FoundationCase;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

export default function CaseCard({
  case: foundationCase,
  isCompleted = false,
  isLocked = false,
  onClick,
}: CaseCardProps) {
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 4) return 'bg-green-100 text-green-800';
    if (difficulty <= 8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 4) return 'Einfach';
    if (difficulty <= 8) return 'Mittel';
    return 'Schwer';
  };

  const getInteractionTypeText = (type: string) => {
    const types = {
      multiple_choice_with_hypotheses: 'Multiple Choice',
      structured_mbb_framework: 'Framework',
      free_form_with_hints: 'Freie Form',
      minimal_support: 'Minimal Support',
    };
    return types[type] || type;
  };

  return (
    <div
      className={`
        bg-white rounded-lg border shadow-sm p-4 transition-all duration-200 cursor-pointer
        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-blue-300'}
        ${isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'}
      `}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Header with Status Icons */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">
            {foundationCase.title}
          </h3>
          <p className="text-xs text-gray-600 mb-2">{foundationCase.cluster}</p>
        </div>

        {/* Status Icons */}
        <div className="flex items-center space-x-1 ml-2">
          {isCompleted && (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {isLocked && (
            <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-700 mb-3 leading-relaxed">{foundationCase.description}</p>

      {/* Footer with badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {/* Difficulty Badge */}
          <span
            className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${getDifficultyColor(foundationCase.difficulty)}
          `}
          >
            {getDifficultyText(foundationCase.difficulty)}
          </span>

          {/* Estimated Time */}
          <div className="text-xs text-gray-500 font-medium">
            ~{foundationCase.estimated_time_minutes} Min
          </div>
        </div>

        {/* Interaction Type */}
        <div className="text-xs text-gray-500 text-center bg-gray-50 py-1 px-2 rounded">
          {getInteractionTypeText(foundationCase.interaction_type)}
        </div>
      </div>
    </div>
  );
}
