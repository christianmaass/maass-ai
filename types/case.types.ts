// Shared Types for Case Workflow System
// This file centralizes all case-related types for consistency across components

export interface CaseData {
  id: string;
  title: string;
  description: string;
  case_type: {
    name: string;
    difficulty_level: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CaseLimitInfo {
  canGenerateCase: boolean;
  casesUsed: number;
  caseLimit: number;
  tariffName: string;
  message?: string;
}

export interface UserResponse {
  id: string;
  user_id: string;
  case_id: string;
  response_text: string;
  time_spent_seconds: number;
  created_at: string;
}

export interface Assessment {
  id: string;
  user_response_id: string;
  scores: number; // Note: Database column is 'scores' not 'score'
  feedback: string;
  strengths: string[];
  improvements: string[];
  created_at: string;
}

export type WorkflowView = 'start' | 'case' | 'response' | 'assessment';

export interface CaseWorkflowState {
  currentView: WorkflowView;
  currentCase: CaseData | null;
  assessmentId: string | null;
  loading: boolean;
  error: string | null;
}

// Props interfaces for reusable components
export interface CaseWorkflowProps {
  onViewChange?: (view: WorkflowView) => void;
  onCaseGenerated?: (caseData: CaseData) => void;
  onResponseSubmitted?: (responseId: string) => void;
  onAssessmentCompleted?: (assessmentId: string) => void;
  initialView?: WorkflowView;
  initialCase?: CaseData | null;
  className?: string;
  showProgress?: boolean;
}

export interface CaseDisplayProps {
  caseData: CaseData | null;
  loading?: boolean;
  onStartResponse?: () => void;
}

export interface ResponseInputProps {
  caseData: CaseData | null;
  loading?: boolean;
  onSubmitResponse?: (response: string) => void;
  onResponseSubmitted?: (responseId: string) => void;
  onBack?: () => void;
}

export interface AssessmentDisplayProps {
  assessmentId: string | null;
  onNewCase?: () => void;
  onAssessmentCompleted?: (assessmentId: string) => void;
}
