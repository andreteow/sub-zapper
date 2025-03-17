
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        // In a real app, you would exchange this code for tokens
        // by making a server-side request to Google's token endpoint
        
        // For demo purposes, we're simulating a successful auth
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
        
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
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
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="mb-4 text-2xl font-semibold">Connecting to Gmail...</div>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </>
        )}
        
        {status === 'success' && (
          <div className="text-2xl font-semibold text-green-500">
            Gmail Connected! Redirecting you back...
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-2xl font-semibold text-red-500">
            Connection failed. Redirecting you back...
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
