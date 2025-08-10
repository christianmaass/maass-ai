import React from 'react';
import { useRouter } from 'next/router';

const SettingsHeader: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    // Go back to the main application
    router.push('/cases');
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium">Zurück</span>
            </button>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Benutzereinstellungen</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
