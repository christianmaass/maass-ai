import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import LogDashboard from '../../components/admin/LogDashboard';

export default function AdminLogsPage() {
  return (
    <AdminLayout currentPage="logs">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">📊 System Logs</h1>
          <p className="text-gray-600">
            System-Monitoring, Log-Analytics und Performance-Überwachung
          </p>
        </div>

        {/* Log Dashboard */}
        <LogDashboard />
      </div>
    </AdminLayout>
  );
}
