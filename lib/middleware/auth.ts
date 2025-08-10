/**
 * AUTH MIDDLEWARE
 * navaa Auth Guidelines Compliant Middleware (WP-C1)
 *
 * COMPLIANCE:
 * - JWT token validation and extraction
 * - Role-based access control (RBAC)
 * - Production-ready error handling
 * - Consistent auth patterns for all API routes
 *
 * @version 1.0.0 (WP-C1 Backend Migration)
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
 * ✅ Auth Middleware - Centralized authentication logic
 * ✅ JWT Validation - Proper token verification and user extraction
 * ✅ Error Handling - Secure error responses without data leakage
 * ✅ API Protection - Mandatory auth for protected endpoints
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient } from '../../supabaseClient';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
    role?: string;
    [key: string]: any;
  };
}

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse,
) => Promise<void> | void;

export type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

// =============================================================================
// JWT TOKEN EXTRACTION AND VALIDATION
// =============================================================================

/**
 * Extract and validate JWT token from Authorization header
 * Per navaa Guidelines: All API calls must use JWT tokens
 */
export async function extractUserFromRequest(req: NextApiRequest): Promise<{
  user: any;
  error?: string;
}> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return {
        user: null,
        error: 'Missing or invalid Authorization header',
      };
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return {
        user: null,
        error: 'No JWT token provided',
      };
    }

    // Validate JWT token with Supabase (navaa Guidelines compliant)
    const supabase = getSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('JWT token validation failed:', error);
      return {
        user: null,
        error: 'Invalid or expired JWT token',
      };
    }

    return { user };
  } catch (error) {
    console.error('Error extracting user from request:', error);
    return {
      user: null,
      error: 'Authentication error',
    };
  }
}

// =============================================================================
// AUTH MIDDLEWARE WRAPPER
// =============================================================================

/**
 * Main authentication middleware wrapper
 * Validates JWT token and attaches user to request
 */
export function withAuth(handler: AuthenticatedHandler): ApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Extract and validate user from JWT token
      const { user, error } = await extractUserFromRequest(req);

      if (error || !user) {
        console.error('Authentication failed:', error);
        return res.status(401).json({
          error: 'Unauthorized',
          message: error || 'Authentication required',
          code: 'AUTH_REQUIRED',
        });
      }

      // Attach user to request object
      (req as AuthenticatedRequest).user = user;

      // Call the protected handler
      return await handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authentication middleware failed',
        code: 'AUTH_MIDDLEWARE_ERROR',
      });
    }
  };
}

// =============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// =============================================================================

/**
 * Role-based access control middleware
 * Requires specific role for API access
 * Fetches user role from database (not JWT token)
 */
export function requireRole(requiredRole: string) {
  return function (handler: AuthenticatedHandler): ApiHandler {
    return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const user = req.user;

        // Fetch user role from database (navaa Guidelines: use same source as user-tariff API)
        const supabase = getSupabaseClient();
        const { data: userProfile, error: profileError } = await supabase
          .from('user_tariff_info')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileError || !userProfile) {
          console.error(`Profile fetch failed for user ${user.id}:`, profileError);
          return res.status(403).json({
            error: 'Forbidden',
            message: 'User profile not found or access denied',
            code: 'PROFILE_NOT_FOUND',
          });
        }

        // Check if user has required role
        const userRole = userProfile.role;
        if (!userRole || userRole !== requiredRole) {
          console.error(
            `Access denied: User ${user.id} has role '${userRole}', required '${requiredRole}'`,
          );
          return res.status(403).json({
            error: 'Forbidden',
            message: `Access denied. Required role: ${requiredRole}`,
            code: 'INSUFFICIENT_PERMISSIONS',
          });
        }

        console.log(`✅ RBAC Success: User ${user.id} has required role '${requiredRole}'`);

        // User has required role, proceed with handler
        return await handler(req, res);
      } catch (error) {
        console.error('Role check error:', error);
        return res.status(500).json({
          error: 'Internal Server Error',
          message: 'Role validation failed',
          code: 'ROLE_CHECK_ERROR',
        });
      }
    });
  };
}

/**
 * Admin-only access control
 * Convenience wrapper for admin role requirement
 */
export function requireAdmin(handler: AuthenticatedHandler): ApiHandler {
  return requireRole('admin')(handler);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if user has specific role
 */
export function hasRole(user: any, role: string): boolean {
  return user?.role === role;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: any): boolean {
  return hasRole(user, 'admin');
}

/**
 * Get user ID from authenticated request
 */
export function getUserId(req: AuthenticatedRequest): string {
  return req.user.id;
}

/**
 * Get user email from authenticated request
 */
export function getUserEmail(req: AuthenticatedRequest): string {
  return req.user.email;
}
