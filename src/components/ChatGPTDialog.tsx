// ChatGPTDialog.tsx
// Provides an interactive chat dialog interface, likely for AI-driven conversations or support.

import React, { useState } from 'react';

// Interface for a single chat message, with a 'role' indicating whether it's from the user or assistant, and 'content' for the message text.
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// A specific prompt to be used for the chat dialog, defining the tone and personality of the assistant.
const SPECIFIC_PROMPT = "Du bist ein hilfreicher KI-Assistent für die Testseite. Antworte freundlich und prägnant.";

const ChatGPTDialog: React.FC = () => {
  // Debug: Zeige, ob der API-Key geladen wird
  React.useEffect(() => {
    console.log('VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY ? 'Vorhanden' : 'Nicht gesetzt');
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    try {
      const response = await fetch('http://localhost:8787/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // API-Key aus .env.local
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: SPECIFIC_PROMPT },
            ...newMessages,
          ],
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        setMessages([...newMessages, { role: 'assistant' as const, content: data.choices[0].message.content }]);
      } else {
        setError('Fehler bei der Antwort von OpenAI.');
      }
    } catch (err) {
      setError('Verbindungsfehler oder ungültiger API-Key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 mt-8 font-sans">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Chat</h3>
      <div className="h-72 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
        {messages.length === 0 && <div className="text-gray-400">Starte den Dialog…</div>}
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'flex justify-end mb-2' : 'flex justify-start mb-2'}>
            <span className={msg.role === 'user'
              ? 'inline-block bg-gray-800 text-white px-4 py-2 rounded-2xl max-w-xs text-right break-words shadow'
              : 'inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl max-w-xs text-left break-words shadow'}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
        <input
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 text-base font-sans bg-white"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Deine Nachricht…"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gray-800 text-white rounded-lg font-bold text-base hover:bg-gray-900 transition-colors disabled:opacity-60"
          disabled={loading || !input.trim()}
        >
          Senden
        </button>
      </form>
      {loading && <div className="text-sm text-gray-500 mt-2">Antwort wird geladen…</div>}
      {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default ChatGPTDialog;
