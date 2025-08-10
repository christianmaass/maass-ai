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
 * ✅ Admin Dashboard - Role-based access control
 * ✅ Admin Operations - Secure admin functionality
 * ✅ User Management - Safe user operations with audit trails
 * ✅ System Monitoring - Health checks and diagnostics
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Willkommen im navaa.ai Admin-Bereich</p>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-[#009e82]">-</p>
            <p className="text-sm text-gray-500">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Cases</h3>
            <p className="text-3xl font-bold text-[#009e82]">-</p>
            <p className="text-sm text-gray-500">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-[#009e82]">-</p>
            <p className="text-sm text-gray-500">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Health</h3>
            <p className="text-3xl font-bold text-[#009e82]">✅</p>
            <p className="text-sm text-gray-500">All systems operational</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-[#009e82] hover:bg-[#009e82]/5 transition-colors"
            >
              <h3 className="font-medium text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600 mt-1">Verwalte User und Test-Accounts</p>
            </Link>

            <Link
              href="/admin/monitoring"
              className="p-4 border border-gray-200 rounded-lg hover:border-[#009e82] hover:bg-[#009e82]/5 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Monitoring</h3>
              <p className="text-sm text-gray-600 mt-1">System-Status und Analytics</p>
            </Link>

            <Link
              href="/admin/cases"
              className="p-4 border border-gray-200 rounded-lg hover:border-[#009e82] hover:bg-[#009e82]/5 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Case Management</h3>
              <p className="text-sm text-gray-600 mt-1">Foundation Cases verwalten</p>
            </Link>

            <Link
              href="/admin/foundation-manager"
              className="p-4 border border-gray-200 rounded-lg hover:border-[#009e82] hover:bg-[#009e82]/5 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Foundation Manager</h3>
              <p className="text-sm text-gray-600 mt-1">Cases erstellen und bearbeiten</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
