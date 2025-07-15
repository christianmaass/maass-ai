import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Gruß from './Gruß';
import Textblock from './Textblock';

import ChatGPTDialog from './ChatGPTDialog';
import LoginPage from './LoginPage';


import { useEffect } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setLoggedIn(true);
        setUser(data.session.user);
        console.log('Supabase-User:', data.session.user);
      } else {
        setLoggedIn(false);
        setUser(null);
        console.log('Kein User eingeloggt');
      }
    });
    // Optional: Listener für Login/Logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      setUser(session?.user || null);
      console.log('Auth-Status geändert:', session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!loggedIn) {
    return <LoginPage onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onLogout={() => {
        setLoggedIn(false);
        setUser(null);
      }} />
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-4 text-sm text-gray-500">
          Eingeloggt als: {user?.email || 'Unbekannt'}
        </div>
        <ChatGPTDialog />
      </main>
      <Footer />
    </div>
  );
}

export default App;
