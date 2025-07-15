import React, { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SPECIFIC_PROMPT = "Du bist ein hilfreicher KI-Assistent für die Testseite. Antworte freundlich und prägnant.";

const ChatGPTDialog: React.FC = () => {
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
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // <-- API-Key hier eintragen
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
    <div className="max-w-xl w-full mx-auto bg-white rounded shadow p-4 mt-6">
      <h3 className="text-xl font-bold mb-2 text-blue-700">ChatGPT Dialog</h3>
      <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50 mb-2">
        {messages.length === 0 && <div className="text-gray-400">Starte den Dialog…</div>}
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right mb-2' : 'text-left mb-2'}>
            <span className={msg.role === 'user' ? 'bg-blue-100 text-blue-800 px-2 py-1 rounded' : 'bg-gray-200 text-gray-800 px-2 py-1 rounded'}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Deine Nachricht…"
          disabled={loading}
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Senden
        </button>
      </div>
      {loading && <div className="text-sm text-gray-500 mt-1">Antwort wird geladen…</div>}
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
      <div className="text-xs text-gray-400 mt-2">Hinweis: Du musst deinen OpenAI API-Key im Code hinterlegen.</div>
    </div>
  );
};

export default ChatGPTDialog;
