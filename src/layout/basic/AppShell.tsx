import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface AppShellProps {
  children: React.ReactNode;
  headerVariant?: 'marketing' | 'app';
}

export default function AppShell({ children, headerVariant = 'marketing' }: AppShellProps) {
  return (
    <div className="navaa-page navaa-bg-primary min-h-screen flex flex-col">
      <Header variant={headerVariant} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
