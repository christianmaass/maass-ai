import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

interface MarketingLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function MarketingLayout({ title, description, children }: MarketingLayoutProps) {
  const pageTitle = title ? `${title} | navaa` : 'navaa';
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Header variant="marketing" />
      <main className="min-h-screen bg-[#f6f4f0]">
        <div className="max-w-7xl mx-auto px-6 py-12">{children}</div>
      </main>
      <Footer />
    </>
  );
}
