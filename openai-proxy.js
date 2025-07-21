// Einfache Express-Proxy für OpenAI Chat API
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');

const app = express();
const PORT = process.env.OPENAI_PROXY_PORT || 8787;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY nicht gesetzt!');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post('/v1/chat/completions', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
    } else {
      console.log('OpenAI API Antwort:', JSON.stringify(data));
    }
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy-Fehler', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`OpenAI Proxy läuft auf http://localhost:${PORT}`);
});
