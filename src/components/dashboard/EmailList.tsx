
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
  const { toast } = useToast();

  const fetchEmails = async () => {
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
      
      // Get access and refresh tokens from localStorage
      const tokens = JSON.parse(localStorage.getItem('gmail_tokens') || '{}');
      
      if (!tokens.access_token) {
        setError('No access token found. Please reconnect your Gmail account.');
        setIsLoading(false);
        return;
      }
      
      // Get the current redirect URI to ensure it matches
      const redirectUri = window.location.origin + '/auth/callback';
      
      // Call the edge function to fetch emails
      const { data, error } = await supabase.functions.invoke('fetch-gmail', {
        body: { 
          authorization: { tokens },
          redirectUri
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

  useEffect(() => {
    fetchEmails();
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
    fetchEmails();
    toast({
      title: 'Refreshing',
      description: 'Fetching the latest emails from your Gmail account',
    });
  };

  return (
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
  );
};

export default EmailList;
