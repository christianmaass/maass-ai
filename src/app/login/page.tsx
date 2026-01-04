'use client';

import { useEffect, useState } from 'react';
import { LoginOverlay } from '@/shared/ui/components/login-overlay';

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return <LoginOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
