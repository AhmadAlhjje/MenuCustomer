import React from 'react';
import { Header } from '../organisms/Header';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, showHeader = true }) => {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
