/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ Admin Layout - Consistent admin interface structure
 * ✅ Role-based Access - Admin-only functionality protection
 * ✅ Navigation - Clear admin navigation and breadcrumbs
 * ✅ Responsive Design - Admin interface mobile compatibility
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React from 'react';
import Link from 'next/link';
import AdminHeader from './AdminHeader';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const { user, loading } = useAuth();
  const { isAdmin } = useProfile();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00bfae] mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Admin-Bereich...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!user) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Zugriff verweigert</h2>
          <p className="text-gray-600 mb-4">
            Du musst angemeldet sein, um den Admin-Bereich zu verwenden.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Zur Anmeldung
          </Link>
        </div>
      </div>
    );
  }

  // Admin permission check
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Admin-Berechtigung erforderlich
          </h2>
          <p className="text-gray-600 mb-4">Du hast keine Berechtigung für den Admin-Bereich.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Zurück zu navaa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navaa-bg-primary">
      <AdminHeader currentPage={currentPage} />
      <main className="max-w-7xl mx-auto py-6 px-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
