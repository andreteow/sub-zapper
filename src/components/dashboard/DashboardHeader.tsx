
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Zap, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-8">
      {isMobile && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-superhuman-purple" />
            <span className="text-lg font-semibold text-gradient">Sub-Zapper</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      <h1 className="text-gradient text-3xl font-bold md:text-4xl tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default DashboardHeader;
