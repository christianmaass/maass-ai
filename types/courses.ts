// =====================================================
// COURSE TYPES - SHARED INTERFACES
// =====================================================
// Zentrale TypeScript-Interfaces für Kurs-System

export interface FoundationCase {
  case_id: string;
  title: string;
  difficulty: number;
  sequence_order: number;
}

export interface Course {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  difficulty_level: number;
  estimated_duration_hours: number;
  prerequisites: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  progress_percentage: number;
  completed_cases: number;
  total_cases: number;
  last_activity_at: string | null;
}

export interface CourseWithEnrollment extends Course {
  user_enrolled: boolean;
  foundation_cases?: FoundationCase[];
  foundation_cases_count: number;
  user_progress?: UserProgress;
}

export interface CoursesResponse {
  courses: CourseWithEnrollment[];
  total_count: number;
}

// Enrollment Status
export type EnrollmentStatus = 'active' | 'completed' | 'paused' | 'cancelled';

// Course Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: { min: 1, max: 3, label: 'Anfänger', color: 'green' },
  INTERMEDIATE: { min: 4, max: 7, label: 'Fortgeschritten', color: 'yellow' },
  ADVANCED: { min: 8, max: 10, label: 'Experte', color: 'red' },
} as const;

// Helper Functions
export const getDifficultyLevel = (difficulty: number) => {
  if (difficulty <= 3) return DIFFICULTY_LEVELS.BEGINNER;
  if (difficulty <= 7) return DIFFICULTY_LEVELS.INTERMEDIATE;
  return DIFFICULTY_LEVELS.ADVANCED;
};

export const formatDuration = (hours: number): string => {
  if (hours < 1) return `${Math.round(hours * 60)} Min`;
  if (hours === 1) return '1 Stunde';
  return `${hours} Stunden`;
};

export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};
