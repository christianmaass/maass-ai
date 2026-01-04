'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImpressumOverlay } from './impressum-overlay';
import { PrivacyPolicyOverlay } from './privacy-policy-overlay';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

  return (
    <footer className="bg-navaa-warm-beige text-navaa-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-16 gap-y-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">navaa</h3>
            <p className="text-navaa-gray-600">
              Train judgment, not prompts.
            </p>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/learning-path"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Learning Path
                </Link>
              </li>
              <li>
                <Link
                  href="/thinking-gym"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Thinking Gym
                </Link>
              </li>
              <li>
                <Link
                  href="/daily-drills"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Daily Drills
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/team"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setIsImpressumOpen(true)}
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Legal Notice
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsPrivacyPolicyOpen(true)}
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8">
          <p className="text-center text-navaa-gray-600">
            © {currentYear} navaa. All rights reserved.
          </p>
        </div>
      </div>
      <ImpressumOverlay
        isOpen={isImpressumOpen}
        onClose={() => setIsImpressumOpen(false)}
      />
      <PrivacyPolicyOverlay
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
      />
    </footer>
  );
}
