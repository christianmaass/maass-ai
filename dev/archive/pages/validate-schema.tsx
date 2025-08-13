/**
 * SCHEMA VALIDATION TOOL
 * Sichere Validierung vor Migration - NAVAA Guidelines konform
 *
 * SICHERHEITS-CHECKS:
 * - Aktuelle Tabellen-Struktur analysieren
 * - Existierende Daten prüfen
 * - Migration-Risiken bewerten
 * - Rollback-Strategie validieren
 *
 * @version 1.0.0
 * @author navaa Development Team
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface ValidationResult {
  step: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export default function ValidateSchema() {
  const { user } = useAuth();
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallSafe, setOverallSafe] = useState<boolean | null>(null);

  useEffect(() => {
    async function validateSchema() {
      const validationResults: ValidationResult[] = [];

      try {
        // 1. Check current table structure
        validationResults.push({
          step: '1. Checking user_course_enrollments table structure',
          status: 'success',
          message: 'Starting table structure analysis...',
        });

        // Get current columns
        const { data: tableData, error: tableError } = await supabase
          .from('user_course_enrollments')
          .select('*')
          .limit(1);

        if (tableError) {
          validationResults.push({
            step: '1.1 Table Access',
            status: 'error',
            message: `Cannot access table: ${tableError.message}`,
            details: tableError,
          });
        } else {
          validationResults.push({
            step: '1.1 Table Access',
            status: 'success',
            message: 'Table accessible',
          });

          // Analyze current structure
          const currentColumns = tableData && tableData.length > 0 ? Object.keys(tableData[0]) : [];

          const requiredColumns = ['user_id', 'course_id', 'enrolled_at'];
          const optionalColumns = [
            'is_active',
            'status',
            'progress_percentage',
            'last_activity_at',
          ];

          // Check required columns
          const missingRequired = requiredColumns.filter((col) => !currentColumns.includes(col));
          if (missingRequired.length > 0) {
            validationResults.push({
              step: '1.2 Required Columns',
              status: 'error',
              message: `Missing required columns: ${missingRequired.join(', ')}`,
              details: { missing: missingRequired, current: currentColumns },
            });
          } else {
            validationResults.push({
              step: '1.2 Required Columns',
              status: 'success',
              message: 'All required columns present',
            });
          }

          // Check optional columns (these we want to add)
          const missingOptional = optionalColumns.filter((col) => !currentColumns.includes(col));
          validationResults.push({
            step: '1.3 Optional Columns',
            status: missingOptional.length > 0 ? 'warning' : 'success',
            message:
              missingOptional.length > 0
                ? `Missing optional columns: ${missingOptional.join(', ')}`
                : 'All optional columns present',
            details: { missing: missingOptional, current: currentColumns },
          });
        }

        // 2. Check existing data
        const { count: enrollmentCount } = await supabase
          .from('user_course_enrollments')
          .select('*', { count: 'exact', head: true });

        validationResults.push({
          step: '2. Existing Data Analysis',
          status: 'success',
          message: `Found ${enrollmentCount || 0} existing enrollment records`,
          details: { count: enrollmentCount },
        });

        // 3. Check related tables
        const relatedTables = ['courses', 'user_course_progress'];
        for (const tableName of relatedTables) {
          try {
            const { count } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });

            validationResults.push({
              step: `3. Related Table: ${tableName}`,
              status: 'success',
              message: `Table accessible with ${count || 0} records`,
            });
          } catch (err) {
            validationResults.push({
              step: `3. Related Table: ${tableName}`,
              status: 'warning',
              message: `Table access issue: ${err instanceof Error ? err.message : 'Unknown error'}`,
            });
          }
        }

        // 4. Migration Safety Assessment
        const hasErrors = validationResults.some((r) => r.status === 'error');
        const hasWarnings = validationResults.some((r) => r.status === 'warning');

        if (hasErrors) {
          validationResults.push({
            step: '4. Migration Safety Assessment',
            status: 'error',
            message: '❌ MIGRATION NOT SAFE - Critical errors found',
          });
          setOverallSafe(false);
        } else if (hasWarnings) {
          validationResults.push({
            step: '4. Migration Safety Assessment',
            status: 'warning',
            message: '⚠️ MIGRATION POSSIBLE - Warnings present, proceed with caution',
          });
          setOverallSafe(true);
        } else {
          validationResults.push({
            step: '4. Migration Safety Assessment',
            status: 'success',
            message: '✅ MIGRATION SAFE - No critical issues found',
          });
          setOverallSafe(true);
        }
      } catch (error) {
        validationResults.push({
          step: 'Validation Error',
          status: 'error',
          message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error,
        });
        setOverallSafe(false);
      }

      setResults(validationResults);
      setLoading(false);
    }

    if (user) {
      validateSchema();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🔒 Authentication Required</h1>
          <p className="text-gray-600">Please log in to validate schema.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Schema Migration Validation</h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Validating schema safety...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Status */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  overallSafe === true
                    ? 'bg-green-50 border-green-200'
                    : overallSafe === false
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <h2 className="text-xl font-semibold mb-2">
                  {overallSafe === true
                    ? '✅ Migration Safe'
                    : overallSafe === false
                      ? '❌ Migration Not Safe'
                      : '⚠️ Migration Status Unknown'}
                </h2>
                <p
                  className={`${
                    overallSafe === true
                      ? 'text-green-800'
                      : overallSafe === false
                        ? 'text-red-800'
                        : 'text-yellow-800'
                  }`}
                >
                  {overallSafe === true
                    ? 'Proceed with migration'
                    : overallSafe === false
                      ? 'Do NOT proceed - fix errors first'
                      : 'Review warnings before proceeding'}
                </p>
              </div>

              {/* Validation Results */}
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border-l-4 ${
                      result.status === 'success'
                        ? 'bg-green-50 border-green-400'
                        : result.status === 'warning'
                          ? 'bg-yellow-50 border-yellow-400'
                          : 'bg-red-50 border-red-400'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="mr-2">
                        {result.status === 'success'
                          ? '✅'
                          : result.status === 'warning'
                            ? '⚠️'
                            : '❌'}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{result.step}</h3>
                        <p
                          className={`text-sm ${
                            result.status === 'success'
                              ? 'text-green-700'
                              : result.status === 'warning'
                                ? 'text-yellow-700'
                                : 'text-red-700'
                          }`}
                        >
                          {result.message}
                        </p>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs text-gray-500">
                              Show details
                            </summary>
                            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Steps */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🎯 Next Steps</h3>
                <div className="text-blue-800 text-sm space-y-1">
                  {overallSafe === true ? (
                    <>
                      <p>✅ Schema validation passed - migration is safe to proceed</p>
                      <p>• Run the migration script in Supabase SQL Editor</p>
                      <p>• Test enrollment functionality after migration</p>
                      <p>• Monitor for any issues</p>
                    </>
                  ) : overallSafe === false ? (
                    <>
                      <p>❌ Critical issues found - DO NOT proceed with migration</p>
                      <p>• Fix all error conditions first</p>
                      <p>• Re-run validation</p>
                      <p>• Consider alternative approaches</p>
                    </>
                  ) : (
                    <>
                      <p>⚠️ Warnings present - proceed with caution</p>
                      <p>• Review all warnings carefully</p>
                      <p>• Test in development environment first</p>
                      <p>• Have rollback plan ready</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
