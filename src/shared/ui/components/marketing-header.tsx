'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../Button';
import { LoginOverlay } from './login-overlay';

export function MarketingHeader() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="bg-navaa-warm-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/images/navaa-logo.png"
                  alt="Navaa Logo"
                  width={80}
                  height={50}
                  priority
                  style={{ width: '80px', height: 'auto' }}
                  className="object-contain mt-2"
                />
              </Link>
            </div>

            {/* Navigation and Login Button grouped together */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-navaa-gray-700 hover:text-navaa-accent transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/#why-navaa"
                className="text-navaa-gray-700 hover:text-navaa-accent transition-colors duration-200"
              >
                Why navaa
              </Link>
              <Link
                href="/#who-this-is-for"
                className="text-navaa-gray-700 hover:text-navaa-accent transition-colors duration-200"
              >
                Who this is for
              </Link>
              <Button
                size="sm"
                className="text-white border-[#42A5F5] bg-[#42A5F5] hover:bg-[#1E88E5] transition-colors"
                onClick={() => setIsLoginOpen(true)}
              >
                Sign in
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-navaa-gray-700 hover:text-navaa-accent focus:outline-none focus:ring-2 focus:ring-navaa-accent"
                aria-label="Menü öffnen"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <LoginOverlay isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
