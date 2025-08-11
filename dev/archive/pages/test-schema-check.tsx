/**
 * SCHEMA CHECK TEST PAGE
 * Benutzerfreundliche Seite zum Prüfen der Datenbankstruktur
 *
 * @version 1.0.0
 */

import React, { useState } from 'react';

interface SchemaCheckResult {
  table: string;
  column: string;
  exists: boolean;
  dataType?: string;
  isNullable?: boolean;
  defaultValue?: string;
}

interface SchemaCheckResponse {
  success: boolean;
  summary: {
    tableExists: boolean;
    totalFields: number;
    existingFields: number;
    missingFields: number;
    migrationRequired: boolean;
    allFieldsPresent: boolean;
  };
  results: SchemaCheckResult[];
  missingFields: string[];
  existingFields: Array<{
    column: string;
    dataType: string;
    isNullable: boolean;
    defaultValue: string;
  }>;
  sampleUserData?: any;
  timestamp: string;
}

export default function TestSchemaCheck() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SchemaCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkSchema = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/check-schema');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Schema check failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen navaa-bg-primary p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-navaa-text-primary mb-8">
          🔍 Database Schema Check
        </h1>

        {/* Check Button */}
        <div className="mb-8">
          <button
            onClick={checkSchema}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Checking Schema...
              </div>
            ) : (
              'Check Database Schema'
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">❌ Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Summary */}
            <div
              className={`rounded-lg border p-6 ${
                result.summary.allFieldsPresent
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">📊 Schema Summary</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Table exists:</span>
                    <span
                      className={result.summary.tableExists ? 'text-green-600' : 'text-red-600'}
                    >
                      {result.summary.tableExists ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total fields:</span>
                    <span>{result.summary.totalFields}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Existing fields:</span>
                    <span className="text-green-600">{result.summary.existingFields}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Missing fields:</span>
                    <span className="text-red-600">{result.summary.missingFields}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Migration required:</span>
                    <span
                      className={
                        result.summary.migrationRequired ? 'text-orange-600' : 'text-green-600'
                      }
                    >
                      {result.summary.migrationRequired ? '⚠️ Yes' : '✅ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>All fields present:</span>
                    <span
                      className={
                        result.summary.allFieldsPresent ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {result.summary.allFieldsPresent ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Missing Fields */}
            {result.missingFields.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-red-800 font-semibold mb-4">❌ Missing Fields</h3>
                <div className="grid md:grid-cols-3 gap-2">
                  {result.missingFields.map((field) => (
                    <div
                      key={field}
                      className="bg-red-100 px-3 py-2 rounded text-red-800 font-mono text-sm"
                    >
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Fields */}
            {result.existingFields.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-green-800 font-semibold mb-4">✅ Existing Fields</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-green-200">
                        <th className="text-left py-2 px-3 text-green-800">Column</th>
                        <th className="text-left py-2 px-3 text-green-800">Data Type</th>
                        <th className="text-left py-2 px-3 text-green-800">Nullable</th>
                        <th className="text-left py-2 px-3 text-green-800">Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.existingFields.map((field) => (
                        <tr key={field.column} className="border-b border-green-100">
                          <td className="py-2 px-3 font-mono text-sm">{field.column}</td>
                          <td className="py-2 px-3 text-sm">{field.dataType}</td>
                          <td className="py-2 px-3 text-sm">{field.isNullable ? 'Yes' : 'No'}</td>
                          <td className="py-2 px-3 text-sm font-mono">
                            {field.defaultValue || 'None'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sample User Data */}
            {result.sampleUserData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-blue-800 font-semibold mb-4">👤 Sample User Data</h3>
                <pre className="bg-blue-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(result.sampleUserData, null, 2)}
                </pre>
              </div>
            )}

            {/* Detailed Results */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold mb-4">📋 Detailed Field Check</h3>
              <div className="space-y-2">
                {result.results.map((field) => (
                  <div
                    key={field.column}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <span className="font-mono text-sm">{field.column}</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        field.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {field.exists ? '✅ Exists' : '❌ Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-center text-gray-500 text-sm">
              Checked at: {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
