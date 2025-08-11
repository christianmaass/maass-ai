import React from 'react';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="navaa-page">
      <Header />
      <main className="navaa-container py-6">{children}</main>
    </div>
  );
}
