'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Callout } from '@/shared/ui/Callout';
import { ArtifactForm } from '@/components/ArtifactForm';
import { DecisionSuiteV1Result } from '@/components/DecisionSuiteV1Result';
import type { DecisionSuiteV1AggregatedResult } from '@/lib/decisionSuite/types';
import type { Artifact } from '@/lib/schemas/artifact';

interface ArtifactResponse extends DecisionSuiteV1AggregatedResult {
  feedback?: {
    hint_label: string;
    result_line: string;
    focus_question?: string;
  };
}

export default function AppPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArtifactResponse | null>(null);
  const [artifactData, setArtifactData] = useState<Artifact | null>(null);

  const handleSubmit = async (data: Artifact) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setArtifactData(data);

    try {
      const response = await fetch('/api/artifacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Something went wrong. Please try again.');
      }

      const responseData: ArtifactResponse = await response.json();
      setResult(responseData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
    setArtifactData(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-navaa-gray-900 mb-2">Decision Training</h1>
          <p className="text-navaa-gray-600">
            Strukturierte Artefakt-Eingabe für strategisches Denken und Entscheiden unter
            Unsicherheit.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Callout variant="error" className="mb-6">
            {error}
          </Callout>
        )}

        {/* Form or Result */}
        {!result ? (
          <ArtifactForm onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <div className="space-y-6">
            {/* Result Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analysis Result</CardTitle>
                  <button
                    onClick={handleClear}
                    className="text-sm text-navaa-accent hover:underline"
                  >
                    New Analysis
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <DecisionSuiteV1Result
                  aggregatedResult={result}
                  inputText={
                    artifactData
                      ? `${artifactData.problem_statement} ${artifactData.objective}`
                      : ''
                  }
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
