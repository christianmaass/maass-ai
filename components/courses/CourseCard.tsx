/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ Course Cards - Consistent design and interaction patterns
 * ✅ Enrollment Status - Visual indicators for user progress
 * ✅ Navigation - Proper routing to course detail pages
 * ✅ Responsive Design - Mobile-first approach
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React from 'react';
import { Heading, Text } from '@ui/Typography';
import { ChevronRightIcon, BookOpenIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline';

interface FoundationCase {
  case_id: string;
  title: string;
  difficulty: number;
  sequence_order: number;
}

interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    difficulty_level: number;
    estimated_duration_hours: number;
    foundation_cases?: FoundationCase[];
    foundation_cases_count: number;
    user_enrolled: boolean;
    user_progress?: {
      progress_percentage: number;
      completed_cases: number;
      total_cases: number;
      last_activity_at: string | null;
    };
  };
  onClick?: () => void;
  className?: string;
  showEnrollmentStatus?: boolean;
  showProgress?: boolean;
}

export default function CourseCard({
  course,
  onClick,
  className = '',
  showProgress = true,
}: CourseCardProps) {
  const {
    name,
    description,
    difficulty_level,
    estimated_duration_hours,
    foundation_cases_count,
    user_enrolled,
    user_progress,
  } = course;

  // Berechne Difficulty-Farbe
  const getDifficultyColor = (level: number) => {
    if (level <= 3) return 'text-green-600 bg-green-50';
    if (level <= 7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Berechne Progress-Farbe
  const getProgressColor = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-200';
    if (percentage < 50) return 'bg-yellow-400';
    if (percentage < 100) return 'bg-blue-400';
    return 'bg-green-400';
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg cursor-pointer
        border border-gray-100
        ${className}
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Kurs ${name} öffnen`}
    >
      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Heading variant="h2" className="mb-2">
              {name}
            </Heading>
            {description && (
              <Text variant="small" as="p" className="text-gray-600 leading-relaxed line-clamp-2">
                {description}
              </Text>
            )}
          </div>

          {/* Status Badge */}
          <div
            className={`
            ml-4 px-3 py-1 rounded-full text-xs font-semibold
            ${user_enrolled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}
          `}
          >
            {user_enrolled ? '✅ Eingeschrieben' : '📚 Verfügbar'}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {/* Foundation Cases */}
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-4 w-4 text-navaa-primary" />
            <div>
              <p className="text-xs text-gray-500">Cases</p>
              <p className="font-semibold text-gray-900">{foundation_cases_count}</p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-navaa-primary" />
            <div>
              <p className="text-xs text-gray-500">Dauer</p>
              <p className="font-semibold text-gray-900">{estimated_duration_hours}h</p>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <TrophyIcon className="h-4 w-4 text-navaa-primary" />
            <div>
              <p className="text-xs text-gray-500">Level</p>
              <span
                className={`
                px-2 py-0.5 rounded-full text-xs font-medium
                ${getDifficultyColor(difficulty_level)}
              `}
              >
                {difficulty_level}/10
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar (wenn eingeschrieben) */}
        {showProgress && user_enrolled && user_progress && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Fortschritt</span>
              <span className="text-sm text-gray-500">
                {user_progress.completed_cases}/{user_progress.total_cases} Cases
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(user_progress.progress_percentage)}`}
                style={{ width: `${user_progress.progress_percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {user_progress.progress_percentage}% abgeschlossen
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user_enrolled && user_progress && user_progress.progress_percentage > 0 ? (
              <span className="text-sm text-navaa-primary font-medium">Fortsetzen</span>
            ) : (
              <span className="text-sm text-gray-700 font-medium">Foundation Cases starten</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-navaa-primary group-hover:translate-x-1 transition-transform duration-300">
            <span className="text-sm font-medium">
              {user_enrolled && user_progress && user_progress.progress_percentage > 0
                ? 'Weiter'
                : 'Starten'}
            </span>
            <ChevronRightIcon className="h-4 w-4" />
          </div>
        </div>

        {/* Hover Shine Effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
      </div>

      {/* Foundation Cases Preview (Hover) */}
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <BookOpenIcon className="h-4 w-4 text-navaa-primary" />
          Foundation Cases Preview
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {course.foundation_cases?.slice(0, 4).map((foundationCase) => (
            <div key={foundationCase.case_id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-navaa-primary/10 text-navaa-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {foundationCase.sequence_order}
                </span>
                <span className="text-gray-700 truncate">{foundationCase.title}</span>
              </div>
              <span
                className={`
                px-1.5 py-0.5 rounded text-xs font-medium
                ${getDifficultyColor(foundationCase.difficulty)}
              `}
              >
                {foundationCase.difficulty}
              </span>
            </div>
          ))}
          {foundation_cases_count > 4 && (
            <p className="text-xs text-gray-500 text-center pt-2">
              ... und {foundation_cases_count - 4} weitere Cases
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
