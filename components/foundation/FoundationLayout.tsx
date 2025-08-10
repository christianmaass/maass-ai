import React from 'react';

interface FoundationLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function FoundationLayout({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBack,
}: FoundationLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              {showBackButton && (
                <button
                  onClick={onBack}
                  className="mb-2 text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  ← Zurück zur Übersicht
                </button>
              )}
              {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
            <div className="text-sm text-gray-500">Foundation Track</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
