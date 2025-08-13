import { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { getSupabaseClient } from 'supabaseClient';

interface FoundationCase {
  id: string;
  title: string;
  category: string;
  cluster: string;
  tool: string;
  difficulty: number;
  estimated_duration: number;
  interaction_type: string;
  content: any;
  learning_objectives: string[];
  case_type?: string;
  framework_hints?: string;
  case_description?: string;
  case_question?: string;
  created_at: string;
  updated_at: string;
}

interface UseFoundationCasesReturn {
  cases: FoundationCase[];
  selectedCase: FoundationCase | null;
  loading: boolean;
  error: string | null;
  selectCase: (caseId: string) => void;
  refreshCases: () => Promise<void>;
  updateCase: (caseId: string, updates: Partial<FoundationCase>) => Promise<boolean>;
}

export const useFoundationCases = (): UseFoundationCasesReturn => {
  const [cases, setCases] = useState<FoundationCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<FoundationCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load all foundation cases
  const loadCases = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = getSupabaseClient();
      const { data, error: fetchError } = await supabase
        .from('foundation_cases')
        .select('*')
        .order('difficulty', { ascending: true });

      if (fetchError) {
        throw new Error(`Failed to load cases: ${fetchError.message}`);
      }

      setCases(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading cases';
      setError(errorMessage);
      console.error('Error loading foundation cases:', err);
    } finally {
      setLoading(false);
    }
  };

  // Select a specific case
  const selectCase = (caseId: string) => {
    const foundCase = cases.find((c) => c.id === caseId);
    if (foundCase) {
      setSelectedCase(foundCase);
    } else {
      console.warn(`Case with ID ${caseId} not found`);
    }
  };

  // Update a case in the database and local state
  const updateCase = async (caseId: string, updates: Partial<FoundationCase>): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/admin/update-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`, // TODO: Get proper access token
        },
        body: JSON.stringify({
          caseId,
          updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setCases((prevCases) => prevCases.map((c) => (c.id === caseId ? { ...c, ...updates } : c)));

        // Update selected case if it's the one being updated
        if (selectedCase?.id === caseId) {
          setSelectedCase((prev) => (prev ? { ...prev, ...updates } : null));
        }

        return true;
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error updating case';
      setError(errorMessage);
      console.error('Error updating case:', err);
      return false;
    }
  };

  // Refresh cases from database
  const refreshCases = async () => {
    await loadCases();
  };

  // Load cases on mount
  useEffect(() => {
    loadCases();
  }, []);

  return {
    cases,
    selectedCase,
    loading,
    error,
    selectCase,
    refreshCases,
    updateCase,
  };
};

export type { FoundationCase, UseFoundationCasesReturn };
