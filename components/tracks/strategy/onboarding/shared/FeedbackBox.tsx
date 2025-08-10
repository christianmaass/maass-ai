import React from 'react';

interface FeedbackBoxProps {
  isCorrect: boolean;
  correctFeedback: string;
  incorrectFeedback: string;
  learningPoint?: string;
  show: boolean;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({
  isCorrect,
  correctFeedback,
  incorrectFeedback,
  learningPoint,
  show,
}) => {
  if (!show) return null;

  const feedbackText = isCorrect ? correctFeedback : incorrectFeedback;
  const bgColor = isCorrect ? 'bg-green-50' : 'bg-blue-50';
  const borderColor = isCorrect ? 'border-green-200' : 'border-blue-200';
  const textColor = isCorrect ? 'text-green-800' : 'text-blue-800';
  const iconColor = isCorrect ? 'text-green-600' : 'text-blue-600';
  const icon = isCorrect ? '✓' : '💡';

  return (
    <div className={`mt-6 p-4 ${bgColor} ${borderColor} border rounded-lg`}>
      <div className="flex items-start space-x-3">
        <div className={`text-lg ${iconColor} mt-0.5`}>{icon}</div>
        <div className="flex-1">
          <div className={`font-medium ${textColor} mb-2`}>
            {isCorrect ? 'Richtig!' : 'Nicht ganz richtig.'}
          </div>
          <p className={`text-sm ${textColor} mb-3`}>{feedbackText}</p>
          {learningPoint && (
            <div
              className={`text-xs ${textColor} bg-white bg-opacity-50 p-2 rounded border-l-2 ${isCorrect ? 'border-green-400' : 'border-blue-400'}`}
            >
              <strong>💡 Lernpunkt:</strong> {learningPoint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackBox;
