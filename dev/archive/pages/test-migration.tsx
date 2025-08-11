/**
 * MIGRATION TEST PAGE
 * Sichere Ausführung der User-Tracking-Migration
 *
 * @version 1.0.0
 */

import React, { useState } from 'react';

interface MigrationStep {
  step: number;
  action: string;
  status: 'success' | 'error';
  sql?: string;
  error?: string;
  sampleData?: any;
}

interface MigrationResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  totalSteps: number;
  completedSteps?: number;
  steps: MigrationStep[];
  sampleUserData?: any;
  timestamp: string;
}

export default function TestMigration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MigrationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runMigration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/safe-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Migration failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const checkSchemaAfter = () => {
    window.open('/test-schema-check', '_blank');
  };

  const testUserStatus = () => {
    window.open('/debug-user-status', '_blank');
  };

  return (
    <div className="min-h-screen navaa-bg-primary p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-navaa-text-primary mb-8">
          🛠️ User-Tracking Migration
        </h1>

        {/* Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h3 className="text-orange-800 font-semibold mb-2">⚠️ Important</h3>
          <p className="text-orange-700 mb-4">
            This migration will add user tracking fields to the database. The migration is designed
            to be safe and reversible.
          </p>
          <div className="text-sm text-orange-600">
            <strong>Fields to be added:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>login_count (INTEGER DEFAULT 0)</li>
              <li>first_login_at (TIMESTAMP)</li>
              <li>last_login_at (TIMESTAMP)</li>
              <li>last_activity_track (VARCHAR)</li>
              <li>last_activity_at (TIMESTAMP)</li>
              <li>onboarding_completed (BOOLEAN DEFAULT FALSE)</li>
            </ul>
          </div>
        </div>

        {/* Migration Button */}
        <div className="mb-8">
          <button
            onClick={runMigration}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium mr-4"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running Migration...
              </div>
            ) : (
              'Run Migration'
            )}
          </button>

          {result && result.success && (
            <div className="inline-flex space-x-2">
              <button
                onClick={checkSchemaAfter}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                Check Schema
              </button>
              <button
                onClick={testUserStatus}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              >
                Test User Status
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">❌ Migration Failed</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Summary */}
            <div
              className={`rounded-lg border p-6 ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">
                {result.success ? '✅ Migration Successful' : '❌ Migration Failed'}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                      {result.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total steps:</span>
                    <span>{result.totalSteps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed steps:</span>
                    <span className="text-green-600">
                      {result.completedSteps || result.totalSteps}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Message:</span>
                    <span className="text-sm">{result.message || result.error}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span className="text-sm">{new Date(result.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Migration Steps */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-4">📋 Migration Steps</h3>
              <div className="space-y-3">
                {result.steps.map((step) => (
                  <div
                    key={step.step}
                    className={`p-4 rounded-lg border ${
                      step.status === 'success'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        Step {step.step}: {step.action}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          step.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {step.status === 'success' ? '✅ Success' : '❌ Error'}
                      </span>
                    </div>

                    {step.sql && (
                      <div className="mt-2">
                        <code className="text-xs bg-gray-100 p-2 rounded block overflow-auto">
                          {step.sql}
                        </code>
                      </div>
                    )}

                    {step.error && (
                      <div className="mt-2 text-red-700 text-sm">
                        <strong>Error:</strong> {step.error}
                      </div>
                    )}

                    {step.sampleData && (
                      <div className="mt-2">
                        <strong className="text-sm">Sample Data:</strong>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(step.sampleData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sample User Data */}
            {result.sampleUserData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-blue-800 font-semibold mb-4">👤 Updated User Data</h3>
                <pre className="bg-blue-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(result.sampleUserData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
