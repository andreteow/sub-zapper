
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useGoogleAuth } from '@/utils/googleAuth';

const ConnectEmailCard = () => {
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const { toast } = useToast();
  const { connectGmail } = useGoogleAuth();

  useEffect(() => {
    // Check if Gmail is connected from localStorage
    const gmailConnected = localStorage.getItem('gmail_connected') === 'true';
    setIsGmailConnected(gmailConnected);
  }, []);

  const handleConnect = () => {
    if (isGmailConnected) {
      toast({
        title: "Gmail Already Connected",
        description: "Your Gmail account is already connected.",
      });
    } else {
      connectGmail();
    }
  };

  return (
    <Card className={`border-dashed ${isGmailConnected ? "border-green-500" : ""}`}>
      <CardHeader>
        <CardTitle className="text-center">
          {isGmailConnected ? "Email Connected" : "Connect Your Email"}
        </CardTitle>
        <CardDescription className="text-center">
          {isGmailConnected 
            ? "Your Gmail account is connected and ready to scan" 
            : "Connect your email to scan for subscriptions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isGmailConnected ? "bg-green-500/10" : "bg-primary/10"}`}>
          {isGmailConnected ? (
            <Check className="h-8 w-8 text-green-500" />
          ) : (
            <Mail className="h-8 w-8 text-primary" />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleConnect} 
          className={`group ${isGmailConnected ? "bg-green-500 hover:bg-green-600" : ""}`}
          disabled={isGmailConnected}
        >
          <span>{isGmailConnected ? "Gmail Connected" : "Connect Gmail"}</span>
          {!isGmailConnected && (
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectEmailCard;
