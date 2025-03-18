
import React from 'react';
import { AlertCircle, Mail, RefreshCw } from 'lucide-react';

interface EmailStatusProps {
  isLoading: boolean;
  error: string | null;
  emailCount: number;
}

const EmailStatus: React.FC<EmailStatusProps> = ({ isLoading, error, emailCount }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="mb-2 h-10 w-10 text-yellow-500" />
        <p className="mb-2 text-lg font-semibold">{error}</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          {error.includes('not connected') 
            ? 'Connect your Gmail account to scan for subscription emails.' 
            : 'Please try refreshing or reconnecting your Gmail account.'}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (emailCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Mail className="mb-2 h-10 w-10 text-muted-foreground/50" />
        <p className="text-muted-foreground">No emails found</p>
      </div>
    );
  }

  return null;
};

export default EmailStatus;
