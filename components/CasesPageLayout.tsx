import React, { useState } from 'react';
import { CaseData, WorkflowView } from '../types/case.types';

interface CasesPageLayoutProps {
  children: React.ReactNode;
  currentCase?: CaseData | null;
  currentView?: WorkflowView;
  onViewChange?: (view: WorkflowView) => void;
}

const CasesPageLayout: React.FC<CasesPageLayoutProps> = ({
  children,
  currentCase,
  currentView = 'start',
  onViewChange
}) => {
  return (
    <div className="cases-page-layout min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📋 Cases & Assessments
              </h1>
              <p className="text-gray-600">
                Entwickle deine strategischen Denkfähigkeiten mit realistischen Business Cases
              </p>
            </div>
            
            {/* Current Case Info */}
            {currentCase && (
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                <div className="text-sm text-gray-600">Aktueller Case:</div>
                <div className="font-semibold text-gray-900 truncate max-w-48">
                  {currentCase.title}
                </div>
                <div className="text-xs text-gray-500">
                  {currentCase.case_type.name} - Level {currentCase.case_type.difficulty_level}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Case Overview */}
          <div className="lg:col-span-1">
            <CasesSidebar currentView={currentView} onViewChange={onViewChange} />
          </div>

          {/* Main Workflow Area */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const CasesSidebar: React.FC<{
  currentView: WorkflowView;
  onViewChange?: (view: WorkflowView) => void;
}> = ({ currentView, onViewChange }) => {
  const steps = [
    {
      id: 'start' as WorkflowView,
      title: 'Case auswählen',
      icon: '🎯',
      description: 'Neuen Business Case generieren'
    },
    {
      id: 'case' as WorkflowView,
      title: 'Case studieren',
      icon: '📖',
      description: 'Aufgabenstellung verstehen'
    },
    {
      id: 'response' as WorkflowView,
      title: 'Lösung entwickeln',
      icon: '💭',
      description: 'Strukturierte Antwort eingeben'
    },
    {
      id: 'assessment' as WorkflowView,
      title: 'Feedback erhalten',
      icon: '📊',
      description: 'Assessment und nächste Schritte'
    }
  ];

  const getStepStatus = (stepId: WorkflowView) => {
    const stepOrder = ['start', 'case', 'response', 'assessment'];
    const currentIndex = stepOrder.indexOf(currentView);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Case-Workflow
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <div
              key={step.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                status === 'current' 
                  ? 'bg-[#00bfae] bg-opacity-10 border border-[#00bfae] border-opacity-20' 
                  : status === 'completed'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                status === 'current' 
                  ? 'bg-[#00bfae] text-white' 
                  : status === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {status === 'completed' ? '✓' : step.icon}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  status === 'current' ? 'text-[#00bfae]' : 
                  status === 'completed' ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
              
              {/* Step Number */}
              <div className="flex-shrink-0 text-xs text-gray-400">
                {index + 1}/4
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Deine Statistiken
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Cases bearbeitet:</span>
            <span className="font-medium text-gray-900">3</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Durchschnittsscore:</span>
            <span className="font-medium text-gray-900">7.5/10</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Verbesserung:</span>
            <span className="font-medium text-green-600">+1.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasesPageLayout;
