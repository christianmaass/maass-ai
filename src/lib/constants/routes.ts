// Route constants for centralized route management
export const PROTECTED_ROUTES = ['/admin', '/dashboard'] as const;
export const AUTH_ROUTES = ['/login', '/register'] as const;

// Type definitions for route safety
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];
export type AuthRoute = (typeof AUTH_ROUTES)[number];
