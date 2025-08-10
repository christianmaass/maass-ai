/**
 * DEBUG ENROLLMENT TABLE
 * Schnelle Diagnose der user_course_enrollments Tabelle
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

export async function getServerSideProps() {
  if (process.env.NODE_ENV !== 'development') {
    return { notFound: true };
  }
  return { props: {} };
}

export default function DebugEnrollmentTable() {
  const { user } = useAuth();
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkTable() {
      try {
        // Get table structure from information_schema
        const { data: columnData, error: columnError } = await supabase.rpc('get_table_columns', {
          table_name: 'user_course_enrollments',
        });

        if (columnError) {
          console.error('Column query error:', columnError);
          // Fallback: Try to get sample data to see structure
          const { data: sampleData, error: sampleError } = await supabase
            .from('user_course_enrollments')
            .select('*')
            .limit(1);

          if (sampleError) {
            setError(`Table access error: ${sampleError.message}`);
          } else {
            setSampleData(sampleData || []);
            if (sampleData && sampleData.length > 0) {
              const cols = Object.keys(sampleData[0]).map((key) => ({
                column_name: key,
                data_type: typeof sampleData[0][key],
                is_nullable: 'unknown',
                column_default: null,
              }));
              setColumns(cols);
            }
          }
        } else {
          setColumns(columnData || []);
        }

        // Get sample data
        const { data: sample } = await supabase
          .from('user_course_enrollments')
          .select('*')
          .limit(3);

        setSampleData(sample || []);
      } catch (err) {
        console.error('Debug error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      checkTable();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🔒 Authentication Required</h1>
          <p className="text-gray-600">Please log in to access table diagnostics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 user_course_enrollments Table Debug
          </h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Checking table structure...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-2">❌ Error</h3>
              <p className="text-red-800">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 Table Structure</h3>
                {columns.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Column
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nullable
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Default
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {columns.map((col, index) => (
                          <tr
                            key={index}
                            className={col.column_name === 'is_active' ? 'bg-green-50' : ''}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {col.column_name === 'is_active' ? '✅' : ''} {col.column_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {col.data_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {col.is_nullable}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {col.column_default || 'NULL'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No column information available</p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                  📋 Sample Data ({sampleData.length} rows)
                </h3>
                {sampleData.length > 0 ? (
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                    {JSON.stringify(sampleData, null, 2)}
                  </pre>
                ) : (
                  <p className="text-yellow-800">No data in table</p>
                )}
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-2">🎯 Problem Analysis</h3>
                <div className="text-red-800 text-sm space-y-2">
                  <p>
                    <strong>Expected columns for enrollment API:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>user_id (UUID)</li>
                    <li>course_id (UUID)</li>
                    <li>enrolled_at (timestamp)</li>
                    <li className="font-bold text-red-600">is_active (boolean) ← MISSING!</li>
                    <li>status (text, optional)</li>
                    <li>progress_percentage (integer, optional)</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Solution:</strong> Add missing columns or adjust API code to match
                    existing schema.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
