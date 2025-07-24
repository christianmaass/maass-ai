import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Describtion_Case_Start, { CaseData } from '../components/Describtion_Case_Start';
import CaseDisplay from '../components/CaseDisplay';
import ResponseInput from '../components/ResponseInput';
import AssessmentDisplay from '../components/AssessmentDisplay';
import { useRouter } from 'next/router';
import { getSupabaseClient } from '../supabaseClient';
import MainNavaaHeader from '../components/MainNavaaHeader';

const MainNavaa: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Case/Assessment State
  const [currentCase, setCurrentCase] = useState<CaseData | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'start' | 'case' | 'response' | 'assessment'>('start');
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (!data.user) {
        router.replace('/');
      }
    };
    getUser();
    const supabase = getSupabaseClient();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/MainNavaa');
    }
  };

  return (
    <>
      {user ? (
        <>
          <MainNavaaHeader onLogout={handleLogout} />
          <main className="w-full max-w-7xl mx-auto px-4 md:px-0 py-12 flex flex-col md:flex-row gap-8">
            {/* Linke Seite - Case Display */}
            <div className="flex-1">
              {currentView === 'start' && (
                <div className="bg-white rounded-xl shadow p-8">
                  <Describtion_Case_Start 
                    onCaseGenerated={(caseData) => {
                      setCurrentCase(caseData);
                      setCurrentView('case');
                      setAssessmentId(null);
                    }}
                  />
                </div>
              )}
              
              {(currentView === 'case' || currentView === 'response') && (
                <CaseDisplay caseData={currentCase} />
              )}
              
              {currentView === 'assessment' && (
                <AssessmentDisplay 
                  assessmentId={assessmentId}
                  onNewCase={() => {
                    setCurrentCase(null);
                    setAssessmentId(null);
                    setCurrentView('start');
                  }}
                />
              )}
            </div>
            
            {/* Rechte Seite - Response Input */}
            <div className="flex-1">
              {(currentView === 'case' || currentView === 'response') && (
                <ResponseInput 
                  caseData={currentCase}
                  onResponseSubmitted={(responseId) => {
                    setAssessmentId(responseId);
                    setCurrentView('assessment');
                  }}
                />
              )}
              
              {currentView === 'start' && (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Bereit für deinen ersten Case?</h3>
                  <p className="text-gray-500">Klicke links auf "Start Case" um zu beginnen.</p>
                </div>
              )}
              
              {currentView === 'assessment' && (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Bewertung abgeschlossen!</h3>
                  <p className="text-gray-500">Deine detaillierte Bewertung siehst du links.</p>
                </div>
              )}
            </div>
          </main>
        </>
      ) : (
        <main className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-Mail</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Passwort</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <button
                type="submit"
                className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Einloggen…' : 'Login'}
              </button>
            </form>
          </div>
        </main>
      )}
      <Footer />
    </>
  );
};

export default MainNavaa;
