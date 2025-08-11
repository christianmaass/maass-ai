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
 * ✅ Module System - 3-Modul-Architektur (Onboarding, Foundation, Expert)
 * ✅ Responsive Design - Mobile-first approach with Tailwind CSS
 * ✅ User Experience - Clear module progression and status indication
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */

/**
 * MODULE CARD COMPONENT
 *
 * Displays individual course modules in a card format.
 * Part of the 3-module architecture (Onboarding, Foundation Cases, Expert Cases).
 *
 * FEATURES:
 * - Status management (Locked/Available/In Progress/Completed)
 * - Progress tracking per module
 * - navaa-guideline-conform design
 * - Responsive layout
 * - Click navigation to module content
 *
 * @version 1.0.0 (3-Module Architecture)
 * @author navaa Development Team
 */

import React from 'react';
import { Heading, Text } from '../ui/Typography';
import Image from 'next/image';
import { MODULES } from '../../lib/assetPaths';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  type: 'onboarding' | 'foundation' | 'expert';
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  estimatedTime: string;
  icon: string;
  features: string[];
}

interface ModuleCardProps {
  module: ModuleData;
  onClick: () => void;
  disabled?: boolean;
}

// =============================================================================
// MODULE CARD COMPONENT
// =============================================================================

export default function ModuleCard({ module, onClick, disabled = false }: ModuleCardProps) {
  const showProgress = Boolean(
    module.progress && (module.status === 'in-progress' || module.status === 'completed'),
  );

  // Status badge configuration
  const getStatusBadge = (status: ModuleData['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✅ Abgeschlossen
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            🔄 In Bearbeitung
          </span>
        );
      case 'available':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            🚀 Verfügbar
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            🔒 Gesperrt
          </span>
        );
      default:
        return null;
    }
  };

  // Button text based on status
  const getButtonText = (status: ModuleData['status']) => {
    switch (status) {
      case 'completed':
        return 'Wiederholen';
      case 'in-progress':
        return 'Fortsetzen';
      case 'available':
        return 'Starten';
      case 'locked':
        return 'Gesperrt';
      default:
        return 'Starten';
    }
  };

  // Button styling based on status
  const getButtonStyle = (status: ModuleData['status']) => {
    if (status === 'locked' || disabled) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }
    return 'bg-primary text-white hover:bg-primary/90 transition-colors';
  };

  const isClickable = !disabled && module.status !== 'locked';

  // Resolve header image per module type
  const imageSrc =
    module.type === 'foundation'
      ? MODULES.foundation
      : module.type === 'expert'
        ? MODULES.expert
        : MODULES.onboarding;
  const imageAlt =
    module.type === 'foundation'
      ? 'Foundation Cases'
      : module.type === 'expert'
        ? 'Expert Cases'
        : 'Onboarding';

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
        isClickable ? 'hover:shadow-md cursor-pointer' : ''
      } flex flex-col h-full`}
      onClick={isClickable ? onClick : undefined}
    >
      {/* Module Image/Icon (3:2, full bleed) */}
      <div className="relative aspect-[3/2] bg-[#052d55]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
          priority={false}
        />
      </div>

      {/* Module Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Status Badge */}
        <div className="mb-3">{getStatusBadge(module.status)}</div>

        {/* Title & Description */}
        <Heading variant="h2" className="mb-2">
          {module.title}
        </Heading>
        <Text variant="body" as="p" className="text-gray-700 leading-relaxed mb-2">
          {module.description}
        </Text>

        {/* Feature List (optional, show up to 3) */}
        {Array.isArray(module.features) && module.features.length > 0 && (
          <ul className="text-gray-600 text-base space-y-1 mb-3 list-disc list-inside">
            {module.features.slice(0, 3).map((feat, idx) => (
              <li key={idx}>{feat}</li>
            ))}
          </ul>
        )}

        {/* Module Meta Info */}
        <div className="mb-3">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <Text as="span" variant="micro" className="text-gray-500">
              {module.estimatedTime}
            </Text>
          </div>

          {module.type === 'foundation' && (
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Text as="span" variant="micro" className="text-gray-500">
                10-12 Cases
              </Text>
            </div>
          )}
        </div>

        {/* Progress Bar (only when available) */}
        {showProgress && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <Text as="span" variant="micro" className="text-gray-600">
                Fortschritt
              </Text>
              <Text as="span" variant="micro" className="text-gray-600">
                {module.progress!.current}/{module.progress!.total}
              </Text>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${module.progress!.percentage}%` }}
              ></div>
            </div>
            <Text variant="micro" className="text-gray-500 mt-1">
              {module.progress!.percentage}% abgeschlossen
            </Text>
          </div>
        )}

        {/* Action Button - always at bottom */}
        <div className="mt-auto pt-1">
          <button
            className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${getButtonStyle(module.status)}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isClickable) onClick();
            }}
            disabled={!isClickable}
          >
            {getButtonText(module.status)}
          </button>
        </div>
      </div>
    </div>
  );
}
