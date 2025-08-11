import React from 'react';
import AdminLayout from '@components/admin/AdminLayout';

const AdminMonitoring: React.FC = () => {
  return (
    <AdminLayout currentPage="monitoring">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="navaa-card">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">📊 System Monitoring</h1>
          <p className="text-gray-600">Login-Aktivitäten, User-Sessions und System-Performance</p>
        </div>

        {/* Coming Soon - Will integrate with existing monitoring */}
        <div className="navaa-card p-8 text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Integration in Arbeit</h2>
          <p className="text-gray-600">
            Login-Monitoring wird mit bestehender Infrastruktur integriert
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMonitoring;
