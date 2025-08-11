import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register, error, clearError, loading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): string | null => {
    if (!firstName.trim() || !lastName.trim()) return 'Bitte Vor- und Nachnamen angeben.';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Bitte eine gültige E-Mail angeben.';
    if (password.length < 8) return 'Passwort muss mindestens 8 Zeichen haben.';
    if (password !== confirmPassword) return 'Passwörter stimmen nicht überein.';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const v = validate();
    if (v) {
      setFormError(v);
      return;
    }

    setSubmitting(true);
    try {
      await register(firstName.trim(), lastName.trim(), email.trim(), password);
      // AuthContext.register navigiert bereits auf '/'; optional: router.push('/onboarding');
    } catch (e) {
      // Fehler wird in Context gesetzt; lokale Meldung nur als Fallback
      setFormError('Registrierung fehlgeschlagen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navaa-bg-primary p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Konto erstellen</h1>
        <p className="text-sm text-gray-600 mb-6">Beginne deinen Lernpfad bei NAVAA.</p>

        {(formError || error) && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {formError || error?.message}
          </div>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Vorname</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nachname</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Passwort bestätigen</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting || loading ? 'Wird erstellt…' : 'Registrieren'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Bereits ein Konto?{' '}
          <button onClick={() => router.push('/login')} className="text-blue-600 hover:underline">
            Anmelden
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
