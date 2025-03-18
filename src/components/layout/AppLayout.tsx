
import React from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen">
      {!isMobile && <Sidebar />}
      <main className="flex-1">
        <div className="container max-w-7xl py-4 px-4 md:px-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
