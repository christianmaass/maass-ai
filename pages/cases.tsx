import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import UnifiedHeader from '../components/UnifiedHeader';
import Footer from '../components/Footer';
import CasesPageLayout from '../components/CasesPageLayout';
import CasesList from '../components/CasesList';
import CaseWorkflow from '../components/CaseWorkflow';
import { CaseData, WorkflowView } from '../types/case.types';

const CasesPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // State for case workflow
  const [currentCase, setCurrentCase] = useState<CaseData | null>(null);
  const [currentView, setCurrentView] = useState<WorkflowView>('start');
  const [showCasesList, setShowCasesList] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  // Loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Prüfe Anmeldung...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // Event handlers
  const handleCaseGenerated = (caseData: CaseData) => {
    setCurrentCase(caseData);
    setShowCasesList(false); // Hide cases list when working on a case
  };

  const handleViewChange = (view: WorkflowView) => {
    setCurrentView(view);
    // Show cases list when back to start view
    if (view === 'start') {
      setShowCasesList(true);
    }
  };

  const handleCaseSelect = (caseData: CaseData) => {
    setCurrentCase(caseData);
    setCurrentView('case');
    setShowCasesList(false);
  };

  const handleResponseSubmitted = (responseId: string) => {
    console.log('Response submitted:', responseId);
    // Could update case history or stats here
  };

  const handleAssessmentCompleted = (assessmentId: string) => {
    console.log('Assessment completed:', assessmentId);
    // Could trigger analytics or progress updates here
  };

  return (
    <>
      <UnifiedHeader variant="app" />
      
      <CasesPageLayout
        currentCase={currentCase}
        currentView={currentView}
        onViewChange={handleViewChange}
      >
        <div className="space-y-6">
          {/* Toggle between Cases List and Workflow */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCasesList(!showCasesList)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showCasesList
                    ? 'bg-[#00bfae] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📋 Cases-Übersicht
              </button>
              
              <button
                onClick={() => {
                  setShowCasesList(false);
                  if (!currentCase) setCurrentView('start');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !showCasesList
                    ? 'bg-[#00bfae] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🎯 Case-Workflow
              </button>
            </div>
            
            {currentCase && (
              <div className="text-sm text-gray-600">
                Aktueller Case: <span className="font-medium">{currentCase.title}</span>
              </div>
            )}
          </div>

          {/* Content Area */}
          {showCasesList ? (
            <CasesList
              onCaseSelect={handleCaseSelect}
              currentCaseId={currentCase?.id || null}
              className="transition-all duration-300"
            />
          ) : (
            <CaseWorkflow
              onViewChange={handleViewChange}
              onCaseGenerated={handleCaseGenerated}
              onResponseSubmitted={handleResponseSubmitted}
              onAssessmentCompleted={handleAssessmentCompleted}
              initialCase={currentCase}
              initialView={currentView}
              showProgress={true}
              className="transition-all duration-300"
            />
          )}
        </div>
      </CasesPageLayout>
      
      <Footer />
    </>
  );
};

export default CasesPage;
