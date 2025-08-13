// =====================================================
// API ENDPOINT: UPDATE CASE CONTENT (MANUAL EDITING)
// =====================================================
// Purpose: Save manually edited case description and question

import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '@supabaseClient';

interface ApiRequest extends NextApiRequest {
  body: {
    caseId: string;
    title?: string;
    description?: string;
    question?: string;
  };
}

interface ApiResponse {
  success: boolean;
  error?: string;
  data?: {
    description: string;
    question: string;
  };
}

export default async function handler(req: ApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { caseId, title, description, question } = req.body;

    // Validate input
    if (!caseId || (!title && !description && !question)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: caseId and at least one of title/description/question',
      });
    }

    // Get Supabase client with SERVICE ROLE for API operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('💥 Missing Supabase environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Missing Supabase credentials',
      });
    }

    // Create Supabase client with SERVICE ROLE key for API operations
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify user authentication (but use service role for DB operations)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const userSupabase = getSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await userSupabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication token',
      });
    }

    console.log('🔄 === MANUAL UPDATE DEBUG START ===');
    console.log('🔄 Update request:', {
      caseId,
      titleLength: title?.length || 0,
      descriptionLength: description?.length || 0,
      questionLength: question?.length || 0,
      userId: user.id,
    });

    // Update the case content
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) {
      updateData.title = title;
    }
    if (description !== undefined) {
      updateData.case_description = description;
    }
    if (question !== undefined) {
      updateData.case_question = question;
    }

    const { data: updateResult, error: updateError } = await supabase
      .from('foundation_cases')
      .update(updateData)
      .eq('id', caseId)
      .select();

    console.log('🔄 Manual update result:', {
      success: !updateError,
      error: updateError?.message || null,
      updatedRows: updateResult?.length || 0,
    });
    console.log('🔄 === MANUAL UPDATE DEBUG END ===');

    if (updateError) {
      console.error('💥 Manual update failed:', updateError);
      return res.status(500).json({
        success: false,
        error: `Failed to update case: ${updateError.message}`,
      });
    }

    if (!updateResult || updateResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Case not found or no changes made',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        description: updateResult[0].case_description,
        question: updateResult[0].case_question,
      },
    });
  } catch (error) {
    console.error('💥 Unexpected error in update-case-content:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
