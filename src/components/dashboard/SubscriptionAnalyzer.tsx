import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Subscription } from '@/types/subscription';

interface SubscriptionAnalyzerProps {
  emails: any[];
  onSubscriptionsDetected: (subscriptions: Subscription[]) => void;
}

const SubscriptionAnalyzer: React.FC<SubscriptionAnalyzerProps> = ({ 
  emails, 
  onSubscriptionsDetected 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedCount, setDetectedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<string | null>(
    localStorage.getItem('last_email_analysis_timestamp')
  );
  const { toast } = useToast();

  // On component mount, check if we have stored subscriptions
  useEffect(() => {
    try {
      const storedSubscriptions = localStorage.getItem('detected_subscriptions');
      if (storedSubscriptions) {
        const parsedSubscriptions = JSON.parse(storedSubscriptions);
        if (Array.isArray(parsedSubscriptions)) {
          setDetectedCount(parsedSubscriptions.length);
        }
      }
    } catch (error) {
      console.error('Error reading stored subscriptions:', error);
    }
  }, []);

  const analyzeEmails = async () => {
    if (emails.length === 0) {
      toast({
        title: "No emails to analyze",
        description: "Connect your Gmail account and fetch emails first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setProgress(0);
      setError(null);
      
      toast({
        title: "Analysis Started",
        description: `Analyzing ${emails.length} emails for subscriptions...`,
      });

      // Simulate progress incrementally while waiting for edge function
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 1000);

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-emails', {
        body: { emails }
      });

      clearInterval(progressInterval);

      if (error) {
        console.error('Edge function error:', error);
        setError(`Analysis failed: ${error.message}`);
        throw new Error(`Analysis error: ${error.message}`);
      }

      if (!data || !data.subscriptions) {
        setError('Invalid response from analysis service');
        throw new Error('Invalid response from analysis service');
      }

      console.log("Analysis complete. Raw response:", data);

      // Set final states
      setProgress(100);
      setDetectedCount(data.subscriptions.length);

      // Store analysis timestamp
      const timestamp = new Date().toISOString();
      localStorage.setItem('last_email_analysis_timestamp', timestamp);
      setLastAnalyzedAt(timestamp);
      
      // Store the detected subscriptions
      if (Array.isArray(data.subscriptions)) {
        localStorage.setItem('detected_subscriptions', JSON.stringify(data.subscriptions));
        
        // Pass the detected subscriptions to parent
        onSubscriptionsDetected(data.subscriptions);
        
        // Also dispatch a global event
        const event = new CustomEvent('subscriptions_detected', { detail: data.subscriptions });
        window.dispatchEvent(event);
      }
      
      toast({
        title: "Analysis Complete",
        description: `Found ${data.subscriptions.length} subscriptions in your emails.`,
      });

      // Log to console for debugging
      console.log("Detected subscriptions:", data.subscriptions);
    } catch (error: any) {
      console.error('Error analyzing emails:', error);
      setError(error.message || 'Analysis failed');
      setProgress(0);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatLastAnalyzed = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          AI Subscription Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">
                Analyzing emails...
              </span>
              <span className="text-sm font-medium">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              This may take a minute or two depending on the number of emails.
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-2 py-6">
            <AlertCircle className="h-16 w-16 text-red-500 mb-2" />
            <h3 className="text-xl font-bold text-red-500">Analysis Failed</h3>
            <p className="text-center text-muted-foreground">
              {error}
            </p>
            <p className="text-sm text-center text-muted-foreground">
              Please try again or check the console for more details.
            </p>
          </div>
        ) : detectedCount > 0 ? (
          <div className="flex flex-col items-center space-y-2 py-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
            <h3 className="text-2xl font-bold">{detectedCount} Subscriptions Found</h3>
            <p className="text-center text-muted-foreground">
              We've detected {detectedCount} subscriptions in your emails.
            </p>
            {lastAnalyzedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Last analyzed: {formatLastAnalyzed(lastAnalyzedAt)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="mb-2 h-12 w-12 text-muted-foreground/70" />
            <h3 className="text-lg font-medium mb-1">Detect Subscriptions</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Our AI will analyze your emails to find subscriptions and categorize them.
              This helps you discover all the services you're subscribed to.
            </p>
            
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Paid Subscriptions
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Free Accounts
              </Badge>
              <Badge variant="outline" className="bg-pink-50 text-pink-700">
                Newsletters
              </Badge>
            </div>
            
            {lastAnalyzedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Last analyzed: {formatLastAnalyzed(lastAnalyzedAt)}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button 
          onClick={analyzeEmails}
          disabled={isAnalyzing || emails.length === 0}
          className="w-full sm:w-auto"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : error ? (
            "Try Again"
          ) : detectedCount > 0 ? (
            "Analyze Again"
          ) : (
            "Start Analysis"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionAnalyzer;
