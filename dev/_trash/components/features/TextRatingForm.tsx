import React, { useState } from 'react';

interface TextRatingFormProps {
  userId: string;
}

const TextRatingForm: React.FC<TextRatingFormProps> = ({ userId }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScore(null);
    setFeedback(null);
    try {
      const res = await fetch('/api/rate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          input_text: inputText,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        let msg = data.error || 'Fehler bei der Bewertung';
        if (data.details) msg += ` (Details: ${data.details})`;
        throw new Error(msg);
      }
      setScore(data.score);
      setFeedback(data.feedback);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 mt-8 font-sans">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block font-semibold text-gray-700">Kurzer Text für GPT-Bewertung:</label>
        <textarea
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-700 text-white font-bold px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
          disabled={loading || !inputText.trim()}
        >
          {loading ? 'Bewertung läuft…' : 'Bewerten'}
        </button>
      </form>
      {score !== null && feedback && (
        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200 flex justify-end">
          <div className="font-bold">Score: {score} / 10</div>
          <div className="mt-1">Feedback: {feedback}</div>
        </div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
};

export default TextRatingForm;
