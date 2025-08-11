/**
 * USER MANAGEMENT COMPONENT
 * Migrated to navaa Auth Guidelines (WP-B1)
 *
 * COMPLIANCE:
 * - Uses useAuth() hook (MANDATORY)
 * - Role-based access control via hasRole(), isAdmin()
 * - JWT token management via getAccessToken()
 * - No direct supabase.auth calls
 *
 * @version 2.0.0 (WP-B1 Migration)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  expires_at: string;
}

interface TestUserForm {
  email: string;
  first_name: string;
  last_name: string;
  duration: number;
}

const UserManagement: React.FC = () => {
  // =============================================================================
  // NAVAA AUTH INTEGRATION (WP-B1 Migration)
  // =============================================================================

  const { user, getAccessToken, hasRole, isAdmin, isAuthenticated } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [testUserForm, setTestUserForm] = useState<TestUserForm>({
    email: '',
    first_name: '',
    last_name: '',
    duration: 24,
  });

  const loadUsers = useCallback(async () => {
    try {
      // Use navaa Auth Guidelines - check authentication and admin role
      if (!isAuthenticated() || !isAdmin()) {
        console.error('User not authenticated or not admin for loadUsers');
        setIsLoading(false);
        return;
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token for loadUsers');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, isAuthenticated, isAdmin]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateTestUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Use navaa Auth Guidelines - check authentication and admin role
      if (!isAuthenticated() || !isAdmin()) {
        console.error('User not authenticated or not admin for createTestUser');
        setIsCreating(false);
        return;
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token for createTestUser');
        setIsCreating(false);
        return;
      }

      const response = await fetch('/api/admin/create-test-user-direct', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUserForm.email,
          first_name: testUserForm.first_name,
          last_name: testUserForm.last_name,
          duration: testUserForm.duration,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create test user');
      }

      const data = await response.json();

      // Reload users to show the new test user
      await loadUsers();

      // Reset form and close
      setTestUserForm({ email: '', first_name: '', last_name: '', duration: 24 });
      setShowCreateForm(false);

      alert(`Test-User erfolgreich erstellt!\nE-Mail: ${data.email}\nPasswort: ${data.password}`);
    } catch (error) {
      console.error('Error creating test user:', error);
      const e = error as Error;
      alert(`Fehler beim Erstellen des Test-Users: ${e?.message ?? String(error)}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen User löschen möchten?')) {
      return;
    }

    try {
      // Use navaa Auth Guidelines - check authentication and admin role
      if (!isAuthenticated() || !isAdmin()) {
        console.error('User not authenticated or not admin for deleteUser');
        return;
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token for deleteUser');
        return;
      }

      const response = await fetch(`/api/admin/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      // Reload users to reflect the deletion
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      const e = error as Error;
      alert(`Fehler beim Löschen des Users: ${e?.message ?? String(error)}`);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nie';
    return new Date(dateString).toLocaleString('de-DE');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'test':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUserExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getActiveUsers = () => users.filter((u) => !isUserExpired(u.expires_at));
  const getTestUsers = () => users.filter((u) => u.role === 'test');
  const getAdminUsers = () => users.filter((u) => u.role === 'admin');

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 User-Statistiken</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            <div className="text-sm text-gray-600">Gesamt-User</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{getActiveUsers().length}</div>
            <div className="text-sm text-gray-600">Aktive User</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{getTestUsers().length}</div>
            <div className="text-sm text-gray-600">Test-User</div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{getAdminUsers().length}</div>
            <div className="text-sm text-gray-600">Admin-User</div>
          </div>
        </div>
      </div>

      {/* Test User Creation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">🧪 Test-User erstellen</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-[#00bfae] text-white rounded-lg hover:bg-[#009688] transition-colors"
          >
            {showCreateForm ? 'Abbrechen' : '+ Neuer Test-User'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateTestUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                <input
                  type="email"
                  value={testUserForm.email}
                  onChange={(e) => setTestUserForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bfae] focus:border-transparent"
                  placeholder="test@navaa.ai"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
                <input
                  type="text"
                  value={testUserForm.first_name}
                  onChange={(e) =>
                    setTestUserForm((prev) => ({ ...prev, first_name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bfae] focus:border-transparent"
                  placeholder="Max"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
                <input
                  type="text"
                  value={testUserForm.last_name}
                  onChange={(e) =>
                    setTestUserForm((prev) => ({ ...prev, last_name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bfae] focus:border-transparent"
                  placeholder="Mustermann"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gültigkeitsdauer (Stunden)
                </label>
                <select
                  value={testUserForm.duration}
                  onChange={(e) =>
                    setTestUserForm((prev) => ({ ...prev, duration: parseInt(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bfae] focus:border-transparent"
                >
                  <option value={1}>1 Stunde</option>
                  <option value={24}>24 Stunden</option>
                  <option value={168}>1 Woche</option>
                  <option value={720}>1 Monat</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 bg-[#00bfae] text-white rounded-lg hover:bg-[#009688] disabled:opacity-50 transition-colors"
              >
                {isCreating ? 'Erstelle...' : 'Test-User erstellen'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">👥 Registrierte User</h2>

        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">👤</div>
            <p>Keine User gefunden</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rolle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erstellt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Läuft ab
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const isExpired = isUserExpired(user.expires_at);
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50 ${isExpired ? 'opacity-60' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-[#00bfae] flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : `ID: ${user.id.substring(0, 8)}...`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${isExpired ? 'bg-red-500' : 'bg-green-500'}`}
                          ></div>
                          <span
                            className={`text-sm ${isExpired ? 'text-red-600' : 'text-green-600'}`}
                          >
                            {isExpired ? 'Abgelaufen' : 'Aktiv'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.expires_at ? formatDate(user.expires_at) : 'Permanent'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {user.role === 'test' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Löschen
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
