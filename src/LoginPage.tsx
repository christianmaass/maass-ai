import React, { useState } from 'react';
import { supabase } from './supabaseClient';

interface LoginProps {
  onLogin: () => void;
}

import './loginpage-custom.css';

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError('Login fehlgeschlagen: ' + error.message);
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center loginpage-bg">
      <div className="loginpage-logo">
        <img src="https://christianmaass.com/logo-maass.png" alt="Christian Maaß Logo" width={120} height={60} />
      </div>
      <form style={{ width: '100%', maxWidth: 380 }} onSubmit={handleSubmit}>
        <h2 className="loginpage-title">Login</h2>
        <label className="loginpage-label">E-Mail-Adresse</label>
        <input
          type="email"
          className="loginpage-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label className="block mb-2 text-gray-700">Passwort</label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded mb-4"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        <button
          type="submit"
          className="loginpage-btn"
          disabled={loading}
        >
          {loading ? 'Anmelden…' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
