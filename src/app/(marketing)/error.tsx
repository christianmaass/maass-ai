'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Callout } from '@/shared/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MarketingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Marketing Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <Callout variant="error" title="Ein Fehler ist aufgetreten">
          Entschuldigung, etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.
        </Callout>

        <div className="mt-6 space-y-3">
          <Button onClick={reset} className="w-full">
            Erneut versuchen
          </Button>

          <Link href="/" className="block w-full">
            <Button variant="outline" className="w-full">
              Zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
