// =====================================================
// CASE GENERATION API ENDPOINT
// =====================================================
// Purpose: RESTful API for generating case descriptions and questions
// Architecture: Clean API design, proper error handling, admin-only access

import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '@supabaseClient';
import { createCaseGenerationService } from '@services/CaseGenerationService';
import { CaseGenerationRequest } from '@config/case-generation-prompts';
import { createClient } from '@supabase/supabase-js';

interface ApiRequest extends NextApiRequest {
  body: {
    caseId: string;
    userDescription: string;
  };
}

interface ApiResponse {
  success: boolean;
  data?: {
    description: string;
    question: string;
  };
  error?: string;
}

export default async function handler(req: ApiRequest, res: NextApiResponse<ApiResponse>) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  try {
    // 1. Validate request body
    const { caseId, userDescription } = req.body;

    console.log('🔍 API Debug - Received request:', {
      caseId,
      userDescriptionLength: userDescription?.length || 0,
      timestamp: new Date().toISOString(),
    });

    if (!caseId || !userDescription?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: caseId and userDescription',
      });
    }

    // 2. Get Supabase client with SERVICE ROLE for API operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('💥 Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
      });
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Missing Supabase credentials',
      });
    }

    // Create Supabase client with SERVICE ROLE key for API operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('🔍 Supabase client created with service role');

    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: 'Database connection failed',
      });
    }

    // With SERVICE_ROLE_KEY, we bypass RLS and don't need token auth
    // But we still want to verify the request comes from an authenticated frontend
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required - No bearer token',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Create a separate client for user verification (with anon key)
    const userSupabase = getSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await userSupabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Auth error:', authError);
      return res.status(401).json({
        success: false,
        error: 'Authentication required - Invalid token',
      });
    }

    console.log('🔍 User authenticated:', user.id);

    // Verify admin role using SERVICE_ROLE client (bypasses RLS)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('🔍 Profile query result:', {
      found: !!profile,
      role: profile?.role,
      error: profileError?.message || null,
    });

    // For development: allow any authenticated user if no profile exists or role is not set
    const isDevelopment = process.env.NODE_ENV === 'development';
    const hasAdminAccess =
      profile?.role === 'admin' || (isDevelopment && (profileError || !profile?.role));

    if (!hasAdminAccess) {
      console.log('Access denied:', {
        profileError,
        userRole: profile?.role,
        isDevelopment,
        userId: user.id,
      });

      return res.status(403).json({
        success: false,
        error: `Admin access required. Current role: ${profile?.role || 'none'}. Development mode: ${isDevelopment}`,
      });
    }

    console.log('✅ Admin access granted:', {
      userRole: profile?.role || 'development-fallback',
      userId: user.id,
    });

    // 3. COMPREHENSIVE DATABASE DEBUGGING
    console.log('🔍 === DATABASE DEBUG START ===');
    console.log('🔍 Supabase client status:', !!supabase);
    console.log('🔍 Searching for case with ID:', caseId);

    // First, test basic database connection
    try {
      const { data: _testQuery, error: testError } = await supabase
        .from('foundation_cases')
        .select('count')
        .limit(1);

      console.log('🔍 Database connection test:', {
        success: !testError,
        error: testError?.message || null,
      });
    } catch (dbTestError) {
      console.error('💥 Database connection failed:', dbTestError);
    }

    // Check all available cases first
    const { data: allCases, error: allCasesError } = await supabase
      .from('foundation_cases')
      .select('id, title, cluster, difficulty')
      .order('id');

    console.log('🔍 All cases query:', {
      success: !allCasesError,
      error: allCasesError?.message || null,
      count: allCases?.length || 0,
      cases: allCases?.slice(0, 3) || [],
    });

    // Now try to find the specific case
    const { data: foundationCase, error: caseError } = await supabase
      .from('foundation_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    console.log('🔍 Specific case query result:', {
      searchedId: caseId,
      found: !!foundationCase,
      error: caseError?.message || null,
      caseTitle: foundationCase?.title || 'N/A',
    });

    console.log('🔍 === DATABASE DEBUG END ===');

    if (caseError || !foundationCase) {
      return res.status(404).json({
        success: false,
        error: `Foundation case not found. Searched for ID: ${caseId}. Total cases in DB: ${allCases?.length || 0}. Available IDs: ${
          (allCases as Array<{ id: string }> | undefined)
            ?.map((c: { id: string }) => c.id)
            .slice(0, 5)
            .join(', ') || 'none'
        }. DB Error: ${allCasesError?.message || caseError?.message || 'none'}`,
      });
    }

    // 4. Prepare generation request
    const generationRequest: CaseGenerationRequest = {
      cluster: foundationCase.cluster,
      tool: foundationCase.tool,
      difficulty: foundationCase.difficulty,
      caseType: foundationCase.case_type || 'Foundation Case',
      learningObjectives: foundationCase.learning_objectives || [],
      userDescription: userDescription.trim(),
      estimatedDuration: foundationCase.estimated_duration,
    };

    // 5. Generate case using service
    const caseGenerationService = createCaseGenerationService();
    const generatedCase = await caseGenerationService.generateCase(generationRequest);

    // 6. Update database with generated content
    console.log('🔄 === DATABASE UPDATE DEBUG START ===');
    console.log('🔄 Update data:', {
      caseId,
      descriptionLength: generatedCase.description?.length || 0,
      questionLength: generatedCase.question?.length || 0,
      hasDescription: !!generatedCase.description,
      hasQuestion: !!generatedCase.question,
    });

    const updateData = {
      case_description: generatedCase.description,
      case_question: generatedCase.question,
      updated_at: new Date().toISOString(),
    };

    console.log('🔄 Executing UPDATE query...');
    const { data: updateResult, error: updateError } = await supabase
      .from('foundation_cases')
      .update(updateData)
      .eq('id', caseId)
      .select(); // Add select to see what was updated

    console.log('🔄 UPDATE result:', {
      success: !updateError,
      error: updateError?.message || null,
      errorDetails: updateError?.details || null,
      errorHint: updateError?.hint || null,
      errorCode: updateError?.code || null,
      updatedRows: updateResult?.length || 0,
      updatedData: updateResult?.[0] || null,
    });
    console.log('🔄 === DATABASE UPDATE DEBUG END ===');

    if (updateError) {
      console.error(
        '💥 Database update failed with full error:',
        JSON.stringify(updateError, null, 2),
      );
      return res.status(500).json({
        success: false,
        error: `Failed to save generated case to database: ${updateError.message}. Details: ${updateError.details || 'none'}. Hint: ${updateError.hint || 'none'}`,
      });
    }

    if (!updateResult || updateResult.length === 0) {
      console.error('💥 UPDATE succeeded but no rows were affected');
      return res.status(500).json({
        success: false,
        error: 'UPDATE succeeded but no rows were affected - possible ID mismatch',
      });
    }

    // 7. Return success response
    return res.status(200).json({
      success: true,
      data: {
        description: generatedCase.description,
        question: generatedCase.question,
      },
    });
  } catch (error) {
    console.error('Case generation API error:', error);

    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return res.status(500).json({
      success: false,
      error: `Case generation failed: ${errorMessage}`,
    });
  }
}

// Export configuration for larger payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
