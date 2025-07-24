import React, { useState } from 'react';
import { CaseData } from './Describtion_Case_Start';
import { getSupabaseClient } from '../supabaseClient';

interface ResponseInputProps {
  caseData: CaseData | null;
  onResponseSubmitted?: (responseId: string) => void;
}

const ResponseInput: React.FC<ResponseInputProps> = ({ caseData, onResponseSubmitted }) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caseData || !response.trim()) {
      setError('Bitte gib eine Antwort ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      // Get current user
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to submit response');
      }

      // Submit response to API
      const submitResponse = await fetch('/api/submit-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          case_id: caseData.id,
          response_text: response,
          time_spent_seconds: timeSpent
        })
      });

      const submitData = await submitResponse.json();

      if (!submitResponse.ok) {
        throw new Error(submitData.error || 'Failed to submit response');
      }

      // Trigger assessment
      const assessResponse = await fetch('/api/assess-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          case_id: caseData.id,
          user_response_id: submitData.response.id
        })
      });

      const assessData = await assessResponse.json();

      if (!assessResponse.ok) {
        throw new Error(assessData.error || 'Failed to assess response');
      }

      // Notify parent component
      if (onResponseSubmitted) {
        onResponseSubmitted(assessData.assessment.id);
      }

      // Clear form
      setResponse('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!caseData) {
    return (
      <div className="w-full bg-white rounded-xl shadow p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Warte auf deinen Case</h3>
        <p className="text-gray-500">Generiere zuerst einen Case, um deine Antwort eingeben zu können.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow p-8">
      <h3 className="text-xl font-bold mb-4">Deine Antwort</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
            Strukturiere deine Antwort und entwickle eine klare Empfehlung:
          </label>
          <textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Beginne mit einer strukturierten Analyse...

Beispiel:
1. Problemverständnis: ...
2. Hypothesen: ...
3. Analyse: ...
4. Empfehlung: ..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {response.length} Zeichen
            </span>
            <span className="text-sm text-gray-500">
              💡 Tipp: Nutze MECE-Strukturierung
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setResponse('')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={loading}
          >
            Zurücksetzen
          </button>
          
          <button
            type="submit"
            disabled={loading || !response.trim()}
            className="px-8 py-3 bg-[#ff8200] text-white font-bold rounded-xl shadow hover:bg-[#ff9900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Bewerte Antwort...' : 'Antwort einreichen'}
          </button>
        </div>
      </form>

      {/* Progress indicator */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>📊 Bewertung nach MBB-Kriterien</span>
          <span>⏱️ Zeit: {Math.floor((Date.now() - startTime) / 60000)} Min</span>
        </div>
      </div>
    </div>
  );
};

export default ResponseInput;
