import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../supabaseClient';
import { useRouter } from 'next/router';
import LoginModal from './LoginModal';

const MainAppHeader: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
    const supabase = getSupabaseClient();
    // Listen auf Auth-Änderungen (Login/Logout)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <header className="w-full bg-[#f5f8fa]">
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => setShowLogin(false)}
      />
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 bg-[#f5f8fa]">
        <div className="flex items-center gap-2">
          <img src="/logo-navaa.png" alt="navaa.ai Logo" className="h-20 w-20 object-contain" />
        </div>
        <ul className="flex gap-6 items-center">
          {user ? (
            <>
              <li>
                <a href="#user" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">User</a>
              </li>
              <li>
                <a href="#progress" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">Dein Fortschritt</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="#dashboard" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">Dashboard</a>
              </li>
              <li>
                <a href="#profile" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">Dein Fortschritt</a>
              </li>
              <li>
                <a href="#profile" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">Profil</a>
              </li>
            </>
          )}
          <li>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="ml-6 px-5 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors"
              >
                Logout
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainAppHeader;
