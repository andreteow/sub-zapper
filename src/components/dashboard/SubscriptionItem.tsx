
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Subscription } from '@/types/subscription';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink } from 'lucide-react';

interface SubscriptionItemProps {
  subscription: Subscription;
}

const SubscriptionItem = ({ subscription }: SubscriptionItemProps) => {
  const { toast } = useToast();

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'paid':
        return 'bg-blue-50 text-blue-500 hover:bg-blue-100';
      case 'free':
        return 'bg-green-50 text-green-500 hover:bg-green-100';
      case 'newsletter':
        return 'bg-pink-50 text-pink-500 hover:bg-pink-100';
      default:
        return 'bg-gray-50 text-gray-500 hover:bg-gray-100';
    }
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  const formatRenewalDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    const renewalDate = new Date(dateString);
    if (isNaN(renewalDate.getTime())) return dateString;
    
    const now = new Date();
    
    // Use getTime() to convert dates to numbers for arithmetic operations
    const diffTime = Math.abs(renewalDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `${renewalDate.toLocaleString('default', { month: 'short' })} ${renewalDate.getDate()}`;
    }
  };

  const handleUnsubscribe = () => {
    if (subscription.unsubscribeUrl) {
      window.open(subscription.unsubscribeUrl, '_blank');
    } else {
      toast({
        title: "Unsubscribe link not available",
        description: `No direct unsubscribe link is available for ${subscription.name}. Try visiting their website or checking your email for unsubscribe options.`,
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price) + '/mo';
  };

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        {subscription.logo && (
          <div className="h-10 w-10 overflow-hidden rounded">
            <img 
              src={subscription.logo} 
              alt={`${subscription.name} logo`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{subscription.name}</h3>
            <Badge className={getBadgeClass(subscription.type)}>
              {subscription.type === 'newsletter' ? 'Newsletter' : subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Added {formatDate(subscription.detectedDate || subscription.renewalDate)}</span>
            {subscription.email && <span>{subscription.email}</span>}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {subscription.type === 'newsletter' ? (
          <Button variant="outline" size="sm" className="h-8 text-xs border-pink-200 text-pink-500 hover:bg-pink-50" onClick={handleUnsubscribe}>
            Unsubscribe
          </Button>
        ) : subscription.type === 'paid' ? (
          <div className="flex flex-col items-end">
            {subscription.price ? (
              <span className="font-medium text-blue-500">{formatPrice(subscription.price)}</span>
            ) : (
              <span className="font-medium text-blue-500">Paid</span>
            )}
            {subscription.renewalDate && (
              <span className="text-xs text-muted-foreground">
                Renews {formatRenewalDate(subscription.renewalDate)}
              </span>
            )}
          </div>
        ) : (
          <Button variant="outline" size="sm" className="h-8 text-xs border-green-200 text-green-500 hover:bg-green-50" onClick={handleUnsubscribe}>
            Unsubscribe
          </Button>
        )}
        
        {subscription.type === 'paid' && (
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleUnsubscribe}>
            Cancel
          </Button>
        )}
        
        {subscription.managementUrl && (
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => window.open(subscription.managementUrl, '_blank')}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionItem;
