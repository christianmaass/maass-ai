import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { getSupabaseClient } from '../supabaseClient';
import MainNavaaHeader from '../components/MainNavaaHeader';

const MainNavaa: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (!data.user) {
        router.replace('/');
      }
    };
    getUser();
    const supabase = getSupabaseClient();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/MainNavaa');
    }
  };

  return (
    <>
      {user ? (
        <>
          <MainNavaaHeader onLogout={handleLogout} />
          <main className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
              <h1 className="text-3xl font-bold mb-6 text-gray-800">Willkommen, {user.email}!</h1>
              <p className="mb-6 text-gray-700">Du bist erfolgreich eingeloggt. Hier findest du jetzt exklusive Inhalte für eingeloggte Nutzer.</p>
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </main>
        </>
      ) : (
        <main className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-Mail</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Passwort</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Einloggen…' : 'Login'}
              </button>
            </form>
          </div>
        </main>
      )}
      <Footer />
    </>
  );
};

export default MainNavaa;
