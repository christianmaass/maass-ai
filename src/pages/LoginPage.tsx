import React, { useState } from 'react';
import logo from '../assets/logo-navaa.png';
import { supabase } from '../supabaseClient';

interface LoginProps {
  onLogin: () => void;
}



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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex justify-center items-center mb-9">
        <img src={logo} alt="navaa Logo" width={120} height={60} />
      </div>
      <form className="w-full max-w-md bg-white rounded-lg shadow p-8" onSubmit={handleSubmit}>
        <label className="block text-gray-800 font-semibold mb-2">E-Mail-Adresse</label>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 text-base font-sans"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label className="block text-gray-800 font-semibold mb-2">Passwort</label>
        <input
          type="password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800 text-base font-sans"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-4 text-sm font-sans">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Anmelden…' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
