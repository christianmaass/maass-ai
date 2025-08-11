import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import UserManagement from '../../components/admin/UserManagement';

const AdminUsers: React.FC = () => {
  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="navaa-card">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">👥 User Management</h1>
          <p className="text-gray-600">
            Verwalte User-Accounts, erstelle Test-User und überwache Aktivitäten
          </p>
        </div>

        {/* User Management Component with Real Database Integration */}
        <div className="navaa-card">
          <UserManagement />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
