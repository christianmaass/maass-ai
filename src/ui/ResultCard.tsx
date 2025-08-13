/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ UI Components - Reusable, responsive, accessible
 * ✅ Tailwind CSS - Consistent styling with navaa branding
 * ✅ TypeScript - Type safety and developer experience
 * ✅ Performance - Optimized rendering and animations
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React from 'react';

interface ResultCardProps {
  title?: string;
  message?: string;
  progress?: number;
  checkboxText?: string;
  className?: string;
}

// ResultCard.tsx
// Displays learning result card with progress bar and checkbox
export default function ResultCard({
  title = 'Ergebnis',
  message = 'Du neigst dazu, voreilig zu einer Lösung zu kommen.',
  progress = 35,
  checkboxText = 'Trainiere systematisch deine Optionsanalyse',
  className = '',
}: ResultCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-4 max-w-xs ${className}`}
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>

      {/* Message */}
      <p className="text-gray-700 text-base leading-relaxed mb-6">{message}</p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#009e82] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Checkbox with Text */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-5 h-5 bg-[#009e82] rounded border border-[#009e82] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{checkboxText}</p>
      </div>
    </div>
  );
}
