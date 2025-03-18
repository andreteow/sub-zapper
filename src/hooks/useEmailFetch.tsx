
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

export const useEmailFetch = () => {
  const [emails, setEmails] = useState<EmailHeader[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  return {
    emails,
    isLoading,
    error,
    fetchEmails,
  };
};
