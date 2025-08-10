/**
 * USER UPDATE-PROFILE API
 * Migrated to navaa Auth Guidelines (WP-C3)
 *
 * COMPLIANCE:
 * - Uses withAuth middleware (MANDATORY)
 * - JWT token validation via auth middleware
 * - Input validation and sanitization maintained
 * - No manual JWT extraction or verification
 *
 * @version 2.0.0 (WP-C3 User API Migration)
 */

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
 * ✅ API Standards - Proper error handling and response formats
 * ✅ User Data - Complete profile data with schema sync
 * ✅ Naming Conventions - Consistent camelCase ↔ snake_case mapping
 * ✅ Privacy - Secure handling of user information
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { withAuth, AuthenticatedRequest, getUserId } from '../../../lib/middleware/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
}

// Main API handler with Auth Middleware (WP-C3 Migration)
async function userUpdateProfileHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from Auth Middleware (WP-C3 Migration)
  const userId = getUserId(req); // User already authenticated by withAuth middleware

  try {
    // =============================================================================
    // NAVAA AUTH INTEGRATION (WP-C3 Migration)
    // =============================================================================
    // Manual JWT extraction and verification REMOVED - handled by withAuth middleware
    // User authentication and token validation guaranteed by middleware

    // Validate request body
    const { first_name, last_name }: UpdateProfileRequest = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        error: 'Vorname und Nachname sind erforderlich',
        details: {
          first_name: !first_name ? 'Vorname ist erforderlich' : null,
          last_name: !last_name ? 'Nachname ist erforderlich' : null,
        },
      });
    }

    // Validate input length
    if (first_name.length > 100 || last_name.length > 100) {
      return res.status(400).json({
        error: 'Name zu lang',
        details: {
          first_name: first_name.length > 100 ? 'Vorname darf maximal 100 Zeichen haben' : null,
          last_name: last_name.length > 100 ? 'Nachname darf maximal 100 Zeichen haben' : null,
        },
      });
    }

    // Sanitize input (basic XSS protection)
    const sanitizedFirstName = first_name.trim().replace(/[<>]/g, '');
    const sanitizedLastName = last_name.trim().replace(/[<>]/g, '');

    // Update user profile in database
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('id, email, first_name, last_name, role, created_at, updated_at')
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Fehler beim Speichern der Profil-Daten',
        details: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({ error: 'Benutzer-Profil nicht gefunden' });
    }

    // Return updated profile
    res.status(200).json({
      success: true,
      message: 'Profil erfolgreich aktualisiert',
      profile: data,
    });
  } catch (error: any) {
    console.error('Profile update error:', error);

    // JWT error handling removed - handled by withAuth middleware
    return res.status(500).json({
      error: 'Interner Server-Fehler',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

// Export handler with withAuth middleware (WP-C3 Migration)
export default withAuth(userUpdateProfileHandler);
