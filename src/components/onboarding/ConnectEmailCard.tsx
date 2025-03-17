
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ConnectEmailCard = () => {
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Demo Mode",
      description: "In a real app, this would open Gmail OAuth."
    });
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-center">Connect Your Email</CardTitle>
        <CardDescription className="text-center">
          Connect your email to scan for subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleConnect} className="group">
          <span>Connect Gmail</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectEmailCard;
