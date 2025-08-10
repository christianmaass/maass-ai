import React from 'react';
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
 * ✅ AuthContext - Mandatory useAuth() hook for all auth operations
 * ✅ Global State - Consistent state management patterns
 * ✅ Error Boundaries - Robust error handling for production
 * ✅ Performance - Optimize bundle size and loading times
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
