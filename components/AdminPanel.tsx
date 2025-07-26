import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TestUser {
  id: string;
  email: string;
  name: string;
  role: string;
  expires_at: string;
  login_url: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  expires_at?: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTestUser, setShowCreateTestUser] = useState(false);
  const [testUserForm, setTestUserForm] = useState({
    email: '',
    name: '',
    duration: 24
  });
  const [createdTestUser, setCreatedTestUser] = useState<TestUser | null>(null);

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    if (isAdmin) {
      loadUsers();
    }
  }, [user, isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/admin/check-role');
      const data = await response.json();
      setIsAdmin(data.isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    try {
      const response = await fetch('/api/admin/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUserForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCreatedTestUser(data.testUser);
        setTestUserForm({ email: '', name: '', duration: 24 });
        loadUsers(); // Refresh user list
      } else {
        alert('Fehler beim Erstellen des Test-Users: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating test user:', error);
      alert('Fehler beim Erstellen des Test-Users');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('User wirklich löschen?')) return;
    
    try {
      const response = await fetch(`/api/admin/delete-user/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        loadUsers(); // Refresh list
      } else {
        alert('Fehler beim Löschen des Users');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const cleanupExpiredUsers = async () => {
    try {
      const response = await fetch('/api/admin/cleanup-expired', {
        method: 'POST'
      });
      const data = await response.json();
      alert(`${data.deletedCount} abgelaufene Test-User gelöscht`);
      loadUsers();
    } catch (error) {
      console.error('Error cleaning up users:', error);
    }
  };

  if (!user) {
    return <div className="p-4">Bitte einloggen</div>;
  }

  if (!isAdmin) {
    return <div className="p-4">Keine Admin-Berechtigung</div>;
  }

  if (loading) {
    return <div className="p-4">Lade...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowCreateTestUser(!showCreateTestUser)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test-User erstellen
        </button>
        <button
          onClick={cleanupExpiredUsers}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Abgelaufene Test-User löschen
        </button>
      </div>

      {/* Create Test User Form */}
      {showCreateTestUser && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Test-User erstellen</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="email"
              placeholder="E-Mail"
              value={testUserForm.email}
              onChange={(e) => setTestUserForm({...testUserForm, email: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Name"
              value={testUserForm.name}
              onChange={(e) => setTestUserForm({...testUserForm, name: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <select
              value={testUserForm.duration}
              onChange={(e) => setTestUserForm({...testUserForm, duration: parseInt(e.target.value)})}
              className="border rounded px-3 py-2"
            >
              <option value={1}>1 Stunde</option>
              <option value={24}>24 Stunden</option>
              <option value={72}>3 Tage</option>
              <option value={168}>1 Woche</option>
            </select>
          </div>
          <button
            onClick={createTestUser}
            disabled={!testUserForm.email || !testUserForm.name}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Test-User erstellen
          </button>
        </div>
      )}

      {/* Created Test User Info */}
      {createdTestUser && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Test-User erstellt!</h3>
          <p><strong>E-Mail:</strong> {createdTestUser.email}</p>
          <p><strong>Name:</strong> {createdTestUser.name}</p>
          <p><strong>Läuft ab:</strong> {new Date(createdTestUser.expires_at).toLocaleString('de-DE')}</p>
          <p><strong>Login-URL:</strong> 
            <a href={createdTestUser.login_url} className="text-blue-600 underline ml-2" target="_blank">
              {window.location.origin}{createdTestUser.login_url}
            </a>
          </p>
          <button
            onClick={() => setCreatedTestUser(null)}
            className="mt-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Schließen
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Alle User ({users.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">E-Mail</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Rolle</th>
                <th className="px-4 py-3 text-left">Erstellt</th>
                <th className="px-4 py-3 text-left">Läuft ab</th>
                <th className="px-4 py-3 text-left">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'test_user' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-4 py-3">
                    {user.expires_at ? (
                      <span className={new Date(user.expires_at) < new Date() ? 'text-red-600' : 'text-orange-600'}>
                        {new Date(user.expires_at).toLocaleString('de-DE')}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Löschen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
