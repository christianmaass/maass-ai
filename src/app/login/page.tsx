import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navaa-warm-beige p-4">
      <h2 className="text-3xl font-bold text-navaa-gray-900 mb-6">Anmelden</h2>
      <form
        action="/api/auth/login"
        method="post"
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <label className="block mb-2 text-navaa-gray-700" htmlFor="email">
          Email
        </label>
        <input
          className="w-full p-2 mb-4 border border-navaa-gray-200 rounded"
          type="email"
          name="email"
          id="email"
          required
        />
        <label className="block mb-2 text-navaa-gray-700" htmlFor="password">
          Passwort
        </label>
        <input
          className="w-full p-2 mb-4 border border-navaa-gray-200 rounded"
          type="password"
          name="password"
          id="password"
          required
        />
        <button
          className="w-full bg-navaa-accent text-white p-2 rounded-lg hover:bg-navaa-accent/80"
          type="submit"
        >
          Anmelden
        </button>
      </form>
      <p className="mt-4 text-navaa-gray-700">
        Noch kein Konto?{' '}
        <Link href="/register" className="text-navaa-accent">
          Registrieren
        </Link>
      </p>
    </div>
  );
}
