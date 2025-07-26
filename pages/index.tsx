import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MainApp from '../components/MainApp';
import Dashboard from '../components/Dashboard';
import UnifiedHeader from '../components/UnifiedHeader';
import Footer from '../components/Footer';

export default function Home() {
  const { user, authLoading } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  const [checkingNewUser, setCheckingNewUser] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      // Check if user is new (registered in last 5 minutes)
      const userCreated = new Date(user.created_at || user.user_metadata?.created_at || Date.now());
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      setIsNewUser(userCreated > fiveMinutesAgo);
      setCheckingNewUser(false);
    } else if (!authLoading) {
      setCheckingNewUser(false);
    }
  }, [user, authLoading]);

  // Loading state
  if (authLoading || checkingNewUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade navaa.ai...</p>
        </div>
      </div>
    );
  }

  // Smart routing: Dashboard for users, Marketing for guests
  if (user) {
    return (
      <div>
        <UnifiedHeader variant="app" />
        <Dashboard isNewUser={isNewUser} />
        <Footer />
      </div>
    );
  }

  // Marketing page for guests
  return <MainApp />;
}

