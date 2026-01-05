'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import type { Artifact } from '@/lib/schemas/artifact';

interface ArtifactFormProps {
  onSubmit: (data: Artifact) => void;
  isLoading?: boolean;
}

export function ArtifactForm({ onSubmit, isLoading = false }: ArtifactFormProps) {
  const [objective, setObjective] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [options, setOptions] = useState<Array<{ id?: string; text: string; trade_offs?: string }>>(
    [{ text: '' }, { text: '' }]
  );
  const [assumptions, setAssumptions] = useState<
    Array<{ id?: string; text: string; evidence?: string }>
  >([]);
  const [hypotheses, setHypotheses] = useState<Array<{ id?: string; text: string; test?: string }>>(
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validierung
    if (!objective.trim() || !problemStatement.trim()) {
      return;
    }

    if (options.filter((opt) => opt.text.trim()).length < 2) {
      return;
    }

    onSubmit({
      objective: objective.trim(),
      problem_statement: problemStatement.trim(),
      options: options.filter((opt) => opt.text.trim()),
      assumptions: assumptions.filter((ass) => ass.text.trim()),
      hypotheses: hypotheses.filter((hyp) => hyp.text.trim()),
    });
  };

  const addOption = () => {
    setOptions([...options, { text: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: 'text' | 'trade_offs', value: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  };

  const addAssumption = () => {
    setAssumptions([...assumptions, { text: '' }]);
  };

  const removeAssumption = (index: number) => {
    setAssumptions(assumptions.filter((_, i) => i !== index));
  };

  const updateAssumption = (index: number, field: 'text' | 'evidence', value: string) => {
    const updated = [...assumptions];
    updated[index] = { ...updated[index], [field]: value };
    setAssumptions(updated);
  };

  const addHypothesis = () => {
    setHypotheses([...hypotheses, { text: '' }]);
  };

  const removeHypothesis = (index: number) => {
    setHypotheses(hypotheses.filter((_, i) => i !== index));
  };

  const updateHypothesis = (index: number, field: 'text' | 'test', value: string) => {
    const updated = [...hypotheses];
    updated[index] = { ...updated[index], [field]: value };
    setHypotheses(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Objective */}
      <Card>
        <CardHeader>
          <CardTitle>Objective</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="objective"
              className="block text-sm font-medium text-navaa-gray-900 mb-2"
            >
              What do you want to achieve?
            </label>
            <textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g., Reduce checkout failures by 50% within 3 months"
              className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-navaa-accent focus:border-transparent text-navaa-gray-700"
              required
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Include constraints (cost, time, risk, quality) if relevant.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Problem Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-navaa-gray-900 mb-2">
              What problem are you solving?
            </label>
            <textarea
              id="problem"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="e.g., Current checkout process fails for 15% of transactions, causing revenue loss"
              className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-navaa-accent focus:border-transparent text-navaa-gray-700"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle>Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {options.map((option, index) => (
            <div key={index} className="space-y-2 border-b pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`option-${index}`}
                  className="block text-sm font-medium text-navaa-gray-900"
                >
                  Option {index + 1}
                </label>
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input
                id={`option-${index}`}
                type="text"
                value={option.text}
                onChange={(e) => updateOption(index, 'text', e.target.value)}
                placeholder="e.g., Switch to Vendor B"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navaa-accent focus:border-transparent text-navaa-gray-700"
                required={index < 2}
                disabled={isLoading}
              />
              <textarea
                value={option.trade_offs || ''}
                onChange={(e) => updateOption(index, 'trade_offs', e.target.value)}
                placeholder="Trade-offs (optional)"
                className="w-full min-h-[60px] px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-navaa-accent focus:border-transparent text-sm text-navaa-gray-700"
                disabled={isLoading}
              />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addOption} disabled={isLoading}>
            Add Option
          </Button>
        </CardContent>
      </Card>

      {/* Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle>Assumptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assumptions.length === 0 ? (
            <p className="text-sm text-gray-500">No assumptions yet. Add one to get started.</p>
          ) : (
            assumptions.map((assumption, index) => (
              <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`assumption-${index}`}
                    className="block text-sm font-medium text-navaa-gray-900"
                  >
                    Assumption {index + 1}
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAssumption(index)}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </div>
                <input
                  id={`assumption-${index}`}
                  type="text"
                  value={assumption.text}
                  onChange={(e) => updateAssumption(index, 'text', e.target.value)}
                  placeholder="e.g., Vendor B has better uptime"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navaa-accent focus:border-transparent text-navaa-gray-700"
                  disabled={isLoading}
                />
                <textarea
                  value={assumption.evidence || ''}
                  onChange={(e) => updateAssumption(index, 'evidence', e.target.value)}
                  placeholder="Evidence (optional)"
                  className="w-full min-h-[60px] px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-navaa-accent focus:border-transparent text-sm text-navaa-gray-700"
                  disabled={isLoading}
                />
              </div>
            ))
          )}
          <Button type="button" variant="outline" onClick={addAssumption} disabled={isLoading}>
            Add Assumption
          </Button>
        </CardContent>
      </Card>

      {/* Hypotheses */}
      <Card>
        <CardHeader>
          <CardTitle>Hypotheses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hypotheses.length === 0 ? (
            <p className="text-sm text-gray-500">No hypotheses yet. Add one to get started.</p>
          ) : (
            hypotheses.map((hypothesis, index) => (
              <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`hypothesis-${index}`}
                    className="block text-sm font-medium text-navaa-gray-900"
                  >
                    Hypothesis {index + 1}
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeHypothesis(index)}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </div>
                <input
                  id={`hypothesis-${index}`}
                  type="text"
                  value={hypothesis.text}
                  onChange={(e) => updateHypothesis(index, 'text', e.target.value)}
                  placeholder="e.g., Vendor B will reduce failures by 50%"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navaa-accent focus:border-transparent text-navaa-gray-700"
                  disabled={isLoading}
                />
                <textarea
                  value={hypothesis.test || ''}
                  onChange={(e) => updateHypothesis(index, 'test', e.target.value)}
                  placeholder="How to test (optional)"
                  className="w-full min-h-[60px] px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-navaa-accent focus:border-transparent text-sm text-navaa-gray-700"
                  disabled={isLoading}
                />
              </div>
            ))
          )}
          <Button type="button" variant="outline" onClick={addHypothesis} disabled={isLoading}>
            Add Hypothesis
          </Button>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !objective.trim() || !problemStatement.trim()}>
          {isLoading ? 'Analyzing…' : 'Analyze decision'}
        </Button>
      </div>
    </form>
  );
}
