'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton({ className = '' }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`text-gray-700 hover:text-gray-900 disabled:opacity-50 ${className}`}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
