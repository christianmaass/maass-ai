import React, { useState } from 'react';
import { getSupabaseClient } from '../supabaseClient';

interface CaseData {
  id: string;
  title: string;
  description: string;
  case_type: {
    name: string;
    difficulty_level: number;
  };
}

interface DescribtionCaseStartProps {
  onCaseGenerated?: (caseData: CaseData) => void;
}

const Describtion_Case_Start: React.FC<DescribtionCaseStartProps> = ({ onCaseGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartCase = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to start a case');
      }

      // Get a random case type for now (later: adaptive based on user progress)
      const { data: caseTypes } = await supabase
        .from('case_types')
        .select('*')
        .limit(5);

      if (!caseTypes || caseTypes.length === 0) {
        throw new Error('No case types available');
      }

      const randomCaseType = caseTypes[Math.floor(Math.random() * caseTypes.length)];

      // Generate case via API
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          case_type_id: randomCaseType.id,
          user_id: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate case');
      }

      // Notify parent component
      if (onCaseGenerated) {
        onCaseGenerated({
          id: data.case.id,
          title: data.case.title,
          description: data.case.description,
          case_type: data.case_type
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-2">Anleitung</h2>
      <p className="text-gray-700 mb-4">
        Klicke auf den Button "Start Case", um deine nächste Aufgabe zu erhalten. 
        navaa generiert einen Case zur Bearbeitung. Gebe deine Antwort in der 
        Dialogbox auf der rechten Seite ein, um direktes Feedback zu erhalten.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <button 
        onClick={handleStartCase}
        disabled={loading}
        className="mt-4 inline-block px-8 py-3 bg-[#ff8200] text-white font-bold rounded-xl shadow hover:bg-[#ff9900] transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generiere Case...' : 'Start Case'}
      </button>
    </div>
  );
};

export default Describtion_Case_Start;
export type { CaseData };
