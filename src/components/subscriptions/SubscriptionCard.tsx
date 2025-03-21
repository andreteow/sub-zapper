
import React from 'react';
import { ExternalLink, Clock, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types/subscription';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const { toast } = useToast();

  const handleUnsubscribe = () => {
    if (subscription.unsubscribeUrl) {
      window.open(subscription.unsubscribeUrl, '_blank');
      toast({
        title: "Unsubscribe page opened",
        description: `Unsubscribe page for ${subscription.name} opened in a new tab.`,
      });
    } else {
      toast({
        title: "Unsubscribe link not available",
        description: `No direct unsubscribe link is available for ${subscription.name}. Try visiting their website or checking your email for unsubscribe options.`,
        variant: "destructive"
      });
    }
  };

  // Helper to format the renewal date
  const formatRenewalDate = (date: string) => {
    if (!date) return '';
    
    try {
      const renewalDate = new Date(date);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }).format(renewalDate);
    } catch (e) {
      console.error("Error formatting date:", e);
      return date; // Return the original string if parsing fails
    }
  };

  // Format price with currency
  const formatPrice = (price: number | undefined) => {
    if (!price) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price) + '/mo';
  };

  // Determine badge style based on subscription type
  const getBadgeStyles = () => {
    switch (subscription.type) {
      case 'paid':
        return 'bg-paid-light text-paid';
      case 'free':
        return 'bg-free-light text-free';
      case 'newsletter':
        return 'bg-newsletter-light text-newsletter';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="subscription-card">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-medium">{subscription.name}</h3>
          <div className="flex items-center gap-2">
            <Badge className={getBadgeStyles()}>
              {subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)}
            </Badge>
            
            {subscription.price && (
              <span className="text-sm text-muted-foreground">
                {formatPrice(subscription.price)}
              </span>
            )}
          </div>
        </div>
        
        {subscription.logo && (
          <div className="h-10 w-10 overflow-hidden rounded">
            <img 
              src={subscription.logo} 
              alt={`${subscription.name} logo`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
      
      {subscription.renewalDate && (
        <div className="mb-3 flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          Renews {formatRenewalDate(subscription.renewalDate)}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={handleUnsubscribe}>
                <Trash className="mr-1 h-3 w-3" />
                Unsubscribe
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cancel this subscription</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {subscription.managementUrl && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => window.open(subscription.managementUrl, '_blank')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Manage
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open management page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
