import React, { useState } from 'react';
import { Heading, Text } from '../../../../ui/Typography';

export interface MultipleChoiceOption {
  id: string;
  text: string;
  correct: boolean;
}

interface MultipleChoiceProps {
  question: string;
  options: MultipleChoiceOption[];
  onAnswer: (selectedOption: MultipleChoiceOption, isCorrect: boolean) => void;
  showFeedback?: boolean;
  selectedOptionId?: string;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  options,
  onAnswer,
  showFeedback = false,
  selectedOptionId,
}) => {
  const [selectedOption, setSelectedOption] = useState<MultipleChoiceOption | null>(
    selectedOptionId ? options.find((opt) => opt.id === selectedOptionId) || null : null,
  );
  const [hasAnswered, setHasAnswered] = useState<boolean>(!!selectedOptionId);

  const handleOptionSelect = (option: MultipleChoiceOption) => {
    if (hasAnswered) return; // Prevent re-selection

    setSelectedOption(option);
    setHasAnswered(true);
    onAnswer(option, option.correct);
  };

  const getOptionStyle = (option: MultipleChoiceOption) => {
    const baseStyle =
      'w-full p-4 text-left border-2 rounded-lg transition-all duration-200 cursor-pointer text-lg';

    if (!hasAnswered) {
      return `${baseStyle} border-gray-200 hover:border-[#00bfae] hover:bg-gray-50`;
    }

    // After answering - show correct/incorrect states
    if (option.correct) {
      return `${baseStyle} border-green-500 bg-green-50 text-green-800`;
    }

    if (selectedOption?.id === option.id && !option.correct) {
      return `${baseStyle} border-red-500 bg-red-50 text-red-800`;
    }

    return `${baseStyle} border-gray-200 bg-gray-50 text-gray-500`;
  };

  const getOptionIcon = (option: MultipleChoiceOption) => {
    if (!hasAnswered) {
      return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }

    if (option.correct) {
      return (
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
          ✓
        </div>
      );
    }

    if (selectedOption?.id === option.id && !option.correct) {
      return (
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
          ✗
        </div>
      );
    }

    return <div className="w-5 h-5 border-2 border-gray-300 rounded-full bg-gray-100" />;
  };

  return (
    <div className="space-y-4">
      <Heading variant="h2" className="mb-6">
        {question}
      </Heading>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleOptionSelect(option)}
            disabled={hasAnswered}
            className={getOptionStyle(option)}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <Text as="span" className="block font-medium text-gray-900">
                  {option.text}
                </Text>
              </div>
              {hasAnswered && (
                <div className="ml-4">
                  {option.correct ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      ✗
                    </div>
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {showFeedback && hasAnswered && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            {selectedOption?.correct ? (
              <span className="font-medium">✓ Richtig!</span>
            ) : (
              <span className="font-medium">Nicht ganz richtig.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoice;
