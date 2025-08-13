// =====================================================
// MODULE CONFIGURATION API ENDPOINT
// SOLID: Single Responsibility - Only handles module configuration persistence
// =====================================================

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import {
  CaseModuleConfiguration,
  validateConfiguration,
} from '@project-types/module-configuration.types';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * API Handler for saving module configuration
 * SOLID: Single Responsibility - Only handles configuration saving
 * SOLID: Dependency Inversion - Uses Supabase abstraction
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication (consistent with other admin APIs)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const userId = authHeader.split(' ')[1];
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user ID in authorization header' });
    }

    // Extract and validate request data
    const { caseId, configuration } = req.body;

    if (!caseId || !configuration) {
      return res.status(400).json({
        error: 'Missing required fields: caseId, configuration',
      });
    }

    // Validate configuration structure
    if (!validateConfiguration(configuration)) {
      return res.status(400).json({
        error: 'Invalid configuration structure',
      });
    }

    console.log(`🎛️ Saving module configuration for case ${caseId}`);

    // Verify that the foundation case exists
    const { data: foundationCase, error: caseError } = await supabase
      .from('foundation_cases')
      .select('id, title')
      .eq('id', caseId)
      .single();

    if (caseError || !foundationCase) {
      return res.status(404).json({ error: 'Foundation case not found' });
    }

    // Update the case with new module configuration
    const { data: updatedCase, error: updateError } = await supabase
      .from('foundation_cases')
      .update({
        step_modules: configuration,
        updated_at: new Date().toISOString(),
      })
      .eq('id', caseId)
      .select('id, title, step_modules, updated_at')
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({
        error: 'Failed to save module configuration',
        details: updateError.message,
      });
    }

    console.log('✅ Module configuration saved successfully');

    // Count total enabled modules for response
    const totalEnabledModules = Object.values(configuration as CaseModuleConfiguration).reduce(
      (total, stepConfig) => {
        return total + Object.values(stepConfig).filter(Boolean).length;
      },
      0,
    );

    return res.status(200).json({
      success: true,
      data: {
        case: updatedCase,
        totalEnabledModules,
        configuration: configuration,
      },
      message: `Modul-Konfiguration für "${foundationCase.title}" erfolgreich gespeichert (${totalEnabledModules} Module aktiv)`,
    });
  } catch (error: any) {
    console.error('💥 Error in save-module-config API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
