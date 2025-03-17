
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
          console.error('Google OAuth error from URL:', error);
          throw new Error(`Authentication denied or canceled: ${error}`);
        }
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        console.log('Received authorization code, calling edge function');
        
        // Get the current redirect URI to ensure it matches what was sent to Google
        const redirectUri = window.location.origin + '/auth/callback';
        console.log('Using redirect URI:', redirectUri);

        // Call our edge function to exchange the code for tokens
        // Make sure we include the anon key in the Authorization header
        const response = await supabase.functions.invoke('fetch-gmail', {
          body: { 
            authorization: { code },
            redirectUri,
            debug: true // Add debug flag to get more verbose responses
          }
        });

        if (response.error) {
          console.error('Edge function error:', response.error);
          console.error('Error details:', response.error);
          // Include full error details in message
          throw new Error(response.error.message || 'Failed to connect Gmail account');
        }

        const { data } = response;
        console.log('Token exchange successful');

        // Store the tokens securely in localStorage
        if (data && data.tokens) {
          localStorage.setItem('gmail_tokens', JSON.stringify(data.tokens));
          // Mark Gmail as connected
          localStorage.setItem('gmail_connected', 'true');
          
          setStatus('success');
          toast({
            title: "Gmail Connected",
            description: "Your Gmail account has been successfully connected.",
          });
          
          // Redirect back to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          throw new Error('No tokens received from server');
        }
        
      } catch (error: any) {
        console.error('Auth callback error:', error);
        const errorMsg = error.message || 'Unknown error';
        setStatus('error');
        setErrorDetails(errorMsg);
        
        toast({
          title: "Connection Failed",
          description: "Could not connect your Gmail account. Please try again.",
          variant: "destructive",
        });
        
        // Redirect back to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="text-center max-w-md">
        {status === 'loading' && (
          <>
            <div className="mb-4 text-2xl font-semibold">Connecting to Gmail...</div>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">This may take a few moments</p>
          </>
        )}
        
        {status === 'success' && (
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="text-2xl font-semibold text-green-600">
              Gmail Connected!
            </AlertTitle>
            <AlertDescription className="text-green-600">
              Redirecting you back to the dashboard...
            </AlertDescription>
          </Alert>
        )}
        
        {status === 'error' && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTitle className="text-2xl font-semibold text-red-600">
              Connection Failed
            </AlertTitle>
            <AlertDescription className="text-red-600">
              <p>There was a problem connecting your Gmail account.</p>
              {errorDetails && (
                <p className="mt-2 text-sm font-mono bg-red-100 p-2 rounded-md overflow-auto max-h-48">{errorDetails}</p>
              )}
              <p className="mt-2">Redirecting you back to the dashboard...</p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
