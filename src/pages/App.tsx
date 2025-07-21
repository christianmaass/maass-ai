import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Gruß from '../components/Gruß';
import Textblock from '../components/Textblock';
import HeroBanner from '../components/HeroBanner';
import ContentSections from '../components/ContentSections';
import ChatGPTDialog from '../components/ChatGPTDialog';
import LoginPage from '../pages/LoginPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

// App.tsx
// Main application component. Handles authentication, routing, and global layout (header, footer, main content).
function App() {
  // State for authentication status and user info
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // On mount: check for existing session and set up auth state change listener
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
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#f5f8fa]">
        <Header onLogout={() => {
          setLoggedIn(false);
          setUser(null);
        }} />
        <main className="flex flex-1 flex-col items-center justify-center">
          <Routes>
            <Route path="/" element={
              <>
                <HeroBanner />
                <ContentSections />
              </>
            } />
            <Route path="/chat" element={<ChatGPTDialog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
