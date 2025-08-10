/**
 * DEBUG TABLES
 * Schnelle Diagnose der Datenbankstruktur für Multi-Course Architecture
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

interface TableInfo {
  table_name: string;
  exists: boolean;
  row_count?: number;
  columns?: string[];
  error?: string;
}

export async function getServerSideProps() {
  if (process.env.NODE_ENV !== 'development') {
    return { notFound: true };
  }
  return { props: {} };
}

export default function DebugTables() {
  const { user } = useAuth();
  const [tableInfo, setTableInfo] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkTables() {
      const tables = [
        'courses',
        'user_course_enrollments',
        'course_foundation_cases',
        'user_course_progress',
        'foundation_cases',
      ];

      const results: TableInfo[] = [];

      for (const tableName of tables) {
        try {
          // Check if table exists and get row count
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (error) {
            results.push({
              table_name: tableName,
              exists: false,
              error: error.message,
            });
          } else {
            // Get first row to see columns
            const { data: sampleData } = await supabase.from(tableName).select('*').limit(1);

            const columns = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : [];

            results.push({
              table_name: tableName,
              exists: true,
              row_count: count || 0,
              columns,
            });
          }
        } catch (err) {
          results.push({
            table_name: tableName,
            exists: false,
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }

      setTableInfo(results);
      setLoading(false);
    }

    if (user) {
      checkTables();
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Database Tables Debug</h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Checking database tables...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tableInfo.map((table) => (
                <div
                  key={table.table_name}
                  className={`border rounded-lg p-4 ${
                    table.exists ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {table.exists ? '✅' : '❌'} {table.table_name}
                    </h3>
                    {table.exists && (
                      <span className="text-sm text-gray-600">{table.row_count} rows</span>
                    )}
                  </div>

                  {table.error && (
                    <div className="text-red-600 text-sm mb-2">
                      <strong>Error:</strong> {table.error}
                    </div>
                  )}

                  {table.columns && table.columns.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Columns:</h4>
                      <div className="flex flex-wrap gap-2">
                        {table.columns.map((column) => (
                          <span
                            key={column}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {column}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🎯 Next Steps</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Check if all required tables exist</li>
                  <li>• Verify table structures match API expectations</li>
                  <li>• Run missing migrations if needed</li>
                  <li>• Test API endpoints after fixes</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
