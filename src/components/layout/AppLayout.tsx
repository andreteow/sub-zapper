
import React from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-superhuman-gradient">
      {!isMobile && <Sidebar />}
      <main className="flex-1 relative overflow-x-hidden">
        <div className="container max-w-7xl py-4 px-4 md:px-6 md:py-8">
          {children}
        </div>
        
        {/* Additional decorative elements */}
        <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        <div className="fixed top-[30%] right-0 w-72 h-72 rounded-full bg-superhuman-purple/5 blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-[20%] left-0 w-96 h-96 rounded-full bg-superhuman-dark-purple/10 blur-3xl pointer-events-none"></div>
      </main>
    </div>
  );
};

export default AppLayout;
