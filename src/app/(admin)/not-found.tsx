import Link from 'next/link';
import { Button } from '@/shared/ui';

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">Admin-Bereich nicht gefunden</h2>
          <p className="text-gray-300">Der gesuchte Admin-Bereich existiert nicht.</p>
        </div>

        <Link href="/dashboard" className="block w-full">
          <Button className="w-full">Zum Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
