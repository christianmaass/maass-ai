import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import '../globals.css';
import { requireAuth } from '@/lib/auth/guards';
import { AppHeader } from '@/shared/ui/components/app-header';
import { MarketingFooter } from '@/shared/ui/components/marketing-footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

// No-Store: App-Seiten sind dynamisch und werden nicht gecacht
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireAuth();
  return (
    <div className={`bg-navaa-warm-beige min-h-screen ${poppins.variable} font-sans`}>
      <AppHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}

