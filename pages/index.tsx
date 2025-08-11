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
 * ✅ Smart Routing - Central routing logic, no distributed decisions
 * ✅ React Standards - No router in useEffect dependencies
 * ✅ Loading States - Always with timeout and fallback
 * ✅ Error Handling - Structured logging with context
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MainApp from '@layout/basic/MainApp';
import CourseGrid from '../components/courses/CourseGrid';
import DashboardCourseSection from '../components/dashboard/DashboardCourseSection';
import Header from '@layout/basic/Header';
import Footer from '@layout/basic/Footer';
import WelcomeHeroBanner from '@/marketing/sections/WelcomeHeroBanner';
import { useRouter } from 'next/router';

interface UserStatus {
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
  hasActiveEnrollments: boolean;
  shouldRedirectToOnboarding: boolean;
}

export default function Home() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const [checkingUserStatus, setCheckingUserStatus] = useState(true);
  const [checkingNewUser, setCheckingNewUser] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      // Check if user is new (registered in last 5 minutes)
      const userCreated = new Date(user.created_at || user.user_metadata?.created_at || Date.now());
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      setIsNewUser(userCreated > fiveMinutesAgo);
      setCheckingNewUser(false);
    } else if (!authLoading) {
      setCheckingNewUser(false);
    }
  }, [user, authLoading]);

  // Loading state
  if (authLoading || checkingNewUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade navaa.ai...</p>
        </div>
      </div>
    );
  }

  // Smart routing: Dashboard for users, Marketing for guests
  if (user) {
    const firstName =
      profile?.firstName ||
      user.user_metadata?.firstName ||
      user.user_metadata?.first_name ||
      'User';

    return (
      <div className="min-h-screen bg-navaa-bg-primary">
        <Header variant="app" />
        <WelcomeHeroBanner variant="dashboard" firstName={firstName} />
        <div className="container mx-auto px-4 py-8">
          <DashboardCourseSection />
        </div>
        <Footer />
      </div>
    );
  }

  // Marketing page for guests
  return <MainApp />;
}
