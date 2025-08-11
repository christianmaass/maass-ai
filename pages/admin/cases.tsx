import React from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminCases: React.FC = () => {
  return (
    <AdminLayout currentPage="cases">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="navaa-card">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Case Management</h1>
          <p className="text-gray-600">Verwalte Foundation Cases und Content-Bibliothek</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/foundation-manager"
            className="navaa-card hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Foundation Manager</h3>
            <p className="text-gray-600">Cases erstellen, bearbeiten und Module konfigurieren</p>
            <div className="mt-4 text-red-600 font-medium">→ Zum Foundation Manager</div>
          </Link>

          <div className="navaa-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Case Analytics</h3>
            <p className="text-gray-600">Performance-Metriken und User-Feedback</p>
            <div className="mt-4 text-gray-400">Coming Soon</div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="navaa-card p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erweiterte Case Management Features
          </h2>
          <p className="text-gray-600">
            Case Analytics, Content-Bibliothek und Templates werden in Kürze implementiert
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCases;
