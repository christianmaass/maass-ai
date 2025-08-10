/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ Dynamic Routing - Proper caseId handling and validation
 * ✅ Foundation Cases - Integration with foundation case API
 * ✅ Progress Tracking - Case completion and user progress
 * ✅ Loading States - Robust loading and error handling
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import FoundationCaseContainer from '../../components/foundation-cases/FoundationCaseContainer';

// Types
interface FoundationCase {
  id: string;
  title: string;
  cluster: string;
  case_type: string;
  difficulty: number;
  learning_objectives: string[];
  case_description?: string;
  case_question?: string;
  estimated_duration?: number;
}

const FoundationCaseDetailPage: React.FC = () => {
  const [foundationCase, setFoundationCase] = useState<FoundationCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { caseId } = router.query;

  // moved below loadFoundationCase to avoid TDZ

  const loadFoundationCase = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/get-foundation-case?caseId=${id}`, {
          headers: {
            Authorization: `Bearer ${user?.id}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load foundation case');
        }

        const data = await response.json();
        if (data.success) {
          setFoundationCase(data.case);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Error loading foundation case:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [user?.id],
  );

  useEffect(() => {
    if (user?.id && caseId && typeof caseId === 'string') {
      loadFoundationCase(caseId);
    }
  }, [user?.id, caseId, loadFoundationCase]);

  const handleBackToCases = () => {
    router.push('/foundation-cases');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bfae] mx-auto mb-4"></div>
          <p className="text-gray-600">Foundation Case wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !foundationCase) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600">{error || 'Foundation Case nicht gefunden'}</p>
          <button
            onClick={handleBackToCases}
            className="mt-4 px-4 py-2 bg-[#009e82] text-white rounded-lg hover:bg-[#007a66]"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navaa-bg-primary">
      {/* Simple Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button onClick={handleBackToCases} className="mr-4 text-gray-600 hover:text-gray-900">
              ← Zurück
            </button>
            <Image
              src="/assets/navaa-logo.png"
              alt="navaa"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
            <span className="ml-3 text-lg font-semibold text-gray-900">{foundationCase.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <FoundationCaseContainer
          foundationCase={foundationCase}
          onBackToCases={handleBackToCases}
        />
      </div>
    </div>
  );
};

export default FoundationCaseDetailPage;
