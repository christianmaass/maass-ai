import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const TestLogin: React.FC = () => {
  const router = useRouter();
  const { loginAsTestUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testUser, setTestUser] = useState<any>(null);

  const { user_id } = router.query;

  useEffect(() => {
    if (user_id) {
      loadTestUser(user_id as string);
    }
  }, [user_id]);

  const loadTestUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/test-user/${userId}`);
      const data = await response.json();

      if (data.success) {
        setTestUser(data.user);

        // Check if expired
        if (new Date(data.user.expires_at) < new Date()) {
          setError('Dieser Test-User ist abgelaufen.');
        }
      } else {
        setError('Test-User nicht gefunden oder ungültig.');
      }
    } catch (error) {
      console.error('Error loading test user:', error);
      setError('Fehler beim Laden des Test-Users.');
    }
  };

  const handleTestLogin = async () => {
    if (!testUser) return;

    setLoading(true);
    setError('');

    try {
      const success = await loginAsTestUser(testUser.id);

      if (success) {
        router.push('/cases');
      } else {
        setError('Login fehlgeschlagen.');
      }
    } catch (error) {
      console.error('Test login error:', error);
      setError('Login fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  if (!user_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navaa-bg-primary">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Test-User Login</h1>
          <p className="text-gray-600 text-center">Ungültige Test-User URL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navaa-bg-primary">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Test-User Login</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {testUser && !error && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">Test-User Details</h3>
              <p>
                <strong>Name:</strong> {testUser.name}
              </p>
              <p>
                <strong>E-Mail:</strong> {testUser.email}
              </p>
              <p>
                <strong>Läuft ab:</strong> {new Date(testUser.expires_at).toLocaleString('de-DE')}
              </p>
            </div>

            <button
              onClick={handleTestLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Logge ein...' : 'Als Test-User einloggen'}
            </button>

            <div className="text-sm text-gray-600 text-center">
              <p>Dies ist ein temporärer Test-Account.</p>
              <p>Alle Daten werden nach Ablauf automatisch gelöscht.</p>
            </div>
          </div>
        )}

        {!testUser && !error && <div className="text-center text-gray-600">Lade Test-User...</div>}
      </div>
    </div>
  );
};

export default TestLogin;
