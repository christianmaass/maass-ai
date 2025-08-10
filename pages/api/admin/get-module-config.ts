// =====================================================
// GET MODULE CONFIGURATION API ENDPOINT
// SOLID: Single Responsibility - Only handles module configuration retrieval
// =====================================================

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import {
  CaseModuleConfiguration,
  createDefaultConfiguration,
} from '../../../types/module-configuration.types';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * API Handler for retrieving module configuration
 * SOLID: Single Responsibility - Only handles configuration retrieval
 * SOLID: Dependency Inversion - Uses Supabase abstraction
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    // Extract case ID from query parameters
    const { caseId } = req.query;

    if (!caseId || typeof caseId !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid caseId parameter',
        details: 'caseId must be provided as a string query parameter',
      });
    }

    // Retrieve module configuration from database
    const { data: caseData, error: fetchError } = await supabase
      .from('foundation_cases')
      .select('step_modules')
      .eq('id', caseId)
      .single();

    if (fetchError) {
      console.error('Database error retrieving module configuration:', fetchError);
      return res.status(500).json({
        error: 'Failed to retrieve module configuration',
        details: fetchError.message,
      });
    }

    if (!caseData) {
      return res.status(404).json({
        error: 'Case not found',
        details: `No case found with ID: ${caseId}`,
      });
    }

    // Parse module configuration or use default
    let configuration: CaseModuleConfiguration;

    if (caseData.step_modules && typeof caseData.step_modules === 'object') {
      try {
        configuration = caseData.step_modules as CaseModuleConfiguration;
      } catch (parseError) {
        console.warn('Invalid module configuration format, using default:', parseError);
        configuration = createDefaultConfiguration();
      }
    } else {
      // No configuration exists, use default
      configuration = createDefaultConfiguration();
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      configuration,
      caseId,
      message: 'Module configuration retrieved successfully',
    });
  } catch (error) {
    console.error('Unexpected error in get-module-config:', error);

    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false,
    });
  }
}

/**
 * API Response Types for TypeScript
 */
export interface GetModuleConfigResponse {
  success: boolean;
  configuration?: CaseModuleConfiguration;
  caseId?: string;
  message?: string;
  error?: string;
  details?: string;
}
