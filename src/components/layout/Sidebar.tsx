
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { 
  Home, 
  Calendar, 
  CreditCard, 
  Mail, 
  Settings, 
  Zap, 
  Plus,
  Check,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleAuth } from '@/utils/googleAuth';

const Sidebar = () => {
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const { connectGmail } = useGoogleAuth();

  useEffect(() => {
    // Check if Gmail is connected from localStorage
    const gmailConnected = localStorage.getItem('gmail_connected') === 'true';
    setIsGmailConnected(gmailConnected);
  }, []);

  const handleConnectGmail = () => {
    if (!isGmailConnected) {
      connectGmail();
    }
  };

  return (
    <div className="sticky top-0 h-screen w-64 border-r bg-sidebar p-4">
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">Sub-Zapper</h1>
        </div>

        <Button 
          variant={isGmailConnected ? "outline" : "default"} 
          className="mb-6 w-full justify-start gap-2"
          onClick={handleConnectGmail}
        >
          {isGmailConnected ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span>Gmail Connected</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Connect Gmail</span>
            </>
          )}
        </Button>

        <nav className="flex-1 space-y-1">
          <NavItem to="/dashboard" icon={<Home className="h-5 w-5" />} label="Dashboard" />
          <NavItem to="/subscriptions" icon={<CreditCard className="h-5 w-5" />} label="Subscriptions" />
          <NavItem to="/newsletters" icon={<Mail className="h-5 w-5" />} label="Newsletters" />
          <NavItem to="/renewals" icon={<Calendar className="h-5 w-5" />} label="Renewals" />
          <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
        </nav>

        <div className="space-y-4">
          <div className="rounded-lg border border-dashed p-4 text-center">
            <p className="mb-2 text-sm font-medium">Premium Features</p>
            <Button variant="outline" size="sm">
              Upgrade Plan
            </Button>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm font-medium">Account</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

export default Sidebar;
