'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Callout } from '@/shared/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Admin Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <Callout variant="error" title="Administrationsfehler">
          Es gab ein Problem beim Laden des Admin-Bereichs. Bitte versuchen Sie es erneut.
        </Callout>

        <div className="mt-6 space-y-3">
          <Button onClick={reset} className="w-full">
            Erneut versuchen
          </Button>

          <Link href="/dashboard" className="block w-full">
            <Button variant="outline" className="w-full">
              Zum Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
