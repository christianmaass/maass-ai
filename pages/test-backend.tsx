import React, { useState, useEffect } from 'react';

// Einfache Test-Seite für Backend-APIs
const TestBackend: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-case-generation');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Test failed');
      }
      
      setTestResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Backend Test - Case/Assessment Feature</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">System Status</h2>
            <button 
              onClick={runTest}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Run Test'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {testResult && (
            <div className="space-y-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <strong>Status:</strong> {testResult.status}
                <br />
                <strong>Message:</strong> {testResult.message}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Database Test */}
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Database Connection</h3>
                  <p className="text-sm">
                    <strong>Status:</strong> {testResult.tests?.database?.status || 'unknown'}
                  </p>
                  <p className="text-sm">
                    <strong>Case Types:</strong> {testResult.tests?.database?.case_types_count || 0}
                  </p>
                  {testResult.tests?.database?.sample_types && (
                    <div className="mt-2">
                      <strong>Sample Types:</strong>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {testResult.tests.database.sample_types.map((type: string, idx: number) => (
                          <li key={idx}>{type}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* OpenAI Test */}
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">OpenAI Configuration</h3>
                  <p className="text-sm">
                    <strong>API Key:</strong> {testResult.tests?.openai?.api_key_present ? '✅ Present' : '❌ Missing'}
                  </p>
                  <p className="text-sm">
                    <strong>Key Format:</strong> {testResult.tests?.openai?.api_key_format || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <strong>Package:</strong> {testResult.tests?.openai?.package_available ? '✅ Available' : '❌ Missing'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-2 text-sm">
            <p>✅ Database tables created</p>
            <p>✅ Case types seeded</p>
            <p>✅ Backend APIs ready</p>
            <p>🔄 Testing system integration...</p>
            <p>⏳ Frontend MVP implementation pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBackend;
