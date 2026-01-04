import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../globals.css';
import { MarketingHeader } from '@/shared/ui/components/marketing-header';
import { MarketingFooter } from '@/shared/ui/components/marketing-footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Navaa - Decision OS',
  description: 'Make better decisions. Every time.',
};

// ISR: Marketing-Seiten werden alle 1 Stunde neu generiert
export const revalidate = 3600;

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${poppins.variable} min-h-screen flex flex-col`}>
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
