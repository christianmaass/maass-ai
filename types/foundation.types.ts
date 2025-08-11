// Foundation Track TypeScript Types
// Comprehensive type definitions for all Foundation Track functionality

// =====================================================
// CORE FOUNDATION TYPES
// =====================================================

export type InteractionType =
  | 'multiple_choice_with_hypotheses'
  | 'structured_mbb'
  | 'free_form_with_hints'
  | 'minimal_support';

export type FoundationCluster =
  | 'Leistung & Wirtschaftlichkeit'
  | 'Wachstum & Markt'
  | 'Strategie & Priorisierung'
  | 'Organisation & Transformation';

// =====================================================
// FOUNDATION CASE TYPES
// =====================================================

export interface FoundationCase {
  id: string;
  title: string;
  category: 'foundation';
  cluster: FoundationCluster;
  tool: string;
  difficulty: number; // 1-12
  estimated_duration: number; // minutes
  interaction_type: InteractionType;
  learning_objectives: string[];
  created_at: string;
  updated_at: string;
}

export interface FoundationCaseWithUserStatus extends FoundationCase {
  user_status?: {
    completed: boolean;
    score?: number;
    completed_at?: string;
    attempts: number;
  };
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

// GET /api/foundation/cases
export interface FoundationCasesListResponse {
  success: boolean;
  data: {
    cases: FoundationCaseWithUserStatus[];
    user_progress?: {
      cases_completed: number;
      cases_total: number;
      completion_percentage: number;
      current_case_id: string | null;
      last_activity: string;
    };
  };
  meta: {
    total_cases: number;
    filtered_cases: number;
    execution_time_ms: number;
  };
}

// =====================================================
// FOUNDATION RESPONSE & ASSESSMENT TYPES
// =====================================================

// Foundation Response (for submit API)
export interface FoundationResponse {
  case_id: string;
  response_data: any;
  interaction_type: string;
}

// Foundation Assessment (AI-generated feedback)
export interface FoundationAssessment {
  id?: string;
  case_id: string;
  response_id?: string;
  user_id?: string | null;
  overall_score: number;
  dimension_scores: Record<string, number>;
  feedback: string;
  created_at: string;
}

// Foundation Submit Response
export interface FoundationSubmitResponse {
  success: true;
  data: {
    response: {
      id: string;
      case_id: string;
      user_id: string | null;
      responses: any;
      interaction_type: string;
      submitted_at: string;
    };
    assessment: FoundationAssessment;
  };
  meta: {
    execution_time_ms: number;
  };
}

// =====================================================
// ERROR TYPES
// =====================================================

export interface FoundationApiError {
  success: false;
  error: {
    code?: string;
    message: string;
    details?: any;
  };
  meta?: {
    execution_time_ms: number;
  };
}
