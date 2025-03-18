
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SubscriptionDetector from './SubscriptionDetector';
import { Subscription } from '@/types/subscription';

interface EmailHeader {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  labelIds: string[];
}

const EmailList = () => {
  const [emails, setEmails] = useState<EmailHeader[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedSubscriptions, setDetectedSubscriptions] = useState<Subscription[]>([]);
  const { toast } = useToast();

  const fetchEmails = async (isManualRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if Gmail is connected
      const isGmailConnected = localStorage.getItem('gmail_connected') === 'true';
      
      if (!isGmailConnected) {
        setError('Gmail is not connected. Connect Gmail to view emails.');
        setIsLoading(false);
        return;
      }
      
      // Check if we should fetch based on time since last fetch
      if (!isManualRefresh) {
        const lastFetchTime = localStorage.getItem('last_email_fetch_time');
        if (lastFetchTime) {
          const lastFetch = new Date(lastFetchTime);
          const now = new Date();
          // Calculate hours since last fetch
          const hoursSinceLastFetch = (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60);
          
          // Don't fetch if it's been less than 24 hours, unless it's manual refresh
          if (hoursSinceLastFetch < 24) {
            console.log(`Skipping email fetch - last fetch was ${hoursSinceLastFetch.toFixed(1)} hours ago`);
            setIsLoading(false);
            
            // Try to load emails from cache
            const cachedEmails = JSON.parse(localStorage.getItem('cached_emails') || '[]');
            if (cachedEmails.length > 0) {
              setEmails(cachedEmails);
            }
            return;
          }
        }
      }
      
      // Get access and refresh tokens from localStorage
      const tokens = JSON.parse(localStorage.getItem('gmail_tokens') || '{}');
      
      if (!tokens.access_token) {
        setError('No access token found. Please reconnect your Gmail account.');
        setIsLoading(false);
        return;
      }
      
      // Get the current redirect URI to ensure it matches
      const redirectUri = window.location.origin + '/auth/callback';
      
      // Call the edge function to fetch emails, increase to 100 emails
      const { data, error } = await supabase.functions.invoke('fetch-gmail', {
        body: { 
          authorization: { tokens },
          redirectUri,
          maxResults: 100 // Request 100 emails
        }
      });
      
      if (error) {
        console.error('Error fetching emails:', error);
        setError(`Failed to fetch emails: ${error.message}`);
        toast({
          title: 'Error',
          description: `Failed to fetch emails: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        setEmails(data.emails || []);
        
        // Cache the fetched emails
        localStorage.setItem('cached_emails', JSON.stringify(data.emails || []));
        
        // Update the last fetch time
        localStorage.setItem('last_email_fetch_time', new Date().toISOString());
        
        // Update tokens if they were refreshed
        if (data.tokens) {
          localStorage.setItem('gmail_tokens', JSON.stringify(data.tokens));
        }
      }
    } catch (err: any) {
      console.error('Error in fetchEmails:', err);
      setError(`An unexpected error occurred: ${err.message}`);
      toast({
        title: 'Error',
        description: `An unexpected error occurred: ${err.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if it's time for the scheduled 8am fetch
  const checkScheduledFetch = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Get the last check date (YYYY-MM-DD)
    const lastCheckDate = localStorage.getItem('last_daily_check_date');
    const todayDate = now.toISOString().split('T')[0];
    
    // If it's 8am (or later) and we haven't checked today, fetch emails
    if (currentHour >= 8 && lastCheckDate !== todayDate) {
      console.log('Running scheduled 8am email fetch');
      localStorage.setItem('last_daily_check_date', todayDate);
      fetchEmails();
    }
  };

  useEffect(() => {
    // Check for scheduled fetch on component mount
    checkScheduledFetch();
    
    // Also set up an interval to check every hour
    // This ensures the 8am check happens even if the user 
    // has the app open but doesn't refresh the page
    const intervalId = setInterval(checkScheduledFetch, 60 * 60 * 1000); // Every hour
    
    // Try to load cached emails immediately while waiting for fetch
    const cachedEmails = JSON.parse(localStorage.getItem('cached_emails') || '[]');
    if (cachedEmails.length > 0) {
      setEmails(cachedEmails);
    } else {
      // If no cached emails, do initial fetch
      fetchEmails();
    }
    
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const formatSender = (from: string) => {
    // Extract name and email from format "Name <email@example.com>"
    const match = from.match(/^([^<]+)?<?([^>]+)?>?$/);
    if (match) {
      const name = match[1]?.trim() || '';
      const email = match[2]?.trim() || from;
      return name || email;
    }
    return from;
  };

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
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="mb-2 h-10 w-10 text-yellow-500" />
              <p className="mb-2 text-lg font-semibold">{error}</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                {error.includes('not connected') 
                  ? 'Connect your Gmail account to scan for subscription emails.' 
                  : 'Please try refreshing or reconnecting your Gmail account.'}
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Mail className="mb-2 h-10 w-10 text-muted-foreground/50" />
              <p className="text-muted-foreground">No emails found</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead className="w-[50%]">Subject</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell className="font-medium">{formatSender(email.from)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{email.subject}</div>
                          <div className="text-sm text-muted-foreground">{email.snippet}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatDate(email.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
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
