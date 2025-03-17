
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Calendar, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleAuth } from '@/utils/googleAuth';
import { useToast } from '@/components/ui/use-toast';

const DashboardSidebar = () => {
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const { connectGmail } = useGoogleAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if Gmail is connected from localStorage
    const gmailConnected = localStorage.getItem('gmail_connected') === 'true';
    setIsGmailConnected(gmailConnected);
  }, []);

  const handleConnectGmail = () => {
    if (isGmailConnected) {
      // Handle disconnection
      localStorage.removeItem('gmail_connected');
      setIsGmailConnected(false);
      toast({
        title: "Gmail Disconnected",
        description: "Your Gmail account has been disconnected.",
      });
    } else {
      // Handle connection
      connectGmail();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Connect Gmail Box */}
      <Card className={isGmailConnected ? "border-green-500" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center">
            <Mail className={`mr-2 h-4 w-4 ${isGmailConnected ? "text-green-500" : "text-blue-500"}`} />
            {isGmailConnected ? "Gmail Connected" : "Connect Gmail"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGmailConnected ? (
            <>
              <div className="flex items-center gap-2 text-green-500">
                <Check className="h-5 w-5" />
                <p className="text-sm font-medium">Connected and ready to scan</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Your Gmail is now connected. We'll scan for subscriptions and help you manage them.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Connect your Gmail to scan for subscriptions</p>
          )}
          
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-500">✓</div>
              <span>Scan your inbox for subscription emails</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-500">✓</div>
              <span>One-click unsubscribe from unwanted emails</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-500">✓</div>
              <span>Track paid subscriptions and get renewal alerts</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-500">✓</div>
              <span>Read-only access. Your data is encrypted.</span>
            </li>
          </ul>
          
          <Button 
            className={`w-full ${isGmailConnected ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
            onClick={handleConnectGmail}
          >
            {isGmailConnected ? "Disconnect Gmail" : "Sign in to Connect Gmail"}
          </Button>
        </CardContent>
      </Card>
      
      {/* Upcoming Renewals (30 days) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-yellow-500" />
            Upcoming Renewals
          </CardTitle>
          <p className="text-xs text-muted-foreground">Subscriptions renewing in the next 30 days</p>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <div className="text-center text-muted-foreground">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
            <p>No upcoming renewals in the next 30 days</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSidebar;
