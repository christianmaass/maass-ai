import React from 'react';

interface SkipButtonProps {
  onSkip: () => void;
  showConfirm: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const SkipButton: React.FC<SkipButtonProps> = ({ onSkip, showConfirm, onConfirm, onCancel }) => {
  if (showConfirm) {
    return (
      <div className="relative">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onCancel} />

        {/* Confirmation Dialog */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 max-w-md w-full mx-4">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Onboarding überspringen?</h3>
          <p className="text-gray-600 mb-6">
            Du verpasst eine kurze Einführung in den navaa-Denkprozess. Du kannst das Onboarding
            jederzeit später nachholen.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Abbrechen
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-[#00bfae] text-white font-bold rounded-lg hover:bg-[#009688] transition-colors"
            >
              Ja, überspringen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onSkip}
      className="text-sm text-gray-500 hover:text-gray-700 underline font-medium"
    >
      Onboarding überspringen
    </button>
  );
};

export default SkipButton;
