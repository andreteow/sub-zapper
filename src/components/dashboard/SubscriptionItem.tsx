
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Subscription } from '@/types/subscription';

interface SubscriptionItemProps {
  subscription: Subscription;
}

const SubscriptionItem = ({ subscription }: SubscriptionItemProps) => {
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  const formatRenewalDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    const renewalDate = new Date(dateString);
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
            <span>Added {formatDate(subscription.renewalDate || '2023-05-15')}</span>
            {subscription.email && <span>{subscription.email}</span>}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {subscription.type === 'newsletter' ? (
          <Button variant="outline" size="sm" className="h-8 text-xs border-pink-200 text-pink-500 hover:bg-pink-50">
            Unsubscribe
          </Button>
        ) : subscription.type === 'paid' ? (
          <div className="flex flex-col items-end">
            <span className="font-medium text-blue-500">${subscription.price}/mo</span>
            {subscription.renewalDate && (
              <span className="text-xs text-muted-foreground">
                Renews {formatRenewalDate(subscription.renewalDate)}
              </span>
            )}
          </div>
        ) : (
          <Button variant="outline" size="sm" className="h-8 text-xs border-green-200 text-green-500 hover:bg-green-50">
            Unsubscribe
          </Button>
        )}
        
        {subscription.type === 'paid' && (
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionItem;
