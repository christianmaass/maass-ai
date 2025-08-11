import React from 'react';
import Link from 'next/link';
import Header from '@layout/basic/Header';
import Footer from '@layout/basic/Footer';
import ErrorBoundary from '@layout/basic/ErrorBoundary';

export default function Custom404() {
  return (
    <>
      <Header variant="marketing" />
      <ErrorBoundary level="page">
        <div className="navaa-page navaa-bg-primary min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <div className="text-center max-w-md">
            {/* 404 Icon */}
            <div className="mb-8">
              <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
              <div className="w-24 h-1 bg-[#00bfae] mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Seite nicht gefunden</h1>
            <p className="text-lg text-gray-600 mb-8">
              Die angeforderte Seite konnte nicht gefunden werden. Möglicherweise wurde sie
              verschoben oder existiert nicht mehr.
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block w-full px-6 py-3 bg-[#00bfae] text-white rounded-lg font-semibold hover:bg-[#009688] transition-colors"
              >
                Zur Startseite
              </Link>
              <Link
                href="/"
                className="inline-block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Zum Dashboard
              </Link>
            </div>

            {/* Help Text */}
            <p className="text-sm text-gray-500 mt-8">
              Benötigen Sie Hilfe? Kontaktieren Sie unser{' '}
              <Link href="/impressum" className="text-[#00bfae] hover:underline">
                Support-Team
              </Link>
            </p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
      <Footer />
    </>
  );
}
