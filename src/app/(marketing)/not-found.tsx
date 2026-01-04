import Link from 'next/link';
import { Button } from '@/shared/ui';

export default function MarketingNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Seite nicht gefunden</h2>
          <p className="text-gray-600">Die gesuchte Seite existiert nicht oder wurde verschoben.</p>
        </div>

        <Link href="/" className="block w-full">
          <Button className="w-full">Zur Startseite</Button>
        </Link>
      </div>
    </div>
  );
}
