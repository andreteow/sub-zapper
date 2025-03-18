
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SubscriptionDetector from './SubscriptionDetector';
import { Subscription } from '@/types/subscription';
import { useEmailFetch } from '@/hooks/useEmailFetch';
import EmailTable from './EmailTable';
import EmailStatus from './EmailStatus';

const EmailList = () => {
  const { emails, isLoading, error, fetchEmails } = useEmailFetch();
  const [detectedSubscriptions, setDetectedSubscriptions] = React.useState<Subscription[]>([]);
  const { toast } = useToast();

  const handleRefresh = () => {
    fetchEmails(true); // true indicates manual refresh
    toast({
      title: 'Refreshing',
      description: 'Fetching the latest emails from your Gmail account',
    });
  };

  const handleSubscriptionsDetected = (subscriptions: Subscription[]) => {
    setDetectedSubscriptions(subscriptions);
    
    // Store detected subscriptions in localStorage for other components to use
    localStorage.setItem('detected_subscriptions', JSON.stringify(subscriptions));
    
    // Fire a custom event to notify other components
    const event = new CustomEvent('subscriptions_detected', { detail: subscriptions });
    window.dispatchEvent(event);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">
            <div className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              Recent Emails
            </div>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <EmailStatus isLoading={isLoading} error={error} emailCount={emails.length} />
          {!isLoading && !error && emails.length > 0 && <EmailTable emails={emails} />}
        </CardContent>
      </Card>
      
      <SubscriptionDetector 
        emails={emails} 
        onSubscriptionsDetected={handleSubscriptionsDetected} 
      />
    </div>
  );
};

export default EmailList;
