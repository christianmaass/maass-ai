// Core case interfaces
export interface CaseDefinition {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  tags: string[];
}

export interface GeneratedCase {
  id: string;
  title: string;
  content: string;
  context: string;
  questions: CaseQuestion[];
  assessmentCriteria: AssessmentCriterion[];
  metadata: CaseMetadata;
}

export interface CaseQuestion {
  id: string;
  question: string;
  type: 'open_text' | 'multiple_choice' | 'structured';
  expectedElements?: string[];
  weight: number; // for scoring
}

export interface AssessmentCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface CaseMetadata {
  trackType: string;
  caseType: string;
  generatedAt: Date;
  difficulty: string;
  estimatedTime: number;
}

// Case response and assessment
export interface CaseResponse {
  caseId: string;
  userId: string;
  responses: Record<string, string>;
  submittedAt: Date;
  timeSpent: number; // in seconds
}

export interface CaseAssessment {
  responseId: string;
  scores: Record<string, number>;
  totalScore: number;
  maxScore: number;
  feedback: AssessmentFeedback[];
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
}

export interface AssessmentFeedback {
  criterionId: string;
  score: number;
  maxScore: number;
  feedback: string;
  suggestions?: string[];
}

// Track-specific configuration
export interface TrackCaseConfiguration {
  trackType: string;
  prompts: CasePromptConfiguration;
  assessmentCriteria: AssessmentCriterion[];
  caseTemplates: CaseTemplate[];
  difficultyProgression: DifficultyProgression;
}

export interface CasePromptConfiguration {
  caseGeneration: string;
  assessment: string;
  feedback: string;
  contextPrompts: Record<string, string>;
}

export interface CaseTemplate {
  id: string;
  name: string;
  structure: string;
  variables: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DifficultyProgression {
  beginner: {
    caseCount: number;
    focusAreas: string[];
  };
  intermediate: {
    caseCount: number;
    focusAreas: string[];
  };
  advanced: {
    caseCount: number;
    focusAreas: string[];
  };
}

// Case engine props
export interface CaseEngineProps {
  trackConfig: TrackCaseConfiguration;
  onCaseGenerated?: (generatedCase: GeneratedCase) => void;
  onResponseSubmitted?: (response: CaseResponse) => void;
  onAssessmentComplete?: (assessment: CaseAssessment) => void;
  userId?: string;
}

export interface CaseGeneratorProps {
  trackConfig: TrackCaseConfiguration;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  caseType?: string;
  onGenerated: (generatedCase: GeneratedCase) => void;
  onError?: (error: string) => void;
}
