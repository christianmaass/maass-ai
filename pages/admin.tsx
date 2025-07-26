
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import AdminPanel from '../components/AdminPanel';
import MainAppHeader from '../components/MainAppHeader';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin } = useProfile();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainAppHeader />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin-Bereich</h1>
            <p className="text-gray-600">Bitte loggen Sie sich ein, um auf den Admin-Bereich zuzugreifen.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainAppHeader />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Zugriff verweigert</h1>
            <p className="text-gray-600">Sie haben keine Berechtigung für den Admin-Bereich.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainAppHeader />
      <div className="pt-16">
        <AdminPanel />
      </div>
    </div>
  );
};

export default AdminPage;
